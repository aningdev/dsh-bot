import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Context } from '@deepseek-ai/cordis'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import { installConnection } from '@deepseek-ai/dsh-client-connection/client'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import BotRemote from '@dsh-bot/bot/remote'
import { afterEach, expect } from 'vite-plus/test'
import WebSocket from 'ws'

/** Own independent process, client, and data resources for one test file. */
export function runnerHarness() {
  const homes: string[] = []
  const children: ChildProcess[] = []
  const clients: Context[] = []
  const appRoot = fileURLToPath(new URL('../../', import.meta.url))

  interface Probe {
    readonly type: 'compatibility'
    readonly event: string
    readonly sessionId: string
    readonly detail: string
  }
  interface Ready {
    type: 'ready'
    origin: string
    connectUrl: string
  }
  async function start(
    home: string,
    mock = true,
    patches: readonly string[] = [],
  ): Promise<{ child: ChildProcess; ready: Ready; probes: Probe[] }> {
    const child = spawn(
      process.execPath,
      [
        '--expose-internals',
        appRoot + 'lib/index.js',
        '--home',
        home,
        ...(mock ? ['--patch', appRoot + 'tests/fixtures/model.overlay.yml'] : []),
        ...patches.flatMap((path) => ['--patch', path]),
      ],
      {
        cwd: appRoot,
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        env: { ...process.env, DEEPSEEK_API_KEY: '', DSH_TELEMETRY_DISABLED: '1' },
      },
    )
    children.push(child)
    const probes: Probe[] = []
    child.on('message', (message: unknown) => {
      if (
        typeof message !== 'object' ||
        message === null ||
        !('type' in message) ||
        message.type !== 'compatibility'
      )
        return
      if (
        'event' in message &&
        typeof message.event === 'string' &&
        'sessionId' in message &&
        typeof message.sessionId === 'string' &&
        'detail' in message &&
        typeof message.detail === 'string'
      )
        probes.push({
          type: 'compatibility',
          event: message.event,
          sessionId: message.sessionId,
          detail: message.detail,
        })
    })
    let stderr = ''
    child.stderr!.on('data', (chunk) => {
      stderr = (stderr + String(chunk)).slice(-16000)
    })
    const ready = await new Promise<Ready>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Runner readiness timed out: ' + stderr))
      }, 15000)
      child.once('error', reject)
      child.once('exit', (code) => {
        clearTimeout(timer)
        reject(new Error(`Runner exited ${code}: ${stderr}`))
      })
      child.on('message', (message: unknown) => {
        if (typeof message !== 'object' || message === null || !('type' in message)) return
        if (
          message.type === 'ready' &&
          'origin' in message &&
          'connectUrl' in message &&
          typeof message.origin === 'string' &&
          typeof message.connectUrl === 'string'
        ) {
          clearTimeout(timer)
          resolve({ type: 'ready', origin: message.origin, connectUrl: message.connectUrl })
        }
        if (message.type === 'fatal') {
          clearTimeout(timer)
          reject(new Error(JSON.stringify(message) + '\n' + stderr))
        }
      })
    })
    return { child, ready, probes }
  }
  async function stop(
    child: ChildProcess,
  ): Promise<{ code: number | null; acknowledged: boolean }> {
    if (child.exitCode !== null || child.signalCode !== null)
      return { code: child.exitCode, acknowledged: false }
    const exit = once(child, 'exit')
    let acknowledged = false
    child.on('message', (message: unknown) => {
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message.type === 'shutdown-complete'
      )
        acknowledged = true
    })
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
    }, 10000)
    try {
      if (child.connected)
        child.send({ type: 'shutdown' }, (error) => {
          if (error !== null) child.kill('SIGTERM')
        })
      else child.kill('SIGTERM')
      const [code] = await exit
      return { code, acknowledged }
    } finally {
      clearTimeout(timer)
    }
  }
  async function connect(ready: Ready): Promise<Context> {
    const response = await fetch(ready.connectUrl, { redirect: 'manual' })
    expect(response.status).toBe(302)
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    await response.body?.cancel()
    if (cookie === undefined) throw new Error('Runner did not provide an API cookie')
    const ctx = new Context()
    clients.push(ctx)
    installConnection(ctx, {
      interactions: 'none',
      transport: {
        streamBaseUrl: ready.origin,
        fetch: (input, init) =>
          fetch(new URL(input, ready.origin), {
            ...init,
            headers: { ...Object.fromEntries(new Headers(init.headers)), cookie },
          }),
        createWebSocket: (url) => new WebSocket(url, { headers: { cookie } }),
      },
    })
    await ctx.plugin(TypertRegistry)
    await ctx.plugin(Gateway)
    await ctx.remote.$mount(BotRemote)
    return ctx
  }
  async function home(): Promise<string> {
    const directory = await mkdtemp(join(tmpdir(), 'dsh-runner-contract-'))
    homes.push(directory)
    return directory
  }
  afterEach(async () => {
    const disconnected = await Promise.allSettled(
      clients.splice(0).map((ctx) => ctx.fiber.dispose()),
    )
    const stopped = await Promise.allSettled(
      children.splice(0).map(async (child) => {
        const acknowledgementRequired =
          child.connected && child.exitCode === null && child.signalCode === null
        const result = await stop(child)
        if (result.code !== 0 || (acknowledgementRequired && !result.acknowledged))
          throw new Error(
            `Runner cleanup failed: code=${String(result.code)}, acknowledged=${String(result.acknowledged)}`,
          )
      }),
    )
    const removed = await Promise.allSettled(
      homes.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
    )
    const failures = [...disconnected, ...stopped, ...removed].flatMap((result) =>
      result.status === 'rejected' ? [result.reason] : [],
    )
    if (failures.length > 0) throw new AggregateError(failures, 'Runner test cleanup failed')
  })

  return { start, stop, connect, home }
}
