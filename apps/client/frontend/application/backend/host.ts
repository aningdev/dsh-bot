import type { BackendHost } from './connection'
import type { BackendInfo } from '../../infrastructure/host/protocol'
import { hostAccess, watchBackendStatus } from '../../infrastructure/host/control'
import { BackendService } from './service'

const service = new BackendService(hostAccess)
export { watchBackendStatus }

export function canUnregisterBackend(): boolean { return !hostAccess.development && hostAccess.available() }

export async function startBackend(): Promise<void> {
  await service.prepare(true)
  await hostAccess.ensure('userStart')
}

export async function unregisterBackend(): Promise<void> {
  await service.unregister()
}

export async function backendInfo(): Promise<BackendInfo> {
  try {
    await service.prepare(false)
    await hostAccess.ensure('attach')
    return await hostAccess.info()
  } catch (error) {
    throw new Error(`未发现可连接后台：${error instanceof Error ? error.message : String(error)}。可点击「启动官方后台」或重新发现。`)
  }
}
export const backendHost: BackendHost = {
  discover: backendInfo, watch: watchBackendStatus, start: startBackend, unregister: unregisterBackend,
}
