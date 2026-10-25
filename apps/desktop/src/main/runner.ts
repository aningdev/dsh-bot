import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

import { app } from 'electron'

import { APP_CONFIG } from '@/shared/app-config'

import { RunnerClient } from './runner-client'
import { RunnerError, runnerHome } from './runner-connection'
import { installPackagedRuntime } from './runner-runtime'
import { RunnerService } from './runner-service'

// No filesystem or network access until an IPC operation asks for a connection.
export const runnerClient = new RunnerClient({ home: () => runnerHome(app.getPath('userData')) })

/** Reuse a reachable Runner before installing the bundled local service. */
export async function startLocalRunner(): Promise<void> {
  try {
    await runnerClient.list()
    return
  } catch {
    await getRunnerService().autoStart()
  }
}

let service: RunnerService | undefined
export function getRunnerService(): RunnerService {
  if (process.platform !== 'darwin') throw new RunnerError('后台服务管理目前仅支持 macOS。')
  if (service) return service
  const home = runnerHome(app.getPath('userData'))
  const root = process.env.DSH_BOT_RUNTIME_ROOT ?? path.join(process.resourcesPath, 'runner')
  const suffix = createHash('sha256').update(home).digest('hex').slice(0, 12)
  const uid = process.getuid?.()
  if (!uid) throw new RunnerError('请以当前桌面用户管理后台服务。')
  let prepared: ReturnType<typeof installPackagedRuntime> | undefined
  const prepareRuntime = () =>
    (prepared ??= installPackagedRuntime(root, home).catch((error: unknown) => {
      prepared = undefined
      throw error
    }))
  service = new RunnerService({
    home,
    loginDirectory: path.join(homedir(), 'Library/LaunchAgents'),
    label: APP_CONFIG.appId + '.runner.' + suffix,
    uid,
    runtime: {
      node: path.join(root, 'bin/node'),
      entry: path.join(root, 'apps/runner/lib/index.js'),
    },
    prepareRuntime,
    waitReady: async () => {
      const deadline = Date.now() + 35_000
      for (;;) {
        try {
          await runnerClient.list()
          return
        } catch (error) {
          if (Date.now() >= deadline) throw error
          await delay(100)
        }
      }
    },
  })
  return service
}
