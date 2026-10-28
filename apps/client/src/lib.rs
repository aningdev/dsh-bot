//! Native registration only. Each module owns its transport or local OS adaptation.
mod cookie_websocket;
mod host_control;

pub use cookie_websocket::{CookieWebSocket, Socket};
use host_control::{HostControl, HostWatch};
use nsh_core::prelude::*;

#[native_module("dsh-client/native")]
fn native(registry: &mut Registry) {
    registry.module::<CookieWebSocket>().class::<Socket>();
    registry.module::<HostControl>().class::<HostWatch>();
}
