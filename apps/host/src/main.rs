//! Executable modes, configuration and signal handling.
use dsh_host::{Config, Result, dsh_process, host_control};
use std::{
    path::PathBuf,
    sync::atomic::{AtomicBool, Ordering},
    time::Duration,
};

static EXIT: AtomicBool = AtomicBool::new(false);
extern "C" fn exit_signal(_: libc::c_int) {
    EXIT.store(true, Ordering::Release);
}

fn config(args: &[String]) -> Result<Config> {
    let mut root = None;
    let mut cli = None;
    let mut logs = None;
    let mut version = None;
    let mut startup = 20_000;
    let mut args = args.iter();
    while let Some(key) = args.next() {
        let value = args.next().ok_or("Missing argument")?;
        match key.as_str() {
            "--data-root" => root = Some(PathBuf::from(value)),
            "--dsh" => cli = Some(PathBuf::from(value)),
            "--logs" => logs = Some(PathBuf::from(value)),
            "--version" => version = Some(value.clone()),
            "--startup-ms" => {
                startup = value
                    .parse::<u64>()
                    .map_err(|_| "Invalid startup deadline")?
            }
            _ => return Err(format!("Unknown argument: {key}")),
        }
    }
    if !(100..=180_000).contains(&startup) {
        return Err("Invalid startup deadline".into());
    }
    let config = Config {
        root: root.ok_or("Missing data root")?,
        cli: cli.ok_or("Missing CLI")?,
        logs: logs.ok_or("Missing logs")?,
        version: version.ok_or("Missing version pin")?,
        startup_timeout: Duration::from_millis(startup),
    };
    config.prepare()?;
    Ok(config)
}
fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    unsafe {
        libc::signal(
            libc::SIGTERM,
            exit_signal as *const () as libc::sighandler_t,
        );
        libc::signal(libc::SIGINT, exit_signal as *const () as libc::sighandler_t);
    }
    let result = match args.split_first() {
        Some((mode, rest)) if mode == "serve-app" && rest.is_empty() => {
            let home = std::env::var("HOME").map_err(|_| "无法确定用户目录".to_string());
            home.and_then(|home| {
                let pin: serde_json::Value = serde_json::from_str(include_str!("../../../scripts/backend/pinned-version.json")).map_err(|_| "无效发行版配置")?;
                let root = PathBuf::from(home).join(".dsh-bot");
                let config = Config { logs: root.join("logs"), root, cli: PathBuf::from("dsh"), version: pin["release"].as_str().ok_or("缺少发行版版本")?.into(), startup_timeout: Duration::from_secs(30) };
                config.prepare()?;
                host_control::serve(config, &EXIT)
            })
        }
        Some((mode, rest)) if mode == "serve" => config(rest).and_then(|config| host_control::serve(config, &EXIT)),
        Some((mode, rest)) if mode == "guardian" => {
            // Guardian must outlive SIGTERM of its host and react to pipe EOF.
            unsafe { libc::signal(libc::SIGTERM, libc::SIG_IGN); libc::signal(libc::SIGINT, libc::SIG_IGN); }
            config(rest).and_then(|config| dsh_process::run_guardian(&config))
        }
        _ => Err("Usage: dsh-host serve|guardian --data-root PATH --dsh PATH --logs PATH --version VERSION".into()),
    };
    if let Err(error) = result {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
