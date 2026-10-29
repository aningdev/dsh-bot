use dsh_host::{bridge::snapshot::read_snapshot, generation};
use serde_json::{Value, json};
use std::{fs, os::unix::fs::symlink, path::PathBuf};

struct Registry(PathBuf);
impl Registry {
    fn new() -> Self {
        let root =
            std::env::temp_dir().join(format!("dsh-bridge-snapshot-{}", generation().unwrap()));
        fs::create_dir_all(&root).unwrap();
        Self(root)
    }
    fn record(&self, id: &str, value: Value) {
        fs::write(
            self.0.join(format!("{id}.json")),
            serde_json::to_vec(&value).unwrap(),
        )
        .unwrap();
    }
}
impl Drop for Registry {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}
fn bot(id: &str, session: &str) -> Value {
    json!({"id":id,"name":"Example","preset":"default","workspace":"/private/workspace", "model":{"provider":"test","model":"test"}, "archived":false, "sessionId":session, "draft":{"text":"private draft","requestId":"private request"}, "initializing":{"candidateSessionId":"private candidate"}})
}

#[test]
fn snapshots_only_expose_allowlisted_fields_and_revision_tracks_public_changes() {
    let registry = Registry::new();
    registry.record("bot_a", bot("bot_a", "sess_a"));
    let first = read_snapshot(&registry.0).unwrap();
    let encoded = serde_json::to_string(&first).unwrap();
    for private in [
        "private draft",
        "private request",
        "private candidate",
        "/private/workspace",
        "provider",
        "preset",
    ] {
        assert!(!encoded.contains(private), "leaked {private}");
    }
    let mut changed = bot("bot_a", "sess_a");
    changed["draft"]["text"] = json!("another draft");
    registry.record("bot_a", changed.clone());
    assert_eq!(first.revision, read_snapshot(&registry.0).unwrap().revision);
    changed["name"] = json!("New name");
    registry.record("bot_a", changed);
    assert_ne!(first.revision, read_snapshot(&registry.0).unwrap().revision);
}

#[test]
fn unfinished_bots_remain_visible_without_a_session() {
    let registry = Registry::new();
    let mut value = bot("bot_a", "sess_a");
    value["preset"] = json!("");
    value["workspace"] = json!("");
    value["model"] = json!({"provider":"", "model":""});
    value.as_object_mut().unwrap().remove("sessionId");
    registry.record("bot_a", value);
    let snapshot = read_snapshot(&registry.0).unwrap();
    assert_eq!(snapshot.bots.len(), 1);
    assert_eq!(snapshot.bots[0].session_id, None);
    assert_eq!(snapshot.damaged, 0);
}

#[test]
fn unsafe_session_pointer_does_not_hide_the_bot_or_authorize_the_pointer() {
    let registry = Registry::new();
    let value = bot("bot_a", "../outside");
    registry.record("bot_a", value);
    let snapshot = read_snapshot(&registry.0).unwrap();
    assert_eq!(snapshot.bots.len(), 1);
    assert_eq!(snapshot.bots[0].session_id, None);
    assert!(!snapshot.bots[0].archived);
    assert_eq!(snapshot.damaged, 0);
}

#[test]
fn invalid_archive_state_cannot_authorize_a_session() {
    let registry = Registry::new();
    let mut value = bot("bot_a", "sess_a");
    value["archived"] = json!("true");
    registry.record("bot_a", value);
    let snapshot = read_snapshot(&registry.0).unwrap();
    assert!(snapshot.bots.is_empty());
    assert_eq!(snapshot.damaged, 1);
}

#[test]
fn named_pipe_is_rejected_without_waiting_for_a_writer() {
    use std::{ffi::CString, os::unix::ffi::OsStrExt};
    let registry = Registry::new();
    let path = registry.0.join("pipe.json");
    let path = CString::new(path.as_os_str().as_bytes()).unwrap();
    assert_eq!(unsafe { libc::mkfifo(path.as_ptr(), 0o600) }, 0);
    assert_eq!(
        read_snapshot(&registry.0).unwrap_err().kind(),
        std::io::ErrorKind::InvalidData
    );
}

#[test]
fn damaged_records_are_omitted_and_duplicate_session_pointers_fail_closed() {
    let registry = Registry::new();
    registry.record("bot_a", bot("bot_a", "sess_a"));
    registry.record("bot_b", bot("other", "sess_b"));
    fs::write(registry.0.join("broken.json"), b"{").unwrap();
    fs::write(registry.0.join("bot_a.json.tmp"), b"ignored").unwrap();
    let snapshot = read_snapshot(&registry.0).unwrap();
    assert_eq!(snapshot.bots.len(), 1);
    assert_eq!(snapshot.damaged, 2);
    registry.record("bot_b", bot("bot_b", "sess_a"));
    assert_eq!(
        read_snapshot(&registry.0).unwrap_err().kind(),
        std::io::ErrorKind::InvalidData
    );
}

#[test]
fn missing_registry_is_empty_but_filesystem_failures_are_not() {
    let registry = Registry::new();
    assert!(
        read_snapshot(&registry.0.join("missing"))
            .unwrap()
            .bots
            .is_empty()
    );
    fs::write(registry.0.join("not-a-directory"), b"x").unwrap();
    assert!(read_snapshot(&registry.0.join("not-a-directory")).is_err());
    fs::write(registry.0.join("outside"), b"secret").unwrap();
    symlink(registry.0.join("outside"), registry.0.join("link.json")).unwrap();
    assert!(read_snapshot(&registry.0).is_err());
}
