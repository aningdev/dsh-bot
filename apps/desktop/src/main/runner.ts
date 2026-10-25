import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import path from 'node:path'

import { app } from 'electron'

import { APP_CONFIG } from '@/shared/app-config'

import { RunnerClient } from './runner-client'
import { RunnerError, runnerHome } from './runner-connection'
import { RunnerService } from './runner-service'

// No filesystem or network access until an IPC operation asks for a connection.
export const runnerClient = new RunnerClient({ home: () => runnerHome(app.getPath('userData')) })

let service: RunnerService | undefined
export function getRunnerService(): RunnerService {
  if (process.platform !== 'darwin') throw new RunnerError('后台服务管理目前仅支持 macOS。')
  if (service) return service
  const home = runnerHome(app.getPath('userData'))
  const root = process.env.DSH_BOT_RUNTIME_ROOT ?? path.join(process.resourcesPath, 'runner')
  const suffix = createHash('sha256').update(home).digest('hex').slice(0, 12)
  const uid = process.getuid?.()
  if (!uid) throw new RunnerError('请以当前桌面用户管理后台服务。')
  service = new RunnerService({
    home,
    loginDirectory: path.join(homedir(), 'Library/LaunchAgents'),
    label: APP_CONFIG.appId + '.runner.' + suffix,
    uid,
    runtime: {
      node: path.join(root, 'bin/node'),
      entry: path.join(root, 'apps/runner/lib/index.js'),
    },
  })
  return service
}
