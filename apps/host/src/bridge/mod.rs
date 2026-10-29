//! Host-owned building blocks for the future device bridge.
//!
//! No network listener or authorization is exposed by this module. A caller
//! must authenticate and authorize a device before returning a snapshot.
pub mod device_access;
pub mod device_store;
mod identity;
pub mod pairing_manager;
pub mod pairing;
pub mod pairing_relay;
pub mod relay;
pub mod secure_channel;
pub mod session_request;
pub mod snapshot;
