import { CookieWebSocket, type Socket } from 'dsh-client/native'
import type { ConnectionWebSocket } from '@deepseek-ai/dsh-client-connection/client'

// NSH supports ws/wss, but its standard handshake API rejects Cookie headers.
// Adapt only that gap; HTTP uses fetch and all Mux/RPC logic stays in the official client.
export class AuthenticatedSocket extends EventTarget {
  declare addEventListener: EventTarget['addEventListener'] & ConnectionWebSocket['addEventListener']
  declare removeEventListener: EventTarget['removeEventListener'] & ConnectionWebSocket['removeEventListener']
  readyState = 0
  private socket?: Socket
  constructor(url: string, cookie: string) {
    super()
    CookieWebSocket.connect(url, cookie).then(async socket => {
      if (this.readyState !== 0) { socket.close(); socket.dispose(); return }
      this.socket = socket
      this.readyState = 1
      this.dispatchEvent(new Event('open'))
      try {
        while (this.readyState === 1) {
          const data = await socket.read()
          if (this.readyState === 1) this.dispatchEvent(Object.assign(new Event('message'), { data }))
        }
      } catch {
        if (this.readyState === 1) this.dispatchEvent(new Event('error'))
      } finally {
        this.readyState = 3
        this.socket = undefined
        socket.dispose()
        this.dispatchEvent(new Event('close'))
      }
    }, () => { this.readyState = 3; this.dispatchEvent(new Event('error')); this.dispatchEvent(new Event('close')) })
  }
  send(data: string) {
    if (this.readyState !== 1 || !this.socket) throw new Error('Socket is not open')
    this.socket.write(data)
  }
  close() {
    if (this.readyState >= 2) return
    this.readyState = 2
    this.socket?.close()
  }
}
