//! One-shot, explicitly approved device pairing over an encrypted handshake.
//!
//! An invitation must securely convey the Host public key and an unguessable
//! one-use rendezvous address. This module does not create invitations, store
//! grants or implement the user interface; its caller owns those operations.
use super::secure_channel::{self, Channel, Handshake};
use snow::{Builder, HandshakeState};
use std::time::{Duration, Instant};

const MAX_HANDSHAKE: usize = 65_535;
const MAX_LIFETIME: Duration = Duration::from_secs(300);
pub const CONFIRMATION: &[u8] = b"dsh-bot pairing confirmation v1";

/// Generate a fresh, unpredictable invitation context for each attempt.
pub fn generate_nonce() -> Result<[u8; 32], &'static str> {
    let mut nonce = [0; 32];
    getrandom::fill(&mut nonce).map_err(|_| "pairing entropy unavailable")?;
    Ok(nonce)
}

fn prologue(nonce: &[u8; 32]) -> Vec<u8> {
    let mut bytes = b"dsh-bot pairing v1\0".to_vec();
    bytes.extend_from_slice(nonce);
    bytes
}

/// The nonce must be freshly generated for each invitation and conveyed with
/// the Host key. Binding it to the transcript prevents cross-invitation replay.
pub fn initiate(
    device_private: &[u8; 32],
    host_public: [u8; 32],
    nonce: &[u8; 32],
) -> Result<Handshake, &'static str> {
    secure_channel::pairing_initiator(device_private, host_public, &prologue(nonce))
}

/// An invitation admits at most one handshake attempt. Dropping it cancels it.
pub struct Invitation {
    state: HandshakeState,
    expires: Instant,
}

/// The UI must show this candidate's key fingerprint before asking the owner.
/// No reply or application channel is produced until the owner approves and
/// the grant has been durably stored by the caller.
pub struct PendingApproval {
    state: HandshakeState,
    device_key: [u8; 32],
    expires: Instant,
}

pub struct PendingConfirmation {
    channel: Channel,
    expires: Instant,
}

impl PendingConfirmation {
    /// The returned channel proves the device received the handshake reply.
    /// The owner must still coordinate current authorization and revocation.
    pub fn confirm(mut self, frame: &[u8]) -> Result<(Vec<u8>, Channel), &'static str> {
        if Instant::now() >= self.expires || self.channel.decrypt(frame)? != CONFIRMATION {
            return Err("pairing confirmation failed");
        }
        let reply = self.channel.encrypt(CONFIRMATION)?;
        Ok((reply, self.channel))
    }
}

impl Invitation {
    pub fn new(
        host_private: &[u8; 32],
        nonce: &[u8; 32],
        lifetime: Duration,
    ) -> Result<Self, &'static str> {
        if lifetime.is_zero() || lifetime > MAX_LIFETIME {
            return Err("invalid pairing lifetime");
        }
        let context = prologue(nonce);
        let state = Builder::new(secure_channel::params()?)
            .prologue(&context)
            .map_err(|_| "invalid pairing context")?
            .local_private_key(host_private)
            .map_err(|_| "invalid channel key")?
            .build_responder()
            .map_err(|_| "invalid channel key")?;
        Ok(Self {
            state,
            expires: Instant::now() + lifetime,
        })
    }

    pub fn expires_at(&self) -> Instant { self.expires }

    /// Consumes the invitation on every attempt, including invalid messages.
    pub fn receive(mut self, message: &[u8]) -> Result<PendingApproval, &'static str> {
        if Instant::now() >= self.expires || message.len() > MAX_HANDSHAKE {
            return Err("pairing expired or invalid");
        }
        let mut payload = vec![0; MAX_HANDSHAKE];
        let len = self
            .state
            .read_message(message, &mut payload)
            .map_err(|_| "pairing request invalid")?;
        if len != 0 {
            return Err("pairing request invalid");
        }
        let device_key = self
            .state
            .get_remote_static()
            .and_then(|key| key.try_into().ok())
            .ok_or("pairing request invalid")?;
        Ok(PendingApproval {
            state: self.state,
            device_key,
            expires: self.expires,
        })
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum ApprovalError {
    Expired,
    /// The persistence operation may have committed even if it returned an error.
    PersistenceUncertain,
    /// The grant was saved, but no acceptance was returned; reconcile or revoke it.
    GrantedButIncomplete,
}

impl PendingApproval {
    pub fn device_key(&self) -> [u8; 32] {
        self.device_key
    }

    /// Consumes the request; `persist` must atomically and durably store the
    /// device grant and reject revoked keys. Failure never sends an acceptance.
    pub fn approve<F>(mut self, persist: F) -> Result<(Vec<u8>, PendingConfirmation), ApprovalError>
    where
        F: FnOnce([u8; 32]) -> Result<(), &'static str>,
    {
        if Instant::now() >= self.expires {
            return Err(ApprovalError::Expired);
        }
        persist(self.device_key).map_err(|_| ApprovalError::PersistenceUncertain)?;
        if Instant::now() >= self.expires {
            return Err(ApprovalError::GrantedButIncomplete);
        }
        let mut reply = vec![0; MAX_HANDSHAKE];
        let len = self
            .state
            .write_message(&[], &mut reply)
            .map_err(|_| ApprovalError::GrantedButIncomplete)?;
        reply.truncate(len);
        let channel =
            Channel::from_handshake(self.state).map_err(|_| ApprovalError::GrantedButIncomplete)?;
        Ok((
            reply,
            PendingConfirmation {
                channel,
                expires: self.expires,
            },
        ))
    }
}
