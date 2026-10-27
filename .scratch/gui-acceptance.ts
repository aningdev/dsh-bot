import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { startModelFixture } from '../apps/client/tests/model-fixture'
const root = await mkdtemp(join(tmpdir(), 'dsh-packaged-gui-'))
const home = join(root, 'dsh-home'), workspace = join(homedir(), '.dsh-bot-e2e-workspace')
const bots = join(homedir(), '.dsh-bot-e2e')
await mkdir(home, { recursive: true }); await mkdir(workspace, { recursive: true }); await mkdir(bots, { recursive: true })
const model = await startModelFixture()
const backend = spawn('dsh', ['web', '--host', '127.0.0.1', '--port', '0', '--no-open'], {
  cwd: workspace, env: { ...process.env, DSH_HOME: home, DSH_AGENTS_HOME: join(home, 'agents'), DEEPSEEK_BASE_URL: model.baseUrl, DEEPSEEK_API_KEY: 'nsh-fixture-key', DSH_PERMISSION_MODE: 'workspace-write' }, stdio: ['ignore', 'pipe', 'pipe'],
})
let buffer = ''
const url = await new Promise<string>((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('ready timeout')), 60000)
  backend.once('exit', () => { clearTimeout(timer); reject(new Error('backend exited before ready')) })
  const read = (chunk: Buffer) => {
    buffer += chunk.toString()
    const match = /dsh web: (http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+)/.exec(buffer)
    if (match) { clearTimeout(timer); resolve(match[1]!) }
  }
  backend.stdout?.on('data', read); backend.stderr?.on('data', read)
})
const app = spawn(resolve('dist/macos/DSH Bot.app/Contents/MacOS/DSHBot'), [], { env: { ...process.env, DSH_SPIKE_URL: url, DSH_BOTS_HOME: bots }, stdio: ['ignore', 'ignore', 'ignore'] })
await writeFile('/tmp/dsh-gui-pids.json', JSON.stringify({ driver: process.pid, app: app.pid, backend: backend.pid, workspace }))
console.log('Packaged GUI ready; isolated fixture active; authentication URL kept in memory')
let closing = false
async function close() {
  if (closing) return
  closing = true
  app.kill('SIGTERM')
  backend.kill('SIGTERM')
  await model.close().catch(() => undefined)
  await rm(root, { recursive: true, force: true })
  await rm(bots, { recursive: true, force: true })
  await rm(workspace, { recursive: true, force: true })
  process.exit(0)
}
process.on('SIGTERM', () => { void close() })
process.on('SIGINT', () => { void close() })
