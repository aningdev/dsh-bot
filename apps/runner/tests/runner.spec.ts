import { execFile } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type { BotFrame } from '@dsh-bot/bot/types'
import { expect, test } from 'vite-plus/test'

import { runnerHarness } from './fixtures/runner.ts'

const { home, start, stop, connect } = runnerHarness()

function isClientConnection(value: unknown): value is ConnectionHandle {
  return (
    typeof value === 'object' &&
    value !== null &&
    'registerGenerationSource' in value &&
    typeof value.registerGenerationSource === 'function' &&
    'rpc' in value &&
    typeof value.rpc === 'object' &&
    value.rpc !== null &&
    'call' in value.rpc &&
    typeof value.rpc.call === 'function'
  )
}

test('launcher reports a before-dispose failure with a nonzero exit status', async () => {
  const directory = await home()
  await expect(
    promisify(execFile)(
      process.execPath,
      [fileURLToPath(new URL('../.test-output/shutdown-failure.js', import.meta.url)), directory],
      { timeout: 10000, env: { ...process.env, DSH_TELEMETRY_DISABLED: '1' } },
    ),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining('Expected teardown failure'),
  })
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
  const connection = client.get('connection')
  if (!isClientConnection(connection)) throw new Error('Expected the client Connection service')
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
  const connection = client.get('connection')
  if (!isClientConnection(connection)) throw new Error('Expected the client Connection service')
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
