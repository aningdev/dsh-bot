//! Read-only, field-limited projection of the desktop-owned Bot registry.
//!
//! Each record is atomically replaced by the desktop. A scan is not a
//! transaction across records; its revision identifies the projection read,
//! not a globally consistent point in time.
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::HashSet,
    fs::{self, File, OpenOptions},
    io::{self, Read},
    os::unix::fs::OpenOptionsExt,
    path::Path,
};

const MAX_RECORD_BYTES: u64 = 1024 * 1024;
const MAX_RECORDS: usize = 10_000;

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct BotSnapshot {
    pub id: String,
    pub name: String,
    pub archived: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub version: u32,
    pub revision: String,
    pub bots: Vec<BotSnapshot>,
    /// Count only: invalid file names and content are not sent to devices.
    pub damaged: usize,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Record {
    id: String,
    name: String,
    #[serde(rename = "preset")]
    _preset: String,
    #[serde(rename = "workspace")]
    _workspace: String,
    #[serde(rename = "model")]
    _model: Model,
    #[serde(default)]
    archived: Option<bool>,
    session_id: Option<serde_json::Value>,
}

#[derive(Deserialize)]
struct Model {
    #[serde(rename = "provider")]
    _provider: String,
    #[serde(rename = "model")]
    _model: String,
}

fn identifier(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 128
        && value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')
}

fn project(bytes: &[u8], stem: &str) -> Option<BotSnapshot> {
    let record: Record = serde_json::from_slice(bytes).ok()?;
    if record.id != stem || !identifier(&record.id) || record.name.len() > 4096 {
        return None;
    }
    // Desktop accepts any string here; expose only safe identifiers for future
    // authorization without hiding an otherwise displayable Bot.
    let session_id = record.session_id.and_then(|value| {
        value
            .as_str()
            .filter(|id| identifier(id))
            .map(str::to_owned)
    });
    Some(BotSnapshot {
        id: record.id,
        name: record.name,
        archived: record.archived.unwrap_or(false),
        session_id,
    })
}

fn read_record(path: &Path) -> io::Result<Vec<u8>> {
    // Never follow a registry entry into another file. Limit size even if it
    // grows between open and read, and distinguish I/O failure from corruption.
    let file: File = OpenOptions::new()
        .read(true)
        .custom_flags(libc::O_NOFOLLOW | libc::O_NONBLOCK)
        .open(path)?;
    if !file.metadata()?.is_file() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "Bot record is not a regular file",
        ));
    }
    let mut bytes = Vec::new();
    file.take(MAX_RECORD_BYTES + 1).read_to_end(&mut bytes)?;
    Ok(bytes)
}

/// Scan a desktop registry directory without modifying it. Missing directory
/// means no Bots; all other filesystem failures are returned to the caller.
/// Invalid records are counted and omitted, never treated as authorized.
pub fn read_snapshot(root: &Path) -> io::Result<Snapshot> {
    let directory = match fs::read_dir(root) {
        Ok(directory) => directory,
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            return make_snapshot(Vec::new(), 0);
        }
        Err(error) => return Err(error),
    };
    let mut files = Vec::new();
    for entry in directory {
        let entry = entry?;
        let name = entry.file_name();
        if name.to_string_lossy().ends_with(".json") {
            files.push((name, entry.path()));
            if files.len() > MAX_RECORDS {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Too many Bot records",
                ));
            }
        }
    }
    files.sort_by(|a, b| a.0.cmp(&b.0));
    let mut bots = Vec::new();
    let mut damaged = 0;
    let mut sessions = HashSet::new();
    for (name, path) in files {
        let Some(stem) = name
            .to_str()
            .and_then(|s| s.strip_suffix(".json"))
            .filter(|s| identifier(s))
        else {
            damaged += 1;
            continue;
        };
        let bytes = read_record(&path)?;
        let Some(bot) = (bytes.len() as u64 <= MAX_RECORD_BYTES)
            .then(|| project(&bytes, stem))
            .flatten()
        else {
            damaged += 1;
            continue;
        };
        if let Some(session) = &bot.session_id {
            if !sessions.insert(session.clone()) {
                // Ambiguous ownership must never become an authorization map.
                return Err(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Duplicate Bot session pointer",
                ));
            }
        }
        bots.push(bot);
    }
    make_snapshot(bots, damaged)
}

fn make_snapshot(bots: Vec<BotSnapshot>, damaged: usize) -> io::Result<Snapshot> {
    let bytes = serde_json::to_vec(&(1u32, &bots, damaged)).map_err(io::Error::other)?;
    let revision = format!("{:x}", Sha256::digest(bytes));
    Ok(Snapshot {
        version: 1,
        revision,
        bots,
        damaged,
    })
}
