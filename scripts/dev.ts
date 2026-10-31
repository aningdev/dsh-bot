import { spawn, type ChildProcess } from 'node:child_process'
import { connect } from 'node:net'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const defaultSocket = join(homedir(), '.dsh-bot/host/control.sock')
const socket = process.env.DSH_HOST_SOCKET || defaultSocket
let host: ChildProcess | undefined
let client: ChildProcess | undefined
let stopping = false

// Probe only the public Host status, never connectionInfo or authentication data.
function probe(): Promise<'ready' | 'missing' | 'invalid'> {
  return new Promise(resolveProbe => {
    const connection = connect(socket)
    let result = ''
    let settled = false
    const finish = (value: 'ready' | 'missing' | 'invalid') => {
      if (settled) return
      settled = true
      connection.destroy()
      resolveProbe(value)
    }
    connection.setTimeout(1500, () => finish('invalid'))
    connection.on('error', error => finish(['ENOENT', 'ECONNREFUSED'].includes((error as NodeJS.ErrnoException).code ?? '') ? 'missing' : 'invalid'))
    connection.on('connect', () => connection.write(JSON.stringify({ version: 1, id: 'dev-probe', operation: 'status' }) + '\n'))
    connection.on('data', chunk => {
      result += chunk.toString()
      if (result.length > 16384) return finish('invalid')
      if (!result.includes('\n')) return
      try {
        const response = JSON.parse(result.split('\n')[0]!)
        finish(response.version === 1 && response.id === 'dev-probe' && response.ok === true && typeof response.value?.phase === 'string' ? 'ready' : 'invalid')
      } catch { finish('invalid') }
    })
    connection.on('end', () => finish('invalid'))
  })
}
function run(program: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): ChildProcess {
  return spawn(program, args, { cwd: options.cwd ?? root, env: options.env ?? process.env, stdio: 'inherit' })
}
function completed(child: ChildProcess): Promise<number> {
  return new Promise(resolveExit => {
    child.once('error', error => { console.error(error.message); resolveExit(1) })
    child.once('exit', code => resolveExit(code ?? 1))
  })
}
async function stopOwnedHost() {
  if (!host || host.exitCode !== null || host.signalCode !== null) return
  const done = completed(host)
  host.kill('SIGTERM')
  await done
}
async function main() {
  const existing = await probe()
  if (existing === 'invalid') throw new Error('宿主控制端点不可用或协议不兼容，请检查后重试')
  if (existing === 'missing') {
    if (socket !== defaultSocket) throw new Error('指定的开发宿主未运行，请先启动该宿主或移除 DSH_HOST_SOCKET')
    console.log('正在构建并启动开发 Host…')
    if (await completed(run('cargo', ['build', '--manifest-path', 'apps/host/Cargo.toml', '--bin', 'dsh-host'])) !== 0) throw new Error('开发 Host 构建失败')
    if (stopping) return
    // Recheck after the build to avoid starting a second host if another launcher won.
    const afterBuild = await probe()
    if (afterBuild === 'invalid') throw new Error('宿主控制端点不可用或协议不兼容')
    if (afterBuild === 'missing') {
      host = run(join(root, 'target/debug/dsh-host'), ['serve-app'], {
        env: {
          ...process.env,
          DSH_BOT_COMPOSITION_PLUGIN: join(root, 'packages/dsh-plugin-bot-composition'),
        },
      })
      const exit = completed(host)
      let exited = false
      void exit.then(() => { exited = true })
      const deadline = Date.now() + 15000
      while (true) {
        if (exited) throw new Error('开发 Host 启动失败，请检查上方错误')
        const state = await probe()
        if (state === 'ready') break
        if (state === 'invalid') throw new Error('开发 Host 控制端点不可用')
        if (Date.now() >= deadline) throw new Error('等待开发 Host 超时')
        await new Promise(resolveDelay => setTimeout(resolveDelay, 50))
      }
      void exit.then(() => {
        if (!stopping) { console.error('开发 Host 已退出'); client?.kill('SIGTERM'); process.exitCode = 1 }
      })
    }
  }
  if (stopping) return
  console.log('开发 Host 已就绪；在客户端中明确启动官方后台。')
  client = run('bun', ['run', '--cwd', 'apps/client', 'dev'], { env: { ...process.env, DSH_HOST_SOCKET: socket } })
  const result = await completed(client)
  client = undefined
  if (result !== 0 && !stopping) process.exitCode = result
  if (host && host.exitCode === null && host.signalCode === null && !stopping) {
    console.log('客户端已退出；开发 Host 继续运行。按 Ctrl+C 停止本次启动的 Host。')
    await new Promise<void>(resolveWait => { host!.once('exit', () => resolveWait()); process.once('SIGINT', () => resolveWait()); process.once('SIGTERM', () => resolveWait()) })
  }
}
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => {
  stopping = true
  client?.kill(signal)
  void stopOwnedHost()
})
try { await main() } catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
} finally { stopping = true; await stopOwnedHost() }
