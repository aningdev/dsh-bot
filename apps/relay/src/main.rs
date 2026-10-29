use dsh_relay::Relay;
use std::{
    env,
    net::{IpAddr, Ipv4Addr, SocketAddr},
};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let host: IpAddr = env::var("DSH_RELAY_HOST")
        .unwrap_or_else(|_| Ipv4Addr::LOCALHOST.to_string())
        .parse()?;
    let port: u16 = env::var("DSH_RELAY_PORT")
        .unwrap_or_else(|_| "8787".into())
        .parse()?;
    if port == 0 {
        return Err("Invalid DSH_RELAY_PORT".into());
    }
    let listener = TcpListener::bind(SocketAddr::new(host, port)).await?;
    let relay = Relay::default();
    eprintln!("Relay listening on {}", listener.local_addr()?);
    let server = axum::serve(
        listener,
        relay
            .router()
            .into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(async move {
        #[cfg(unix)]
        {
            let mut terminate =
                tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
                    .expect("install SIGTERM handler");
            tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = terminate.recv() => {} }
        }
        #[cfg(not(unix))]
        {
            let _ = tokio::signal::ctrl_c().await;
        }
        relay.shutdown();
    });
    server.await?;
    Ok(())
}
