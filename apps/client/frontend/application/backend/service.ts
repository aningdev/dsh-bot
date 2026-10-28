import { checkServiceResult, decodeServiceStatus } from '../../infrastructure/host/protocol'

/** OS adapters provide facts and operations; this module owns the product policy. */
export interface ServiceAccess {
  development: boolean
  service(operation: 'status' | 'register' | 'unregister'): Promise<string>
  legacyInstalled(): Promise<boolean>
  reachable(): Promise<boolean>
  activate(): Promise<void>
  stop(): Promise<void>
}

export class BackendService {
  constructor(private readonly access: ServiceAccess) {}

  async prepare(explicit: boolean): Promise<void> {
    if (await this.access.legacyInstalled()) throw new Error('检测到旧后台服务，请先停止并移除 dev.dshbot.backend LaunchAgent，确认旧进程已退出后重试；迁移步骤见 README')
    if (this.access.development) return
    let state = decodeServiceStatus(await this.access.service('status'))
    if (explicit && state.status === 'notRegistered') state = decodeServiceStatus(await this.access.service('register'))
    switch (state.status) {
      case 'enabled': break
      case 'notRegistered': throw new Error('请明确启动后台；首次启动将登记 DSH Bot 后台项目')
      case 'requiresApproval': throw new Error('请在系统设置 → 通用 → 登录项与扩展中允许 DSH Bot 后台项目，再重试')
      case 'unsupported': throw new Error('应用关联后台项目需要 macOS 13 或更高版本')
      default: throw new Error(state.error ?? '系统后台项目不可用，请重新安装或登记')
    }
    if (await this.access.reachable()) return
    // Restoring approval alone must never resurrect the backend.
    if (!explicit) throw new Error('后台宿主当前未运行；请明确启动后台')
    await this.access.activate()
    const deadline = Date.now() + 15000
    while (!await this.access.reachable()) {
      if (Date.now() >= deadline) throw new Error('后台宿主未启动；请确认官方 dsh 已安装，并检查后台日志')
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  async unregister(): Promise<void> {
    if (this.access.development) throw new Error('开发宿主未登记 App 后台服务，请在宿主终端退出')
    // A missing endpoint is allowed; an unconfirmed stop must block unregister.
    if (await this.access.reachable()) await this.access.stop()
    checkServiceResult(await this.access.service('unregister'))
  }
}
