use dsh_host::bridge::{device_access::DeviceAccess, pairing::{self, Invitation}, pairing_relay::{self, PairingError}, secure_channel::generate_keypair};
use dsh_relay::Relay;
use std::{net::SocketAddr, sync::Arc, time::Duration};
use tokio::sync::oneshot;

const ROOM: &str = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

#[tokio::test]
async fn pairing_over_relay_requires_approval_and_durable_grant() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let root = tempfile::tempdir().unwrap();
    let access = Arc::new(DeviceAccess::new(root.path().join("devices")));
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    let nonce = pairing::generate_nonce().unwrap();
    let invitation = Invitation::new(&host_secret, &nonce, Duration::from_secs(10)).unwrap();
    let (candidate_tx, candidate_rx) = oneshot::channel();
    let (decision_tx, decision_rx) = oneshot::channel();
    let grant = access.clone();
    let host = pairing_relay::host(&base, ROOM, invitation, candidate_tx, decision_rx, move |key| grant.authorize(key).map_err(|_| "grant failed"));
    let device = pairing_relay::device(&base, ROOM, &device_secret, host_public, &nonce, Duration::from_secs(10));
    let approval = async {
        assert_eq!(candidate_rx.await.unwrap(), device_public);
        assert!(access.list().unwrap().is_empty());
        decision_tx.send(true).unwrap();
    };
    let (host, device, ()) = tokio::join!(host, device, approval);
    assert_eq!(host.unwrap(), device_public);
    device.unwrap();
    assert!(access.register(device_public).is_ok());
    server.abort();
}

#[tokio::test]
async fn rejected_pairing_never_creates_a_grant() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let root = tempfile::tempdir().unwrap();
    let access = Arc::new(DeviceAccess::new(root.path().join("devices")));
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let nonce = pairing::generate_nonce().unwrap();
    let invitation = Invitation::new(&host_secret, &nonce, Duration::from_secs(10)).unwrap();
    let (candidate_tx, candidate_rx) = oneshot::channel();
    let (decision_tx, decision_rx) = oneshot::channel();
    let grant = access.clone();
    let host = pairing_relay::host(&base, ROOM, invitation, candidate_tx, decision_rx, move |key| grant.authorize(key).map_err(|_| "grant failed"));
    let device = pairing_relay::device(&base, ROOM, &device_secret, host_public, &nonce, Duration::from_secs(10));
    let approval = async { candidate_rx.await.unwrap(); decision_tx.send(false).unwrap(); };
    let (host, device, ()) = tokio::join!(host, device, approval);
    assert_eq!(host.unwrap_err(), PairingError::Rejected);
    assert!(device.is_err());
    assert!(access.list().unwrap().is_empty());
    server.abort();
}

#[tokio::test]
async fn failed_persistence_sends_no_pairing_acceptance() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let nonce = pairing::generate_nonce().unwrap();
    let invitation = Invitation::new(&host_secret, &nonce, Duration::from_secs(10)).unwrap();
    let (candidate_tx, candidate_rx) = oneshot::channel();
    let (decision_tx, decision_rx) = oneshot::channel();
    let host = pairing_relay::host(&base, ROOM, invitation, candidate_tx, decision_rx, |_| Err("failed"));
    let device = pairing_relay::device(&base, ROOM, &device_secret, host_public, &nonce, Duration::from_secs(10));
    let approval = async { candidate_rx.await.unwrap(); decision_tx.send(true).unwrap(); };
    let (host, device, ()) = tokio::join!(host, device, approval);
    assert_eq!(host.unwrap_err(), PairingError::GrantUncertain);
    assert!(device.is_err());
    server.abort();
}

#[tokio::test]
async fn disconnected_device_cannot_be_approved_later() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let root = tempfile::tempdir().unwrap();
    let access = Arc::new(DeviceAccess::new(root.path().join("devices")));
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let nonce = pairing::generate_nonce().unwrap();
    let invitation = Invitation::new(&host_secret, &nonce, Duration::from_secs(10)).unwrap();
    let (candidate_tx, candidate_rx) = oneshot::channel();
    let (decision_tx, decision_rx) = oneshot::channel();
    let grant = access.clone();
    let host_base = base.clone();
    let host = tokio::spawn(async move { pairing_relay::host(&host_base, ROOM, invitation, candidate_tx, decision_rx, move |key| grant.authorize(key).map_err(|_| "grant failed")).await });
    let device = tokio::spawn(async move { pairing_relay::device(&base, ROOM, &device_secret, host_public, &nonce, Duration::from_secs(10)).await });
    candidate_rx.await.unwrap();
    device.abort();
    assert_eq!(tokio::time::timeout(Duration::from_secs(3), host).await.unwrap().unwrap(), Err(PairingError::InvalidOrDisconnected));
    assert!(decision_tx.send(true).is_err());
    assert!(access.list().unwrap().is_empty());
    server.abort();
}

#[tokio::test]
async fn expiration_waits_for_inflight_persistence_to_finish() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let base = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let root = tempfile::tempdir().unwrap();
    let access = Arc::new(DeviceAccess::new(root.path().join("devices")));
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    let nonce = pairing::generate_nonce().unwrap();
    let invitation = Invitation::new(&host_secret, &nonce, Duration::from_millis(500)).unwrap();
    let (candidate_tx, candidate_rx) = oneshot::channel();
    let (decision_tx, decision_rx) = oneshot::channel();
    let (started_tx, started_rx) = oneshot::channel();
    let (release_tx, release_rx) = std::sync::mpsc::channel();
    let grant = access.clone();
    let host_base = base.clone();
    let host = tokio::spawn(async move { pairing_relay::host(&host_base, ROOM, invitation, candidate_tx, decision_rx, move |key| {
        started_tx.send(()).unwrap();
        release_rx.recv().unwrap();
        grant.authorize(key).map_err(|_| "grant failed")
    }).await });
    let device = tokio::spawn(async move { pairing_relay::device(&base, ROOM, &device_secret, host_public, &nonce, Duration::from_secs(2)).await });
    candidate_rx.await.unwrap();
    decision_tx.send(true).unwrap();
    started_rx.await.unwrap();
    tokio::time::sleep(Duration::from_millis(600)).await;
    assert!(!host.is_finished());
    release_tx.send(()).unwrap();
    assert_eq!(host.await.unwrap(), Err(PairingError::GrantedButIncomplete));
    assert!(access.register(device_public).is_ok());
    assert!(device.await.unwrap().is_err());
    server.abort();
}

