/** Positive contracts for the execution owner's published-API integration. */
import type { ChildProcess } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { SessionRequestId } from '@deepseek-ai/dsh-api-session-controller'
import SessionRemote from '@deepseek-ai/dsh-api-session-controller/remote'
import FileUploadRemote from '@deepseek-ai/dsh-client-file-upload/remote'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { BotConfiguration, BotRecord } from '@dsh-bot/bot/types'
import { expect, test } from 'vite-plus/test'

import { runnerHarness } from './fixtures/runner.ts'

const { home, start, startFailure, stop, connect } = runnerHarness()

async function integrationPatch(
  directory: string,
  options: {
    holdModel?: string
    holdFileReferences?: boolean
    holdCleanup?: boolean
    manualOwner?: boolean
  } = {},
): Promise<string> {
  const filename = join(directory, 'session-lifecycle.yml')
  await writeFile(
    filename,
    JSON.stringify([
      ...(options.holdFileReferences ? [{ id: 'runner-file-references', disabled: true }] : []),
      ...(options.manualOwner ? [{ id: 'bot-session-controller', disabled: true }] : []),
      {
        insert: [
          {
            id: 'lifecycle-probe',
            name: new URL('../.test-output/session-controller-probe.js', import.meta.url).href,
            config: {
              ownerLifecycle: options.manualOwner ?? false,
              holdModel: options.holdModel ?? '',
              holdFileReferences: options.holdFileReferences ?? false,
              holdCleanup: options.holdCleanup ?? false,
            },
          },
        ],
      },
    ]),
  )
  return filename
}

function configuration(bot: BotRecord, model = 'fake-2'): BotConfiguration {
  return {
    cwd: bot.cwd,
    provider: 'fake',
    model,
    instructions: 'Owner instructions {{literal}}.',
    capabilities: [],
    maxTokens: 31,
    reasoningEffort: null,
  }
}

function control(
  child: ChildProcess,
  type: string,
  extra: Record<string, string> = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    child.send({ type, ...extra }, (error) => (error === null ? resolve() : reject(error)))
  })
}

async function storedBot(directory: string): Promise<BotRecord> {
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'owned', cwd: directory })
  if (!created.ok) throw created.error
  for await (const _frame of client.remote.bot.send(created.value.botId, 'before')) {
    /* Persist fake-1. */
  }
  const saved = await client.remote.bot.saveConfiguration(created.value.botId, {
    expectedRevision: created.value.revision,
    configuration: configuration(created.value),
  })
  if (!saved.ok) throw saved.error
  await client.fiber.dispose()
  expect(await stop(running.child)).toEqual({ code: 0, acknowledged: true })
  return saved.value
}

async function rawUpload(
  ready: { connectUrl: string; origin: string },
  sessionId: string,
): Promise<unknown> {
  const handshake = await fetch(ready.connectUrl, { redirect: 'manual' })
  const cookie = handshake.headers.get('set-cookie')?.split(';')[0]
  await handshake.body?.cancel()
  if (cookie === undefined) throw new Error('Missing Runner cookie')
  const url = new URL('/api/session/uploadFileBinary', ready.origin)
  url.searchParams.set('sessionId', sessionId)
  url.searchParams.set('name', 'raw.txt')
  const response = await fetch(url, {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/octet-stream' },
    body: Buffer.from('raw attachment'),
  })
  expect(response.status).toBe(200)
  return response.json()
}

test('returning a Gateway stream before its first read releases replacement admission', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await integrationPatch(directory)])
  const client = await connect(running.ready)
  await control(running.child, 'compatibility:close-unstarted-stream', { sessionId: bot.sessionId })
  await expect
    .poll(() => running.probes)
    .toContainEqual(expect.objectContaining({ event: 'unstarted-stream-closed' }))
  expect(
    (
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      })
    ).ok,
  ).toBe(true)
})

test('cold Controller activation belongs to Bot and uses the latest configuration before another turn', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await integrationPatch(directory)])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  expect(
    (await client.remote.session.rename({ sessionId: SessionId(bot.sessionId), title: 'restored' }))
      .ok,
  ).toBe(true)
  let reply = ''
  for await (const frame of client.remote.bot.send(bot.botId, 'inspect configuration'))
    if (frame.type === 'text') reply += frame.text
  expect(JSON.parse(reply)).toMatchObject({ model: 'fake-2', maxTokens: 31 })
  expect(reply).toContain('{{literal}}')
  expect(
    (
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      })
    ).ok,
  ).toBe(true)
})

test('cold history promotes through Bot and a follower survives replacement without holding the configuration lock', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await integrationPatch(directory)])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const following = client.remote.session.follow({
    address: { kind: 'session', sessionId: SessionId(bot.sessionId) },
  })
  const iterator = following[Symbol.asyncIterator]()
  try {
    expect((await iterator.next()).value).toMatchObject({
      type: 'snapshot',
      header: { id: bot.sessionId },
    })
    await expect
      .poll(() =>
        running.probes.some(
          (event) => event.event === 'agent-announced' && event.detail === 'fake-2',
        ),
      )
      .toBe(true)
    expect(
      (await client.remote.session.rename({ sessionId: SessionId(bot.sessionId), title: 'owned' }))
        .ok,
    ).toBe(true)
    const saved = await client.remote.bot.saveConfiguration(bot.botId, {
      expectedRevision: bot.revision,
      configuration: configuration(bot, 'fake-1'),
    })
    if (!saved.ok) throw saved.error
    const prompted = await client.remote.session.prompt({
      sessionId: SessionId(bot.sessionId),
      requestId: randomUUID() as SessionRequestId,
      mode: 'queue',
      content: [{ type: 'text', text: 'after replacement' }],
    })
    if (!prompted.ok) throw prompted.error
    let observed = false
    while (!observed) {
      const frame = await iterator.next()
      expect(frame.done).toBe(false)
      observed = JSON.stringify(frame.value).includes('echo: after replacement')
    }
    await expect
      .poll(async () => {
        const history = await client.remote.bot.history(bot.botId)
        if (!history.ok) throw history.error
        return history.value.at(-1)
      })
      .toEqual({ role: 'assistant', text: 'echo: after replacement' })
    await expect
      .poll(
        async () =>
          (
            await client.remote.bot.saveConfiguration(bot.botId, {
              expectedRevision: saved.value.revision,
              configuration: configuration(bot),
            })
          ).ok,
      )
      .toBe(true)
  } finally {
    following.dispose()
    await iterator.return?.()
  }
})

test('replacement rejects standard history, Agent lookup, encoded upload, and raw upload before they use the candidate', async () => {
  const directory = await home()
  const running = await start(directory, true, [
    await integrationPatch(directory, { holdModel: 'fake-2' }),
  ])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  await client.remote.$mount(FileUploadRemote)
  const created = await client.remote.bot.create({ name: 'replacing', cwd: directory })
  if (!created.ok) throw created.error
  const bot = created.value
  for await (const _frame of client.remote.bot.send(bot.botId, 'before')) {
    /* Establish the owned Agent. */
  }
  const saving = client.remote.bot.saveConfiguration(bot.botId, {
    expectedRevision: bot.revision,
    configuration: configuration(bot),
  })
  const rejected = {
    ok: false,
    error: { code: 'bot/config-rejected', details: { reason: 'replacing' } },
  }
  try {
    await expect
      .poll(() => running.probes.some((event) => event.event === 'initialization-blocked'))
      .toBe(true)
    expect(
      await client.remote.session.rename({
        sessionId: SessionId(bot.sessionId),
        title: 'too early',
      }),
    ).toMatchObject(rejected)
    expect(await client.remote.fileReferences.list(SessionId(bot.sessionId), '')).toMatchObject(
      rejected,
    )
    expect(
      await client.remote.fileUploads.upload(SessionId(bot.sessionId), {
        data: Buffer.from('encoded').toString('base64'),
      }),
    ).toMatchObject(rejected)
    expect(await rawUpload(running.ready, bot.sessionId)).toMatchObject(rejected)
    const following = client.remote.session.follow({
      address: { kind: 'session', sessionId: SessionId(bot.sessionId) },
    })
    const iterator = following[Symbol.asyncIterator]()
    try {
      await expect(iterator.next()).rejects.toMatchObject(rejected.error)
    } finally {
      following.dispose()
      await iterator.return?.()
    }
    expect(await client.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
  } finally {
    await control(running.child, 'compatibility:release')
  }
  expect((await saving).ok).toBe(true)
  expect(await rawUpload(running.ready, bot.sessionId)).toMatchObject({
    ok: true,
    value: { file: { name: 'raw.txt', bytes: 14 } },
  })
})

test('an asynchronous Agent lookup protects initialization until the receiver is ready', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [
    await integrationPatch(directory, { holdModel: 'fake-2' }),
  ])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const querying = client.remote.fileReferences.list(SessionId(bot.sessionId), '')
  try {
    await expect
      .poll(() => running.probes.some((event) => event.event === 'initialization-blocked'))
      .toBe(true)
    expect(
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      }),
    ).toMatchObject({
      ok: false,
      error: { code: 'bot/config-rejected', details: { reason: 'maintenance' } },
    })
  } finally {
    await control(running.child, 'compatibility:release')
  }
  expect((await querying).ok).toBe(true)
  expect(
    (
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      })
    ).ok,
  ).toBe(true)
})

test('the Gateway retains the lease after lookup through asynchronous receiver use', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [
    await integrationPatch(directory, { holdFileReferences: true }),
  ])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const querying = client.remote.fileReferences.list(SessionId(bot.sessionId), '')
  try {
    await expect
      .poll(() => running.probes.some((event) => event.event === 'references-blocked'))
      .toBe(true)
    expect(
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      }),
    ).toMatchObject({
      ok: false,
      error: { code: 'bot/config-rejected', details: { reason: 'maintenance' } },
    })
  } finally {
    await control(running.child, 'compatibility:release', { phase: 'references' })
  }
  expect(await querying).toEqual({ ok: true, value: [] })
  expect(
    (
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      })
    ).ok,
  ).toBe(true)
})

test('raw intake holds admission through durable staging and withdrawal cancels and drains both body and receiver', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [
    await integrationPatch(directory, { holdFileReferences: true, manualOwner: true }),
  ])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const querying = client.remote.fileReferences.list(SessionId(bot.sessionId), '')
  await expect
    .poll(() => running.probes.some((event) => event.event === 'references-blocked'))
    .toBe(true)
  await control(running.child, 'compatibility:upload', { sessionId: bot.sessionId })
  await expect
    .poll(() => running.probes.some((event) => event.event === 'upload-blocked'))
    .toBe(true)
  expect(
    await client.remote.bot.saveConfiguration(bot.botId, {
      expectedRevision: bot.revision,
      configuration: configuration(bot, 'fake-1'),
    }),
  ).toMatchObject({
    ok: false,
    error: { code: 'bot/config-rejected', details: { reason: 'maintenance' } },
  })
  await control(running.child, 'compatibility:withdraw')
  await expect
    .poll(() => running.probes.some((event) => event.event === 'bridge-withdrawn'))
    .toBe(true)
  expect(await querying).toMatchObject({ ok: false })
  expect(running.probes).toContainEqual(
    expect.objectContaining({ event: 'references-cleanup', detail: 'live' }),
  )
  await expect
    .poll(() => running.probes.some((event) => event.event === 'upload-failed'))
    .toBe(true)
  expect(running.probes.some((event) => event.event === 'upload-cleanup')).toBe(true)
  expect(await readdir(join(directory, 'attachments', 'v1', 'tmp'))).toEqual([])
  expect(
    await client.remote.session.rename({
      sessionId: SessionId(bot.sessionId),
      title: 'after withdrawal',
    }),
  ).toMatchObject({ ok: false, error: { code: 'gateway/service-unavailable' } })
})

test.each(['IPC', 'SIGTERM'])(
  '%s shutdown waits for consumer cleanup while its Agent and record domain remain usable',
  async (mode) => {
    const directory = await home()
    const bot = await storedBot(directory)
    const running = await start(directory, true, [
      await integrationPatch(directory, { holdFileReferences: true, holdCleanup: true }),
    ])
    const client = await connect(running.ready)
    await client.remote.$mount(SessionRemote)
    const querying = client.remote.fileReferences
      .list(SessionId(bot.sessionId), '')
      .catch((error: unknown) => ({ ok: false as const, error }))
    await expect
      .poll(() => running.probes.some((event) => event.event === 'references-blocked'))
      .toBe(true)
    const exited = once(running.child, 'exit')
    let stopping: Promise<{ code: number | null; acknowledged: boolean }>
    if (mode === 'IPC') stopping = stop(running.child)
    else {
      running.child.kill('SIGTERM')
      stopping = exited.then(([code]) => ({
        code: typeof code === 'number' ? code : null,
        acknowledged: false,
      }))
    }
    try {
      await expect
        .poll(() => running.probes.some((event) => event.event === 'references-cleanup-blocked'))
        .toBe(true)
      const detail = running.probes.find((event) => event.event === 'cleanup-resources')?.detail
      expect(JSON.parse(detail ?? 'null')).toEqual({ agentLive: true, recordsReadable: true })
      expect(running.child.exitCode).toBe(null)
    } finally {
      await control(running.child, 'compatibility:release', { phase: 'references-cleanup' })
      const terminal = await stopping
      expect(terminal).toMatchObject(mode === 'IPC' ? { code: 0, acknowledged: true } : { code: 0 })
    }
    expect(await querying).toMatchObject({ ok: false })
    expect(running.probes).toContainEqual(
      expect.objectContaining({ event: 'references-cleanup', detail: 'live' }),
    )
  },
)

test('a new Bot opens an empty stable Session before its first prompt and can still change configuration', async () => {
  const directory = await home()
  const running = await start(directory)
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const created = await client.remote.bot.create({ name: 'new', cwd: directory })
  if (!created.ok) throw created.error
  const bot = created.value
  const following = client.remote.session.follow({
    address: { kind: 'session', sessionId: SessionId(bot.sessionId) },
  })
  const iterator = following[Symbol.asyncIterator]()
  try {
    expect((await iterator.next()).value).toMatchObject({
      type: 'snapshot',
      header: { id: bot.sessionId },
    })
    expect(
      (
        await client.remote.bot.saveConfiguration(bot.botId, {
          expectedRevision: bot.revision,
          configuration: configuration(bot),
        })
      ).ok,
    ).toBe(true)
  } finally {
    following.dispose()
    await iterator.return?.()
  }
})

test('Runner refuses readiness when the standard API has no Bot lifecycle binding', async () => {
  const directory = await home()
  const patch = join(directory, 'unowned.yml')
  await writeFile(patch, JSON.stringify([{ id: 'bot-session-controller', disabled: true }]))
  await expect(startFailure(directory, [patch])).rejects.toThrow('botSessionController')
})

test('standard create, fork, and model selection cannot create another owner or change the saved model', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await integrationPatch(directory)])
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  for (const result of [
    await client.remote.session.create({ cwd: directory }),
    await client.remote.session.fork({ sessionId: SessionId(bot.sessionId) }),
    await client.remote.session.selectModel({
      sessionId: SessionId(bot.sessionId),
      provider: 'fake',
      model: 'fake-1',
    }),
  ])
    expect(result).toMatchObject({ ok: false, error: { code: 'bot/operation-unavailable' } })
  expect(await client.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
  expect(
    (
      await client.remote.bot.saveConfiguration(bot.botId, {
        expectedRevision: bot.revision,
        configuration: configuration(bot, 'fake-1'),
      })
    ).ok,
  ).toBe(true)
})
