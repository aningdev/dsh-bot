# dsh-relay

Rust Relay for experimental online forwarding between one Host and one device.

```sh
cargo run -p dsh-relay
cargo test -p dsh-relay
```

`DSH_RELAY_HOST` defaults to `127.0.0.1`, `DSH_RELAY_PORT` to `8787`. `GET /v1/health` returns a health response. The WebSocket path is `/v1/rooms/{room}/{host|device}`, where `room` is 43 base64url characters. Each side waits for the server's `ready` text frame before sending binary frames. Disconnect, rate limit, timeout, or backpressure closes the pair; frames are never retried or persisted.

The implementation limits rooms (64), simultaneous upgraded or upgrading connections (128), message size (1 MiB), queued frames (16 per connection), total queued bytes (32 MiB), connection attempts per direct IP and frame rate per connection. The 32 MiB limit covers forwarding queues only; WebSocket receive buffers and incomplete messages are separately bounded by the connection and message limits. The 10,000-entry IP table rejects new IPs when all entries are active, so distributed traffic can deny service. It does not trust forwarded IP headers: a reverse proxy makes all traffic share the proxy's direct IP quota. It is single-instance: replicas do not share rooms. `SIGINT` and `SIGTERM` close active pairs before exit. A TLS reverse proxy is required for a public endpoint.

**Experimental only:** the Relay does not authenticate devices or establish encryption. A room ID and `ready` do not authenticate either endpoint. Pairing, device revocation, replay protection, endpoint encryption and Bridge authorization are not implemented; do not use for real remote access.
