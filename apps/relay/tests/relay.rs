use dsh_relay::Relay;
use futures_util::{SinkExt, StreamExt};
use std::{net::SocketAddr, time::Duration};
use tokio::{net::TcpListener, task::JoinHandle};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{Error, Message},
};

type Socket =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;
struct Server {
    addr: SocketAddr,
    task: JoinHandle<()>,
}
impl Drop for Server {
    fn drop(&mut self) {
        self.task.abort();
    }
}
impl Server {
    async fn new(relay: Relay) -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let task = tokio::spawn(async move {
            axum::serve(
                listener,
                relay
                    .router()
                    .into_make_service_with_connect_info::<SocketAddr>(),
            )
            .await
            .unwrap();
        });
        Self { addr, task }
    }
    async fn connect(&self, room: &str, role: &str) -> Result<Socket, Error> {
        connect_async(format!("ws://{}/v1/rooms/{room}/{role}", self.addr))
            .await
            .map(|(socket, _)| socket)
    }
    async fn http(&self, path: &str, headers: &str) -> String {
        use tokio::io::{AsyncReadExt, AsyncWriteExt};
        let mut stream = tokio::net::TcpStream::connect(self.addr).await.unwrap();
        stream
            .write_all(
                format!(
                    "GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n{headers}\r\n"
                )
                .as_bytes(),
            )
            .await
            .unwrap();
        let mut response = String::new();
        stream.read_to_string(&mut response).await.unwrap();
        response
    }
}
async fn receive(socket: &mut Socket) -> Message {
    tokio::time::timeout(Duration::from_secs(3), socket.next())
        .await
        .unwrap()
        .unwrap()
        .unwrap()
}
async fn paired(server: &Server, room: &str) -> (Socket, Socket) {
    let mut host = server.connect(room, "host").await.unwrap();
    let mut device = server.connect(room, "device").await.unwrap();
    assert_eq!(receive(&mut host).await, Message::Text("ready".into()));
    assert_eq!(receive(&mut device).await, Message::Text("ready".into()));
    (host, device)
}
const ROOM: &str = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const OTHER: &str = "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

#[tokio::test]
async fn forwards_frames_only_between_paired_sockets() {
    let server = Server::new(Relay::default()).await;
    let mut host = server.connect(ROOM, "host").await.unwrap();
    assert!(
        tokio::time::timeout(Duration::from_millis(30), host.next())
            .await
            .is_err()
    );
    let mut device = server.connect(ROOM, "device").await.unwrap();
    assert_eq!(receive(&mut host).await, Message::Text("ready".into()));
    assert_eq!(receive(&mut device).await, Message::Text("ready".into()));
    let mut other = server.connect(OTHER, "host").await.unwrap();
    host.send(Message::Binary(vec![1, 2, 3].into()))
        .await
        .unwrap();
    assert_eq!(
        receive(&mut device).await,
        Message::Binary(vec![1, 2, 3].into())
    );
    device
        .send(Message::Binary(vec![4, 5].into()))
        .await
        .unwrap();
    assert_eq!(receive(&mut host).await, Message::Binary(vec![4, 5].into()));
    assert!(
        tokio::time::timeout(Duration::from_millis(30), other.next())
            .await
            .is_err()
    );
}

#[tokio::test]
async fn closes_pair_and_allows_a_new_generation() {
    let server = Server::new(Relay::default()).await;
    let (mut host, mut device) = paired(&server, ROOM).await;
    host.close(None).await.unwrap();
    assert!(matches!(receive(&mut host).await, Message::Close(_)));
    assert!(
        matches!(receive(&mut device).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1001)
    );
    let (_host, _device) = paired(&server, ROOM).await;
}

#[tokio::test]
async fn rejects_text_and_unpaired_frames() {
    let server = Server::new(Relay::default()).await;
    let (mut host, mut device) = paired(&server, ROOM).await;
    host.send(Message::Text("plaintext".into())).await.unwrap();
    assert!(
        matches!(receive(&mut host).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1003)
    );
    assert!(
        matches!(receive(&mut device).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1001)
    );
    let mut solo = server.connect(OTHER, "device").await.unwrap();
    solo.send(Message::Binary(vec![1].into())).await.unwrap();
    assert!(
        matches!(receive(&mut solo).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1013)
    );
}

#[tokio::test]
async fn expires_waiters_and_rejects_duplicate_and_invalid_routes() {
    let server = Server::new(Relay::with_pairing_timeout(Duration::from_millis(40)).unwrap()).await;
    let mut solo = server.connect(ROOM, "host").await.unwrap();
    tokio::time::sleep(Duration::from_millis(10)).await;
    assert!(
        matches!(server.connect(ROOM, "host").await, Err(Error::Http(response)) if response.status() == 409)
    );
    assert!(
        matches!(server.connect("short", "host").await, Err(Error::Http(response)) if response.status() == 404)
    );
    assert!(
        matches!(receive(&mut solo).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1001)
    );
}

#[tokio::test]
async fn shutdown_closes_both_sides() {
    let relay = Relay::default();
    let server = Server::new(relay.clone()).await;
    let (mut host, mut device) = paired(&server, ROOM).await;
    relay.shutdown();
    assert!(
        matches!(receive(&mut host).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1001)
    );
    assert!(
        matches!(receive(&mut device).await, Message::Close(Some(frame)) if u16::from(frame.code) == 1001)
    );
}

#[tokio::test]
async fn health_and_connection_limits_ignore_spoofed_forwarded_headers() {
    let server = Server::new(Relay::default()).await;
    let health = server.http("/v1/health", "").await;
    assert!(health.starts_with("HTTP/1.1 200"));
    assert!(health.contains("\"service\":\"dsh-relay\""));
    let path = format!("/v1/rooms/{ROOM}/host");
    for i in 0..60 {
        let response = server
            .http(&path, &format!("X-Forwarded-For: 192.0.2.{}\r\n", i + 1))
            .await;
        assert!(response.starts_with("HTTP/1.1 400"), "{response}");
    }
    let limited = server
        .http(&path, "X-Forwarded-For: 198.51.100.1\r\n")
        .await;
    assert!(limited.starts_with("HTTP/1.1 429"), "{limited}");
    assert!(limited.to_ascii_lowercase().contains("retry-after: 1"));
    assert!(
        server
            .http("/v1/health", "")
            .await
            .starts_with("HTTP/1.1 200")
    );
}
