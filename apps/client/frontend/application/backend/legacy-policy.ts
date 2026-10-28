export interface LegacyAccess {
  readLog(): Promise<string>
  inspectJob(): Promise<string | undefined>
  install(): Promise<void>
  activate(): Promise<void>
}

/** Temporary LaunchAgent compatibility. Authentication stays in Connection. */
export class LegacyBackend {
  private starting?: Promise<void>

  constructor(
    private readonly access: LegacyAccess,
    private readonly version: string,
  ) {}

  async discover(): Promise<string> {
    const log = await this.access.readLog()
    const job = await this.access.inspectJob()
    if (job === undefined) throw new Error('后台尚未启动')
    const pid = /^\s*pid = (\d+)\s*$/m.exec(job)?.[1]
    if (!pid) throw new Error('后台正在启动，请稍后重连')
    let current = false
    let ready: string | undefined
    for (const line of log.split('\n')) {
      if (line.startsWith('[launch ')) {
        const launch = /\] pid=(\d+) version=(.+)$/.exec(line)
        current = launch?.[1] === pid && launch[2] === this.version
        ready = undefined
      } else if (current) {
        const url = /dsh web: (http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+)(?:\s|$)/.exec(line)?.[1]
        if (url) ready = url
      }
    }
    if (!ready) throw new Error('后台版本或当前启动信息未确认，请安装受支持版本并重新启动后台')
    return ready
  }

  /** Only an explicit user action installs or activates the accepted old entry. */
  start(): Promise<void> {
    if (this.starting) return this.starting
    const starting = this.startOnce().finally(() => {
      if (this.starting === starting) this.starting = undefined
    })
    this.starting = starting
    return starting
  }

  private async startOnce(): Promise<void> {
    try { await this.discover(); return } catch {}
    await this.access.install()
    await this.access.activate()
    const deadline = Date.now() + 30000
    while (Date.now() < deadline) {
      try { await this.discover(); return } catch {}
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    throw new Error('当前后台未就绪或版本未确认。请先停止旧后台后重新启动，不会自动中断已有任务')
  }
}
