import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { startModelFixture } from './model-fixture'

const home = await mkdtemp(join(tmpdir(), 'dsh-nsh-connect-'))
const workspace = join(home, 'workspace')
await mkdir(workspace)
const model = await startModelFixture()
const host = spawn('dsh', ['web', '--host', '127.0.0.1', '--port', '0', '--no-open'], {
  cwd: workspace,
  env: { ...process.env, DSH_HOME: home, DSH_AGENTS_HOME: join(home, 'agents'),
    DEEPSEEK_BASE_URL: model.baseUrl, DEEPSEEK_API_KEY: 'nsh-fixture-key', DSH_PERMISSION_MODE: 'workspace-write' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let testProcess: ChildProcess | undefined
let hostOutput = ''
const deadline = setTimeout(() => {
  console.error('Connectivity probe exceeded its build/run deadline')
  process.exitCode = 1
  host.kill('SIGKILL')
  testProcess?.kill('SIGKILL')
}, 900000)
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return
  const exited = new Promise<void>(resolve => child.once('exit', () => resolve()))
  child.kill('SIGTERM')
  const force = setTimeout(() => child.kill('SIGKILL'), 5000)
  try { await exited } finally { clearTimeout(force) }
}
try {
  const login = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Official web ready timeout')), 30000)
    const receive = (chunk: Buffer) => {
      hostOutput = (hostOutput + chunk.toString()).slice(-24000)
      const found = hostOutput.match(/dsh web: (http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+)/)
      if (found) { clearTimeout(timer); resolve(found[1]) }
    }
    host.stdout!.on('data', receive)
    host.stderr!.on('data', receive)
    host.once('error', error => { clearTimeout(timer); reject(error) })
    host.once('exit', code => { clearTimeout(timer); reject(new Error(`Official web exited: ${code}`)) })
  })
  console.log('Official web ready on loopback; token=<redacted>')
  // Negative path: an unsupported credential must fail explicitly and hand back no Cookie.
  const rejected = await fetch(new URL('/connect?token=nsh-invalid-token', login).toString(), { redirect: 'manual' })
  if (rejected.status === 302 || rejected.headers.get('set-cookie')) throw new Error(`Invalid token was accepted: ${rejected.status}`)
  console.log('Invalid token rejected explicitly; status=' + rejected.status + '; no Cookie issued')
  const url = new URL(login)
  url.searchParams.set('workspace', workspace)
  testProcess = spawn('nsh', ['test', 'App.test.tsx', '--verbose'], {
    cwd: import.meta.dir,
    env: { ...process.env, DSH_SPIKE_URL: url.toString() }, stdio: 'inherit',
  })
  const code = await new Promise<number>((resolve, reject) => {
    testProcess!.once('error', reject)
    testProcess!.once('exit', code => resolve(code ?? 1))
  })
  if (code !== 0) throw new Error(`NSH probe exited ${code}`)
  model.verify()
} catch (error) {
  console.error(String(error))
  console.error(hostOutput.replace(/token=[A-Za-z0-9_-]+/g, 'token=<redacted>'))
  process.exitCode = 1
} finally {
  clearTimeout(deadline)
  if (testProcess) await stop(testProcess)
  await stop(host)
  await model.close()
  await rm(home, { recursive: true, force: true })
}
