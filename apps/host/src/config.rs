//! Validated host paths and launch configuration.
use crate::{Result, private_dir};
use std::{path::PathBuf, time::Duration};

/// Default startup deadline for product and isolation entries when unset.
pub const STARTUP_TIMEOUT: Duration = Duration::from_secs(30);

const SUPPORTED_DSH: &str = include_str!("../supported-dsh.json");

#[derive(Clone)]
pub enum CliSource {
    /// Resolve the official `dsh` executable from the login-shell PATH.
    Official,
    /// Use an absolute path, for isolated tests and fixtures.
    Executable(PathBuf),
}

#[derive(Clone)]
pub struct Config {
    pub root: PathBuf,
    pub cli: CliSource,
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

    /// Product defaults: `~/.dsh-bot`, official dsh, embedded release pin, 30s.
    pub fn product() -> Result<Self> {
        let home = std::env::var("HOME").map_err(|_| "无法确定用户目录".to_string())?;
        let root = PathBuf::from(home).join(".dsh-bot");
        let pin: serde_json::Value =
            serde_json::from_str(SUPPORTED_DSH).map_err(|_| "无效发行版配置")?;
        let version = pin["release"].as_str().ok_or("缺少发行版版本")?.to_owned();
        let config = Self {
            logs: root.join("logs"),
            root,
            cli: CliSource::Official,
            version,
            startup_timeout: STARTUP_TIMEOUT,
        };
        config.prepare()?;
        Ok(config)
    }

    /// Isolation entry used by `serve`, `guardian`, and tests.
    pub fn from_args(args: &[String]) -> Result<Self> {
        let mut root = None;
        let mut cli = None;
        let mut version = None;
        let mut startup = STARTUP_TIMEOUT.as_millis() as u64;
        let mut args = args.iter();
        while let Some(key) = args.next() {
            match key.as_str() {
                "--official-dsh" => {
                    if cli.is_some() {
                        return Err("CLI source specified more than once".into());
                    }
                    cli = Some(CliSource::Official);
                }
                key => {
                    let value = args.next().ok_or("Missing argument")?;
                    match key {
                        "--data-root" => root = Some(PathBuf::from(value)),
                        "--dsh" => {
                            if cli.is_some() {
                                return Err("CLI source specified more than once".into());
                            }
                            let path = PathBuf::from(value);
                            if !path.is_absolute() {
                                return Err("CLI path must be absolute".into());
                            }
                            cli = Some(CliSource::Executable(path));
                        }
                        "--version" => version = Some(value.clone()),
                        "--startup-ms" => {
                            startup = value
                                .parse::<u64>()
                                .map_err(|_| "Invalid startup deadline")?;
                        }
                        _ => return Err(format!("Unknown argument: {key}")),
                    }
                }
            }
        }
        if !(100..=180_000).contains(&startup) {
            return Err("Invalid startup deadline".into());
        }
        let root = root.ok_or("Missing data root")?;
        let config = Self {
            logs: root.join("logs"),
            root,
            cli: cli.ok_or("Missing CLI")?,
            version: version.ok_or("Missing version pin")?,
            startup_timeout: Duration::from_millis(startup),
        };
        config.prepare()?;
        Ok(config)
    }

    /// Serialize this config for guardian handoff.
    pub fn arguments(&self) -> Vec<String> {
        let mut args = vec![
            "--data-root".into(),
            self.root.to_string_lossy().into_owned(),
        ];
        match &self.cli {
            CliSource::Official => args.push("--official-dsh".into()),
            CliSource::Executable(path) => {
                args.push("--dsh".into());
                args.push(path.to_string_lossy().into_owned());
            }
        }
        args.push("--version".into());
        args.push(self.version.clone());
        args.push("--startup-ms".into());
        args.push(self.startup_timeout.as_millis().to_string());
        args
    }

    pub fn prepare(&self) -> Result<()> {
        if !self.root.is_absolute() || !self.logs.is_absolute() {
            return Err("Paths must be absolute".into());
        }
        if let CliSource::Executable(path) = &self.cli
            && !path.is_absolute()
        {
            return Err("CLI path must be absolute".into());
        }
        private_dir(&self.root)?;
        private_dir(&self.runtime())?;
        private_dir(&self.logs)
    }
}
