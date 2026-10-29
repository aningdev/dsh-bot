//! Narrow validation of official Session calls for an already authorized Bot.
//!
//! This is only one part of the future Bridge: the caller must authenticate
//! the device, resolve its grant against a fresh registry snapshot, check
//! history cursors and filter outgoing events before forwarding anything.
use serde::Deserialize;
use serde_json::Value;

use super::snapshot::BotSnapshot;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Args<T> {
    request: T,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct SessionRequest {
    session_id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Prompt {
    session_id: String,
    request_id: String,
    mode: String,
    content: Vec<Text>,
    client_time_zone: Option<String>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Text {
    #[serde(rename = "type")]
    kind: String,
    text: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Follow {
    address: Address,
    assistant_stream: Option<bool>,
    max_messages: Option<u32>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Address {
    kind: String,
    session_id: String,
}

fn decode<T: for<'de> Deserialize<'de>>(args: Value) -> Option<T> {
    serde_json::from_value::<Args<T>>(args)
        .ok()
        .map(|args| args.request)
}

fn valid_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 128
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'-')
}

/// Validates only method and arguments against a Bot selected by an already
/// authenticated and authorized caller. Unknown methods and fields fail closed.
pub fn allows(bot: &BotSnapshot, method: &str, args: Value) -> bool {
    let Some(session_id) = bot.session_id.as_deref() else {
        return false;
    };
    match method {
        "session/projections" | "session/cancel" => {
            decode::<SessionRequest>(args).is_some_and(|request| request.session_id == session_id)
        }
        "session/follow" => decode::<Follow>(args).is_some_and(|request| {
            request.address.kind == "session"
                && request.address.session_id == session_id
                && request.assistant_stream.unwrap_or(true)
                && request
                    .max_messages
                    .is_none_or(|count| (1..=100).contains(&count))
        }),
        "session/prompt" if !bot.archived => decode::<Prompt>(args).is_some_and(|request| {
            request.session_id == session_id
                && valid_id(&request.request_id)
                && request.mode == "queue"
                && request.content.len() == 1
                && request.content[0].kind == "text"
                && !request.content[0].text.trim().is_empty()
                && request.content[0].text.len() <= 64 * 1024
                && request
                    .client_time_zone
                    .is_none_or(|zone| !zone.is_empty() && zone.len() <= 128)
        }),
        _ => false,
    }
}
