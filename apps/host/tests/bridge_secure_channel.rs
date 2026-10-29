use dsh_host::bridge::secure_channel::{Channel, generate_keypair, initiator, responder};

fn connected() -> (Channel, Channel) {
    let (host_private, host_public) = generate_keypair().unwrap();
    let (device_private, device_public) = generate_keypair().unwrap();
    let mut device = initiator(&device_private, host_public).unwrap();
    let mut host = responder(&host_private, device_public).unwrap();
    host.read(&device.write().unwrap()).unwrap();
    device.read(&host.write().unwrap()).unwrap();
    (host.finish().unwrap(), device.finish().unwrap())
}

#[test]
fn only_paired_devices_can_establish_a_channel() {
    let (host_private, host_public) = generate_keypair().unwrap();
    let (_, allowed_public) = generate_keypair().unwrap();
    let (stranger_private, _) = generate_keypair().unwrap();
    let mut device = initiator(&stranger_private, host_public).unwrap();
    let mut host = responder(&host_private, allowed_public).unwrap();
    assert!(host.read(&device.write().unwrap()).is_err());
    assert!(host.write().is_err());
    assert!(host.finish().is_err());
}

#[test]
fn encrypted_messages_are_bidirectional_and_replay_fails_closed() {
    let (mut host, mut device) = connected();
    let message = device.encrypt(b"private prompt").unwrap();
    assert!(!message.windows(14).any(|part| part == b"private prompt"));
    assert_eq!(host.decrypt(&message).unwrap(), b"private prompt");
    let reply = host.encrypt(b"private response").unwrap();
    assert_eq!(device.decrypt(&reply).unwrap(), b"private response");
    assert!(host.decrypt(&message).is_err());
    assert!(
        host.decrypt(&device.encrypt(b"after replay").unwrap())
            .is_err()
    );
}

#[test]
fn rejects_tampered_reordered_and_oversized_frames() {
    let (mut host, mut device) = connected();
    let first = device.encrypt(b"first").unwrap();
    let second = device.encrypt(b"second").unwrap();
    assert!(host.decrypt(&second).is_err());
    assert!(host.decrypt(&first).is_err());
    let (mut host, mut device) = connected();
    let mut frame = device.encrypt(b"data").unwrap();
    frame[0] ^= 1;
    assert!(host.decrypt(&frame).is_err());
    let (mut host, mut device) = connected();
    assert!(device.encrypt(&vec![0; 65520]).is_err());
    assert!(host.decrypt(&vec![0; 65536]).is_err());
}

#[test]
fn refuses_wrong_host_and_cross_generation_replays() {
    let (host_private, _) = generate_keypair().unwrap();
    let (_, other_host_public) = generate_keypair().unwrap();
    let (device_private, device_public) = generate_keypair().unwrap();
    let mut device = initiator(&device_private, other_host_public).unwrap();
    let mut host = responder(&host_private, device_public).unwrap();
    assert!(host.read(&device.write().unwrap()).is_err());
    let (mut first_host, mut first_device) = connected();
    let old = first_device.encrypt(b"old").unwrap();
    assert_eq!(first_host.decrypt(&old).unwrap(), b"old");
    let (mut next_host, _) = connected();
    assert!(next_host.decrypt(&old).is_err());
}
