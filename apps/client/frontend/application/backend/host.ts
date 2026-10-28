import type { BackendHost } from './connection'
import type { BackendInfo } from '../../infrastructure/host/protocol'
import { hostAccess, watchBackendStatus } from '../../infrastructure/host/control'
import { BackendService } from './service'
import { discoverLegacyBackend, startLegacyBackend } from './legacy'

const service = new BackendService(hostAccess)
export { watchBackendStatus }

export function usesHostControl(): boolean { return hostAccess.development || hostAccess.available() }

export async function startBackend(): Promise<void> {
  if (!usesHostControl()) { await startLegacyBackend(); return }
  await service.prepare(true)
  await hostAccess.ensure('userStart')
}

export async function unregisterBackend(): Promise<void> {
  if (!usesHostControl()) throw new Error('当前入口不使用 App 后台服务')
  await service.unregister()
}

export async function backendInfo(): Promise<BackendInfo> {
  try {
    if (!usesHostControl()) return { url: await discoverLegacyBackend() }
    await service.prepare(false)
    await hostAccess.ensure('attach')
    return await hostAccess.info()
  } catch (error) {
    throw new Error(`未发现可连接后台：${error instanceof Error ? error.message : String(error)}。可点击「启动官方后台」或重新发现。`)
  }
}
export async function launchUrl(): Promise<string> { return (await backendInfo()).url }
export const backendHost: BackendHost = {
  discover: backendInfo, watch: watchBackendStatus, start: startBackend, unregister: unregisterBackend,
}
