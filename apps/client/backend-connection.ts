export type HostPhase = 'stopped' | 'preparing' | 'starting' | 'ready' | 'stopping' | 'failed' | 'recovering'
export interface HostStatus {
  phase: HostPhase | 'unavailable'
  generation?: string
  reason?: string
  blocked: boolean
}
export interface BackendInfo { url: string; generation?: string }

/** Private control/discovery adapter; lifecycle commands are never retried here. */
export interface BackendHost {
  discover(): Promise<BackendInfo>
  watch(listener: (status: HostStatus) => void): Promise<() => void>
  start(): Promise<void>
  unregister(): Promise<void>
}
export interface ProtocolConnection {
  connect(url: string): Promise<void>
  dispose(): Promise<void>
  onGenerationChange?: (ready: boolean) => void
}
export type BackendState =
  | { phase: 'connecting'; ready: false; message: string }
  | { phase: 'connected'; ready: boolean; message: string }
  | { phase: 'unavailable'; ready: false; message: string }

/** Owns host replacement, official connection readiness and all retiring resources. */
export class BackendConnection {
  private revision = 0
  private closed = false
  private generation?: string
  private stopWatch?: () => void
  private watchRevision = 0
  private work: Promise<void> = Promise.resolve()
  private retirement: Promise<void> = Promise.resolve()
  private state: BackendState = { phase: 'unavailable', ready: false, message: '尚未连接后台' }
  private protocolReady?: boolean

  constructor(
    private host: BackendHost,
    private client: ProtocolConnection,
    private changed: (state: BackendState) => void,
    private connected: () => void,
  ) {
    client.onGenerationChange = ready => {
      if (this.closed) return
      this.protocolReady = ready
      if (this.state.phase === 'connected') this.publishConnected(ready)
    }
  }

  private publish(state: BackendState): void {
    this.state = state
    if (!this.closed) this.changed(state)
  }

  private publishConnected(ready: boolean): void {
    this.publish({ phase: 'connected', ready, message: ready ? '已连接后台' : '后台事件流已断开，正在恢复连接' })
  }

  private invalidate(): number {
    const revision = ++this.revision
    this.generation = undefined
    // dispose invalidates authentication synchronously, before its cleanup awaits.
    const cleanup = this.client.dispose()
    this.retirement = Promise.all([this.retirement, cleanup]).then(() => {})
    return revision
  }

  private closeWatch(): void {
    ++this.watchRevision
    this.stopWatch?.()
    this.stopWatch = undefined
  }

  private hostChanged(status: HostStatus): void {
    if (this.closed) return
    if (status.phase === 'ready' && status.generation === this.generation) return
    if (status.phase === 'ready') {
      void this.connect()
    } else {
      this.invalidate()
      this.publish({ phase: 'unavailable', ready: false, message: status.reason ?? `后台状态：${status.phase}` })
      if (status.phase === 'unavailable') this.closeWatch()
    }
  }

  private async watch(): Promise<void> {
    if (this.stopWatch) return
    const revision = this.watchRevision
    const stop = await this.host.watch(status => {
      if (revision === this.watchRevision) this.hostChanged(status)
    })
    if (this.closed || revision !== this.watchRevision) stop()
    else this.stopWatch = stop
  }

  /** Recheck discovery. It does not grant explicit startup permission. */
  connect(): Promise<void> { return this.schedule() }
  start(): Promise<void> { return this.schedule(() => this.host.start()) }
  unregister(): Promise<void> { return this.schedule(() => this.host.unregister()) }

  private schedule(command?: () => Promise<void>): Promise<void> {
    if (this.closed) return Promise.resolve()
    if (command) this.closeWatch()
    const revision = this.invalidate()
    this.publish({ phase: 'connecting', ready: false, message: '正在连接后台…' })
    const current = () => !this.closed && revision === this.revision
    const run = async () => {
      try {
        await this.retirement
        if (!current()) return
        if (command) await command()
        if (!current()) return
        const info = await this.host.discover()
        if (!current()) return
        this.generation = info.generation
        if (info.generation) await this.watch()
        if (!current()) return
        this.protocolReady = undefined
        await this.client.connect(info.url)
        if (!current()) return
        this.publishConnected(this.protocolReady ?? true)
        this.connected()
      } catch (error) {
        if (!current()) return
        this.invalidate()
        this.publish({ phase: 'unavailable', ready: false, message: error instanceof Error ? error.message : String(error) })
      }
    }
    this.work = this.work.then(run)
    return this.work
  }

  /** Deliver read results only while the connection that issued them is current. */
  async read<T>(work: () => Promise<T>, receive: (value: T) => void, failed?: (error: unknown) => void): Promise<void> {
    if (this.closed || this.state.phase !== 'connected') return
    const revision = this.revision
    try {
      const value = await work()
      if (!this.closed && revision === this.revision) receive(value)
    } catch (error) {
      if (!this.closed && revision === this.revision) failed?.(error)
    }
  }

  async dispose(): Promise<void> {
    if (!this.closed) {
      this.closed = true
      this.closeWatch()
      this.invalidate()
      this.client.onGenerationChange = undefined
    }
    await this.work
    await this.retirement
  }
}
