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
  const output = launch.packaged
    ? await run('/usr/bin/open', ['-g', '-a', `${directory}Runner.app`])
    : await run(launch.node, [launch.service, 'start', home])
  if (output.code !== 0) throw new Error(output.stderr || '后台启动失败')
}
export const defaultDirectory = homedir()
