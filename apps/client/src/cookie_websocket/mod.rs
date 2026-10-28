//! Cookie-bearing WebSocket handshake missing from NSH standard APIs.
//! HTTP and ordinary WebSockets use NSH; authentication policy stays in TypeScript.
mod socket;

use nsh_core::prelude::*;
pub use socket::Socket;

/// Local dsh WebSocket I/O with an explicitly supplied authentication Cookie.
#[module]
pub struct CookieWebSocket;

#[module]
impl CookieWebSocket {
    /// Open only the loopback dsh API socket; no bootstrap or credential storage.
    pub async fn connect(url: String, cookie: String) -> Result<Socket, String> {
        socket::connect(url, cookie).await
    }
}
