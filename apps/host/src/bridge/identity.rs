//! Stable Host identity for paired devices. Stored only in the private Host directory.
use std::{
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    os::unix::fs::{MetadataExt, OpenOptionsExt, PermissionsExt},
    path::Path,
};
use x25519_dalek::{PublicKey, StaticSecret};

pub struct HostIdentity {
    private: [u8; 32],
    pub public: [u8; 32],
}

impl HostIdentity {
    /// The parent directory is Host-owned, private and protected by its process lock.
    /// An absent identity with existing grants is an error, never a key rotation.
    pub fn load(directory: &Path, has_grants: bool) -> io::Result<Self> {
        let path = directory.join("bridge-identity");
        let mut file = match OpenOptions::new().read(true)
            .custom_flags(libc::O_NOFOLLOW | libc::O_NONBLOCK).open(&path) {
            Ok(file) => file,
            Err(error) if error.kind() == io::ErrorKind::NotFound && !has_grants => {
                let mut private = [0; 32];
                getrandom::fill(&mut private).map_err(io::Error::other)?;
                let mut tmp = tempfile::NamedTempFile::new_in(directory)?;
                tmp.as_file().set_permissions(fs::Permissions::from_mode(0o600))?;
                tmp.write_all(&private)?;
                tmp.as_file().sync_all()?;
                tmp.persist_noclobber(&path).map_err(|error| error.error)?;
                File::open(directory)?.sync_all()?;
                return Ok(Self::from_private(private));
            }
            Err(error) => return Err(error),
        };
        let metadata = file.metadata()?;
        if !metadata.is_file() || metadata.uid() != unsafe { libc::geteuid() }
            || metadata.mode() & 0o077 != 0 || metadata.len() != 32 {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "invalid host identity"));
        }
        let mut private = [0; 32];
        file.read_exact(&mut private)?;
        Ok(Self::from_private(private))
    }

    fn from_private(private: [u8; 32]) -> Self {
        let public = PublicKey::from(&StaticSecret::from(private)).to_bytes();
        Self { private, public }
    }

    pub(super) fn private(&self) -> &[u8; 32] { &self.private }
}
