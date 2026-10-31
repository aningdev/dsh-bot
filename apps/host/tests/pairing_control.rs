use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use dsh_host::{bridge::{pairing_relay, secure_channel::generate_keypair}, call};
use dsh_relay::Relay;
use serde_json::{json, Value};
use std::{net::SocketAddr, path::{Path, PathBuf}, process::{Child, Command, Stdio}, time::Duration};

struct Host { root: tempfile::TempDir, child: Child }
impl Host {
    async fn new() -> Self {
        let root = tempfile::tempdir().unwrap();
        let child = Self::spawn(root.path());
        let host = Self { root, child };
        for _ in 0..250 {
            if host.request(json!({"operation":"pairingStatus"})).is_ok() { return host; }
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
        panic!("host failed to start")
    }
    fn spawn(root: &Path) -> Child {
        Command::new(env!("CARGO_BIN_EXE_dsh-host")).arg("serve").arg("--data-root").arg(root)
            .arg("--dsh").arg(root.join("unused-dsh"))
            .args(["--version", "fixture", "--startup-ms", "3000"])
            .stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null()).spawn().unwrap()
    }
    fn socket(&self) -> PathBuf { self.root.path().join("host/control.sock") }
    fn request(&self, mut value: Value) -> Result<Value, String> {
        value["version"] = json!(1); value["id"] = json!("integration");
        call(&self.socket(), &value)
    }
    async fn phase(&self, expected: &str) -> Value {
        for _ in 0..250 {
            let status = self.request(json!({"operation":"pairingStatus"})).unwrap();
            if status["current"]["phase"] == expected { return status["current"].clone(); }
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
        panic!("pairing phase did not become {expected}")
    }
    async fn restart(&mut self) {
        self.child.kill().unwrap(); self.child.wait().unwrap();
        self.child = Self::spawn(self.root.path());
        for _ in 0..250 {
            if self.request(json!({"operation":"pairingStatus"})).is_ok() { return; }
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
        panic!("host restart failed")
    }
}
impl Drop for Host { fn drop(&mut self) { let _ = self.child.kill(); let _ = self.child.wait(); } }
fn bytes(value: &Value) -> [u8;32] { URL_SAFE_NO_PAD.decode(value.as_str().unwrap()).unwrap().try_into().unwrap() }

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn host_control_pairing_requires_matching_approval_and_survives_restart() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let relay = format!("ws://{}", listener.local_addr().unwrap());
    let app = Relay::default().router().into_make_service_with_connect_info::<SocketAddr>();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let mut host = Host::new().await;
    let offer = host.request(json!({"operation":"startPairing", "relay":relay})).unwrap();
    assert!(host.request(json!({"operation":"startPairing", "relay":relay})).is_err());
    let attempt = offer["attemptId"].as_str().unwrap().to_owned();
    let room = offer["room"].as_str().unwrap().to_owned();
    let host_key = bytes(&offer["hostKey"]); let nonce = bytes(&offer["nonce"]);
    let (secret, public) = generate_keypair().unwrap();
    let device_relay = relay.clone();
    let device = tokio::spawn(async move { pairing_relay::device(&device_relay, &room, &secret, host_key, &nonce, Duration::from_secs(10)).await });
    let status = host.phase("approval").await;
    assert_eq!(status["candidate"], json!(public));
    let wrong = [0u8;32];
    assert!(host.request(json!({"operation":"decidePairing", "attemptId":attempt, "deviceKey":wrong, "approve":true})).is_err());
    host.request(json!({"operation":"decidePairing", "attemptId":attempt, "deviceKey":public, "approve":true})).unwrap();
    device.await.unwrap().unwrap();
    host.phase("paired").await;
    let list = host.request(json!({"operation":"listDevices", "cursor":0})).unwrap();
    assert_eq!(list["devices"][0]["key"], json!(public));
    host.request(json!({"operation":"revokeDevice", "deviceKey":public})).unwrap();
    host.restart().await;
    assert_eq!(host.request(json!({"operation":"listDevices", "cursor":0})).unwrap()["devices"][0]["revoked"], true);
    let next = host.request(json!({"operation":"startPairing", "relay":relay})).unwrap();
    assert_eq!(next["hostKey"], offer["hostKey"]);
    assert_ne!(next["room"], offer["room"]);
    host.request(json!({"operation":"cancelPairing", "attemptId":next["attemptId"]})).unwrap();
    host.phase("cancelled").await;
    server.abort();
}
