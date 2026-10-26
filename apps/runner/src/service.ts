import { spawn } from 'node:child_process'
import { link, mkdir, open, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prepareRunner } from './index.ts'

const home = resolve(process.argv[3] || process.env.DSH_BOT_HOME || join(homedir(), '.dsh-bot-nsh'))
await mkdir(home, { recursive: true, mode: 0o700 })
const lock = join(home, 'supervisor.json')
function alive(pid: number): boolean {
  try { process.kill(pid, 0); return true } catch (error) { return (error as NodeJS.ErrnoException).code === 'EPERM' }
}
async function owner(): Promise<number | undefined> {
  try {
    const value: unknown = JSON.parse(await readFile(lock, 'utf8'))
    if (value && typeof value === 'object' && 'pid' in value && Number.isSafeInteger(value.pid) && Number(value.pid) > 0) return Number(value.pid)
  } catch (error) {
    if (!(error instanceof SyntaxError) && (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  return undefined
}
async function claim(): Promise<boolean> {
  // Link complete contents atomically: there is never an empty, half-written lock.
  const temporary = `${lock}.${randomUUID()}`
  await writeFile(temporary, JSON.stringify({ pid: process.pid }), { flag: 'wx', mode: 0o600 })
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      try { await link(temporary, lock); return true }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error }
      const before = await stat(lock).catch(() => undefined)
      const pid = await owner()
      if (pid && alive(pid)) return false
      const after = await stat(lock).catch(() => undefined)
      if (before && after && before.ino === after.ino) await unlink(lock).catch(error => {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      })
    }
    return false
  } finally { await unlink(temporary) }
}
if (process.argv[2] !== 'supervise') {
  const pid = await owner()
  if (pid && alive(pid)) process.exit(0)
  const log = await open(join(home, 'runner.log'), 'a', 0o600)
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), 'supervise'], {
    detached: true, stdio: ['ignore', log.fd, log.fd], env: { ...process.env, DSH_BOT_HOME: home },
  })
  await new Promise<void>((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject) })
  child.unref()
  await log.close()
} else {
  if (!await claim()) process.exit(0)
  let stopping = false
  let failures = 0
  let child: ReturnType<typeof spawn> | undefined
  const terminateGroup = () => {
    if (!child?.pid) return
    try { process.kill(-child.pid, 'SIGTERM') } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
    }
  }
  const stop = () => { stopping = true; terminateGroup() }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  try {
    const runner = await prepareRunner()
    while (!stopping) {
      const started = Date.now()
      // Supervise the actual Harness process, including subprocesses it owns.
      child = spawn(process.execPath, [runner.cli, '--profile', 'dsh-bot'], {
        detached: true, stdio: 'inherit', env: { ...process.env, DSH_HOME: home, DSH_BOT_HOME: home, DSH_BOT_SUPERVISOR_PID: String(process.pid) },
      })
      await new Promise<void>((resolve, reject) => { child!.once('exit', () => resolve()); child!.once('error', reject) })
      terminateGroup()
      child = undefined
      if (!stopping) {
        failures = Date.now() - started > 30_000 ? 0 : failures + 1
        await new Promise(resolve => setTimeout(resolve, Math.min(10_000, 500 * 2 ** Math.min(failures, 4))))
      }
    }
  } finally { if (await owner() === process.pid) await unlink(lock).catch(() => undefined) }
}
