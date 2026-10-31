//! Owns the lifecycle lock until the old dsh process group is fully reaped.
use super::environment::environment;
use crate::{Config, Result, private_file};
use fs2::FileExt;
use std::{
    io::{self, Read, Write},
    os::unix::process::CommandExt,
    process::{Child, Command, Stdio},
    sync::mpsc,
    thread,
    time::{Duration, Instant},
};

pub(super) fn alive_group(pid: u32) -> bool {
    unsafe {
        libc::kill(-(pid as i32), 0) == 0
            || io::Error::last_os_error().raw_os_error() == Some(libc::EPERM)
    }
}
fn signal_group(pid: u32, signal: i32) {
    unsafe {
        libc::kill(-(pid as i32), signal);
    }
}

pub(super) fn reap(child: &mut Child) -> Result<()> {
    let pid = child.id();
    signal_group(pid, libc::SIGTERM);
    let deadline = Instant::now() + Duration::from_secs(5);
    loop {
        let _ = child.try_wait();
        if !alive_group(pid) {
            let _ = child.wait();
            return Ok(());
        }
        if Instant::now() >= deadline {
            break;
        }
        thread::sleep(Duration::from_millis(25));
    }
    signal_group(pid, libc::SIGKILL);
    let _ = child.wait();
    let deadline = Instant::now() + Duration::from_secs(3);
    while alive_group(pid) {
        if Instant::now() >= deadline {
            return Err("旧 dsh 进程组未确认退出，保持生命周期锁".into());
        }
        thread::sleep(Duration::from_millis(25));
    }
    Ok(())
}

struct GuardedChild(Child);
impl Drop for GuardedChild {
    fn drop(&mut self) {
        // This guard is created immediately after spawn, so errors and panics
        // cannot release the lifecycle lock while the child group is alive.
        while let Err(reason) = reap(&mut self.0) {
            eprintln!("{reason}");
            thread::sleep(Duration::from_secs(1));
        }
    }
}

/// Optional product overlay for `@dsh-bot/dsh-plugin-bot-composition`.
/// Set `DSH_BOT_COMPOSITION_PLUGIN` to the absolute package directory.
fn composition_patch(config: &Config) -> Result<Option<std::path::PathBuf>> {
    let Some(plugin) = std::env::var_os("DSH_BOT_COMPOSITION_PLUGIN") else {
        return Ok(None);
    };
    let plugin = std::path::PathBuf::from(plugin);
    if !plugin.is_absolute() {
        return Err("DSH_BOT_COMPOSITION_PLUGIN must be absolute".into());
    }
    if !plugin.is_dir() {
        return Err("DSH_BOT_COMPOSITION_PLUGIN is not a directory".into());
    }
    let patch = config.runtime().join("bot-composition.patch.yml");
    // Node ESM rejects directory imports; point at the built entry.
    let entry = plugin.join("lib").join("index.js");
    if !entry.is_file() {
        return Err("DSH_BOT_COMPOSITION_PLUGIN is missing lib/index.js (run prepare:plugins)".into());
    }
    let name = serde_json::to_string(&entry.display().to_string())
        .map_err(|error| error.to_string())?;
    let body = format!(
        "- insert:\n    - id: bot-composition\n      name: {name}\n      inject: [agentPresets]\n"
    );
    std::fs::write(&patch, body).map_err(|error| error.to_string())?;
    Ok(Some(patch))
}

pub fn run(config: &Config) -> Result<()> {
    let lock = private_file(&config.runtime().join("lifecycle.lock"))?;
    // Do not block indefinitely or force-unlock an old guardian's cleanup barrier.
    let deadline = Instant::now() + config.startup_timeout;
    loop {
        match lock.try_lock_exclusive() {
            Ok(()) => break,
            Err(e) if e.kind() == io::ErrorKind::WouldBlock && Instant::now() < deadline => {
                thread::sleep(Duration::from_millis(25))
            }
            Err(_) => return Err("旧后台尚未完成回收，不能启动新进程".into()),
        }
    }
    // Parent liveness is tracked even while reading the login environment.
    let (tx, rx) = mpsc::sync_channel(1);
    thread::spawn(move || {
        let mut input = [0u8; 1];
        let _ = io::stdin().read(&mut input);
        let _ = tx.send(());
    });
    let (env, cli) = environment(config)?;
    if rx.try_recv().is_ok() {
        return Ok(());
    }
    let composition_patch = composition_patch(config)?;
    let mut command = Command::new(cli);
    let mut args = vec!["--profile".into(), "web".into()];
    if let Some(patch) = &composition_patch {
        args.push("--patch".into());
        args.push(patch.display().to_string());
    }
    args.extend([
        "--host".into(),
        "127.0.0.1".into(),
        "--port".into(),
        "0".into(),
        "--no-open".into(),
    ]);
    command
        .args(&args)
        .env_clear()
        .envs(env)
        .current_dir(&config.root)
        .stdin(Stdio::null())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .process_group(0);
    unsafe {
        command.pre_exec(|| {
            libc::signal(libc::SIGTERM, libc::SIG_DFL);
            libc::signal(libc::SIGINT, libc::SIG_DFL);
            Ok(())
        });
    }
    let mut child = GuardedChild(
        command
            .spawn()
            .map_err(|_| "无法启动官方 dsh".to_string())?,
    );
    let _ = writeln!(io::stdout(), "dsh-host-pid: {}", child.0.id());
    let _ = io::stdout().flush();
    loop {
        if rx.try_recv().is_ok() {
            break;
        }
        if child.0.try_wait().map_err(|e| e.to_string())?.is_some() {
            let _ = writeln!(io::stdout(), "dsh-host-exited");
            let _ = io::stdout().flush();
            break;
        }
        thread::sleep(Duration::from_millis(25));
    }
    drop(child);
    drop(lock);
    Ok(())
}
