export interface BotConfig { name: string; model: string; instructions: string; cwd: string }
export interface Bot extends BotConfig { id: string }
export interface Conversation { id: string; botId: string; name: string; config: BotConfig }
export interface ProductState { bots: Bot[]; conversations: Conversation[] }

/** Native fetch does not share a browser cookie jar. Keep the owner cookie in memory. */
export class Connection {
  private origin = ''
  private cookie = ''
  async connect(loginUrl: string): Promise<void> {
    const url = new URL(loginUrl)
    if (url.hostname !== '127.0.0.1' || url.protocol !== 'http:') throw new Error('后台地址必须是本机回环地址')
    const response = await fetch(url.toString(), { redirect: 'manual' })
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    if (response.status !== 303 || !cookie) throw new Error(`认证失败：${response.status}`)
    this.origin = url.origin
    this.cookie = cookie
    await this.request('/api/bot/state')
  }
  async request<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await this.response(path, body, signal)
    const value = await response.json() as T & { error?: string }
    if (!response.ok) throw new Error(value.error ?? `后台返回 ${response.status}`)
    return value
  }
  private response(path: string, body?: unknown, signal?: AbortSignal): Promise<Response> {
    if (!this.cookie) throw new Error('尚未连接后台')
    return fetch(this.origin + path, { method: body === undefined ? 'GET' : 'POST',
      headers: { cookie: this.cookie, 'content-type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), ...(signal ? { signal } : {}) })
  }
  async follow(id: string, signal: AbortSignal, receive: (value: unknown) => void): Promise<void> {
    const response = await this.response(`/api/bot/follow?id=${encodeURIComponent(id)}`, undefined, signal)
    if (!response.ok || !response.body) throw new Error(`历史连接失败：${response.status}`)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let pending = ''
    try {
      while (true) {
        const next = await reader.read()
        if (next.done) break
        pending += decoder.decode(next.value, { stream: true })
        let end: number
        while ((end = pending.indexOf('\n')) >= 0) {
          const line = pending.slice(0, end)
          pending = pending.slice(end + 1)
          if (line) receive(JSON.parse(line))
        }
      }
      if (!signal.aborted) throw new Error('后台连接已断开')
    } finally { await reader.cancel().catch(() => undefined); reader.releaseLock() }
  }
}
