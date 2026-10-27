//! HostControl carries lifecycle requests only. Harness business traffic stays
//! on the existing authenticated official client connection.
use nsh_core::prelude::*;
use std::{io::{BufReader, Write}, net::Shutdown, os::unix::net::UnixStream, path::PathBuf, sync::Arc, time::Duration};
use tokio::sync::{mpsc, Mutex};

/// Local process lifecycle only; carries no Harness business requests.
#[module]
pub struct HostControl;

fn socket_path() -> Result<PathBuf, String> {
    if let Ok(path) = std::env::var("DSH_HOST_SOCKET") {
        let path = PathBuf::from(path);
        if !path.is_absolute() { return Err("宿主 socket 必须是绝对路径".into()); }
        return Ok(path);
    }
    let home = std::env::var("HOME").map_err(|_| "No home directory")?;
    Ok(PathBuf::from(home).join(".dsh-bot/host/control.sock"))
}

fn service_library() -> Option<PathBuf> {
    let executable = std::env::current_exe().ok()?;
    let path = executable.parent()?.parent()?.join("Frameworks/libdshservice.dylib");
    if path.is_file() { Some(path) } else { None }
}
fn legacy_service_installed() -> bool {
    let label = format!("gui/{}/dev.dshbot.backend", unsafe { libc::geteuid() });
    let loaded = std::process::Command::new("/bin/launchctl").args(["print", &label])
        .stdin(std::process::Stdio::null()).stdout(std::process::Stdio::null()).stderr(std::process::Stdio::null()).status().is_ok_and(|status| status.success());
    let installed = std::env::var_os("HOME").is_some_and(|home| PathBuf::from(home).join("Library/LaunchAgents/dev.dshbot.backend.plist").exists());
    loaded || installed
}

fn manage_service(operation: &str) -> Result<serde_json::Value, String> {
    if !["status", "register", "unregister", "activate"].contains(&operation) { return Err("不支持的服务操作".into()); }
    // Keep Swift's image loaded for the process lifetime. The C entry point
    // executes in the real NSH app, preserving Bundle.main and code identity.
    static LIBRARY: std::sync::OnceLock<Result<libloading::Library, String>> = std::sync::OnceLock::new();
    let library = LIBRARY.get_or_init(|| {
        let path = service_library().ok_or("当前构建没有系统服务组件")?;
        unsafe { libloading::Library::new(path) }.map_err(|_| "系统服务组件加载失败".into())
    }).as_ref().map_err(Clone::clone)?;
    type Manage = unsafe extern "C" fn(*const libc::c_char) -> *mut libc::c_char;
    let function: libloading::Symbol<'_, Manage> = unsafe { library.get(b"dsh_manage_service\0") }.map_err(|_| "系统服务组件版本不兼容")?;
    let input = std::ffi::CString::new(operation).map_err(|_| "无效服务操作")?;
    let output = unsafe { function(input.as_ptr()) };
    if output.is_null() { return Err("系统服务状态读取失败".into()); }
    let bytes = unsafe { std::ffi::CStr::from_ptr(output) }.to_bytes().to_vec();
    unsafe { libc::free(output.cast()) };
    if bytes.len() > 16 * 1024 { return Err("系统服务响应过大".into()); }
    serde_json::from_slice(&bytes).map_err(|_| "无效系统服务响应".into())
}

#[module]
impl HostControl {
    /// Packaged service components or an explicit development socket opt in.
    /// The legacy discovery path remains available in the accepted app build.
    pub fn enabled() -> bool { std::env::var_os("DSH_HOST_SOCKET").is_some() || service_library().is_some() }

    /// Query or explicitly change the containing app's OS service registration.
    pub async fn service(operation: String) -> Result<String, String> {
        tokio::task::spawn_blocking(move || {
            if operation == "unregister" {
                let socket = socket_path()?;
                if UnixStream::connect(&socket).is_ok() {
                    dsh_host::call(&socket, &serde_json::json!({"version":dsh_host::PROTOCOL,"id":dsh_host::generation()?,"operation":"stopDsh"}))?;
                }
            }
            manage_service(&operation).and_then(|value| serde_json::to_string(&value).map_err(|e| e.to_string()))
        })
            .await.map_err(|_| "系统服务任务中断".to_string())?
    }

    /// Prepare the private control endpoint; only explicit startup may register.
    pub async fn prepare(explicit: bool) -> Result<(), String> {
        if std::env::var_os("DSH_HOST_SOCKET").is_some() { return Ok(()); }
        let socket = socket_path()?;
        tokio::task::spawn_blocking(move || {
            if legacy_service_installed() { return Err("旧后台服务仍已登记。请先通过旧后台管理入口停止并卸载旧 LaunchAgent，再启动新宿主；不会自动中断工作".into()); }
            let mut state = manage_service("status")?;
            if explicit && state["status"] == "notRegistered" { state = manage_service("register")?; }
            match state["status"].as_str() {
                Some("enabled") => {},
                Some("notRegistered") => return Err("请明确启动后台；首次启动将登记 DSH Bot 后台项目".into()),
                Some("requiresApproval") => return Err("请在系统设置 → 通用 → 登录项与扩展中允许 DSH Bot 后台项目，再重试".into()),
                Some("unsupported") => return Err("应用关联后台项目需要 macOS 13 或更高版本".into()),
                _ => return Err(state["error"].as_str().unwrap_or("系统后台项目不可用，请重新安装或登记").into()),
            }
            if UnixStream::connect(&socket).is_err() {
                // Restoring system approval alone must never resurrect dsh.
                if !explicit { return Err("后台宿主当前未运行；请明确启动后台".into()); }
                manage_service("activate")?;
            }
            let deadline = std::time::Instant::now() + Duration::from_secs(15);
            while UnixStream::connect(&socket).is_err() {
                if std::time::Instant::now() >= deadline { return Err("后台宿主未启动；请确认官方 dsh 已安装，并检查后台日志".into()); }
                std::thread::sleep(Duration::from_millis(50));
            }
            Ok(())
        }).await.map_err(|_| "系统服务准备任务中断".to_string())?
    }

    /// Subscribe to public state snapshots and changes without authentication data.
    pub async fn watch() -> Result<HostWatch, String> {
        let socket = socket_path()?;
        tokio::task::spawn_blocking(move || {
            let mut stream = UnixStream::connect(socket).map_err(|_| "后台宿主尚未运行".to_string())?;
            stream.set_write_timeout(Some(Duration::from_secs(3))).map_err(|e| e.to_string())?;
            let id = dsh_host::generation()?;
            writeln!(stream, "{}", serde_json::json!({"version":dsh_host::PROTOCOL,"id":id,"operation":"watchStatus"})).map_err(|e| e.to_string())?;
            let cancel = stream.try_clone().map_err(|e| e.to_string())?;
            let (sender, receiver) = mpsc::channel(16);
            std::thread::spawn(move || {
                let mut reader = BufReader::new(stream);
                loop {
                    let result = dsh_host::read_frame(&mut reader).and_then(|line| {
                        let status = dsh_host::decode_response(&line, &id, false)?;
                        serde_json::to_string(&status).map_err(|e| e.to_string())
                    });
                    let failed = result.is_err();
                    if sender.try_send(result).is_err() || failed { break; }
                }
            });
            Ok(HostWatch { cancel, incoming: Arc::new(Mutex::new(receiver)) })
        }).await.map_err(|_| "宿主订阅任务中断".to_string())?
    }

    /// Issue one validated lifecycle request. Unconfirmed requests are not retried.
    pub async fn request(operation: String, source: String) -> Result<String, String> {
        let socket = socket_path()?;
        let request = serde_json::json!({ "version": dsh_host::PROTOCOL, "id": dsh_host::generation()?, "operation":operation, "source": if source.is_empty() { None } else { Some(source) } });
        tokio::task::spawn_blocking(move || dsh_host::call(&socket, &request).and_then(|value| serde_json::to_string(&value).map_err(|e| e.to_string())))
            .await.map_err(|_| "宿主控制任务中断".to_string())?
    }
}

/// A bounded, disposable host state subscription.
#[class]
pub struct HostWatch {
    cancel: UnixStream,
    incoming: Arc<Mutex<mpsc::Receiver<Result<String, String>>>>,
}
impl Drop for HostWatch { fn drop(&mut self) { let _ = self.cancel.shutdown(Shutdown::Both); } }
#[class]
impl HostWatch {
    /// Receive the next public snapshot; rejects on overflow or disconnect.
    pub fn read(&self) -> Later<String> {
        let incoming = self.incoming.clone();
        Later::new(async move { incoming.lock().await.recv().await.unwrap_or_else(|| Err("宿主状态订阅已断开".into())) })
    }
    /// Release the socket; repeated calls are harmless.
    pub fn close(&self) { let _ = self.cancel.shutdown(Shutdown::Both); }
}
