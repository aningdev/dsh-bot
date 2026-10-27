import { HostControl, Transport } from 'dsh-client/native'
import type { BackendHost, BackendInfo, HostStatus } from './backend-connection'
import { checkServiceResult, decodeBackendInfo, decodeHostStatus } from './host-protocol'

export function usesHostControl(): boolean { return HostControl.enabled() }

export async function startBackend(): Promise<void> {
  if (!HostControl.enabled()) { await Transport.startBackend(); return }
  await HostControl.prepare(true)
  decodeHostStatus(await HostControl.request('ensureDsh', 'userStart'))
}

export async function unregisterBackend(): Promise<void> {
  if (!HostControl.enabled()) throw new Error('当前入口不使用 App 后台服务')
  checkServiceResult(await HostControl.service('unregister'))
}

export async function watchBackendStatus(listener: (status: HostStatus) => void): Promise<() => void> {
  if (!HostControl.enabled()) return () => {}
  const watch = await HostControl.watch()
  let closed = false
  void (async () => {
    try {
      while (!closed) {
        const status = decodeHostStatus(await watch.read())
        if (!closed) listener(status)
      }
    } catch (error) {
      if (!closed) listener({ phase: 'unavailable', blocked: true, reason: `后台宿主连接不可用：${error instanceof Error ? error.message : String(error)}。请重新检查` })
    } finally { watch.close() }
  })()
  return () => { closed = true; watch.close() }
}

export async function backendInfo(): Promise<BackendInfo> {
  try {
    if (!HostControl.enabled()) return { url: Transport.probeUrl() }
    await HostControl.prepare(false)
    decodeHostStatus(await HostControl.request('ensureDsh', 'attach'))
    return decodeBackendInfo(await HostControl.request('connectionInfo', ''))
  } catch (error) {
    throw new Error(`未发现可连接后台：${error instanceof Error ? error.message : String(error)}。可点击「启动官方后台」或重新发现。`)
  }
}
export async function launchUrl(): Promise<string> { return (await backendInfo()).url }
export const backendHost: BackendHost = {
  discover: backendInfo, watch: watchBackendStatus, start: startBackend, unregister: unregisterBackend,
}
