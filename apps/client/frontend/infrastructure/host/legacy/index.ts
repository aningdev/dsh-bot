import { homedir } from 'os'
import { join } from 'path'
import { run as runProcess } from 'process'
import { readLaunchLog } from './discovery'
import { installLegacyBackend } from './installation'
import { launchTarget } from '../launchd'
export { expectedVersion } from './assets'

const label = 'dev.dshbot.backend'
const home = homedir()
const paths = {
  root: join(home, '.dsh-bot'),
  logs: join(home, 'Library/Logs/dsh-bot'),
  agents: join(home, 'Library/LaunchAgents'),
}

async function run(command: string, args: string[]) {
  return runProcess(command, args, { timeoutMs: 10000 })
}

async function inspectJob(): Promise<string | undefined> {
  const result = await run('/bin/launchctl', ['print', (await launchTarget(label)).job])
  if (result.code === 0) return result.stdout
  if (result.stderr.includes('Could not find service')) return undefined
  throw new Error('无法查询旧后台的系统登记状态')
}

async function activate(): Promise<void> {
  const { domain, job } = await launchTarget(label)
  const loaded = await inspectJob()
  if (loaded !== undefined && /^\s*pid = \d+\s*$/m.test(loaded)) return
  const result = loaded === undefined
    ? await run('/bin/launchctl', ['bootstrap', domain, join(paths.agents, `${label}.plist`)])
    : await run('/bin/launchctl', ['kickstart', job])
  if (result.code !== 0) throw new Error('后台启动失败，请检查后台日志')
}

export const legacyAccess = {
  readLog: async () => {
    try { return await readLaunchLog(join(paths.logs, 'backend.log')) } catch (error) {
      if ((error as { code?: string }).code === 'ENOENT') throw new Error('请点击启动官方后台')
      throw error
    }
  },
  inspectJob,
  install: () => installLegacyBackend(paths),
  activate,
}
