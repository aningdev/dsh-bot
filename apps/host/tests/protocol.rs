use dsh_host::decode_response;
use serde_json::{Value, json};

fn ready() -> Value {
    json!({"phase":"ready","generation":"g1","pid":42,"version":"fixture-1","reason":null,"blocked":false})
}
fn response(value: Value) -> Value { json!({"version":1,"id":"request-1","ok":true,"value":value}) }
fn decode(value: Value, connection: bool) -> Result<dsh_host::Status, String> {
    decode_response(&value.to_string(), "request-1", connection)
}

#[test]
fn replies_and_subscriptions_share_envelope_and_status_validation() {
    assert!(decode(response(ready()), false).is_ok());
    for (field, value) in [("version", json!(2)), ("id", json!("wrong")), ("ok", json!("true")), ("value", json!({}))] {
        let mut reply = response(ready()); reply[field] = value;
        assert!(decode(reply, false).is_err(), "accepted malformed {field}");
    }
    for (field, value) in [("phase", json!("future")), ("generation", json!("")), ("generation", Value::Null), ("pid", json!(0)), ("blocked", json!(true)), ("blocked", json!("false"))] {
        let mut status = ready(); status[field] = value;
        assert!(decode(response(status), false).is_err(), "accepted malformed {field}");
    }
    assert!(decode_response("{", "request-1", false).is_err());
    assert_eq!(decode(json!({"version":1,"id":"request-1","ok":false,"error":"operation unconfirmed"}), false).err().unwrap(), "operation unconfirmed");
}

#[test]
fn public_status_never_carries_tokens_and_only_ready_loopback_can_bootstrap() {
    let mut status = ready();
    status["url"] = json!("http://127.0.0.1:32100/?token=fixture-secret");
    assert!(decode(response(status.clone()), true).is_ok());
    assert_eq!(decode(response(status.clone()), false).err().unwrap(), "Public host status contains authentication data");
    assert!(decode(response(ready()), true).is_err());
    for url in ["http://example.org:32100/?token=fixture-secret", "http://127.0.0.1:32100/", "http://user@127.0.0.1:32100/?token=fixture-secret", "http://127.0.0.1:32100/?token=fixture-secret#fragment"] {
        status["url"] = json!(url);
        let error = decode(response(status.clone()), true).err().unwrap();
        assert!(!error.contains("fixture-secret"));
    }
    status["phase"] = json!("starting");
    status["url"] = json!("http://127.0.0.1:32100/?token=fixture-secret");
    assert!(decode(response(status), true).is_err());
}
