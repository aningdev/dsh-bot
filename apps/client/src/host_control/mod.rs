//! Native lifecycle control adapter; Harness business traffic uses the official client.
mod service;
mod watch;

use nsh_core::prelude::*;
use std::path::PathBuf;
pub use watch::HostWatch;

/// Local process lifecycle only; carries no Harness business requests.
#[module]
pub struct HostControl;

fn socket_path() -> Result<PathBuf, String> {
    if let Ok(path) = std::env::var("DSH_HOST_SOCKET") {
        let path = PathBuf::from(path);
        if !path.is_absolute() {
            return Err("宿主 socket 必须是绝对路径".into());
        }
        return Ok(path);
    }
    let home = std::env::var("HOME").map_err(|_| "No home directory")?;
    Ok(PathBuf::from(home).join(".dsh-bot/host/control.sock"))
}

#[module]
impl HostControl {
    /// Whether the containing app bundles the SMAppService bridge.
    pub fn service_available() -> bool {
        service::library_path().is_some()
    }

    /// Query or explicitly change the containing app's OS service registration.
    pub async fn service(operation: String) -> Result<String, String> {
        service::manage(operation).await
    }

    /// Whether the private Unix endpoint currently accepts connections.
    pub async fn reachable() -> Result<bool, String> {
        let socket = socket_path()?;
        tokio::task::spawn_blocking(move || std::os::unix::net::UnixStream::connect(socket).is_ok())
            .await
            .map_err(|_| "宿主端点检查中断".to_string())
    }

    /// Subscribe to public state snapshots and changes without authentication data.
    pub async fn watch() -> Result<HostWatch, String> {
        watch::open().await
    }

    /// Transfer validated device-management requests to the same private Host socket.
    /// Product decisions remain in TypeScript; neither this adapter nor `call`
    /// retries an operation whose result is unknown.
    pub async fn device_request(operation: String, args: String) -> Result<String, String> {
        if !matches!(operation.as_str(), "listDevices" | "revokeDevice" | "startPairing" | "pairingStatus" | "decidePairing" | "cancelPairing") || args.len() > 4096 {
            return Err("无效的设备管理请求".into());
        }
        let mut fields: serde_json::Map<String, serde_json::Value> = serde_json::from_str(&args).map_err(|_| "无效的设备管理参数")?;
        if fields.contains_key("version") || fields.contains_key("id") || fields.contains_key("operation") {
            return Err("无效的设备管理参数".into());
        }
        fields.insert("version".into(), serde_json::json!(dsh_host::PROTOCOL));
        fields.insert("id".into(), serde_json::json!(dsh_host::generation()?));
        fields.insert("operation".into(), serde_json::json!(operation));
        let socket = socket_path()?;
        tokio::task::spawn_blocking(move || {
            dsh_host::call(&socket, &serde_json::Value::Object(fields))
                .and_then(|value| serde_json::to_string(&value).map_err(|e| e.to_string()))
        }).await.map_err(|_| "设备管理任务中断，结果未确认".to_string())?
    }

    /// Issue one validated lifecycle request. Unconfirmed requests are not retried.
    pub async fn request(operation: String, source: String) -> Result<String, String> {
        let socket = socket_path()?;
        let request = serde_json::json!({ "version": dsh_host::PROTOCOL, "id": dsh_host::generation()?, "operation":operation, "source": if source.is_empty() { None } else { Some(source) } });
        tokio::task::spawn_blocking(move || {
            dsh_host::call(&socket, &request)
                .and_then(|value| serde_json::to_string(&value).map_err(|e| e.to_string()))
        })
        .await
        .map_err(|_| "宿主控制任务中断".to_string())?
    }
}
