import { HostControl } from 'dsh-client/native'
import { exists } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'
import { run } from 'process'
import { decodeBackendInfo, decodeHostStatus, type HostStatus } from './protocol'
import { launchTarget } from './launchd'
// NSH dev bundles wrap default module imports; metadata belongs to the runtime global.
export const hostAccess = {
  development: !!globalThis.process.env.DSH_HOST_SOCKET,
  available: () => HostControl.serviceAvailable(),
  service: (operation: string) => HostControl.service(operation),
  reachable: () => HostControl.reachable(),
  legacyInstalled: async () => {
    if (await exists(join(homedir(), 'Library/LaunchAgents/dev.dshbot.backend.plist'))) return true
    return (await run('/bin/launchctl', ['print', (await launchTarget('dev.dshbot.backend')).job], { timeoutMs: 10000 })).code === 0
  },
  activate: async () => {
    const result = await run('/bin/launchctl', ['kickstart', (await launchTarget('dev.dsh-bot.host')).job], { timeoutMs: 10000 })
    if (result.code !== 0) throw new Error('无法启动已注册的后台宿主，请检查系统后台项目')
  },
  stop: async () => { decodeHostStatus(await HostControl.request('stopDsh', '')) },
  ensure: async (cause: string) => { decodeHostStatus(await HostControl.request('ensureDsh', cause)) },
  info: async () => decodeBackendInfo(await HostControl.request('connectionInfo', '')),
}

export async function watchBackendStatus(listener: (status: HostStatus) => void): Promise<() => void> {
  if (!(hostAccess.development || hostAccess.available())) return () => {}
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
