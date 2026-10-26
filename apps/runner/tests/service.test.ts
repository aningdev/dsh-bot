import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readlink, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean, timeout = 20_000): Promise<T> {
  const end = Date.now() + timeout
  let last: unknown
  while (Date.now() < end) {
    try { const value = await read(); if (accept(value)) return value } catch (error) { last = error }
    await delay(100)
  }
  throw new Error(`监督进程等待超时：${String(last ?? '')}`)
}
function alive(pid: number) { try { process.kill(pid, 0); return true } catch { return false } }

test('supervisor: concurrent starts, worker crash recovery, authenticated shutdown', { timeout: 60_000 }, async () => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-bot-supervisor-'))
  let supervisor: number | undefined
  let worker: number | undefined
  const info = async () => JSON.parse(await readFile(join(home, 'connection.json'), 'utf8')) as { pid: number; url: string }
  async function start() {
    const child = spawn(process.execPath, [resolve('dist/service.js'), 'start', home], { stdio: 'pipe' })
    let errors = ''
    child.stderr!.on('data', data => { errors += data })
    const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
    assert.equal(code, 0, errors)
  }
  try {
    const links = join(home, 'profiles/dsh-bot/node_modules/@dsh-bot')
    await mkdir(links, { recursive: true })
    for (const name of ['runner', 'harness-runtime']) await symlink('/obsolete-dsh-bot-install', join(links, name))
    await Promise.all([start(), start(), start()])
    supervisor = await until(async () => JSON.parse(await readFile(join(home, 'supervisor.json'), 'utf8')).pid as number, Number.isSafeInteger)
    const first = await until(info, value => alive(value.pid))
    worker = first.pid
    assert.ok(alive(supervisor))
    assert.equal(await readlink(join(links, 'runner')), resolve('.') + '/')
    assert.notEqual(await readlink(join(links, 'harness-runtime')), '/obsolete-dsh-bot-install')
    process.kill(worker, 'SIGKILL')
    const recovered = await until(info, value => value.pid !== worker && alive(value.pid))
    worker = recovered.pid
    assert.equal(JSON.parse(await readFile(join(home, 'supervisor.json'), 'utf8')).pid, supervisor)
    await start()
    assert.equal(JSON.parse(await readFile(join(home, 'supervisor.json'), 'utf8')).pid, supervisor)
    const login = await fetch(recovered.url, { redirect: 'manual' })
    assert.equal(login.status, 303)
    const cookie = login.headers.get('set-cookie')!.split(';')[0]!
    const response = await fetch(new URL('/api/bot/shutdown', recovered.url), {
      method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: '{}',
    })
    assert.equal(response.status, 200)
    await until(async () => !alive(supervisor!) && !alive(worker!), Boolean)
  } finally {
    if (supervisor && alive(supervisor)) process.kill(supervisor, 'SIGTERM')
    if (worker && alive(worker)) process.kill(worker, 'SIGTERM')
    if (supervisor) await until(async () => !alive(supervisor!), Boolean).catch(() => undefined)
    await rm(home, { recursive: true, force: true })
  }
})
