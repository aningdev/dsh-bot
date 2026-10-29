use dsh_host::bridge::{
    pairing::{ApprovalError, CONFIRMATION, Invitation, initiate},
    secure_channel::generate_keypair,
};
use std::{
    sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
    },
    time::Duration,
};

#[test]
fn approval_persists_the_correct_device_before_reply_and_channel() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, device_public) = generate_keypair().unwrap();
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let invitation = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30)).unwrap();
    let pending = invitation.receive(&device.write().unwrap()).unwrap();
    assert_eq!(pending.device_key(), device_public);
    let stored = Arc::new(AtomicBool::new(false));
    let flag = stored.clone();
    let (reply, confirmation) = pending
        .approve(|key| {
            assert_eq!(key, device_public);
            flag.store(true, Ordering::SeqCst);
            Ok(())
        })
        .unwrap();
    assert!(stored.load(Ordering::SeqCst));
    device.read(&reply).unwrap();
    let mut device = device.finish().unwrap();
    let (ack, mut host) = confirmation
        .confirm(&device.encrypt(CONFIRMATION).unwrap())
        .unwrap();
    assert_eq!(device.decrypt(&ack).unwrap(), CONFIRMATION);
    assert_eq!(
        host.decrypt(&device.encrypt(b"hello").unwrap()).unwrap(),
        b"hello"
    );
}

#[test]
fn pairing_needs_device_key_confirmation_before_channel_is_available() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let request = device.write().unwrap();
    let pending = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30))
        .unwrap()
        .receive(&request)
        .unwrap();
    let (_, confirmation) = pending.approve(|_| Ok(())).unwrap();
    assert!(confirmation.confirm(&request).is_err());
}

#[test]
fn failed_grant_never_returns_acceptance() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let pending = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30))
        .unwrap()
        .receive(&device.write().unwrap())
        .unwrap();
    assert!(matches!(
        pending.approve(|_| Err("revoked")),
        Err(ApprovalError::PersistenceUncertain)
    ));
    assert!(device.finish().is_err());
}

#[test]
fn expired_after_persistence_reports_grant_may_exist() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let pending = Invitation::new(&host_secret, &[7; 32], Duration::from_millis(20))
        .unwrap()
        .receive(&device.write().unwrap())
        .unwrap();
    let result = pending.approve(|_| {
        std::thread::sleep(Duration::from_millis(40));
        Ok(())
    });
    assert!(matches!(result, Err(ApprovalError::GrantedButIncomplete)));
}

#[test]
fn handshake_is_bound_to_invitation_and_separate_from_regular_connections() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    let mut device = initiate(&device_secret, host_public, &[8; 32]).unwrap();
    let offer = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30)).unwrap();
    assert!(offer.receive(&device.write().unwrap()).is_err());
    let mut regular =
        dsh_host::bridge::secure_channel::initiator(&device_secret, host_public).unwrap();
    let offer = Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30)).unwrap();
    assert!(offer.receive(&regular.write().unwrap()).is_err());
}

#[test]
fn invalid_or_expired_invitations_fail_closed() {
    let (host_secret, host_public) = generate_keypair().unwrap();
    let (device_secret, _) = generate_keypair().unwrap();
    assert!(Invitation::new(&host_secret, &[7; 32], Duration::ZERO).is_err());
    assert!(Invitation::new(&host_secret, &[7; 32], Duration::from_secs(301)).is_err());
    assert!(
        Invitation::new(&host_secret, &[7; 32], Duration::from_secs(30))
            .unwrap()
            .receive(b"invalid")
            .is_err()
    );
    let mut device = initiate(&device_secret, host_public, &[7; 32]).unwrap();
    let offer = Invitation::new(&host_secret, &[7; 32], Duration::from_nanos(1)).unwrap();
    assert!(offer.receive(&device.write().unwrap()).is_err());
}
