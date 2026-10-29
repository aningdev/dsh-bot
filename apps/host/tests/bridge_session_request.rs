use dsh_host::bridge::{session_request::allows, snapshot::BotSnapshot};
use serde_json::{Value, json};

fn bot() -> BotSnapshot {
    BotSnapshot {
        id: "bot-1".into(),
        name: "Bot".into(),
        archived: false,
        session_id: Some("session-1".into()),
    }
}

fn args(request: Value) -> Value {
    json!({"request": request})
}

#[test]
fn permits_only_scoped_official_calls() {
    let bot = bot();
    assert!(allows(
        &bot,
        "session/projections",
        args(json!({"sessionId":"session-1"}))
    ));
    assert!(allows(
        &bot,
        "session/cancel",
        args(json!({"sessionId":"session-1"}))
    ));
    assert!(allows(
        &bot,
        "session/follow",
        args(json!({"address":{"kind":"session","sessionId":"session-1"},"assistantStream":true}))
    ));
    assert!(!allows(
        &bot,
        "session/follow",
        args(json!({"address":{"kind":"subagent","sessionId":"session-1"}}))
    ));
    assert!(!allows(
        &bot,
        "session/projections",
        args(json!({"sessionId":"session-2"}))
    ));
    assert!(!allows(
        &bot,
        "session/projections",
        args(json!({"sessionId":"session-1", "address":{}}))
    ));
    assert!(!allows(
        &bot,
        "session/selectModel",
        args(json!({"sessionId":"session-1"}))
    ));
    assert!(!allows(&bot, "credentials/set", args(json!({}))));
    assert!(!allows(
        &bot,
        "session/cancel",
        json!({"request":{"sessionId":"session-1"},"extra":true})
    ));
    let mut missing = bot.clone();
    missing.session_id = None;
    assert!(!allows(
        &missing,
        "session/projections",
        args(json!({"sessionId":"session-1"}))
    ));
}

#[test]
fn restricts_prompt_and_archived_bots() {
    let mut bot = bot();
    let prompt = json!({"sessionId":"session-1","requestId":"request-1","mode":"queue","content":[{"type":"text","text":"hello"}]});
    assert!(allows(&bot, "session/prompt", args(prompt.clone())));
    let mut changed = prompt.clone();
    changed["mode"] = json!("steer");
    assert!(!allows(&bot, "session/prompt", args(changed)));
    let mut changed = prompt.clone();
    changed["content"] = json!([{"type":"file","receiptId":"secret"}]);
    assert!(!allows(&bot, "session/prompt", args(changed)));
    let mut changed = prompt.clone();
    changed["content"][0]["extra"] = json!(true);
    assert!(!allows(&bot, "session/prompt", args(changed)));
    let mut changed = prompt.clone();
    changed["content"][0]["text"] = json!(" ");
    assert!(!allows(&bot, "session/prompt", args(changed)));
    bot.archived = true;
    assert!(!allows(&bot, "session/prompt", args(prompt)));
    assert!(allows(
        &bot,
        "session/cancel",
        args(json!({"sessionId":"session-1"}))
    ));
}
