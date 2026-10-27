//! Authenticated loopback transport for the DSH Bot client. No protocol logic lives here.
use futures_util::{SinkExt, StreamExt};
use nsh_core::ui::prelude::*;
use std::time::Duration;
use tokio::sync::{mpsc, Mutex};
use tokio_tungstenite::tungstenite::{client::IntoClientRequest, http::HeaderValue, Message};

#[native_module("dsh-client/native")]
fn native(registry: &mut Registry) {
    registry.module::<Transport>().class::<Socket>();
    registry.module::<Store>();
}

/// Authenticated loopback WebSocket transport for the desktop client.
#[module]
pub struct Transport;

/// A socket owned by the JS instance; disposal aborts its network task.
#[class]
pub struct Socket {
    send: mpsc::Sender<Option<String>>,
    incoming: std::sync::Arc<Mutex<mpsc::Receiver<Result<String, String>>>>,
    task: tokio::task::JoinHandle<()>,
}

impl Drop for Socket {
    fn drop(&mut self) { self.task.abort(); }
}

#[module]
impl Transport {
    /// Explicit test host input, or the current launchd-owned process's ready line.
    /// Every read re-discovers; a failed authentication never freezes a stale token.
    pub fn probe_url() -> Result<String, String> {
        if let Ok(url) = std::env::var("DSH_SPIKE_URL") { return Ok(url); }
        let home = std::env::var("HOME").map_err(|_| "No home directory")?;
        let log = std::fs::read_to_string(std::path::Path::new(&home).join("Library/Logs/dsh-bot/backend.log"))
            .map_err(|_| "请点击启动官方后台")?;
        let expected: serde_json::Value = serde_json::from_str(include_str!("../../../scripts/backend/pinned-version.json"))
            .map_err(|_| "Invalid pinned runtime version")?;
        let expected = expected["release"].as_str().ok_or("Missing runtime version")?.trim();
        let uid = std::process::Command::new("/usr/bin/id").arg("-u").output().map_err(|_| "Cannot identify current user")?;
        let target = format!("gui/{}/dev.dshbot.backend", String::from_utf8_lossy(&uid.stdout).trim());
        let job = std::process::Command::new("/bin/launchctl").args(["print", &target]).output().map_err(|_| "Cannot inspect backend")?;
        if !job.status.success() { return Err("后台尚未启动".into()); }
        let job = String::from_utf8_lossy(&job.stdout);
        let pid = job.lines().find_map(|line| line.trim().strip_prefix("pid = ")).ok_or("后台正在启动，请稍后重连")?;
        let mut valid = false;
        let mut ready = None;
        for line in log.lines() {
            if line.starts_with("[launch ") {
                valid = line.contains(&format!(" pid={pid} version={expected}"));
                ready = None;
            } else if valid {
                if let Some(url) = line.split("dsh web: ").nth(1) {
                    let url = url.split_whitespace().next().unwrap_or("");
                    if url.starts_with("http://127.0.0.1:") { ready = Some(url.to_owned()); }
                }
            }
        }
        ready.ok_or_else(|| "后台版本或当前启动信息未确认，请安装受支持版本并重新启动后台".into())
    }

    /// Explicit user action: install a launchd job, then discover its authenticated endpoint.
    /// launchd owns the official CLI; no Host is embedded in the client.
    pub async fn start_backend() -> Result<String, String> {
        if let Ok(url) = Self::probe_url() { return Ok(url); }
        use std::os::unix::fs::PermissionsExt;
        let home = std::env::var("HOME").map_err(|_| "No home directory")?;
        let root = std::path::Path::new(&home).join(".dsh-bot");
        let cli = [std::path::PathBuf::from("/usr/local/bin/dsh"), std::path::PathBuf::from("/opt/homebrew/bin/dsh"), std::path::Path::new(&home).join(".local/bin/dsh")]
            .into_iter().find_map(|path| std::fs::canonicalize(path).ok()).ok_or("未安装官方 dsh CLI")?;
        let pin: serde_json::Value = serde_json::from_str(include_str!("../../../scripts/backend/pinned-version.json")).map_err(|_| "Invalid runtime pin")?;
        let expected = pin["release"].as_str().ok_or("Missing runtime pin")?.trim();
        let actual = std::process::Command::new(&cli).arg("--version").output().map_err(|_| "不能检查官方 dsh 版本")?;
        if !actual.status.success() || String::from_utf8_lossy(&actual.stdout).trim() != expected {
            return Err(format!("官方 dsh 版本不兼容；需要 {expected}，不会自动安装或降级"));
        }
        let logs = std::path::Path::new(&home).join("Library/Logs/dsh-bot");
        let agents = std::path::Path::new(&home).join("Library/LaunchAgents");
        for dir in [root.join("bin"), logs.clone(), agents.clone()] {
            std::fs::create_dir_all(&dir).map_err(|_| "不能创建后台目录")?;
        }
        std::fs::set_permissions(&logs, std::fs::Permissions::from_mode(0o700)).map_err(|_| "不能保护日志目录")?;
        let log = logs.join("backend.log");
        std::fs::OpenOptions::new().append(true).create(true).open(&log).map_err(|_| "不能打开后台日志")?;
        std::fs::set_permissions(&log, std::fs::Permissions::from_mode(0o600)).map_err(|_| "不能保护后台日志")?;
        let wrapper = root.join("bin/launch-backend.sh");
        std::fs::write(&wrapper, include_str!("../../../scripts/backend/launch.sh")).map_err(|_| "不能安装启动脚本")?;
        let xml = |value: &str| value.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;");
        let body = format!(r#"<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict>
<key>Label</key><string>dev.dshbot.backend</string><key>ProgramArguments</key><array><string>/bin/sh</string><string>{}</string><string>{}</string><string>{}</string></array>
<key>EnvironmentVariables</key><dict><key>DSH_HOME</key><string>{}</string><key>DSH_AGENTS_HOME</key><string>{}</string></dict>
<key>RunAtLoad</key><false/><key>KeepAlive</key><dict><key>SuccessfulExit</key><false/></dict><key>ThrottleInterval</key><integer>10</integer>
<key>StandardOutPath</key><string>{}</string><key>StandardErrorPath</key><string>{}</string></dict></plist>"#,
xml(&wrapper.to_string_lossy()), xml(&cli.to_string_lossy()), xml(expected), xml(&root.to_string_lossy()), xml(&root.join("agents").to_string_lossy()), xml(&log.to_string_lossy()), xml(&log.to_string_lossy()));
        let plist = agents.join("dev.dshbot.backend.plist");
        std::fs::write(&plist, body).map_err(|_| "不能安装 LaunchAgent")?;
        let uid = std::process::Command::new("/usr/bin/id").arg("-u").output().map_err(|_| "Cannot identify current user")?;
        let domain = format!("gui/{}", String::from_utf8_lossy(&uid.stdout).trim());
        let job = std::process::Command::new("/bin/launchctl").args(["print", &format!("{domain}/dev.dshbot.backend")]).output().map_err(|_| "Cannot inspect launchd")?;
        if !job.status.success() {
            let result = std::process::Command::new("/bin/launchctl").arg("bootstrap").arg(&domain).arg(&plist).output().map_err(|_| "不能启动后台")?;
            if !result.status.success() { return Err("launchd 拒绝启动后台，请检查后台日志".into()); }
        } else if !String::from_utf8_lossy(&job.stdout).lines().any(|line| line.trim().starts_with("pid = ")) {
            let result = std::process::Command::new("/bin/launchctl").args(["kickstart", &format!("{domain}/dev.dshbot.backend")]).output().map_err(|_| "不能启动后台")?;
            if !result.status.success() { return Err("后台启动失败，请检查日志".into()); }
        }
        for _ in 0..120 {
            if let Ok(url) = Self::probe_url() { return Ok(url); }
            tokio::time::sleep(Duration::from_millis(250)).await;
        }
        Err("当前后台未就绪或版本未确认。请先停止旧后台后重新启动，不会自动中断已有任务".into())
    }

    /// Host-injected values the JS client needs (paths, test seams). Never credentials.
    pub fn host_env(name: String) -> Result<String, String> {
        match name.as_str() {
            "DSH_BOTS_HOME" | "DSH_E2E_FAULT" => std::env::var(&name).map_err(|_| "Unset".into()),
            _ => Err("Not a host-injected name".into()),
        }
    }

    /// Opens only an authenticated local API socket, with a bounded handshake.
    pub async fn connect(url: String, cookie: String) -> Result<Socket, String> {
        let parsed = url::Url::parse(&url).map_err(|_| "Invalid socket URL")?;
        if parsed.scheme() != "ws" || parsed.host_str() != Some("127.0.0.1")
            || !parsed.username().is_empty() || parsed.password().is_some()
            || parsed.fragment().is_some() || parsed.query().is_some()
            || parsed.path() != "/api/remote.mux" {
            return Err("Only the local API socket is supported".into());
        }
        let mut request = url.into_client_request().map_err(|_| "Invalid handshake")?;
        request.headers_mut().insert("cookie", HeaderValue::from_str(&cookie).map_err(|_| "Invalid cookie")?);
        let (socket, _) = tokio::time::timeout(Duration::from_secs(10), tokio_tungstenite::connect_async(request))
            .await.map_err(|_| "Socket handshake timed out")?
            .map_err(|_| "Socket handshake failed")?;
        let (mut writer, mut reader) = socket.split();
        let (send, mut outgoing) = mpsc::channel::<Option<String>>(16);
        let (received, incoming) = mpsc::channel(32);
        let task = background(async move {
            loop {
                tokio::select! {
                    command = outgoing.recv() => {
                        match command {
                            Some(Some(text)) => {
                                if writer.send(Message::Text(text.into())).await.is_err() { break; }
                            }
                            _ => { let _ = writer.close().await; break; }
                        }
                    }
                    message = reader.next() => {
                        match message {
                            Some(Ok(Message::Text(text))) => {
                                if received.try_send(Ok(text.to_string())).is_err() { break; }
                            }
                            Some(Ok(Message::Ping(bytes))) => {
                                if writer.send(Message::Pong(bytes)).await.is_err() { break; }
                            }
                            Some(Ok(Message::Close(_))) | None => break,
                            Some(Err(_)) => { let _ = received.try_send(Err("Socket read failed".into())); break; }
                            _ => {}
                        }
                    }
                }
            }
        });
        Ok(Socket { send, incoming: std::sync::Arc::new(Mutex::new(incoming)), task })
    }
}

/// The Bot registry on disk. The JS VM is denied `capabilities.fs` under the
/// test host, so the host process owns these files; every path stays in one root.
#[module]
pub struct Store;

fn store_root() -> Result<std::path::PathBuf, String> {
    if let Ok(value) = std::env::var("DSH_BOTS_HOME") {
        if !value.is_empty() { return Ok(std::path::PathBuf::from(value)); }
    }
    let home = std::env::var("HOME").map_err(|_| "No home directory".to_string())?;
    if home.is_empty() { return Err("No home directory".into()); }
    Ok(std::path::PathBuf::from(home).join(".dsh-bot").join("bots"))
}

fn store_path(name: &str) -> Result<std::path::PathBuf, String> {
    let stem = name.strip_suffix(".json").unwrap_or(name);
    let valid = !stem.is_empty()
        && stem.len() <= 128
        && stem.chars().all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-');
    if !valid { return Err("Registry entry name is not valid".into()); }
    Ok(store_root()?.join(format!("{stem}.json")))
}

#[module]
impl Store {
    /// Where the records live; a test host relocates it with `DSH_BOTS_HOME`.
    pub fn root() -> Result<String, String> {
        Ok(store_root()?.to_string_lossy().into_owned())
    }

    /// Validate an explicitly selected execution directory before a create RPC.
    pub fn is_directory(path: String) -> bool {
        std::path::Path::new(&path).is_absolute() && std::path::Path::new(&path).is_dir()
    }

    /// Every record name, sorted; a missing root is an empty registry.
    pub fn list() -> Result<Vec<String>, String> {
        let entries = match std::fs::read_dir(store_root()?) {
            Ok(entries) => entries,
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
            Err(error) => return Err(format!("Cannot list the registry: {error}")),
        };
        let mut names = Vec::new();
        for entry in entries {
            let entry = entry.map_err(|error| format!("Cannot list the registry: {error}"))?;
            let name = entry.file_name().to_string_lossy().into_owned();
            if name.ends_with(".json") { names.push(name); }
        }
        names.sort();
        Ok(names)
    }

    /// One record's text, or an empty string when no such record exists.
    pub fn read(name: String) -> Result<String, String> {
        match std::fs::read_to_string(store_path(&name)?) {
            Ok(text) => Ok(text),
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
            Err(error) => Err(format!("Cannot read the record: {error}")),
        }
    }

    /// Replaces one record atomically: a whole file appears, or the previous one stays.
    pub fn write(name: String, contents: String) -> Result<(), String> {
        let path = store_path(&name)?;
        std::fs::create_dir_all(store_root()?)
            .map_err(|error| format!("Cannot create the registry: {error}"))?;
        let temporary = path.with_extension("json.tmp");
        std::fs::write(&temporary, contents.as_bytes())
            .map_err(|error| format!("Cannot write the record: {error}"))?;
        std::fs::rename(&temporary, &path).map_err(|error| {
            let _ = std::fs::remove_file(&temporary);
            format!("Cannot replace the record: {error}")
        })
    }
}

#[class]
impl Socket {
    /// Queues text with a bounded backlog; no replay after failure.
    pub fn write(&self, text: String) -> Result<(), String> {
        if text.len() > 8 * 1024 * 1024 { return Err("Socket message too large".into()); }
        self.send.try_send(Some(text)).map_err(|_| "Socket closed or write queue full".into())
    }

    /// Reads the next text message. Only one consumer should read a socket.
    pub fn read(&self) -> Later<String> {
        let incoming = self.incoming.clone();
        Later::new(async move {
            incoming.lock().await.recv().await.unwrap_or_else(|| Err("Socket closed".into()))
        })
    }

    /// Requests orderly shutdown; disposal always aborts remaining I/O.
    pub fn close(&self) {
        if self.send.try_send(None).is_err() { self.task.abort(); }
    }
}
