use dsh_host::bridge::{
    device_store::DeviceStore,
    pairing::{ApprovalError, Invitation, initiate},
    secure_channel::generate_keypair,
};
use std::{
    fs, io,
    os::unix::fs::{PermissionsExt, symlink},
    thread,
    time::Duration,
};

#[test]
fn grants_are_persistent_and_revocation_tombstones_the_key() {
    let root = tempfile::tempdir().unwrap();
    let path = root.path().join("devices");
    let store = DeviceStore::new(&path);
    let key = [1; 32];
    store.authorize(key).unwrap();
    assert!(store.is_authorized(key).unwrap());
    assert_eq!(
        fs::metadata(path.join("devices.json"))
            .unwrap()
            .permissions()
            .mode()
            & 0o777,
        0o600
    );
    assert_eq!(DeviceStore::new(&path).list().unwrap()[0].key, key);
    store.revoke(key).unwrap();
    assert!(!store.is_authorized(key).unwrap());
    assert!(DeviceStore::new(&path).list().unwrap()[0].revoked);
    assert_eq!(
        store.authorize(key).unwrap_err().kind(),
        io::ErrorKind::AlreadyExists
    );
    assert_eq!(
        store.revoke([2; 32]).unwrap_err().kind(),
        io::ErrorKind::NotFound
    );
}

#[test]
fn pairing_cannot_confirm_when_store_rejects_revoked_device() {
    let root = tempfile::tempdir().unwrap();
    let store = DeviceStore::new(root.path().join("devices"));
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    store.authorize(device_public).unwrap();
    store.revoke(device_public).unwrap();
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let pending = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30))
        .unwrap()
        .receive(&device.write().unwrap())
        .unwrap();
    assert!(matches!(
        pending.approve(|key| store.authorize(key).map_err(|_| "store error")),
        Err(ApprovalError::PersistenceUncertain)
    ));
}

#[test]
fn concurrent_mutations_do_not_lose_grants() {
    let root = tempfile::tempdir().unwrap();
    let path = root.path().join("devices");
    let threads: Vec<_> = (0..20)
        .map(|i| {
            let path = path.clone();
            thread::spawn(move || DeviceStore::new(path).authorize([i; 32]).unwrap())
        })
        .collect();
    for thread in threads {
        thread.join().unwrap();
    }
    assert_eq!(DeviceStore::new(path).list().unwrap().len(), 20);
}

#[test]
fn malformed_insecure_or_symlinked_store_fails_closed() {
    let root = tempfile::tempdir().unwrap();
    let path = root.path().join("devices");
    let store = DeviceStore::new(&path);
    store.authorize([1; 32]).unwrap();
    fs::write(path.join("devices.json"), b"bad").unwrap();
    assert_eq!(store.list().unwrap_err().kind(), io::ErrorKind::InvalidData);
    fs::remove_file(path.join("devices.json")).unwrap();
    symlink(root.path().join("target"), path.join("devices.json")).unwrap();
    assert!(store.list().is_err());
    fs::set_permissions(&path, fs::Permissions::from_mode(0o755)).unwrap();
    assert_eq!(
        store.list().unwrap_err().kind(),
        io::ErrorKind::PermissionDenied
    );
}
