import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rename, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const app = resolve('dist/macos/DSH Bot.app')
const temporary = await mkdtemp(join(tmpdir(), 'dsh-bot-package-smoke-'))
const relocated = join(temporary, 'DSH Bot.app')
const test = resolve('apps/runner/tests/service.test.ts')
await rename(app, relocated)
try {
  const runtime = join(relocated, 'Contents/Resources/nsh/Runner.app/Contents/Resources/runtime')
  const child = spawn(join(runtime, 'bin/node'), ['--test', test], {
    cwd: join(runtime, 'apps/runner'), stdio: 'inherit',
    env: { HOME: process.env.HOME, TMPDIR: process.env.TMPDIR, PATH: '/usr/bin:/bin', LANG: 'en_US.UTF-8' },
  })
  const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  if (code !== 0) throw new Error(`成品后台验收失败：${code}`)
  const home = join(temporary, 'helper-home')
  await mkdir(home)
  let supervisor: number | undefined
  const alive = (pid: number) => { try { process.kill(pid, 0); return true } catch { return false } }
  async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean): Promise<T> {
    const end = Date.now() + 20_000
    while (Date.now() < end) {
      try { const value = await read(); if (accept(value)) return value } catch {}
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error('macOS 后台助手启动或停止超时')
  }
  try {
    const open = spawn('/usr/bin/open', ['-g', '-n', '-a', join(relocated, 'Contents/Resources/nsh/Runner.app'),
      '--env', `DSH_BOT_HOME=${home}`, '--env', 'PATH=/usr/bin:/bin'], { stdio: 'inherit' })
    const result = await new Promise<number | null>((resolve, reject) => { open.once('exit', resolve); open.once('error', reject) })
    if (result !== 0) throw new Error(`macOS open 失败：${result}`)
    supervisor = await until(async () => JSON.parse(await readFile(join(home, 'supervisor.json'), 'utf8')).pid as number, Number.isSafeInteger)
    const info = await until(async () => JSON.parse(await readFile(join(home, 'connection.json'), 'utf8')) as { url: string }, value => !!value.url)
    const login = await fetch(info.url, { redirect: 'manual' })
    if (login.status !== 303) throw new Error(`后台助手认证失败：${login.status}`)
    const cookie = login.headers.get('set-cookie')!.split(';')[0]!
    const stop = await fetch(new URL('/api/bot/shutdown', info.url), { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: '{}' })
    if (stop.status !== 200) throw new Error(`后台助手停止失败：${stop.status}`)
    await until(async () => !alive(supervisor!), Boolean)
  } catch (error) {
    try { console.error(await readFile(join(home, 'runner.log'), 'utf8')) } catch {}
    throw error
  } finally {
    if (supervisor && alive(supervisor)) { process.kill(supervisor, 'SIGTERM'); await until(async () => !alive(supervisor!), Boolean) }
  }
  console.info('成品后台已通过迁移目录、受限 PATH、认证、异常恢复、主动停止、旧路径更新与 macOS 后台助手启动验收。')
} finally {
  await rename(relocated, app)
  await rm(temporary, { recursive: true, force: true })
}
