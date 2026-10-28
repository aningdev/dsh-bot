//! Native registration only. Each module owns its transport or local OS adaptation.
mod host_control;
mod transport;

use host_control::{HostControl, HostWatch};
use nsh_core::prelude::*;
pub use transport::{Socket, Transport};

#[native_module("dsh-client/native")]
fn native(registry: &mut Registry) {
    registry.module::<Transport>().class::<Socket>();
    registry.module::<HostControl>().class::<HostWatch>();
}
