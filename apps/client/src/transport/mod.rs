//! Authenticated loopback transport; protocol authentication stays in the official client.
mod socket;

use nsh_core::prelude::*;
pub use socket::Socket;

/// Authenticated loopback WebSocket transport for the desktop client.
#[module]
pub struct Transport;

#[module]
impl Transport {
    /// Open an authenticated local API socket with a bounded handshake.
    pub async fn connect(url: String, cookie: String) -> Result<Socket, String> {
        socket::connect(url, cookie).await
    }
}
