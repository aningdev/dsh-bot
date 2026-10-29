//! Serializes device grants and active-connection revocation within the Host.
use super::device_store::{Device, DeviceStore};
use std::{
    collections::{HashMap, HashSet},
    io,
    path::Path,
    sync::Mutex,
};
use tokio::sync::watch;

struct State {
    store: DeviceStore,
    connections: HashMap<[u8; 32], Vec<watch::Sender<bool>>>,
    uncertain: HashSet<[u8; 32]>,
}

pub struct DeviceAccess {
    state: Mutex<State>,
}

impl DeviceAccess {
    /// All grant changes for this store must go through this owner. Its parent
    /// directory must be trusted, as required by `DeviceStore`.
    pub fn new(directory: impl AsRef<Path>) -> Self {
        Self {
            state: Mutex::new(State {
                store: DeviceStore::new(directory),
                connections: HashMap::new(),
                uncertain: HashSet::new(),
            }),
        }
    }

    pub fn list(&self) -> io::Result<Vec<Device>> {
        self.state
            .lock()
            .map_err(|_| io::Error::other("device access unavailable"))?
            .store
            .list()
    }

    pub fn authorize(&self, key: [u8; 32]) -> io::Result<()> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| io::Error::other("device access unavailable"))?;
        if state.uncertain.contains(&key) {
            return Err(io::Error::other(
                "device authorization requires reconciliation",
            ));
        }
        let result = state.store.authorize(key);
        if result
            .as_ref()
            .is_err_and(|error| error.kind() != io::ErrorKind::AlreadyExists)
        {
            state.uncertain.insert(key);
            if let Some(connections) = state.connections.remove(&key) {
                for sender in connections {
                    let _ = sender.send(true);
                }
            }
        }
        result
    }

    /// Register only after cryptographic confirmation. The connection owner
    /// must close its transport when the returned receiver becomes true or is
    /// closed, and stop accepting new operations before dispatching them.
    pub fn register(&self, key: [u8; 32]) -> io::Result<watch::Receiver<bool>> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| io::Error::other("device access unavailable"))?;
        if state.uncertain.contains(&key) || !state.store.is_authorized(key)? {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "device is not authorized",
            ));
        }
        let connections = state.connections.entry(key).or_default();
        connections.retain(|sender| sender.receiver_count() > 0);
        if connections.len() >= 8 {
            return Err(io::Error::other("too many device connections"));
        }
        let (sender, receiver) = watch::channel(false);
        connections.push(sender);
        Ok(receiver)
    }

    /// Signal all registered connections even if persistence reports an error:
    /// the write may have committed and must be reconciled before reconnecting.
    /// Success confirms the tombstone, not that transport tasks have stopped;
    /// the owning manager must cancel and await their completion separately.
    pub fn revoke(&self, key: [u8; 32]) -> io::Result<()> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| io::Error::other("device access unavailable"))?;
        state.uncertain.insert(key);
        if let Some(connections) = state.connections.remove(&key) {
            for sender in connections {
                let _ = sender.send(true);
            }
        }
        let result = state.store.revoke(key);
        if result.is_ok() {
            state.uncertain.remove(&key);
        }
        result
    }
}
