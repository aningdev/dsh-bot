//! Validated host paths and launch configuration.
use crate::{Result, private_dir};
use std::{
    path::{Path, PathBuf},
    time::Duration,
};

#[derive(Clone)]
pub struct Config {
    pub root: PathBuf,
    pub cli: PathBuf,
    pub logs: PathBuf,
    pub version: String,
    pub startup_timeout: Duration,
}
impl Config {
    pub fn runtime(&self) -> PathBuf {
        self.root.join("host")
    }
    pub fn socket(&self) -> PathBuf {
        self.runtime().join("control.sock")
    }
    pub fn prepare(&self) -> Result<()> {
        if !self.root.is_absolute()
            || (!self.cli.is_absolute() && self.cli != Path::new("dsh"))
            || !self.logs.is_absolute()
        {
            return Err("Paths must be absolute (or the explicit login-PATH dsh selector)".into());
        }
        private_dir(&self.root)?;
        private_dir(&self.runtime())?;
        private_dir(&self.logs)
    }
}
