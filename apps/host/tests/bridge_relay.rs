use dsh_host::bridge::{
    relay::{RelayChannel, Side},
    secure_channel::{generate_keypair, initiator, responder},
};
use dsh_relay::Relay;
use std::net::SocketAddr;

const ROOM: &str = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

#[tokio::test]
async fn paired_endpoints_exchange_encrypted_frames_over_a_real_relay() {
    let relay = Relay::default();
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = relay
        .router()
        .into_make_service_with_connect_info::<SocketAddr>();
    let task = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    let host = RelayChannel::connect(
        &base,
        ROOM,
        Side::Host,
        responder(&host_secret, device_public).unwrap(),
    );
    let device = RelayChannel::connect(
        &base,
        ROOM,
        Side::Device,
        initiator(&device_secret, host_public).unwrap(),
    );
    let (host, device) = tokio::join!(host, device);
    let (host_send, mut host_recv, host_close) = host.unwrap().split();
    let (device_send, mut device_recv, device_close) = device.unwrap().split();
    let (host_result, device_result) = tokio::join!(
        async {
            host_send.send(b"private answer".to_vec()).await.unwrap();
            host_recv.receive().await.unwrap()
        },
        async {
            device_send.send(b"private prompt".to_vec()).await.unwrap();
            device_recv.receive().await.unwrap()
        },
    );
    assert_eq!(host_result, b"private prompt");
    assert_eq!(device_result, b"private answer");
    // Cancellation closes the task even while sender clones remain live.
    let retained_sender = host_send.clone();
    host_close.close().await.unwrap();
    assert!(retained_sender.send(b"after close".to_vec()).await.is_err());
    assert!(device_recv.receive().await.is_err());
    assert!(
        device_send
            .send(b"after disconnect".to_vec())
            .await
            .is_err()
    );
    device_close.close().await.unwrap();
    task.abort();
}

#[tokio::test]
async fn replayed_handshake_does_not_establish_a_host_connection() {
    use futures_util::{SinkExt, StreamExt};
    use tokio_tungstenite::{connect_async, tungstenite::Message};
    let relay = Relay::default();
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = relay
        .router()
        .into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    let mut old_device = initiator(&device_secret, host_public).unwrap();
    let replay = old_device.write().unwrap();
    let host = RelayChannel::connect(
        &base,
        ROOM,
        Side::Host,
        responder(&host_secret, device_public).unwrap(),
    );
    let attacker = async {
        let (mut socket, _) = connect_async(format!("{base}/v1/rooms/{ROOM}/device"))
            .await
            .unwrap();
        assert!(matches!(socket.next().await, Some(Ok(Message::Text(_)))));
        socket.send(Message::Binary(replay.into())).await.unwrap();
        assert!(matches!(socket.next().await, Some(Ok(Message::Binary(_)))));
        socket.close(None).await.unwrap();
    };
    let (result, ()) = tokio::join!(host, attacker);
    assert!(result.is_err());
    server.abort();
}

#[tokio::test]
async fn forbids_plaintext_remote_relay_and_invalid_room() {
    let (private, public) = generate_keypair().unwrap();
    let result = RelayChannel::connect(
        "ws://example.com",
        ROOM,
        Side::Device,
        initiator(&private, public).unwrap(),
    )
    .await;
    assert!(matches!(result, Err("invalid relay URL")));
    let result = RelayChannel::connect(
        "ws://127.0.0.1:1",
        "short",
        Side::Device,
        initiator(&private, public).unwrap(),
    )
    .await;
    assert!(matches!(result, Err("invalid relay room")));
}
