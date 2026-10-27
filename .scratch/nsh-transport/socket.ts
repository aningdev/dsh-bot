import { Transport, type Socket } from 'nsh-transport/native'

// Browser-shaped carrier only; all Mux/RPC logic is the official client's.
export class AuthenticatedSocket {
  readyState = 0
  private socket?: Socket
  private listeners = new Map<string, Set<(event: any) => void>>()
  constructor(url: string, cookie: string) {
    Transport.connect(url, cookie).then(async socket => {
      if (this.readyState !== 0) { socket.close(); socket.dispose(); return }
      this.socket = socket
      this.readyState = 1
      this.emit('open', {})
      try {
        while (this.readyState === 1) this.emit('message', { data: await socket.read() })
      } catch {
        if (this.readyState === 1) this.emit('error', {})
      } finally {
        this.readyState = 3
        this.socket = undefined
        socket.dispose()
        this.emit('close', {})
      }
    }, () => { this.readyState = 3; this.emit('error', {}); this.emit('close', {}) })
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
  addEventListener(type: string, listener: (event: any) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type)!.add(listener)
  }
  removeEventListener(type: string, listener: (event: any) => void) { this.listeners.get(type)?.delete(listener) }
  private emit(type: string, event: any) { for (const listener of this.listeners.get(type) ?? []) listener(event) }
}
