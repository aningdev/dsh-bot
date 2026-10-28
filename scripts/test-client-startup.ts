import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

if (process.platform !== 'darwin') throw new Error('The startup smoke test requires macOS')
const parent = join(homedir(), '.dsh-bot-e2e')
await mkdir(parent, { recursive: true })
const root = await mkdtemp(join(parent, 'startup-'))
const child = spawn('nsh', ['run', 'tests/startup-probe.tsx', '--target', 'macos', '--port', String(20000 + Math.floor(Math.random() * 30000)), '--name', 'DSH startup smoke test'], {
  cwd: resolve('apps/client'), detached: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, DSH_BOTS_HOME: root, DSH_HOST_SOCKET: '', DSH_E2E_FAULT: '', DSH_SPIKE_URL: '' },
})
const exited = new Promise<void>(resolve => child.once('close', () => resolve()))
function signalGroup(signal: NodeJS.Signals) {
  if (!child.pid) return
  try { process.kill(-child.pid, signal) } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error }
}
let deadline: ReturnType<typeof setTimeout> | undefined
try {
  await new Promise<void>((resolve, reject) => {
    let output = ''
    const receive = (chunk: Buffer) => {
      output = (output + chunk.toString()).slice(-16000)
      if (output.includes('[dsh-startup] ready')) resolve()
      else if (/bundle failed|hot update failed|\[dsh-startup\] failed/.test(output)) reject(new Error(output))
    }
    child.stdout!.on('data', receive)
    child.stderr!.on('data', receive)
    child.once('error', reject)
    child.once('exit', code => reject(new Error(`Startup host exited (${code})\n${output}`)))
    deadline = setTimeout(() => reject(new Error(`Startup timed out\n${output}`)), 60000)
  })
  console.log('PASS macOS development bundle: application mounted and isolated registry environment preserved')
} finally {
  clearTimeout(deadline)
  signalGroup('SIGINT')
  let cleanup: ReturnType<typeof setTimeout> | undefined
  await Promise.race([exited, new Promise<void>(resolve => { cleanup = setTimeout(resolve, 3000) })])
  clearTimeout(cleanup)
  signalGroup('SIGKILL')
  await exited
  await rm(root, { recursive: true, force: true })
}
