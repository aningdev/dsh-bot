import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Context } from '@deepseek-ai/cordis'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import { installConnection, type ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import BotRemote from '@dsh-bot/bot/remote'
import type { BotFrame } from '@dsh-bot/bot/types'
import { afterEach, expect, test } from 'vite-plus/test'
import WebSocket from 'ws'

const homes: string[] = []
const children: ChildProcess[] = []
const clients: Context[] = []
const appRoot = fileURLToPath(new URL('../', import.meta.url))

interface Ready {
  type: 'ready'
  origin: string
  connectUrl: string
}
async function start(home: string, mock = true): Promise<{ child: ChildProcess; ready: Ready }> {
  const child = spawn(
    process.execPath,
    [
      '--expose-internals',
      appRoot + 'lib/index.js',
      '--home',
      home,
      ...(mock ? ['--patch', appRoot + 'tests/fixtures/model.overlay.yml'] : []),
    ],
    {
      cwd: appRoot,
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      env: { ...process.env, DEEPSEEK_API_KEY: '', DSH_TELEMETRY_DISABLED: '1' },
    },
  )
  children.push(child)
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
  return { child, ready }
}
async function stop(child: ChildProcess): Promise<{ code: number | null; acknowledged: boolean }> {
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
  for (const ctx of clients.splice(0)) await ctx.fiber.dispose()
  for (const child of children.splice(0)) await stop(child)
  for (const directory of homes.splice(0)) await rm(directory, { recursive: true, force: true })
})

test('Remote streams a turn, stores JSONL, and resumes the same Bot after a process restart', async () => {
  const directory = await home()
  const first = await start(directory)
  expect(
    (await fetch(first.ready.origin + '/api/bot/list', { method: 'POST', body: '{}' })).status,
  ).toBe(401)
  const client = await connect(first.ready)
  const created = await client.remote.bot.create({ name: 'echo', cwd: directory })
  if (!created.ok) throw created.error
  const bot = created.value
  const frames = []
  for await (const frame of client.remote.bot.send(bot.botId, 'hello')) frames.push(frame)
  expect(
    frames
      .filter((frame) => frame.type === 'text')
      .map((frame) => frame.text)
      .join(''),
  ).toBe('echo: hello')
  expect(frames.filter((frame) => frame.type === 'text').length).toBeGreaterThan(1)
  expect(frames.at(-1)).toEqual({ type: 'done' })
  const before = await client.remote.bot.history(bot.botId)
  expect(before).toEqual({
    ok: true,
    value: [
      { role: 'user', text: 'hello' },
      { role: 'assistant', text: 'echo: hello' },
    ],
  })
  await client.fiber.dispose()
  expect(await stop(first.child)).toEqual({ code: 0, acknowledged: true })
  const sessionFiles = await readdir(join(directory, 'sessions'), { recursive: true })
  const jsonl = sessionFiles.filter((file) => file.endsWith('.jsonl'))
  expect(jsonl.length).toBeGreaterThan(0)
  const log = (
    await Promise.all(jsonl.map((file) => readFile(join(directory, 'sessions', file), 'utf8')))
  ).join('\n')
  expect(log).toContain('assistant/message')
  expect(log).toContain('echo: hello')
  const second = await start(directory)
  const reconnected = await connect(second.ready)
  expect(await reconnected.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
  expect(await reconnected.remote.bot.history(bot.botId)).toEqual(before)
  for await (const _frame of reconnected.remote.bot.send(bot.botId, 'again')) {
    /* Drain the second accepted turn. */
  }
  expect(await reconnected.remote.bot.history(bot.botId)).toEqual({
    ok: true,
    value: [
      { role: 'user', text: 'hello' },
      { role: 'assistant', text: 'echo: hello' },
      { role: 'user', text: 'again' },
      { role: 'assistant', text: 'echo: again' },
    ],
  })
})

test('Remote configuration commits only after application and survives a process restart on the same Session', async () => {
  const directory = await home()
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'configurable', cwd: directory })
  if (!created.ok) throw created.error
  const bot = created.value
  for await (const _frame of client.remote.bot.send(bot.botId, 'before')) {
    /* Finish the initial turn. */
  }
  const before = await client.remote.bot.history(bot.botId)
  const request = {
    expectedRevision: bot.revision,
    configuration: {
      cwd: bot.cwd,
      provider: 'fake',
      model: 'fake-2',
      instructions: 'Keep {{literal}}.',
      capabilities: [],
      maxTokens: 17,
      reasoningEffort: null,
    },
  }
  const saved = await client.remote.bot.saveConfiguration(bot.botId, request)
  if (!saved.ok) throw saved.error
  expect(saved.value.revision).toBe(1)
  expect(saved.value.sessionId).toBe(bot.sessionId)
  expect(await client.remote.bot.history(bot.botId)).toEqual(before)
  let inspection = ''
  for await (const frame of client.remote.bot.send(bot.botId, 'inspect configuration'))
    if (frame.type === 'text') inspection += frame.text
  expect(JSON.parse(inspection)).toMatchObject({ model: 'fake-2', maxTokens: 17, tools: [] })
  expect(inspection).toContain('{{literal}}')
  expect(await client.remote.bot.saveConfiguration(bot.botId, request)).toMatchObject({
    ok: false,
    error: { code: 'bot/config-conflict', details: { actualRevision: 1 } },
  })
  const connection = client.get('connection') as ConnectionHandle
  expect(
    await connection.rpc.call('/api', 'bot/saveConfiguration', {
      args: {
        botId: bot.botId,
        request: { expectedRevision: '1', configuration: request.configuration },
      },
    }),
  ).toMatchObject({ ok: false, error: { code: 'gateway/input-invalid' } })
  expect(
    await client.remote.bot.saveConfiguration(bot.botId, {
      expectedRevision: 1,
      configuration: { ...request.configuration, maxTokens: 0 },
    }),
  ).toMatchObject({ ok: false, error: { code: 'bot/config-invalid' } })
  const history = await client.remote.bot.history(bot.botId)
  await client.fiber.dispose()
  expect(await stop(running.child)).toEqual({ code: 0, acknowledged: true })
  const restarted = await start(directory)
  const reconnected = await connect(restarted.ready)
  expect(await reconnected.remote.bot.get(bot.botId)).toEqual(saved)
  expect(await reconnected.remote.bot.history(bot.botId)).toEqual(history)
  const changed = await reconnected.remote.bot.saveConfiguration(bot.botId, {
    expectedRevision: 1,
    configuration: { ...request.configuration, model: 'fake-1', maxTokens: null, instructions: '' },
  })
  if (!changed.ok) throw changed.error
  expect(changed.value.revision).toBe(2)
  const frames: BotFrame[] = []
  for await (const frame of reconnected.remote.bot.send(bot.botId, 'after')) frames.push(frame)
  expect(
    frames
      .filter((frame) => frame.type === 'text')
      .map((frame) => frame.text)
      .join(''),
  ).toBe('echo: after')
  expect(frames.at(-1)).toEqual({ type: 'done' })
})

test('a model failure rejects the stream and leaves the Bot available for another turn', async () => {
  const directory = await home()
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'failure', cwd: directory })
  if (!created.ok) throw created.error
  const frames: BotFrame[] = []
  const failed = async (): Promise<void> => {
    for await (const frame of client.remote.bot.send(created.value.botId, 'fail'))
      frames.push(frame)
  }
  await expect(failed()).rejects.toMatchObject({ code: 'bot/turn-failed' })
  expect(frames).not.toContainEqual({ type: 'done' })
  const recovered = []
  for await (const frame of client.remote.bot.send(created.value.botId, 'recovered'))
    recovered.push(frame)
  expect(recovered.at(-1)).toEqual({ type: 'done' })
})

test('the default profile uses the official selection and rejects malformed wire arguments', async () => {
  const directory = await home()
  const running = await start(directory, false)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'official', cwd: directory })
  if (!created.ok) throw created.error
  expect(created.value.provider).toBe('deepseek-official')
  expect(created.value.model).toBe('deepseek-flash')
  const connection = client.get('connection') as ConnectionHandle
  const invalid = await connection.rpc.call('/api', 'bot/get', { args: { botId: 123 } })
  expect(invalid).toMatchObject({ ok: false, error: { code: 'gateway/input-invalid' } })
  expect(await client.remote.bot.get('../outside')).toMatchObject({
    ok: false,
    error: { code: 'bot/invalid-input' },
  })
  expect(
    await client.remote.bot.create({ name: 'missing directory', cwd: join(directory, 'missing') }),
  ).toMatchObject({ ok: false, error: { code: 'bot/invalid-input' } })
})

test('disconnecting an observer preserves accepted execution and another Bot remains usable', async () => {
  const directory = await home()
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'busy', cwd: directory })
  if (!created.ok) throw created.error
  const stream = client.remote.bot.send(created.value.botId, 'hold')
  const iterator = stream[Symbol.asyncIterator]()
  expect(await iterator.next()).toEqual({ done: false, value: { type: 'text', text: 'e' } })
  stream.dispose()
  await iterator.return?.()
  await client.fiber.dispose()
  const second = await connect(running.ready)
  const duplicate = async (): Promise<void> => {
    for await (const _frame of second.remote.bot.send(created.value.botId, 'duplicate')) {
      /* The busy Bot must reject admission. */
    }
  }
  await expect(duplicate()).rejects.toMatchObject({ code: 'bot/busy' })
  const other = await second.remote.bot.create({ name: 'other', cwd: directory })
  if (!other.ok) throw other.error
  const frames = []
  for await (const frame of second.remote.bot.send(other.value.botId, 'release')) frames.push(frame)
  expect(frames.at(-1)).toEqual({ type: 'done' })
  await expect
    .poll(() => second.remote.bot.history(created.value.botId))
    .toEqual({
      ok: true,
      value: [
        { role: 'user', text: 'hold' },
        { role: 'assistant', text: 'echo: hold' },
      ],
    })
  await second.fiber.dispose()
  expect(await stop(running.child)).toEqual({ code: 0, acknowledged: true })
})
