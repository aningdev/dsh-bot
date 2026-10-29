//! One-use pairing over an opaque Relay room. The Host owns approval and grants.
use super::{
    pairing::{self, ApprovalError, Invitation},
    relay::{self, Side},
};
use futures_util::SinkExt;
use std::time::Duration;
use tokio::sync::{oneshot, watch};
use tokio_tungstenite::tungstenite::Message;

#[derive(Debug, PartialEq, Eq)]
pub enum PairingError {
    InvalidOrDisconnected,
    Rejected,
    Expired,
    Cancelled,
    /// Persistence reported an error and might have committed.
    GrantUncertain,
    /// The grant was saved, but pairing did not finish; inspect or revoke it.
    GrantedButIncomplete,
}

/// The receiver displays the candidate fingerprint to the local owner. Dropping
/// either approval end rejects the attempt. After approval, persistence runs on
/// a blocking worker and is always awaited, even when the invitation expires.
/// The manager must retain and join this task instead of aborting it on shutdown.
pub async fn host<F>(
    base: &str,
    room: &str,
    invitation: Invitation,
    candidate: oneshot::Sender<[u8; 32]>,
    decision: oneshot::Receiver<bool>,
    persist: F,
) -> Result<[u8; 32], PairingError>
where
    F: FnOnce([u8; 32]) -> Result<(), &'static str> + Send + 'static,
{
    let (_keep_alive, cancelled) = watch::channel(false);
    host_cancelable(base, room, invitation, candidate, decision, cancelled, persist).await
}

/// Cancellation stops only the pre-commit stage. Once persistence starts it is
/// awaited to a definite conclusion before this future returns.
pub async fn host_cancelable<F>(
    base: &str,
    room: &str,
    invitation: Invitation,
    candidate: oneshot::Sender<[u8; 32]>,
    mut decision: oneshot::Receiver<bool>,
    mut cancelled: watch::Receiver<bool>,
    persist: F,
) -> Result<[u8; 32], PairingError>
where
    F: FnOnce([u8; 32]) -> Result<(), &'static str> + Send + 'static,
{
    let deadline = tokio::time::Instant::from_std(invitation.expires_at());
    let waiting = tokio::time::timeout_at(deadline, async {
        let mut socket = loop {
            match relay::open_socket(base, room, &Side::Host).await {
                Ok(socket) => break socket,
                Err("relay peer timeout") => continue,
                Err(_) => return Err(PairingError::InvalidOrDisconnected),
            }
        };
        let message = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::InvalidOrDisconnected)?;
        let pending = invitation
            .receive(&message)
            .map_err(|_| PairingError::InvalidOrDisconnected)?;
        let key = pending.device_key();
        candidate.send(key).map_err(|_| PairingError::Rejected)?;
        loop {
            tokio::select! {
                biased;
                message = relay::next(&mut socket) => {
                    // Pairing requests have no further application frames until approved.
                    let _ = message;
                    return Err(PairingError::InvalidOrDisconnected);
                }
                result = &mut decision => {
                    if !result.unwrap_or(false) { return Err(PairingError::Rejected); }
                    break;
                }
            }
        }
        Ok((socket, pending, key))
    });
    let (mut socket, pending, key) = tokio::select! {
        biased;
        _ = async {
            while !*cancelled.borrow() {
                if cancelled.changed().await.is_err() { break; }
            }
        } => return Err(PairingError::Cancelled),
        result = waiting => result.map_err(|_| PairingError::Expired)??,
    };

    let (reply, confirmation) = tokio::task::spawn_blocking(move || pending.approve(persist))
        .await
        .map_err(|_| PairingError::GrantUncertain)?
        .map_err(|error| match error {
            ApprovalError::Expired => PairingError::Expired,
            ApprovalError::PersistenceUncertain => PairingError::GrantUncertain,
            ApprovalError::GrantedButIncomplete => PairingError::GrantedButIncomplete,
        })?;
    tokio::time::timeout_at(deadline, async {
        socket
            .send(Message::Binary(reply.into()))
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        let frame = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        let (ack, mut channel) = confirmation
            .confirm(&frame)
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        socket
            .send(Message::Binary(ack.into()))
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        let receipt = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        if channel
            .decrypt(&receipt)
            .map_err(|_| PairingError::GrantedButIncomplete)?
            != pairing::CONFIRMATION
        {
            return Err(PairingError::GrantedButIncomplete);
        }
        let done = channel
            .encrypt(pairing::CONFIRMATION)
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        socket
            .send(Message::Binary(done.into()))
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        let final_receipt = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantedButIncomplete)?;
        if channel
            .decrypt(&final_receipt)
            .map_err(|_| PairingError::GrantedButIncomplete)?
            != pairing::CONFIRMATION
        {
            return Err(PairingError::GrantedButIncomplete);
        }
        Ok(key)
    })
    .await
    .map_err(|_| PairingError::GrantedButIncomplete)?
}

/// The private key is device-owned and must be retained securely by its caller.
pub async fn device(
    base: &str,
    room: &str,
    device_private: &[u8; 32],
    host_public: [u8; 32],
    nonce: &[u8; 32],
    lifetime: Duration,
) -> Result<(), PairingError> {
    if lifetime.is_zero() || lifetime > Duration::from_secs(300) {
        return Err(PairingError::Expired);
    }
    tokio::time::timeout(lifetime, async {
        let mut socket = relay::open_socket(base, room, &Side::Device)
            .await
            .map_err(|_| PairingError::InvalidOrDisconnected)?;
        let mut handshake = pairing::initiate(device_private, host_public, nonce)
            .map_err(|_| PairingError::InvalidOrDisconnected)?;
        socket
            .send(Message::Binary(
                handshake
                    .write()
                    .map_err(|_| PairingError::InvalidOrDisconnected)?
                    .into(),
            ))
            .await
            .map_err(|_| PairingError::InvalidOrDisconnected)?;
        let reply = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        handshake
            .read(&reply)
            .map_err(|_| PairingError::GrantUncertain)?;
        let mut channel = handshake
            .finish()
            .map_err(|_| PairingError::GrantUncertain)?;
        let confirmation = channel
            .encrypt(pairing::CONFIRMATION)
            .map_err(|_| PairingError::GrantUncertain)?;
        socket
            .send(Message::Binary(confirmation.into()))
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        let ack = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        if channel
            .decrypt(&ack)
            .map_err(|_| PairingError::GrantUncertain)?
            != pairing::CONFIRMATION
        {
            return Err(PairingError::GrantUncertain);
        }
        let receipt = channel
            .encrypt(pairing::CONFIRMATION)
            .map_err(|_| PairingError::GrantUncertain)?;
        socket
            .send(Message::Binary(receipt.into()))
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        let done = relay::binary(&mut socket)
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        if channel
            .decrypt(&done)
            .map_err(|_| PairingError::GrantUncertain)?
            != pairing::CONFIRMATION
        {
            return Err(PairingError::GrantUncertain);
        }
        let receipt = channel
            .encrypt(pairing::CONFIRMATION)
            .map_err(|_| PairingError::GrantUncertain)?;
        socket
            .send(Message::Binary(receipt.into()))
            .await
            .map_err(|_| PairingError::GrantUncertain)?;
        // The authenticated final frame proved approval; keep the room alive
        // briefly so the Host can receive this last receipt.
        let _ = tokio::time::timeout(Duration::from_secs(2), relay::next(&mut socket)).await;
        Ok(())
    })
    .await
    .map_err(|_| PairingError::GrantUncertain)?
}
