//! Encrypted, ordered transport over one online Relay room.
//!
//! A pairing layer must supply each side's trusted static public key and a
//! fresh, unguessable room ID; neither a room nor `ready` authenticates a peer.
use super::secure_channel::{Channel, Handshake};
use futures_util::{SinkExt, StreamExt};
use std::time::{Duration, Instant};
use tokio::{
    net::TcpStream,
    sync::{mpsc, oneshot, watch},
    task::JoinHandle,
};
use tokio_tungstenite::{
    MaybeTlsStream, WebSocketStream, connect_async_with_config,
    tungstenite::{Message, protocol::WebSocketConfig},
};
use url::Url;

const DEADLINE: Duration = Duration::from_secs(20);
const WRITE_DEADLINE: Duration = Duration::from_secs(5);
pub(super) const MAX_FRAME: usize = 65_535;
const QUEUE: usize = 16;
pub(super) type Socket = WebSocketStream<MaybeTlsStream<TcpStream>>;

pub enum Side {
    Host,
    Device,
}
type Outbound = (Vec<u8>, oneshot::Sender<Result<(), &'static str>>);
#[derive(Clone)]
pub struct RelaySender(mpsc::Sender<Outbound>);
pub struct RelayReceiver(mpsc::Receiver<Vec<u8>>);
pub struct RelayChannel {
    sender: RelaySender,
    receiver: RelayReceiver,
    close: RelayCloser,
}

pub struct RelayCloser {
    cancel: watch::Sender<bool>,
    task: JoinHandle<()>,
}

pub(crate) fn relay_url(base: &str, room: &str, side: &Side) -> Result<Url, &'static str> {
    if room.len() != 43
        || !room
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
    {
        return Err("invalid relay room");
    }
    let mut url = Url::parse(base).map_err(|_| "invalid relay URL")?;
    let local = matches!(
        url.host_str(),
        Some("127.0.0.1" | "[::1]" | "::1" | "localhost")
    );
    if (url.scheme() != "wss" && !(url.scheme() == "ws" && local))
        || url.host_str().is_none()
        || !url.username().is_empty()
        || url.password().is_some()
        || url.query().is_some()
        || url.fragment().is_some()
        || url.path() != "/"
    {
        return Err("invalid relay URL");
    }
    url.set_path(&format!(
        "/v1/rooms/{room}/{}",
        match side {
            Side::Host => "host",
            Side::Device => "device",
        }
    ));
    Ok(url)
}

pub(super) async fn next(socket: &mut Socket) -> Result<Message, &'static str> {
    loop {
        match socket.next().await {
            Some(Ok(Message::Ping(_))) => tokio::time::timeout(WRITE_DEADLINE, socket.flush())
                .await
                .map_err(|_| "relay write timed out")?
                .map_err(|_| "relay disconnected")?,
            Some(Ok(Message::Pong(_))) => {}
            Some(Ok(message)) => return Ok(message),
            _ => return Err("relay disconnected"),
        }
    }
}

pub(super) async fn binary(socket: &mut Socket) -> Result<Vec<u8>, &'static str> {
    match next(socket).await? {
        Message::Binary(bytes) if bytes.len() <= MAX_FRAME => Ok(bytes.to_vec()),
        _ => Err("invalid relay frame"),
    }
}

pub(super) async fn open_socket(base: &str, room: &str, side: &Side) -> Result<Socket, &'static str> {
    let url = relay_url(base, room, side)?;
    let config = WebSocketConfig::default()
        .max_message_size(Some(MAX_FRAME))
        .max_frame_size(Some(MAX_FRAME));
    let (mut socket, _) = connect_async_with_config(url.as_str(), Some(config), false)
        .await
        .map_err(|_| "relay connection failed")?;
    match next(&mut socket).await? {
        Message::Text(text) if text == "ready" => Ok(socket),
        Message::Close(_) => Err("relay peer timeout"),
        _ => Err("invalid relay rendezvous"),
    }
}

impl RelayChannel {
    /// Authentication finishes before any application data is sent. A separate
    /// task owns the socket and continues driving control frames while idle.
    pub async fn connect(
        base: &str,
        room: &str,
        side: Side,
        mut handshake: Handshake,
    ) -> Result<Self, &'static str> {
        tokio::time::timeout(DEADLINE, async move {
            let mut socket = open_socket(base, room, &side).await?;
            match side {
                Side::Device => {
                    socket
                        .send(Message::Binary(handshake.write()?.into()))
                        .await
                        .map_err(|_| "relay disconnected")?;
                    handshake.read(&binary(&mut socket).await?)?;
                }
                Side::Host => {
                    handshake.read(&binary(&mut socket).await?)?;
                    socket
                        .send(Message::Binary(handshake.write()?.into()))
                        .await
                        .map_err(|_| "relay disconnected")?;
                }
            }
            let mut channel = handshake.finish()?;
            // IK's first message can be replayed. Require possession of the
            // fresh session keys before declaring the device connected.
            const CONFIRM: &[u8] = b"dsh-bot channel confirmed v1";
            match side {
                Side::Device => {
                    socket
                        .send(Message::Binary(channel.encrypt(CONFIRM)?.into()))
                        .await
                        .map_err(|_| "relay disconnected")?;
                    if channel.decrypt(&binary(&mut socket).await?)? != CONFIRM {
                        return Err("channel confirmation failed");
                    }
                }
                Side::Host => {
                    if channel.decrypt(&binary(&mut socket).await?)? != CONFIRM {
                        return Err("channel confirmation failed");
                    }
                    socket
                        .send(Message::Binary(channel.encrypt(CONFIRM)?.into()))
                        .await
                        .map_err(|_| "relay disconnected")?;
                }
            }
            let (out_tx, out_rx) = mpsc::channel(QUEUE);
            let (in_tx, in_rx) = mpsc::channel(QUEUE);
            let (cancel, cancelled) = watch::channel(false);
            let task = tokio::spawn(run(socket, channel, out_rx, in_tx, cancelled));
            Ok(Self {
                sender: RelaySender(out_tx),
                receiver: RelayReceiver(in_rx),
                close: RelayCloser { cancel, task },
            })
        })
        .await
        .map_err(|_| "relay connection timed out")?
    }

    pub fn split(self) -> (RelaySender, RelayReceiver, RelayCloser) {
        (self.sender, self.receiver, self.close)
    }
}

impl RelayCloser {
    /// Stop the socket task and wait for local resources to be released. This
    /// does not prove that the peer received a WebSocket close handshake.
    /// Writes already admitted may have reached the peer and require reconciliation.
    pub async fn close(self) -> Result<(), &'static str> {
        let _ = self.cancel.send(true);
        self.task.await.map_err(|_| "relay task failed")
    }
}

impl RelaySender {
    /// An error or cancellation after admission leaves delivery unknown; callers
    /// must reconcile writes and must not automatically replay them.
    pub async fn send(&self, data: Vec<u8>) -> Result<(), &'static str> {
        if data.len() > MAX_FRAME - 16 {
            return Err("channel frame rejected");
        }
        let (tx, rx) = oneshot::channel();
        self.0
            .send((data, tx))
            .await
            .map_err(|_| "relay disconnected")?;
        rx.await.map_err(|_| "relay delivery unknown")?
    }
}

impl RelayReceiver {
    pub async fn receive(&mut self) -> Result<Vec<u8>, &'static str> {
        self.0.recv().await.ok_or("relay disconnected")
    }
}

async fn run(
    mut socket: Socket,
    mut channel: Channel,
    mut outbound: mpsc::Receiver<Outbound>,
    inbound: mpsc::Sender<Vec<u8>>,
    mut cancelled: watch::Receiver<bool>,
) {
    let mut control_start = Instant::now();
    let mut controls = 0_u32;
    loop {
        tokio::select! {
            biased;
            changed = cancelled.changed() => {
                if changed.is_err() || *cancelled.borrow() { break; }
            }
            _ = inbound.closed() => break,
            next = outbound.recv() => {
                let Some((data, reply)) = next else { break };
                let result = match channel.encrypt(&data) {
                    Ok(frame) => match tokio::time::timeout(WRITE_DEADLINE, socket.send(Message::Binary(frame.into()))).await {
                        Ok(Ok(())) => Ok(()),
                        _ => Err("relay delivery unknown"),
                    },
                    Err(error) => Err(error),
                };
                let failed = result.is_err();
                let _ = reply.send(result);
                if failed { break; }
            }
            message = socket.next() => {
                match message {
                    Some(Ok(Message::Binary(frame))) => {
                        match channel.decrypt(&frame) {
                            Ok(data) => if inbound.try_send(data).is_err() { break; },
                            Err(_) => break,
                        }
                    }
                    Some(Ok(Message::Ping(_) | Message::Pong(_))) => {
                        if control_start.elapsed() >= Duration::from_secs(10) { control_start = Instant::now(); controls = 0; }
                        controls += 1;
                        if controls > 32 || !matches!(tokio::time::timeout(WRITE_DEADLINE, socket.flush()).await, Ok(Ok(()))) { break; }
                    }
                    _ => break,
                }
            }
        }
    }
    let _ = tokio::time::timeout(Duration::from_secs(2), socket.close(None)).await;
}
