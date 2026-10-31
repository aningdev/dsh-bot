use dsh_host::{call, generation};
use serde_json::{Value, json};
use std::{fs, os::unix::{fs::PermissionsExt, net::UnixStream}, path::PathBuf, process::{Child, Command, Stdio}, thread, time::{Duration, Instant}};

struct Host { root: PathBuf, child: Option<Child> }
impl Host {
    fn new(mode: &str) -> Self {
        let root = PathBuf::from(format!("/tmp/dsh-h-{}", generation().unwrap()));
        fs::create_dir_all(&root).unwrap();
        // Fixture controls only process behavior; production still launches the official CLI.
        let version = if mode == "badversion" { "echo check >> \"$DSH_HOME/checks\"; /bin/sleep 0.3; echo wrong" } else { "echo fixture-1" };
        let script = format!("#!/bin/sh\nif [ \"$1\" = --version ]; then {version}; exit 0; fi\nprintf '%s\\n' $$ >> \"$DSH_HOME/pids\"\n{}\n", match mode {
            "leftover" => "echo 'dsh web: http://127.0.0.1:32100/?token=fixture-secret'; exec /usr/bin/perl -e 'if (fork() == 0) { $SIG{TERM} = \"IGNORE\"; open(my $f, \">\", \"$ENV{DSH_HOME}/leftover\") or die; print $f \"$$\\n\"; close($f); sleep(300); } else { select(undef, undef, undef, 0.8); exit(9); }'",
            "crash" => "echo 'dsh web: http://127.0.0.1:32100/?token=fixture-secret'; /bin/sleep 0.15; exit 9",
            "hang" => "exec /bin/sleep 300",
            "timeout-cleanup" => "exec /usr/bin/perl -e '$SIG{TERM} = \"IGNORE\"; sleep(300)'",
            _ => "echo 'dsh web: http://127.0.0.1:32100/?token=fixture-secret'; exec /bin/sleep 300",
        });
        fs::write(root.join("dsh"), script).unwrap();
        fs::set_permissions(root.join("dsh"), fs::Permissions::from_mode(0o700)).unwrap();
        let mut host = Self { root, child: None };
        host.launch(); host
    }
    fn launch(&mut self) {
        self.child = Some(Command::new(env!("CARGO_BIN_EXE_dsh-host")).arg("serve").arg("--data-root").arg(&self.root)
            .arg("--dsh").arg(self.root.join("dsh"))
            .args(["--version", "fixture-1", "--startup-ms", "3000"])
            .stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null()).spawn().unwrap());
        self.until(|| self.request("status", None).is_ok(), 5);
    }
    fn request(&self, operation: &str, source: Option<&str>) -> Result<Value, String> {
        call(&self.root.join("host/control.sock"), &json!({"version":1,"id":"test","operation":operation,"source":source}))
    }
    fn until(&self, check: impl Fn() -> bool, seconds: u64) {
        let end = Instant::now() + Duration::from_secs(seconds);
        while !check() { assert!(Instant::now() < end, "condition timed out; state={:?}", self.request("status", None)); thread::sleep(Duration::from_millis(25)); }
    }
    fn crash_host(&mut self) { let mut child = self.child.take().unwrap(); child.kill().unwrap(); child.wait().unwrap(); }
    fn pids(&self) -> Vec<i32> { fs::read_to_string(self.root.join("pids")).unwrap_or_default().lines().filter_map(|line| line.parse().ok()).collect() }
}
impl Drop for Host {
    fn drop(&mut self) {
        let _ = self.request("stopDsh", None);
        if let Some(mut child) = self.child.take() { let _ = child.kill(); let _ = child.wait(); }
        let end = Instant::now() + Duration::from_secs(10);
        while self.pids().iter().any(|pid| unsafe { libc::kill(*pid, 0) == 0 }) && Instant::now() < end { thread::sleep(Duration::from_millis(25)); }
        let _ = fs::remove_dir_all(&self.root);
    }
}
#[test]
fn device_control_pages_and_revokes_persistent_grants() {
    use dsh_host::bridge::device_store::DeviceStore;
    let mut host = Host::new("ready");
    let store = DeviceStore::new(host.root.join("host/devices"));
    for i in 0..65 { store.authorize([i; 32]).unwrap(); }
    let socket = host.root.join("host/control.sock");
    let list = |cursor| call(&socket, &json!({"version":1,"id":"devices","operation":"listDevices","cursor":cursor})).unwrap();
    let first = list(0);
    assert_eq!(first["devices"].as_array().unwrap().len(), 64);
    assert_eq!(first["nextCursor"], 64);
    assert_eq!(list(64)["devices"].as_array().unwrap().len(), 1);
    let key = [5u8; 32];
    call(&socket, &json!({"version":1,"id":"revoke","operation":"revokeDevice","deviceKey":key})).unwrap();
    assert_eq!(list(0)["devices"][5]["revoked"], true);
    assert!(call(&socket, &json!({"version":1,"id":"bad","operation":"revokeDevice","deviceKey":[1]})).is_err());
    host.crash_host(); host.launch();
    assert_eq!(list(0)["devices"][5]["revoked"], true);
}

#[test]
fn attach_is_read_only_until_user_start_and_stop_survives_host_crash() {
    let mut host = Host::new("ready");
    assert_eq!(host.request("ensureDsh", Some("attach")).unwrap()["phase"], "stopped");
    assert!(host.pids().is_empty());
    let started = host.request("ensureDsh", Some("userStart")).unwrap();
    assert_eq!(started["phase"], "ready");
    assert!(started.get("url").is_none());
    assert!(host.request("connectionInfo", None).unwrap()["url"].as_str().unwrap().contains("fixture-secret"));
    let attached = host.request("ensureDsh", Some("attach")).unwrap();
    assert_eq!(started["generation"], attached["generation"]);
    assert_eq!(host.pids().len(), 1);
    let log = fs::read_to_string(host.root.join("logs/host-dsh.log")).unwrap_or_default();
    assert!(!log.contains("fixture-secret"));
    host.request("stopDsh", None).unwrap(); host.crash_host(); host.launch();
    assert_eq!(host.request("ensureDsh", Some("attach")).unwrap()["phase"], "stopped");
    assert_eq!(host.pids().len(), 1);
    let restarted = host.request("ensureDsh", Some("userStart")).unwrap();
    assert_eq!(restarted["phase"], "ready");
    assert_ne!(started["generation"], restarted["generation"]);
}
#[test]
fn host_sigkill_reaps_old_process_before_new_generation() {
    let mut host = Host::new("ready");
    let first = host.request("ensureDsh", Some("userStart")).unwrap();
    let old_pid = first["pid"].as_i64().unwrap() as i32;
    host.crash_host(); host.launch();
    host.until(|| host.request("status", None).is_ok_and(|s| s["phase"] == "ready"), 8);
    let next = host.request("status", None).unwrap();
    assert_eq!(next["phase"], "ready");
    assert_ne!(first["generation"], next["generation"]);
    assert_ne!(next["pid"].as_i64().unwrap(), old_pid as i64);
    assert_ne!(unsafe { libc::kill(old_pid, 0) }, 0, "old process still alive at replacement ready");
}
#[test]
fn restart_budget_is_durable_and_attach_cannot_unblock_it() {
    let mut host = Host::new("crash");
    host.request("ensureDsh", Some("userStart")).unwrap();
    host.until(|| host.request("status", None).is_ok_and(|s| s["blocked"] == true), 20);
    assert_eq!(host.pids().len(), 4);
    host.crash_host(); host.launch();
    let state = host.request("ensureDsh", Some("attach")).unwrap();
    assert_eq!(state["blocked"], true); assert_eq!(state["phase"], "failed");
    thread::sleep(Duration::from_millis(200));
    assert_eq!(host.pids().len(), 4);
}
#[test]
fn startup_timeout_has_no_connection_and_invalid_requests_cannot_start() {
    use std::io::{Read, Write};
    let host = Host::new("hang");
    let mut stream = UnixStream::connect(host.root.join("host/control.sock")).unwrap();
    stream.set_read_timeout(Some(Duration::from_secs(4))).unwrap();
    stream.write_all(b"{\"version\":1,\"id\":\"bad\",\"operation\":\"ensureDsh\",\"source\":\"automatic\"}\n").unwrap();
    let mut bytes = Vec::new(); stream.read_to_end(&mut bytes).unwrap();
    assert!(host.pids().is_empty());
    assert!(host.request("ensureDsh", Some("userStart")).is_err());
    assert!(host.request("connectionInfo", None).is_err());
    host.request("stopDsh", None).unwrap();
    let metadata = fs::metadata(host.root.join("host/control.sock")).unwrap();
    assert_eq!(metadata.permissions().mode() & 0o777, 0o600);
}
#[test]
fn overlapping_failed_user_starts_share_one_attempt() {
    let host = Host::new("badversion");
    let socket = host.root.join("host/control.sock");
    let barrier = std::sync::Arc::new(std::sync::Barrier::new(3));
    let threads: Vec<_> = (0..2).map(|index| {
        let socket = socket.clone(); let barrier = barrier.clone();
        thread::spawn(move || { barrier.wait(); call(&socket, &json!({"version":1,"id":index.to_string(),"operation":"ensureDsh","source":"userStart"})) })
    }).collect();
    barrier.wait();
    for thread in threads { assert!(thread.join().unwrap().is_err()); }
    assert_eq!(fs::read_to_string(host.root.join("checks")).unwrap().lines().count(), 1);
    host.request("stopDsh", None).unwrap();
}

#[test]
fn ensure_during_failed_start_cleanup_joins_the_same_attempt() {
    let host = Host::new("timeout-cleanup");
    let socket = host.root.join("host/control.sock");
    let first = thread::spawn(move || call(&socket, &json!({"version":1,"id":"first","operation":"ensureDsh","source":"userStart"})));
    host.until(|| host.request("status", None).is_ok_and(|s| s["phase"] == "stopping"), 6);
    let second = host.request("ensureDsh", Some("userStart"));
    let first = first.join().unwrap();
    host.request("stopDsh", None).unwrap();
    assert!(first.is_err());
    assert!(second.is_err());
    assert_eq!(host.pids().len(), 1, "overlapping ensure started a second dsh during failure cleanup");
}

#[test]
fn exited_dsh_revokes_connection_while_resistant_descendant_is_reaped() {
    let host = Host::new("leftover");
    host.request("ensureDsh", Some("userStart")).unwrap();
    host.until(|| host.request("connectionInfo", None).is_err(), 3);
    let leftover: i32 = fs::read_to_string(host.root.join("leftover")).unwrap().trim().parse().unwrap();
    assert_eq!(unsafe { libc::kill(leftover, 0) }, 0, "resistant descendant must still be present during cleanup");
    host.request("stopDsh", None).unwrap();
    assert_ne!(unsafe { libc::kill(leftover, 0) }, 0);
    assert_eq!(host.request("status", None).unwrap()["phase"], "stopped");
}

#[test]
fn stop_timeout_cannot_turn_later_guardian_exit_into_restart() {
    let host = Host::new("ready");
    let state = host.request("ensureDsh", Some("userStart")).unwrap();
    let pid = state["pid"].as_i64().unwrap().to_string();
    let output = Command::new("/bin/ps").args(["-o", "ppid=", "-p", &pid]).output().unwrap();
    assert!(output.status.success());
    let guardian: i32 = String::from_utf8(output.stdout).unwrap().trim().parse().unwrap();
    assert_eq!(unsafe { libc::kill(guardian, libc::SIGSTOP) }, 0);
    let stopped = host.request("stopDsh", None);
    // Always resume the fixture guardian, even when the regression reappears.
    assert_eq!(unsafe { libc::kill(guardian, libc::SIGCONT) }, 0);
    assert!(stopped.is_err());
    host.until(|| host.request("status", None).is_ok_and(|state| state["phase"] == "stopped"), 5);
    thread::sleep(Duration::from_millis(1300));
    assert_eq!(host.pids().len(), 1);
    assert_eq!(host.request("ensureDsh", Some("attach")).unwrap()["blocked"], true);
}
