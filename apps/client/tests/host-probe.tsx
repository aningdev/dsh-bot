import { View, Text, signal, cleanup, mount } from 'nsh'
import { WebSocket as StandardWebSocket } from 'websocket'
import { Connection } from '../frontend/infrastructure/dsh/connection'
import { backendInfo } from '../frontend/application/backend/host'

export default function HostProbe() {
  const state = signal('connecting')
  const handshake = signal('checking-standard-websocket')
  const connection = new Connection()
  let disposed = false
  cleanup(() => { disposed = true; void connection.dispose() })
  void (async () => {
    try {
      const { url: loginUrl } = await backendInfo()
      const target = new URL('/api/remote.mux', loginUrl)
      target.protocol = 'ws:'
      // Check the installed NSH runtime, with a dummy Cookie and no credentials
      // from the real session. Network grants do not remove this API restriction.
      let rejection = ''
      try {
        const socket = await StandardWebSocket.connect(target.toString(), { headers: { Cookie: 'probe=1' } })
        try { await socket.close() } finally { socket.dispose() }
      } catch (error) { rejection = error instanceof Error ? error.message : String(error) }
      if (!rejection.includes('credential header `Cookie`')) {
        throw new Error('Recheck NSH Cookie handshake support before retaining the native adapter')
      }
      if (!disposed) handshake.set('standard-cookie-header-blocked')
      // Place a second cookie before the real authentication cookie. Connection
      // must retain both pairs without treating Expires attributes as cookies.
      const originalFetch = globalThis.fetch
      globalThis.fetch = async (input, init) => {
        const response = await originalFetch(input, init)
        if (new URL(String(input)).pathname !== '/connect') return response
        const headers = new Headers(response.headers)
        headers.delete('set-cookie')
        headers.append('set-cookie', 'probe=1; Expires=Wed, 21 Oct 2037 07:28:00 GMT; Path=/')
        for (const cookie of response.headers.getSetCookie()) headers.append('set-cookie', cookie)
        return new Response(null, { status: response.status, headers })
      }
      try { await connection.connect(loginUrl) } finally { globalThis.fetch = originalFetch }
      const catalog = await connection.modelCatalog()
      if (!Array.isArray(catalog.models)) throw new Error('Invalid catalog')
      if (!disposed) state.set('official-ready')
    } catch (error) {
      if (!disposed) state.set(`official-failed: ${String(error).replace(/https?:\/\/\S+/g, '<REDACTED>')}`)
    }
  })()
  return <View style={{ flex: 1 }}><Text>{handshake()}</Text><Text>{state()}</Text></View>
}
mount(HostProbe)
