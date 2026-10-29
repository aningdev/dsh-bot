//! Online-only opaque WebSocket forwarding. The relay does not authenticate
//! devices or encrypt frames; those guarantees must be provided by endpoints.
use axum::{
    Json, Router,
    extract::{
        ConnectInfo, Path, State, WebSocketUpgrade,
        ws::{CloseFrame, Message, WebSocket, rejection::WebSocketUpgradeRejection},
    },
    http::{StatusCode, Uri, header},
    response::{IntoResponse, Response},
    routing::get,
};
use futures_util::{SinkExt, StreamExt};
use serde_json::json;
use std::{
    collections::HashMap,
    net::{IpAddr, SocketAddr},
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use tokio::sync::{OwnedSemaphorePermit, Semaphore, mpsc, watch};

const MAX_MESSAGE: usize = 1024 * 1024;
const MAX_ROOMS: usize = 64;
const QUEUE: usize = 16;
const PAIR_TIMEOUT: Duration = Duration::from_secs(15);
const IDLE_TIMEOUT: Duration = Duration::from_secs(120);
const WRITE_TIMEOUT: Duration = Duration::from_secs(5);

type Stop = Option<(u16, &'static str)>;
struct Outgoing {
    message: Message,
    _permit: Option<OwnedSemaphorePermit>,
}
struct Peer {
    id: u64,
    tx: mpsc::Sender<Outgoing>,
    stop: watch::Sender<Stop>,
}
struct Room {
    host: Option<Peer>,
    device: Option<Peer>,
}
impl Room {
    fn new() -> Self {
        Self {
            host: None,
            device: None,
        }
    }
    fn peer(&self, role: &str) -> &Option<Peer> {
        if role == "host" {
            &self.host
        } else {
            &self.device
        }
    }
    fn peer_mut(&mut self, role: &str) -> &mut Option<Peer> {
        if role == "host" {
            &mut self.host
        } else {
            &mut self.device
        }
    }
    fn other(&self, role: &str) -> &Option<Peer> {
        self.peer(if role == "host" { "device" } else { "host" })
    }
}
struct Bucket {
    tokens: f64,
    updated: Instant,
}
#[derive(Default)]
struct Hub {
    rooms: HashMap<String, Room>,
    next_id: u64,
    ips: HashMap<IpAddr, Bucket>,
    shutting_down: bool,
}
#[derive(Clone)]
pub struct Relay {
    hub: Arc<Mutex<Hub>>,
    bytes: Arc<Semaphore>,
    connections: Arc<Semaphore>,
    pairing_timeout: Duration,
}
impl Default for Relay {
    fn default() -> Self {
        Self {
            hub: Arc::new(Mutex::new(Hub::default())),
            bytes: Arc::new(Semaphore::new(32 * 1024 * 1024)),
            connections: Arc::new(Semaphore::new(MAX_ROOMS * 2)),
            pairing_timeout: PAIR_TIMEOUT,
        }
    }
}
impl Relay {
    pub fn with_pairing_timeout(timeout: Duration) -> Result<Self, &'static str> {
        if timeout.is_zero() || timeout > Duration::from_secs(120) {
            return Err("Invalid pairing timeout");
        }
        Ok(Self {
            pairing_timeout: timeout,
            ..Self::default()
        })
    }
    pub fn router(&self) -> Router {
        Router::new()
            .route("/v1/health", get(health))
            .route("/v1/rooms/{room}/{role}", get(upgrade))
            .with_state(self.clone())
    }
    /// Closing connections before server shutdown prevents graceful shutdown
    /// from waiting indefinitely on active WebSockets.
    pub fn shutdown(&self) {
        let mut hub = self.hub.lock().unwrap();
        hub.shutting_down = true;
        for (_, room) in hub.rooms.drain() {
            stop_room(room, 1001, "server shutdown", None);
        }
    }
}
async fn health() -> Json<serde_json::Value> {
    Json(json!({"ok":true,"service":"dsh-relay"}))
}

fn valid_room(id: &str) -> bool {
    id.len() == 43
        && id
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')
}
fn admit_ip(hub: &mut Hub, ip: IpAddr) -> bool {
    let now = Instant::now();
    if !hub.ips.contains_key(&ip) && hub.ips.len() >= 10_000 {
        hub.ips
            .retain(|_, b| b.tokens + now.duration_since(b.updated).as_secs_f64() < 60.0);
        if hub.ips.len() >= 10_000 {
            return false;
        }
    }
    let bucket = hub.ips.entry(ip).or_insert(Bucket {
        tokens: 60.0,
        updated: now,
    });
    bucket.tokens = (bucket.tokens + now.duration_since(bucket.updated).as_secs_f64()).min(60.0);
    bucket.updated = now;
    if bucket.tokens < 1.0 {
        return false;
    }
    bucket.tokens -= 1.0;
    true
}
async fn upgrade(
    State(relay): State<Relay>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Path((room, role)): Path<(String, String)>,
    uri: Uri,
    ws: Result<WebSocketUpgrade, WebSocketUpgradeRejection>,
) -> Response {
    if uri.query().is_some() || !valid_room(&room) || !matches!(role.as_str(), "host" | "device") {
        return StatusCode::NOT_FOUND.into_response();
    }
    {
        let mut hub = relay.hub.lock().unwrap();
        if hub.shutting_down {
            return StatusCode::SERVICE_UNAVAILABLE.into_response();
        }
        if !admit_ip(&mut hub, peer.ip()) {
            return (StatusCode::TOO_MANY_REQUESTS, [(header::RETRY_AFTER, "1")]).into_response();
        }
        if let Some(existing) = hub.rooms.get(&room) {
            if existing.peer(&role).is_some() {
                return StatusCode::CONFLICT.into_response();
            }
        } else if hub.rooms.len() >= MAX_ROOMS {
            return StatusCode::SERVICE_UNAVAILABLE.into_response();
        }
    }
    let Ok(ws) = ws else {
        return StatusCode::BAD_REQUEST.into_response();
    };
    let Ok(connection) = relay.connections.clone().try_acquire_owned() else {
        return StatusCode::SERVICE_UNAVAILABLE.into_response();
    };
    ws.max_message_size(MAX_MESSAGE)
        .max_frame_size(MAX_MESSAGE)
        .on_upgrade(move |socket| async move {
            let _connection = connection;
            serve_socket(relay, room, role, socket).await;
        })
}

fn forward(room: &Room, role: &str, id: u64, outgoing: Outgoing) -> bool {
    room.peer(role)
        .as_ref()
        .is_some_and(|sender| sender.id == id)
        && room
            .other(role)
            .as_ref()
            .is_some_and(|peer| peer.tx.try_send(outgoing).is_ok())
}

fn stop_room(room: Room, code: u16, reason: &'static str, initiator: Option<u64>) {
    for peer in [room.host, room.device].into_iter().flatten() {
        let close = if initiator.is_some() && initiator != Some(peer.id) {
            (1001, "peer disconnected")
        } else {
            (code, reason)
        };
        let _ = peer.stop.send(Some(close));
    }
}
fn disconnect(relay: &Relay, name: &str, id: u64, code: u16, reason: &'static str) {
    let mut hub = relay.hub.lock().unwrap();
    let matches = hub.rooms.get(name).is_some_and(|room| {
        [room.host.as_ref(), room.device.as_ref()]
            .into_iter()
            .flatten()
            .any(|peer| peer.id == id)
    });
    if matches {
        stop_room(hub.rooms.remove(name).unwrap(), code, reason, Some(id));
    }
}
async fn serve_socket(relay: Relay, name: String, role: String, mut socket: WebSocket) {
    let (tx, mut rx) = mpsc::channel(QUEUE);
    let (stop, mut stopped) = watch::channel(None);
    let id = {
        let mut hub = relay.hub.lock().unwrap();
        if hub.shutting_down
            || hub
                .rooms
                .get(&name)
                .is_some_and(|room| room.peer(&role).is_some())
            || (!hub.rooms.contains_key(&name) && hub.rooms.len() >= MAX_ROOMS)
        {
            None
        } else {
            hub.next_id = hub.next_id.wrapping_add(1);
            let id = hub.next_id;
            let room = hub.rooms.entry(name.clone()).or_insert_with(Room::new);
            *room.peer_mut(&role) = Some(Peer { id, tx, stop });
            if let (Some(host), Some(device)) = (&room.host, &room.device) {
                let ready = || Outgoing {
                    message: Message::Text("ready".into()),
                    _permit: None,
                };
                if host.tx.try_send(ready()).is_err() || device.tx.try_send(ready()).is_err() {
                    stop_room(hub.rooms.remove(&name).unwrap(), 1013, "backpressure", None);
                }
            }
            Some(id)
        }
    };
    let Some(id) = id else {
        let _ = tokio::time::timeout(
            WRITE_TIMEOUT,
            socket.send(Message::Close(Some(CloseFrame {
                code: 1013,
                reason: "room unavailable".into(),
            }))),
        )
        .await;
        return;
    };
    let (mut writer, mut reader) = socket.split();
    let paired_deadline = tokio::time::sleep(relay.pairing_timeout);
    tokio::pin!(paired_deadline);
    let idle = tokio::time::sleep(IDLE_TIMEOUT);
    tokio::pin!(idle);
    let mut ping = tokio::time::interval(Duration::from_secs(25));
    ping.tick().await;
    let mut tokens: f64 = 128.0;
    let mut updated = Instant::now();
    loop {
        tokio::select! {
            biased;
            changed = stopped.changed() => {
                if changed.is_ok() {
                    let close = *stopped.borrow();
                    if let Some((code, reason)) = close { let _ = tokio::time::timeout(WRITE_TIMEOUT, writer.send(Message::Close(Some(CloseFrame { code, reason: reason.into() })))).await; }
                }
                break;
            }
            _ = &mut paired_deadline => {
                let paired = relay.hub.lock().unwrap().rooms.get(&name).is_some_and(|r| r.host.is_some() && r.device.is_some());
                if !paired { disconnect(&relay, &name, id, 1001, "pairing timeout"); }
                paired_deadline.as_mut().reset(tokio::time::Instant::now() + Duration::from_secs(86400));
            }
            _ = &mut idle => { disconnect(&relay, &name, id, 1001, "idle timeout"); }
            _ = ping.tick() => {
                if !matches!(tokio::time::timeout(WRITE_TIMEOUT, writer.send(Message::Ping(Default::default()))).await, Ok(Ok(()))) { disconnect(&relay, &name, id, 1013, "write failed"); }
            }
            outgoing = rx.recv() => match outgoing {
                Some(outgoing) => if !matches!(tokio::time::timeout(WRITE_TIMEOUT, writer.send(outgoing.message)).await, Ok(Ok(()))) { disconnect(&relay, &name, id, 1013, "write failed"); },
                None => break,
            },
            incoming = reader.next() => {
                idle.as_mut().reset(tokio::time::Instant::now() + IDLE_TIMEOUT);
                match incoming {
                    Some(Ok(Message::Binary(bytes))) => {
                        let now = Instant::now();
                        tokens = (tokens + now.duration_since(updated).as_secs_f64() * 64.0).min(128.0);
                        updated = now;
                        if tokens < 1.0 { disconnect(&relay, &name, id, 1008, "rate limited"); continue; }
                        tokens -= 1.0;
                        let permit = relay.bytes.clone().try_acquire_many_owned(bytes.len() as u32);
                        let Ok(permit) = permit else { disconnect(&relay, &name, id, 1013, "capacity"); continue; };
                        let result = {
                            let hub = relay.hub.lock().unwrap();
                            hub.rooms.get(&name).is_some_and(|room| forward(room, &role, id, Outgoing { message: Message::Binary(bytes), _permit: Some(permit) }))
                        };
                        if !result { disconnect(&relay, &name, id, 1013, "peer unavailable or backpressure"); }
                    }
                    Some(Ok(Message::Text(_))) => disconnect(&relay, &name, id, 1003, "binary frames only"),
                    Some(Ok(Message::Ping(_))) | Some(Ok(Message::Pong(_))) => {},
                    Some(Ok(Message::Close(_))) => {
                        disconnect(&relay, &name, id, 1001, "peer disconnected");
                        let _ = tokio::time::timeout(WRITE_TIMEOUT, writer.flush()).await;
                        break;
                    }
                    _ => { disconnect(&relay, &name, id, 1001, "peer disconnected"); break; }
                }
            }
        }
    }
    disconnect(&relay, &name, id, 1001, "peer disconnected");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stale_sender_cannot_forward_to_new_room() {
        let (host_tx, _host_rx) = mpsc::channel(1);
        let (device_tx, mut device_rx) = mpsc::channel(1);
        let (host_stop, _) = watch::channel(None);
        let (device_stop, _) = watch::channel(None);
        let room = Room {
            host: Some(Peer {
                id: 3,
                tx: host_tx,
                stop: host_stop,
            }),
            device: Some(Peer {
                id: 4,
                tx: device_tx,
                stop: device_stop,
            }),
        };
        let frame = || Outgoing {
            message: Message::Binary(vec![42].into()),
            _permit: None,
        };
        assert!(!forward(&room, "host", 1, frame()));
        assert!(device_rx.try_recv().is_err());
        assert!(forward(&room, "host", 3, frame()));
        assert!(matches!(
            device_rx.try_recv().unwrap().message,
            Message::Binary(_)
        ));
    }
}
