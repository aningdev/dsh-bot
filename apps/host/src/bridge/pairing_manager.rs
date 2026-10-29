//! Owns one local pairing invitation and its background task.
use super::{device_access::DeviceAccess, identity::HostIdentity, pairing, pairing_relay::{self, PairingError}, relay::{self, Side}};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{path::PathBuf, sync::{Arc, Mutex}, time::{Duration, SystemTime, UNIX_EPOCH}};
use tokio::{runtime::Runtime, sync::{oneshot, watch}, task::JoinHandle};

const LIFETIME: Duration = Duration::from_secs(120);

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PairingOffer {
    pub version: u32,
    pub attempt_id: String,
    pub relay: String,
    pub room: String,
    pub host_key: String,
    pub nonce: String,
    pub expires_at: u64,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PairingStatus {
    pub attempt_id: String,
    pub phase: String,
    pub candidate: Option<[u8; 32]>,
    pub fingerprint: Option<String>,
}

struct Attempt {
    status: PairingStatus,
    decision: Option<oneshot::Sender<bool>>,
    cancel: watch::Sender<bool>,
}
struct State { current: Option<Attempt>, closing: bool }

pub struct PairingManager {
    directory: PathBuf,
    access: Arc<DeviceAccess>,
    state: Arc<Mutex<State>>,
    runtime: Runtime,
    tasks: Mutex<Vec<JoinHandle<()>>>,
}

fn random_string() -> Result<String, String> {
    let mut bytes = [0; 32];
    getrandom::fill(&mut bytes).map_err(|_| "配对随机数不可用".to_string())?;
    Ok(URL_SAFE_NO_PAD.encode(bytes))
}

impl PairingManager {
    pub fn new(directory: PathBuf, access: Arc<DeviceAccess>) -> Result<Self, String> {
        let runtime = tokio::runtime::Builder::new_multi_thread().worker_threads(2).enable_all().build().map_err(|_| "配对服务不可用")?;
        Ok(Self { directory, access, state: Arc::new(Mutex::new(State { current: None, closing: false })), runtime, tasks: Mutex::new(Vec::new()) })
    }

    /// Invitation secrets are returned only by this call, not by status.
    pub fn start(&self, relay_base: String) -> Result<PairingOffer, String> {
        let mut state = self.state.lock().map_err(|_| "配对服务不可用")?;
        if state.closing || state.current.as_ref().is_some_and(|a| matches!(a.status.phase.as_str(), "waiting" | "approval" | "saving" | "rejecting" | "cancelling")) {
            return Err("已有配对正在进行".into());
        }
        let room = random_string()?;
        relay::relay_url(&relay_base, &room, &Side::Host).map_err(|_| "无效的 Relay 地址")?;
        let has_grants = !self.access.list().map_err(|_| "设备授权不可用")?.is_empty();
        let identity = HostIdentity::load(&self.directory, has_grants).map_err(|_| "宿主身份不可用，不能创建配对")?;
        let nonce = pairing::generate_nonce().map_err(str::to_string)?;
        let invitation = pairing::Invitation::new(identity.private(), &nonce, LIFETIME).map_err(str::to_string)?;
        let attempt_id = random_string()?;
        let expires_at = SystemTime::now().duration_since(UNIX_EPOCH).map_err(|_| "系统时间不可用")?.as_secs() + LIFETIME.as_secs();
        let offer = PairingOffer { version: 1, attempt_id: attempt_id.clone(), relay: relay_base.clone(), room: room.clone(), host_key: URL_SAFE_NO_PAD.encode(identity.public), nonce: URL_SAFE_NO_PAD.encode(nonce), expires_at };
        let (candidate_tx, candidate_rx) = oneshot::channel();
        let (decision_tx, decision_rx) = oneshot::channel();
        let (cancel, cancelled) = watch::channel(false);
        state.current = Some(Attempt { status: PairingStatus { attempt_id: attempt_id.clone(), phase: "waiting".into(), candidate: None, fingerprint: None }, decision: Some(decision_tx), cancel });
        let shared = self.state.clone();
        let access = self.access.clone();
        let task = self.runtime.spawn(async move {
            let pairing = pairing_relay::host_cancelable(&relay_base, &room, invitation, candidate_tx, decision_rx, cancelled, move |key| access.authorize(key).map_err(|_| "设备授权保存失败"));
            tokio::pin!(pairing);
            let result = tokio::select! {
                candidate = candidate_rx => {
                    if let Ok(key) = candidate {
                        if let Ok(mut state) = shared.lock() {
                            if let Some(attempt) = state.current.as_mut().filter(|a| a.status.attempt_id == attempt_id && a.status.phase == "waiting") {
                                attempt.status.candidate = Some(key);
                                attempt.status.fingerprint = Some(format!("{:x}", Sha256::digest(key)));
                                attempt.status.phase = "approval".into();
                            }
                        }
                    }
                    pairing.await
                }
                result = &mut pairing => result,
            };
            if let Ok(mut state) = shared.lock() {
                if let Some(attempt) = state.current.as_mut().filter(|a| a.status.attempt_id == attempt_id) {
                    attempt.decision = None;
                    attempt.status.phase = match result {
                        Ok(_) => "paired",
                        Err(PairingError::Rejected) => "rejected",
                        Err(PairingError::Expired) => "expired",
                        Err(PairingError::Cancelled) => "cancelled",
                        Err(PairingError::GrantUncertain) => "uncertain",
                        Err(PairingError::GrantedButIncomplete) => "incomplete",
                        Err(PairingError::InvalidOrDisconnected) => "failed",
                    }.into();
                }
            }
        });
        let mut tasks = self.tasks.lock().map_err(|_| "配对服务不可用")?;
        tasks.retain(|task| !task.is_finished());
        tasks.push(task);
        Ok(offer)
    }

    pub fn status(&self) -> Result<Option<PairingStatus>, String> {
        Ok(self.state.lock().map_err(|_| "配对服务不可用")?.current.as_ref().map(|a| a.status.clone()))
    }

    /// Both the attempt and candidate key bind a decision to the displayed peer.
    pub fn decide(&self, id: &str, key: [u8; 32], approve: bool) -> Result<PairingStatus, String> {
        let mut state = self.state.lock().map_err(|_| "配对服务不可用")?;
        let attempt = state.current.as_mut().filter(|a| a.status.attempt_id == id && a.status.phase == "approval" && a.status.candidate == Some(key)).ok_or("配对请求已变化，请重新检查")?;
        let sender = attempt.decision.take().ok_or("配对请求已处理")?;
        sender.send(approve).map_err(|_| "配对请求已结束，请重新检查")?;
        attempt.status.phase = if approve { "saving" } else { "rejecting" }.into();
        Ok(attempt.status.clone())
    }

    pub fn cancel(&self, id: &str) -> Result<PairingStatus, String> {
        let mut state = self.state.lock().map_err(|_| "配对服务不可用")?;
        let attempt = state.current.as_mut().filter(|a| a.status.attempt_id == id).ok_or("配对请求已变化，请重新检查")?;
        if !matches!(attempt.status.phase.as_str(), "waiting" | "approval") { return Err("配对已进入提交或结束，请重新检查")?; }
        attempt.cancel.send(true).map_err(|_| "配对请求已结束，请重新检查")?;
        attempt.status.phase = "cancelling".into();
        Ok(attempt.status.clone())
    }

    /// Cancel pre-commit work and join every task, including in-flight disk writes.
    pub fn shutdown(&self) {
        if let Ok(mut state) = self.state.lock() {
            state.closing = true;
            if let Some(attempt) = &state.current { let _ = attempt.cancel.send(true); }
        }
        if let Ok(mut tasks) = self.tasks.lock() {
            let tasks = std::mem::take(&mut *tasks);
            self.runtime.block_on(async { for task in tasks { let _ = task.await; } });
        }
    }
}
