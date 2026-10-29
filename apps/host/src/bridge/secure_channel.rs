//! Mutually authenticated encrypted channel for an already paired device.
//!
//! Both static public keys must be pinned by the pairing layer. The Relay only
//! transports handshake and ciphertext frames and never receives either secret.
use snow::{Builder, HandshakeState, TransportState, params::NoiseParams};

const PATTERN: &str = "Noise_IK_25519_ChaChaPoly_SHA256";
const MAX_FRAME: usize = 65_535;
const MAX_PLAINTEXT: usize = MAX_FRAME - 16;

pub struct Handshake {
    state: HandshakeState,
    expected_remote: [u8; 32],
    failed: bool,
}

pub struct Channel {
    state: TransportState,
    failed: bool,
}

pub(super) fn params() -> Result<NoiseParams, &'static str> {
    PATTERN.parse().map_err(|_| "invalid channel protocol")
}

/// The device initiates with its own private key and the paired Host public key.
pub fn initiator(private: &[u8; 32], host: [u8; 32]) -> Result<Handshake, &'static str> {
    let state = Builder::new(params()?)
        .local_private_key(private)
        .map_err(|_| "invalid channel key")?
        .remote_public_key(&host)
        .map_err(|_| "invalid channel key")?
        .build_initiator()
        .map_err(|_| "invalid channel key")?;
    Ok(Handshake {
        state,
        expected_remote: host,
        failed: false,
    })
}

pub(super) fn pairing_initiator(
    private: &[u8; 32],
    host: [u8; 32],
    prologue: &[u8],
) -> Result<Handshake, &'static str> {
    let state = Builder::new(params()?)
        .prologue(prologue)
        .map_err(|_| "invalid pairing context")?
        .local_private_key(private)
        .map_err(|_| "invalid channel key")?
        .remote_public_key(&host)
        .map_err(|_| "invalid channel key")?
        .build_initiator()
        .map_err(|_| "invalid channel key")?;
    Ok(Handshake {
        state,
        expected_remote: host,
        failed: false,
    })
}

/// The Host accepts only the explicitly paired device public key.
pub fn responder(private: &[u8; 32], device: [u8; 32]) -> Result<Handshake, &'static str> {
    let state = Builder::new(params()?)
        .local_private_key(private)
        .map_err(|_| "invalid channel key")?
        .build_responder()
        .map_err(|_| "invalid channel key")?;
    Ok(Handshake {
        state,
        expected_remote: device,
        failed: false,
    })
}

impl Handshake {
    /// Handshake messages carry no application data.
    pub fn write(&mut self) -> Result<Vec<u8>, &'static str> {
        if self.failed {
            return Err("channel handshake failed");
        }
        let mut out = vec![0; MAX_FRAME];
        let len = self.state.write_message(&[], &mut out).map_err(|_| {
            self.failed = true;
            "channel handshake failed"
        })?;
        out.truncate(len);
        Ok(out)
    }

    pub fn read(&mut self, message: &[u8]) -> Result<(), &'static str> {
        if self.failed || message.len() > MAX_FRAME {
            self.failed = true;
            return Err("channel handshake failed");
        }
        let mut out = vec![0; MAX_FRAME];
        let len = self.state.read_message(message, &mut out).map_err(|_| {
            self.failed = true;
            "channel handshake failed"
        })?;
        if len != 0
            || self
                .state
                .get_remote_static()
                .is_some_and(|key| key != self.expected_remote)
        {
            self.failed = true;
            return Err("channel peer is not authorized");
        }
        Ok(())
    }

    pub fn finish(self) -> Result<Channel, &'static str> {
        if self.failed
            || !self.state.is_handshake_finished()
            || self.state.get_remote_static() != Some(self.expected_remote.as_slice())
        {
            return Err("channel peer is not authorized");
        }
        let state = self
            .state
            .into_transport_mode()
            .map_err(|_| "channel handshake incomplete")?;
        Ok(Channel {
            state,
            failed: false,
        })
    }
}

impl Channel {
    pub(super) fn from_handshake(state: HandshakeState) -> Result<Self, &'static str> {
        let state = state
            .into_transport_mode()
            .map_err(|_| "channel handshake incomplete")?;
        Ok(Self {
            state,
            failed: false,
        })
    }

    /// Frames must be delivered once and in order; a failure permanently closes
    /// this channel. Reconnection requires a fresh handshake and new keys.
    pub fn encrypt(&mut self, plaintext: &[u8]) -> Result<Vec<u8>, &'static str> {
        if self.failed || plaintext.len() > MAX_PLAINTEXT {
            self.failed = true;
            return Err("channel frame rejected");
        }
        let mut out = vec![0; plaintext.len() + 16];
        let len = self.state.write_message(plaintext, &mut out).map_err(|_| {
            self.failed = true;
            "channel frame rejected"
        })?;
        out.truncate(len);
        Ok(out)
    }

    pub fn decrypt(&mut self, frame: &[u8]) -> Result<Vec<u8>, &'static str> {
        if self.failed || frame.len() < 16 || frame.len() > MAX_FRAME {
            self.failed = true;
            return Err("channel frame rejected");
        }
        let mut out = vec![0; frame.len()];
        let len = self.state.read_message(frame, &mut out).map_err(|_| {
            self.failed = true;
            "channel frame rejected"
        })?;
        out.truncate(len);
        Ok(out)
    }
}

/// New device or Host key material; keep the private part in protected storage.
pub fn generate_keypair() -> Result<([u8; 32], [u8; 32]), &'static str> {
    let keys = Builder::new(params()?)
        .generate_keypair()
        .map_err(|_| "key generation failed")?;
    let private = keys
        .private
        .try_into()
        .map_err(|_| "key generation failed")?;
    let public = keys
        .public
        .try_into()
        .map_err(|_| "key generation failed")?;
    Ok((private, public))
}
