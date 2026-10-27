//! Shared local control protocol and receiver validation for clients and server.
use crate::Result;
use serde::{Deserialize, Serialize};
use std::{
    io::{BufRead, BufReader, Read, Write},
    os::unix::net::UnixStream,
    path::Path,
    time::Duration,
};

pub const MAX_FRAME: usize = 16 * 1024;
pub const PROTOCOL: u32 = 1;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Status {
    pub phase: String,
    pub generation: Option<String>,
    pub pid: Option<u32>,
    pub version: String,
    pub reason: Option<String>,
    pub blocked: bool,
    // This field is returned only by connectionInfo, never by status/watchStatus.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
}
impl Status {
    pub fn new(version: String) -> Self {
        Self {
            phase: "stopped".into(),
            generation: None,
            pid: None,
            version,
            reason: Some("请明确启动后台".into()),
            blocked: true,
            url: None,
        }
    }
    pub fn public(&self) -> Self {
        let mut value = self.clone();
        value.url = None;
        value
    }
    fn validate(&self, connection_info: bool) -> Result<()> {
        if !matches!(
            self.phase.as_str(),
            "stopped" | "preparing" | "starting" | "ready" | "stopping" | "failed" | "recovering"
        ) || self.version.is_empty()
            || self.generation.as_ref().is_some_and(|id| id.is_empty())
            || (self.phase == "ready"
                && (self.generation.is_none()
                    || self.pid.is_none_or(|pid| pid == 0)
                    || self.blocked))
        {
            return Err("Invalid host status".into());
        }
        if !connection_info {
            if self.url.is_some() {
                return Err("Public host status contains authentication data".into());
            }
            return Ok(());
        }
        if self.phase != "ready" {
            return Err("Host connection is not ready".into());
        }
        let url = self.url.as_ref().ok_or("Host connection URL missing")?;
        let url = url::Url::parse(url).map_err(|_| "Invalid host connection URL")?;
        if url.scheme() != "http"
            || url.host_str() != Some("127.0.0.1")
            || url.port().is_none()
            || !url.username().is_empty()
            || url.password().is_some()
            || url.fragment().is_some()
            || !url
                .query_pairs()
                .any(|(key, value)| key == "token" && !value.is_empty())
        {
            return Err("Invalid host connection URL".into());
        }
        Ok(())
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Request {
    pub version: u32,
    pub id: String,
    pub operation: String,
    pub source: Option<String>,
}
impl Request {
    pub fn validate(&self) -> Result<()> {
        if self.version != PROTOCOL {
            return Err("Unsupported host protocol".into());
        }
        if self.id.is_empty() || self.id.len() > 128 {
            return Err("Invalid request ID".into());
        }
        match (self.operation.as_str(), self.source.as_deref()) {
            ("ensureDsh", Some("attach" | "userStart")) => Ok(()),
            ("status" | "watchStatus" | "connectionInfo" | "stopDsh" | "restartDsh", None) => {
                Ok(())
            }
            _ => Err("Invalid lifecycle operation or source".into()),
        }
    }
}

pub fn read_frame(reader: &mut impl BufRead) -> Result<String> {
    let mut bytes = Vec::new();
    reader
        .take((MAX_FRAME + 1) as u64)
        .read_until(b'\n', &mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() > MAX_FRAME || !bytes.ends_with(b"\n") {
        return Err("Host frame missing or too large".into());
    }
    String::from_utf8(bytes).map_err(|_| "Invalid UTF-8 frame".into())
}
/** Shared receiver validation for one-shot replies and status subscriptions. */
pub fn decode_response(text: &str, id: &str, connection_info: bool) -> Result<Status> {
    #[derive(Deserialize)]
    struct Response {
        version: u32,
        id: String,
        ok: bool,
        value: Option<Status>,
        error: Option<String>,
    }
    let response: Response =
        serde_json::from_str(text).map_err(|_| "Invalid host response".to_string())?;
    if response.version != PROTOCOL || response.id != id {
        return Err("Invalid host response".into());
    }
    if !response.ok {
        return Err(response
            .error
            .unwrap_or_else(|| "Host operation failed".into()));
    }
    let status = response.value.ok_or("Host response value missing")?;
    status.validate(connection_info)?;
    Ok(status)
}
pub fn call(socket: &Path, request: &serde_json::Value) -> Result<serde_json::Value> {
    let validated: Request =
        serde_json::from_value(request.clone()).map_err(|_| "Invalid request fields")?;
    validated.validate()?;
    let mut stream = UnixStream::connect(socket).map_err(|_| "后台宿主尚未运行".to_string())?;
    stream
        .set_read_timeout(Some(Duration::from_secs(30)))
        .map_err(|e| e.to_string())?;
    stream
        .set_write_timeout(Some(Duration::from_secs(3)))
        .map_err(|e| e.to_string())?;
    writeln!(stream, "{request}").map_err(|e| e.to_string())?;
    let text = read_frame(&mut BufReader::new(stream))?;
    let status = decode_response(
        &text,
        &validated.id,
        validated.operation == "connectionInfo",
    )?;
    serde_json::to_value(status).map_err(|e| e.to_string())
}
