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
    pub device_key: Option<[u8; 32]>,
    pub cursor: Option<usize>,
    pub relay: Option<String>,
    pub attempt_id: Option<String>,
    pub approve: Option<bool>,
}
impl Request {
    pub fn validate(&self) -> Result<()> {
        if self.version != PROTOCOL {
            return Err("Unsupported host protocol".into());
        }
        if self.id.is_empty() || self.id.len() > 128 {
            return Err("Invalid request ID".into());
        }
        let pairing_args_empty = self.relay.is_none() && self.attempt_id.is_none() && self.approve.is_none();
        match (
            self.operation.as_str(),
            self.source.as_deref(),
            self.device_key,
            self.cursor,
        ) {
            ("ensureDsh", Some("attach" | "userStart"), None, None) if pairing_args_empty => Ok(()),
            ("status" | "watchStatus" | "connectionInfo" | "stopDsh" | "restartDsh", None, None, None) if pairing_args_empty => Ok(()),
            ("listDevices", None, None, Some(cursor)) if pairing_args_empty && cursor <= 256 => Ok(()),
            ("revokeDevice", None, Some(_), None) if pairing_args_empty => Ok(()),
            ("startPairing", None, None, None) if self.relay.as_ref().is_some_and(|v| v.len() <= 2048) && self.attempt_id.is_none() && self.approve.is_none() => Ok(()),
            ("pairingStatus", None, None, None) if pairing_args_empty => Ok(()),
            ("decidePairing", None, Some(_), None) if self.relay.is_none() && self.approve.is_some() && self.attempt_id.as_deref().is_some_and(valid_id) => Ok(()),
            ("cancelPairing", None, None, None) if self.relay.is_none() && self.approve.is_none() && self.attempt_id.as_deref().is_some_and(valid_id) => Ok(()),
            _ => Err("Invalid host operation or arguments".into()),
        }
    }
}

fn valid_id(value: &str) -> bool {
    use base64::Engine;
    value.len() == 43 && base64::engine::general_purpose::URL_SAFE_NO_PAD.decode(value).is_ok_and(|bytes| bytes.len() == 32)
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DevicePage {
    pub devices: Vec<crate::bridge::device_store::Device>,
    pub next_cursor: Option<usize>,
}

fn decode_device_response(text: &str, request: &Request) -> Result<serde_json::Value> {
    #[derive(Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Response {
        version: u32,
        id: String,
        ok: bool,
        value: Option<serde_json::Value>,
        error: Option<String>,
    }
    let response: Response = serde_json::from_str(text).map_err(|_| "Invalid host response")?;
    if response.version != PROTOCOL || response.id != request.id {
        return Err("Invalid host response".into());
    }
    if !response.ok {
        return Err(response
            .error
            .unwrap_or_else(|| "Host operation failed".into()));
    }
    let value = response.value.ok_or("Host response value missing")?;
    if request.operation == "revokeDevice" {
        if value.as_object().is_none_or(|object| !object.is_empty()) {
            return Err("Invalid device response".into());
        }
    } else if request.operation == "listDevices" {
        let page: DevicePage =
            serde_json::from_value(value.clone()).map_err(|_| "Invalid device response")?;
        let cursor = request.cursor.ok_or("Invalid device cursor")?;
        let mut keys = std::collections::HashSet::new();
        if page.devices.len() > 64
            || cursor + page.devices.len() > 256
            || page.devices.iter().any(|device| !keys.insert(device.key))
            || page
                .next_cursor
                .is_some_and(|next| page.devices.len() != 64 || next != cursor + 64 || next > 256)
        {
            return Err("Invalid device response".into());
        }
    } else {
        use crate::bridge::pairing_manager::{PairingOffer, PairingStatus};
        use sha2::{Digest, Sha256};
        let check_status = |status: PairingStatus| -> Result<()> {
            if !valid_id(&status.attempt_id) || request.attempt_id.as_ref().is_some_and(|id| id != &status.attempt_id)
                || !matches!(status.phase.as_str(), "waiting" | "approval" | "saving" | "rejecting" | "cancelling" | "paired" | "rejected" | "expired" | "cancelled" | "uncertain" | "incomplete" | "failed")
                || status.fingerprint != status.candidate.map(|key| format!("{:x}", Sha256::digest(key)))
                || (matches!(status.phase.as_str(), "approval" | "saving" | "rejecting" | "paired" | "uncertain" | "incomplete") && status.candidate.is_none()) {
                return Err("Invalid pairing response".into());
            }
            Ok(())
        };
        match request.operation.as_str() {
            "startPairing" => {
                let offer: PairingOffer = serde_json::from_value(value.clone()).map_err(|_| "Invalid pairing response")?;
                if offer.version != 1 || !valid_id(&offer.attempt_id) || !valid_id(&offer.room) || !valid_id(&offer.host_key) || !valid_id(&offer.nonce) || offer.expires_at == 0 || Some(&offer.relay) != request.relay.as_ref()
                    || crate::bridge::relay::relay_url(&offer.relay, &offer.room, &crate::bridge::relay::Side::Host).is_err() { return Err("Invalid pairing response".into()); }
            }
            "pairingStatus" => {
                #[derive(Deserialize)]
                #[serde(deny_unknown_fields)]
                struct Current { current: Option<PairingStatus> }
                let current: Current = serde_json::from_value(value.clone()).map_err(|_| "Invalid pairing response")?;
                if let Some(status) = current.current { check_status(status)?; }
            }
            "decidePairing" | "cancelPairing" => check_status(serde_json::from_value(value.clone()).map_err(|_| "Invalid pairing response")?)?,
            _ => return Err("Invalid host operation".into()),
        }
    }
    Ok(value)
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
    if matches!(validated.operation.as_str(), "listDevices" | "revokeDevice" | "startPairing" | "pairingStatus" | "decidePairing" | "cancelPairing") {
        return decode_device_response(&text, &validated);
    }
    let status = decode_response(
        &text,
        &validated.id,
        validated.operation == "connectionInfo",
    )?;
    serde_json::to_value(status).map_err(|e| e.to_string())
}
