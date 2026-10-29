use dsh_host::bridge::device_access::DeviceAccess;
use std::{
    sync::{Arc, Barrier},
    thread,
};

#[test]
fn revoke_closes_registered_connections_and_prevents_new_ones() {
    let root = tempfile::tempdir().unwrap();
    let access = DeviceAccess::new(root.path().join("devices"));
    let key = [4; 32];
    access.authorize(key).unwrap();
    let first = access.register(key).unwrap();
    let second = access.register(key).unwrap();
    access.revoke(key).unwrap();
    assert!(*first.borrow());
    assert!(*second.borrow());
    assert!(access.register(key).is_err());
}

#[test]
fn registration_racing_revoke_is_denied_or_notified() {
    for _ in 0..20 {
        let root = tempfile::tempdir().unwrap();
        let access = Arc::new(DeviceAccess::new(root.path().join("devices")));
        let key = [3; 32];
        access.authorize(key).unwrap();
        let barrier = Arc::new(Barrier::new(2));
        let worker = {
            let access = access.clone();
            let barrier = barrier.clone();
            thread::spawn(move || {
                barrier.wait();
                access.register(key)
            })
        };
        barrier.wait();
        access.revoke(key).unwrap();
        if let Ok(receiver) = worker.join().unwrap() {
            assert!(*receiver.borrow());
        }
        assert!(access.register(key).is_err());
    }
}
