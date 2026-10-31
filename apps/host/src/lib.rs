//! Host lifecycle and local control. No Harness business calls or session state.
pub mod bridge;
mod config;
pub mod dsh_process;
pub mod host_control;
mod runtime;

pub use config::{CliSource, Config, STARTUP_TIMEOUT};
pub type Result<T> = std::result::Result<T, String>;
// Preserve the shared control interface used by the NSH native adapter.
pub use host_control::{MAX_FRAME, PROTOCOL, Request, Status, call, decode_response, read_frame};
pub use runtime::{generation, now, private_dir, private_file};
