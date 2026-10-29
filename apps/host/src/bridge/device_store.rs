//! Durable device grants. The Host owns this store; the Relay never does.
//! Revoked keys remain tombstoned and cannot be paired again.
use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    os::unix::fs::{DirBuilderExt, MetadataExt, OpenOptionsExt, PermissionsExt},
    path::{Path, PathBuf},
};

const MAX_BYTES: u64 = 256 * 1024;
const MAX_DEVICES: usize = 256;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Device {
    pub key: [u8; 32],
    pub revoked: bool,
}
#[derive(Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct Records {
    version: u32,
    devices: Vec<Device>,
}

pub struct DeviceStore {
    directory: PathBuf,
}
struct Lock(File);
impl Drop for Lock {
    fn drop(&mut self) {
        unsafe {
            libc::flock(std::os::fd::AsRawFd::as_raw_fd(&self.0), libc::LOCK_UN);
        }
    }
}

impl DeviceStore {
    /// The directory and all its ancestors must be trusted and not writable by
    /// untrusted processes. Checks on the final directory and files do not
    /// protect against replacement of an ancestor during a store operation.
    /// It must not be shared with unrelated applications.
    pub fn new(directory: impl AsRef<Path>) -> Self {
        Self {
            directory: directory.as_ref().to_owned(),
        }
    }

    fn lock(&self) -> io::Result<Lock> {
        match fs::DirBuilder::new().mode(0o700).create(&self.directory) {
            Ok(()) => {}
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {}
            Err(error) => return Err(error),
        }
        // Also sync on retry if an earlier creation succeeded but its parent
        // sync failed; visibility alone is not proof of durability.
        let parent = self
            .directory
            .parent()
            .filter(|path| !path.as_os_str().is_empty())
            .unwrap_or_else(|| Path::new("."));
        File::open(parent)?.sync_all()?;
        let metadata = fs::symlink_metadata(&self.directory)?;
        if !metadata.is_dir()
            || metadata.uid() != unsafe { libc::geteuid() }
            || metadata.mode() & 0o077 != 0
        {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "device directory is not private",
            ));
        }
        let file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .mode(0o600)
            .custom_flags(libc::O_NOFOLLOW | libc::O_NONBLOCK)
            .open(self.directory.join("devices.lock"))?;
        let metadata = file.metadata()?;
        if !metadata.is_file()
            || metadata.uid() != unsafe { libc::geteuid() }
            || metadata.mode() & 0o077 != 0
        {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "invalid device lock",
            ));
        }
        if unsafe { libc::flock(std::os::fd::AsRawFd::as_raw_fd(&file), libc::LOCK_EX) } != 0 {
            return Err(io::Error::last_os_error());
        }
        Ok(Lock(file))
    }

    fn read(&self) -> io::Result<Records> {
        let file = match OpenOptions::new()
            .read(true)
            .custom_flags(libc::O_NOFOLLOW | libc::O_NONBLOCK)
            .open(self.directory.join("devices.json"))
        {
            Ok(file) => file,
            Err(e) if e.kind() == io::ErrorKind::NotFound => {
                return Ok(Records {
                    version: 1,
                    devices: Vec::new(),
                });
            }
            Err(e) => return Err(e),
        };
        let metadata = file.metadata()?;
        if !metadata.is_file()
            || metadata.uid() != unsafe { libc::geteuid() }
            || metadata.mode() & 0o077 != 0
        {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "invalid device store",
            ));
        }
        let mut bytes = Vec::new();
        file.take(MAX_BYTES + 1).read_to_end(&mut bytes)?;
        if bytes.len() as u64 > MAX_BYTES {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "device store too large",
            ));
        }
        let records: Records = serde_json::from_slice(&bytes)
            .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "invalid device store"))?;
        let mut keys = std::collections::HashSet::new();
        if records.version != 1
            || records.devices.len() > MAX_DEVICES
            || records.devices.iter().any(|entry| !keys.insert(entry.key))
        {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "invalid device store",
            ));
        }
        Ok(records)
    }

    fn save(&self, records: &Records) -> io::Result<()> {
        let mut file = tempfile::NamedTempFile::new_in(&self.directory)?;
        file.as_file()
            .set_permissions(fs::Permissions::from_mode(0o600))?;
        serde_json::to_writer(&mut file, records).map_err(io::Error::other)?;
        file.flush()?;
        file.as_file().sync_all()?;
        file.persist(self.directory.join("devices.json"))
            .map_err(|e| e.error)?;
        File::open(&self.directory)?.sync_all()?;
        Ok(())
    }

    pub fn list(&self) -> io::Result<Vec<Device>> {
        let _lock = self.lock()?;
        Ok(self.read()?.devices)
    }

    /// Re-read under the store lock; a previously returned grant is not proof
    /// that a device remains authorized.
    pub fn is_authorized(&self, key: [u8; 32]) -> io::Result<bool> {
        let _lock = self.lock()?;
        Ok(self
            .read()?
            .devices
            .iter()
            .any(|device| device.key == key && !device.revoked))
    }

    pub fn authorize(&self, key: [u8; 32]) -> io::Result<()> {
        let _lock = self.lock()?;
        let mut records = self.read()?;
        if records.devices.iter().any(|entry| entry.key == key) {
            return Err(io::Error::new(
                io::ErrorKind::AlreadyExists,
                "device key already registered or revoked",
            ));
        }
        if records.devices.len() >= MAX_DEVICES {
            return Err(io::Error::other("device limit reached"));
        }
        records.devices.push(Device {
            key,
            revoked: false,
        });
        self.save(&records)
    }

    pub fn revoke(&self, key: [u8; 32]) -> io::Result<()> {
        let _lock = self.lock()?;
        let mut records = self.read()?;
        let device = records
            .devices
            .iter_mut()
            .find(|device| device.key == key)
            .ok_or_else(|| io::Error::new(io::ErrorKind::NotFound, "unknown device"))?;
        device.revoked = true;
        // Retry the complete durable replacement even when the tombstone is
        // already visible: the previous directory sync may have failed.
        self.save(&records)?;
        Ok(())
    }
}
