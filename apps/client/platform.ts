import { homedir } from 'os'
import { readFile } from 'fs/promises'
import process, { run } from 'process'
import launch from './launch.json'

const home = launch.home || `${homedir()}/.dsh-bot-nsh`
export async function discovery(): Promise<string> {
  const value: unknown = JSON.parse(await readFile(`${home}/connection.json`, 'utf8'))
  if (!value || typeof value !== 'object' || !('url' in value) || typeof value.url !== 'string') throw new Error('后台连接信息无效')
  return value.url
}
export async function startBackend(): Promise<void> {
  if (process.platform !== 'macos' && launch.packaged) throw new Error('此安装包仅支持 macOS')
  const directory = decodeURIComponent(new URL('.', import.meta.url).pathname)
  // Probe before LaunchServices: open only confirms that the helper was dispatched.
  const check = await run('/bin/sh', ['-c', launch.launcher, 'dsh-bot-node', 'check'], { timeoutMs: 15000 })
  if (check.code !== 0) throw new Error(check.stderr.trim() || '未找到可用的 Node，请安装 Node 24.9.0 或更新稳定版后重新检测。')
  const record = check.stdout.split('\n').findLast(line => line.startsWith('DSH_BOT_NODE:'))
  if (!record) throw new Error('未能确认本机 Node 环境，请检查终端中的 node 后重新检测。')
  const detected = JSON.parse(record.slice('DSH_BOT_NODE:'.length)) as { path: string; version: string }
  console.info(`Runner 使用 Node ${detected.version}：${detected.path}`)
  const output = launch.packaged
    ? await run('/usr/bin/open', ['-g', '-a', `${directory}Runner.app`])
    : await run('/bin/sh', ['-c', launch.launcher, 'dsh-bot-node', 'start', launch.service, home], { timeoutMs: 15000 })
  if (output.code !== 0) throw new Error(output.stderr || '后台启动失败')
}
export const defaultDirectory = homedir()
