/** Own a real, separately running profile for packaged desktop conversation tests. */
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { Context } from '@deepseek-ai/cordis'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import { installConnection } from '@deepseek-ai/dsh-client-connection/client'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import BotRemote from '@dsh-bot/bot/remote'
import WebSocket from 'ws'

/** Prepare Bot data through the public Remote; Electron still authenticates independently. */
export async function startTestRunner(existingHome?: string) {
  const home = existingHome ?? (await mkdtemp(join(tmpdir(), 'desktop-bot-runner-')))
  const root = resolve(__dirname, '../../../runner') + '/'
  const child = spawn(
    process.execPath,
    [
      '--expose-internals',
      root + 'lib/index.js',
      '--home',
      home,
      '--patch',
      root + 'tests/fixtures/model.overlay.yml',
    ],
    {
      cwd: root,
      stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
      env: { ...process.env, DEEPSEEK_API_KEY: '', DSH_TELEMETRY_DISABLED: '1' },
    },
  )
  let stderr = ''
  child.stderr?.on('data', (chunk: unknown) => {
    stderr = (stderr + String(chunk)).slice(-12000)
  })
  const client = new Context()
  let disposed = false
  const dispose = async (options: { keepHome?: boolean } = {}) => {
    if (disposed) return
    disposed = true
    const failures: unknown[] = []
    try {
      await client.fiber.dispose()
    } catch (error) {
      failures.push(error)
    }
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit')
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
      const timer = setTimeout(() => child.kill('SIGKILL'), 10000)
      try {
        if (child.connected) child.send({ type: 'shutdown' })
        else child.kill('SIGTERM')
        const [code] = await exited
        if (code !== 0 || !acknowledged)
          failures.push(new Error('Runner did not shut down cleanly: ' + stderr))
      } catch (error) {
        failures.push(error)
      } finally {
        clearTimeout(timer)
      }
    } else if (child.exitCode !== 0)
      failures.push(new Error('Runner exited unexpectedly: ' + stderr))
    try {
      if (!options.keepHome) await rm(home, { recursive: true, force: true })
    } catch (error) {
      failures.push(error)
    }
    if (failures.length > 0)
      throw new AggregateError(failures, 'Desktop Runner fixture cleanup failed')
  }
  try {
    const ready = await new Promise<{ origin: string; connectUrl: string }>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Runner readiness timed out: ' + stderr)),
        15000,
      )
      child.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      child.once('exit', () => {
        clearTimeout(timer)
        reject(new Error('Runner exited before ready: ' + stderr))
      })
      child.on('message', (message: unknown) => {
        if (typeof message !== 'object' || message === null || !('type' in message)) return
        if (message.type === 'fatal') {
          clearTimeout(timer)
          reject(new Error('Runner startup failed: ' + stderr))
        }
        if (
          message.type !== 'ready' ||
          !('origin' in message) ||
          typeof message.origin !== 'string' ||
          !('connectUrl' in message) ||
          typeof message.connectUrl !== 'string'
        )
          return
        clearTimeout(timer)
        resolve({ origin: message.origin, connectUrl: message.connectUrl })
      })
    })
    const response = await fetch(ready.connectUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    })
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    await response.body?.cancel()
    if (response.status !== 302 || cookie === undefined)
      throw new Error('Runner authentication failed')
    installConnection(client, {
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
    await client.plugin(TypertRegistry)
    await client.plugin(Gateway)
    await client.remote.$mount(BotRemote)
    /** Release all tool calls currently waiting in this test Runner. */
    const releaseTool = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (!child.connected) {
          reject(new Error('Runner IPC is disconnected'))
          return
        }
        child.send({ type: 'tool-activity:release' }, (error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    return { home, client, child, dispose, releaseTool, diagnostics: () => stderr }
  } catch (error) {
    try {
      await dispose()
    } catch (cleanup) {
      throw new AggregateError([error, cleanup], 'Runner fixture startup failed')
    }
    throw error
  }
}
