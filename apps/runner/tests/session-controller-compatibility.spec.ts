import { randomUUID } from 'node:crypto'
/** Executable compatibility evidence for the pinned, unmodified Session Controller. */
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { SessionRequestId } from '@deepseek-ai/dsh-api-session-controller'
import SessionRemote from '@deepseek-ai/dsh-api-session-controller/remote'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { BotRecord, SaveBotConfigurationRequest } from '@dsh-bot/bot/types'
import { expect, test } from 'vite-plus/test'

import { runnerHarness } from './fixtures/runner.ts'

const { home, start, stop, connect } = runnerHarness()

async function patch(directory: string, standingPresets = false, holdModel = ''): Promise<string> {
  const filename = join(directory, 'session-controller.compatibility.yml')
  await writeFile(
    filename,
    JSON.stringify([
      { id: 'agent-default-model', config: { provider: 'fake', model: 'fake-1' } },
      {
        insert: [
          { id: 'compat-workspace', name: '@deepseek-ai/dsh-workspace' },
          { id: 'compat-file-references', name: '@deepseek-ai/dsh-file-reference-local' },
          { id: 'compat-file-uploads', name: '@deepseek-ai/dsh-client-file-upload' },
          { id: 'compat-session-controller', name: '@deepseek-ai/dsh-api-session-controller' },
          {
            id: 'compat-probe',
            name: new URL('../.test-output/session-controller-probe.js', import.meta.url).href,
            config: { standingPresets, holdModel },
          },
        ],
      },
    ]),
  )
  return filename
}

function replacement(bot: BotRecord): SaveBotConfigurationRequest {
  return {
    expectedRevision: bot.revision,
    configuration: {
      cwd: bot.cwd,
      provider: 'fake',
      model: 'fake-2',
      instructions: 'Bot-owned instructions.',
      capabilities: [],
      maxTokens: null,
      reasoningEffort: null,
    },
  }
}

async function storedBot(directory: string): Promise<BotRecord> {
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'compatibility', cwd: directory })
  if (!created.ok) throw created.error
  for await (const _frame of client.remote.bot.send(created.value.botId, 'before')) {
    /* Persist the original model's turn. */
  }
  const saved = await client.remote.bot.saveConfiguration(
    created.value.botId,
    replacement(created.value),
  )
  if (!saved.ok) throw saved.error
  await client.fiber.dispose()
  expect(await stop(running.child)).toEqual({ code: 0, acknowledged: true })
  return saved.value
}

test('published Controller cannot cold-resume a Bot whose standing preset belongs to the inactive Bot owner', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await patch(directory)])
  await expect.poll(() => running.probes.some((event) => event.event === 'ready')).toBe(true)
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const renamed = await client.remote.session.rename({
    sessionId: SessionId(bot.sessionId),
    title: 'cold',
  })
  expect(renamed).toMatchObject({
    ok: false,
    error: { code: 'gateway/internal', message: expect.stringContaining(`dsh-bot:${bot.botId}`) },
  })
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
        running.probes.filter(
          (event) => event.event === 'activation-error' && event.sessionId === bot.sessionId,
        ),
      )
      .toMatchObject([{ detail: expect.stringContaining(`dsh-bot:${bot.botId}`) }])
    expect(await client.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
  } finally {
    following.dispose()
    await iterator.return?.()
  }
})

test('a standing preset lets history activate a foreign-owned Agent that uses the logged model instead of the saved Bot selection', async () => {
  const directory = await home()
  const bot = await storedBot(directory)
  const running = await start(directory, true, [await patch(directory, true)])
  await expect.poll(() => running.probes.some((event) => event.event === 'ready')).toBe(true)
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const following = client.remote.session.follow({
    address: { kind: 'session', sessionId: SessionId(bot.sessionId) },
  })
  const iterator = following[Symbol.asyncIterator]()
  try {
    expect((await iterator.next()).value).toMatchObject({ type: 'snapshot' })
    await expect
      .poll(() =>
        running.probes.some(
          (event) => event.event === 'agent-announced' && event.sessionId === bot.sessionId,
        ),
      )
      .toBe(true)
    expect(await client.remote.bot.saveConfiguration(bot.botId, replacement(bot))).toMatchObject({
      ok: false,
      error: { code: 'bot/config-rejected', details: { reason: 'unavailable' } },
    })
    const prompted = await client.remote.session.prompt({
      sessionId: SessionId(bot.sessionId),
      requestId: randomUUID() as SessionRequestId,
      mode: 'queue',
      content: [{ type: 'text', text: 'official turn' }],
    })
    if (!prompted.ok) throw prompted.error
    await expect
      .poll(async () => {
        const history = await client.remote.bot.history(bot.botId)
        if (!history.ok) throw history.error
        return history.value.at(-1)
      })
      .toEqual({ role: 'assistant', text: 'echo: official turn' })
    expect(await client.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
  } finally {
    following.dispose()
    await iterator.return?.()
  }
})

test('official history opening bypasses the Bot replacement guard while candidate initialization is blocked', async () => {
  const directory = await home()
  const running = await start(directory, true, [await patch(directory, false, 'fake-2')])
  await expect.poll(() => running.probes.some((event) => event.event === 'ready')).toBe(true)
  const client = await connect(running.ready)
  await client.remote.$mount(SessionRemote)
  const created = await client.remote.bot.create({ name: 'replacing', cwd: directory })
  if (!created.ok) throw created.error
  const bot = created.value
  for await (const _frame of client.remote.bot.send(bot.botId, 'before')) {
    /* Initialize the owned Agent. */
  }
  const saving = client.remote.bot.saveConfiguration(bot.botId, replacement(bot))
  try {
    await expect
      .poll(() =>
        running.probes.some(
          (event) => event.event === 'initialization-blocked' && event.sessionId === bot.sessionId,
        ),
      )
      .toBe(true)
    expect(await client.remote.bot.history(bot.botId)).toMatchObject({
      ok: false,
      error: { code: 'bot/config-rejected', details: { reason: 'replacing' } },
    })
    const following = client.remote.session.follow({
      address: { kind: 'session', sessionId: SessionId(bot.sessionId) },
    })
    const iterator = following[Symbol.asyncIterator]()
    try {
      expect((await iterator.next()).value).toMatchObject({
        type: 'snapshot',
        header: { id: bot.sessionId },
      })
      expect(await client.remote.bot.get(bot.botId)).toEqual({ ok: true, value: bot })
    } finally {
      following.dispose()
      await iterator.return?.()
    }
  } finally {
    await new Promise<void>((resolve, reject) =>
      running.child.send({ type: 'compatibility:release' }, (error) =>
        error === null ? resolve() : reject(error),
      ),
    )
  }
  const saved = await saving
  if (!saved.ok) throw saved.error
  expect(saved.value.revision).toBe(bot.revision + 1)
})
