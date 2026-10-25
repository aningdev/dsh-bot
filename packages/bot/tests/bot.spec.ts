import { randomUUID } from 'node:crypto'
import { mkdtemp, mkdir, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import type { Context } from '@deepseek-ai/cordis'
import { createUserMessage, type LlmAdapter } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-persistence'
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'
import { Config as DeploymentConfig } from '@dsh-bot/bot'
import type { BotConfiguration, BotRecord, SaveBotConfigurationRequest } from '@dsh-bot/bot/types'
import { afterEach, describe, expect, test } from 'vite-plus/test'

import { FakeModelAdapter } from './fixtures/fake-model.ts'
import { createBotHost, storeLegacyBot } from './fixtures/host.ts'

const homes: string[] = []
const hosts: Context[] = []
const signal = new AbortController().signal

function edited(
  record: BotRecord,
  changes: Partial<BotConfiguration> = {},
): SaveBotConfigurationRequest {
  const { cwd, provider, model, instructions, capabilities, maxTokens, reasoningEffort } = record
  return {
    expectedRevision: record.revision,
    configuration: {
      cwd,
      provider,
      model,
      instructions,
      capabilities,
      maxTokens,
      reasoningEffort,
      ...changes,
    },
  }
}

async function answer(ctx: Context, botId: string, text: string): Promise<string> {
  let result = ''
  for await (const frame of ctx.botController.send(botId, text, signal))
    if (frame.type === 'text') result += frame.text
  return result
}
async function home(): Promise<string> {
  const created = await mkdtemp(path.join(tmpdir(), 'dsh-bot-'))
  homes.push(created)
  return created
}
async function host(directory: string, adapter?: LlmAdapter): Promise<Context> {
  const ctx = await createBotHost(directory, adapter)
  hosts.push(ctx)
  return ctx
}
async function closeHost(ctx: Context): Promise<void> {
  await ctx.fiber.dispose()
  hosts.splice(hosts.indexOf(ctx), 1)
}

afterEach(async () => {
  const results = await Promise.allSettled(hosts.splice(0).map((ctx) => ctx.fiber.dispose()))
  const files = await Promise.allSettled(
    homes.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  )
  const failures = [...results, ...files].flatMap((result) =>
    result.status === 'rejected' ? [result.reason] : [],
  )
  if (failures.length > 0) throw new AggregateError(failures, 'Test Host cleanup failed')
})

describe('Bot Controller public contract', () => {
  test('template creation copies configuration and survives template changes after restart', async () => {
    const directory = await home()
    const first = await createBotHost(directory, new FakeModelAdapter(), [
      {
        id: 'writer',
        name: '写作助手',
        configuration: {
          provider: 'fake',
          model: 'fake-2',
          baseInstructions: 'Base {{literal}}',
          instructions: 'Original template',
          capabilities: [],
          maxTokens: 39,
          reasoningEffort: null,
          inputMode: 'steer',
        },
      },
    ])
    hosts.push(first)
    const bot = await first.botController.createBot(
      { name: 'Copied', cwd: directory, templateId: 'writer' },
      signal,
    )
    expect(bot).toMatchObject({
      model: 'fake-2',
      baseInstructions: 'Base {{literal}}',
      instructions: 'Original template',
      maxTokens: 39,
      inputMode: 'steer',
    })
    await closeHost(first)
    const second = await host(directory)
    expect(await second.botController.getBot(bot.botId, signal)).toEqual(bot)
    const inspection = await answer(second, bot.botId, 'inspect configuration')
    expect(inspection).toContain('Base {{literal}}')
    expect(inspection).toContain('Original template')
    await expect(
      second.botController.createBot(
        { name: 'Unavailable', cwd: directory, templateId: 'writer' },
        signal,
      ),
    ).rejects.toMatchObject({ code: 'bot/invalid-input' })
  })
  test('a standard prompt admission prevents streamed send from overtaking asynchronous preparation', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const bot = await ctx.botController.createBot({ name: 'admission', cwd: directory }, signal)
    const first = ctx.botController.acquireSessionAccess(SessionId(bot.sessionId), 'prompt', signal)
    const second = ctx.botController.acquireSessionAccess(
      SessionId(bot.sessionId),
      'prompt',
      signal,
    )
    try {
      await expect(answer(ctx, bot.botId, 'must not overtake')).rejects.toMatchObject({
        code: 'bot/busy',
      })
      await first.release()
      await expect(answer(ctx, bot.botId, 'still must wait')).rejects.toMatchObject({
        code: 'bot/busy',
      })
      expect(await ctx.botController.history(bot.botId, signal)).toEqual([])
    } finally {
      await first.release()
      await second.release()
    }
    expect(await answer(ctx, bot.botId, 'accepted after release')).toBe(
      'echo: accepted after release',
    )
  })

  test('shutdown settles accepted creation and rejects later creation', async () => {
    const directory = await home()
    const ctx = await host(directory)
    let created: BotRecord | undefined
    const pending = ctx.botController
      .createBot({ name: 'accepted before shutdown', cwd: directory }, signal)
      .then((record) => {
        created = record
        return record
      })
    await ctx.botController.quiesce()
    const settledAtShutdown = created
    await pending
    expect(settledAtShutdown).toBeDefined()
    await expect(
      ctx.botController.createBot({ name: 'after shutdown', cwd: directory }, signal),
    ).rejects.toMatchObject({ code: 'bot/operation-unavailable', details: { operation: 'create' } })
  })

  test('original version-1 records acquire empty configuration defaults without changing Bot or Session identity', async () => {
    const directory = await home()
    const botId = randomUUID()
    const original = {
      botId,
      sessionId: botId,
      name: 'original',
      cwd: directory,
      provider: 'fake',
      model: 'fake-1',
    }
    await storeLegacyBot(directory, original)
    const ctx = await host(directory)
    const loaded = await ctx.botController.getBot(botId, signal)
    expect(loaded).toEqual({
      ...original,
      revision: 0,
      baseInstructions: '',
      instructions: '',
      capabilities: [],
      maxTokens: null,
      reasoningEffort: null,
      inputMode: 'queue',
    })
    const saved = await ctx.botController.saveConfiguration(
      botId,
      edited(loaded, { model: 'fake-2' }),
      signal,
    )
    expect(saved.sessionId).toBe(botId)
    expect(await answer(ctx, botId, 'after upgrade')).toBe('echo-v2: after upgrade')
  })

  test('deployment capability configuration rejects values that JSON would discard', async () => {
    const result = await DeploymentConfig['~standard'].validate({
      capabilities: { invalid: [{ name: 'plugin', config: { callback: () => 'not JSON' } }] },
    })
    expect(result).toMatchObject({
      issues: [{ message: expect.stringContaining('lossless JSON') }],
    })
  })

  test('configuration is applied before the first turn, with literal instructions and independently selected capabilities', async () => {
    const directory = await home()
    const nextDirectory = path.join(directory, 'next')
    await mkdir(nextDirectory)
    const ctx = await host(directory)
    const created = await ctx.botController.createBot({ name: 'cold', cwd: directory }, signal)
    const saved = await ctx.botController.saveConfiguration(
      created.botId,
      edited(created, {
        cwd: nextDirectory,
        model: 'fake-2',
        instructions: 'Use probe. Keep {{literal}} unchanged.',
        maxTokens: 77,
        reasoningEffort: 'high',
      }),
      signal,
    )
    expect(saved.revision).toBe(1)
    expect(await ctx.botController.history(created.botId, signal)).toEqual([])
    const inspection = await answer(ctx, created.botId, 'inspect configuration')
    expect(JSON.parse(inspection)).toMatchObject({
      model: 'fake-2',
      maxTokens: 77,
      reasoningEffort: 'high',
      tools: [],
    })
    expect(inspection).toContain('{{literal}}')
    expect(inspection).toContain(await realpath(nextDirectory))
    const enabled = await ctx.botController.saveConfiguration(
      created.botId,
      edited(saved, { capabilities: ['probe'] }),
      signal,
    )
    expect(JSON.parse(await answer(ctx, created.botId, 'inspect configuration'))).toMatchObject({
      tools: ['probe'],
    })
    const other = await ctx.botController.createBot({ name: 'independent', cwd: directory }, signal)
    expect(JSON.parse(await answer(ctx, other.botId, 'inspect configuration'))).toMatchObject({
      tools: [],
    })
    const disabled = await ctx.botController.saveConfiguration(
      created.botId,
      edited(enabled, { capabilities: [], maxTokens: null, reasoningEffort: null }),
      signal,
    )
    expect(disabled.revision).toBe(3)
    expect(JSON.parse(await answer(ctx, created.botId, 'inspect configuration'))).toMatchObject({
      tools: [],
      maxTokens: null,
      reasoningEffort: null,
    })
    await closeHost(ctx)
    const restarted = await host(directory)
    expect(await restarted.botController.getBot(created.botId, signal)).toEqual(disabled)
    expect(await answer(restarted, created.botId, 'restarted')).toBe('echo-v2: restarted')
  })

  test('configuration save rejects executing work without changing the record or Agent', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot({ name: 'running', cwd: directory }, signal)
    const stream = ctx.botController.send(created.botId, 'hold', signal)[Symbol.asyncIterator]()
    expect((await stream.next()).done).toBe(false)
    const agent = ctx.agents.get(SessionId(created.sessionId))!
    try {
      await expect(
        ctx.botController.saveConfiguration(
          created.botId,
          edited(created, { model: 'fake-2' }),
          signal,
        ),
      ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'running' } })
      expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
      expect(ctx.agents.get(SessionId(created.sessionId))).toBe(agent)
    } finally {
      agent.cancel({ kind: 'user' }, { keepInbox: true })
      await agent.whenIdle()
      await stream.return?.()
    }
  })

  test.each(['next-turn', 'next-step'] as const)(
    'configuration save preserves parked %s input and rejects replacement',
    async (target) => {
      const directory = await home()
      const ctx = await host(directory)
      const created = await ctx.botController.createBot({ name: 'pending', cwd: directory }, signal)
      await answer(ctx, created.botId, 'before')
      const agent = ctx.agents.get(SessionId(created.sessionId))!
      const message = createUserMessage({
        content: [{ type: 'text', text: 'parked' }],
        source: { kind: 'user' },
      })
      agent.send(message, target, false)
      const events = agent.session.snapshotEvents()
      await expect(
        ctx.botController.saveConfiguration(
          created.botId,
          edited(created, { model: 'fake-2' }),
          signal,
        ),
      ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'pending-input' } })
      expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
      expect(ctx.agents.get(SessionId(created.sessionId))).toBe(agent)
      expect([...agent.inbox.nextTurn, ...agent.inbox.nextStep]).toContainEqual(message)
      expect(agent.session.snapshotEvents()).toEqual(events)
    },
  )

  test('input arriving during validation is retained and prevents Agent replacement', async () => {
    const entered = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    class PausedModel extends FakeModelAdapter {
      override async resolveModel(provider: string, model: string) {
        if (model === 'fake-2') {
          entered.resolve()
          await release.promise
        }
        return super.resolveModel(provider, model)
      }
    }
    const directory = await home()
    const ctx = await host(directory, new PausedModel())
    ctx.effect(() => () => release.resolve())
    const created = await ctx.botController.createBot(
      { name: 'late input', cwd: directory },
      signal,
    )
    await answer(ctx, created.botId, 'before')
    const agent = ctx.agents.get(SessionId(created.sessionId))!
    const saving = ctx.botController.saveConfiguration(
      created.botId,
      edited(created, { model: 'fake-2' }),
      signal,
    )
    await Promise.race([entered.promise, saving])
    const message = createUserMessage({
      content: [{ type: 'text', text: 'arrived during validation' }],
      source: { kind: 'user' },
    })
    agent.send(message, 'next-turn', false)
    release.resolve()
    await expect(saving).rejects.toMatchObject({
      code: 'bot/config-rejected',
      details: { reason: 'pending-input' },
    })
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
    expect(ctx.agents.get(SessionId(created.sessionId))).toBe(agent)
    expect(agent.inbox.nextTurn).toEqual([message])
    expect(agent.inbox.remove(message.id)).toBe(true)
    expect(
      (
        await ctx.botController.saveConfiguration(
          created.botId,
          edited(created, { model: 'fake-2' }),
          signal,
        )
      ).revision,
    ).toBe(1)
  })

  test('cold configuration save rejects durable pending input without activating or mutating the Session', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot(
      { name: 'cold pending', cwd: directory },
      signal,
    )
    await answer(ctx, created.botId, 'before')
    const agent = ctx.agents.get(SessionId(created.sessionId))!
    const message = createUserMessage({
      content: [{ type: 'text', text: 'parked before crash' }],
      source: { kind: 'user' },
    })
    agent.send(message, 'next-turn', false)
    await closeHost(ctx)
    const restarted = await host(directory)
    let prefix
    {
      await using stored = await restarted.sessionPersistence.open(
        SessionId(created.sessionId),
        'read',
      )
      prefix = (await stored.read()).events
    }
    await expect(
      restarted.botController.saveConfiguration(
        created.botId,
        edited(created, { model: 'fake-2' }),
        signal,
      ),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'pending-input' } })
    expect(await restarted.botController.getBot(created.botId, signal)).toEqual(created)
    expect(restarted.agents.get(SessionId(created.sessionId))).toBeUndefined()
    await using read = await restarted.sessionPersistence.open(SessionId(created.sessionId), 'read')
    expect((await read.read()).events).toEqual(prefix)
  })

  test('an idle status with an occupied maintenance window rejects save immediately', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot(
      { name: 'maintenance', cwd: directory },
      signal,
    )
    await answer(ctx, created.botId, 'before')
    const agent = ctx.agents.get(SessionId(created.sessionId))!
    const gate = Promise.withResolvers<void>()
    ctx.effect(() => () => gate.resolve())
    const maintenance = agent.runMaintenance(async () => {
      await gate.promise
    })
    expect(agent.status).toBe('idle')
    await expect(
      ctx.botController.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'maintenance' } })
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
    gate.resolve()
    await maintenance
    expect(
      (await ctx.botController.saveConfiguration(created.botId, edited(created), signal)).revision,
    ).toBe(1)
  })

  test('overlapping saves reject replacement; an accepted application finishes after its observer disconnects', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot({ name: 'overlap', cwd: directory }, signal)
    await answer(ctx, created.botId, 'before')
    const entered = Promise.withResolvers<void>()
    const gate = Promise.withResolvers<void>()
    ctx.effect(() => () => gate.resolve())
    ctx.on(
      'agent/created',
      async ({ agent }) => {
        if (agent.options.model !== 'fake-2') return
        entered.resolve()
        await gate.promise
      },
      { global: true },
    )
    const observer = new AbortController()
    const saving = ctx.botController.saveConfiguration(
      created.botId,
      edited(created, { model: 'fake-2' }),
      observer.signal,
    )
    await Promise.race([
      entered.promise,
      saving.then(() => {
        throw new Error('Expected blocked application')
      }),
    ])
    await expect(
      ctx.botController.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'replacing' } })
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
    expect(await ctx.botController.listBots(signal)).toEqual([created])
    await expect(answer(ctx, created.botId, 'blocked')).rejects.toMatchObject({ code: 'bot/busy' })
    await expect(ctx.botController.history(created.botId, signal)).rejects.toMatchObject({
      code: 'bot/config-rejected',
      details: { reason: 'replacing' },
    })
    observer.abort()
    gate.resolve()
    const saved = await saving
    expect(saved.model).toBe('fake-2')
    expect(saved.revision).toBe(1)
    expect(await answer(ctx, created.botId, 'after')).toBe('echo-v2: after')
    await expect(
      ctx.botController.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({
      code: 'bot/config-conflict',
      details: { actualRevision: 1, expectedRevision: 0 },
    })
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(saved)
  })

  test.each(['plain', 'remote'] as const)(
    'assembly failure (%s) restores the previous configuration and a working Agent on the same Session',
    async (kind) => {
      const directory = await home()
      const ctx = await host(directory)
      const created = await ctx.botController.createBot(
        { name: 'rollback', cwd: directory },
        signal,
      )
      await answer(ctx, created.botId, 'before')
      const original = ctx.agents.get(SessionId(created.sessionId))!
      const prefix = original.session.snapshotEvents()
      ctx.on(
        'agent/created',
        ({ agent }) => {
          if (agent.options.model === 'fake-2') {
            if (kind === 'remote')
              throw new RemoteError('bot/turn-failed', 'Candidate initialization failed', {
                botId: created.botId,
              })
            throw new Error('Candidate initialization failed')
          }
        },
        { global: true },
      )
      await expect(
        ctx.botController.saveConfiguration(
          created.botId,
          edited(created, { model: 'fake-2' }),
          signal,
        ),
      ).rejects.toMatchObject({ code: 'bot/config-failed', details: { rolledBack: true } })
      expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
      const restored = ctx.agents.get(SessionId(created.sessionId))!
      expect(restored).not.toBe(original)
      expect(restored.session.snapshotEvents().slice(0, prefix.length)).toEqual(prefix)
      expect(await answer(ctx, created.botId, 'after')).toBe('echo: after')
      expect(await ctx.botController.history(created.botId, signal)).toEqual([
        { role: 'user', text: 'before' },
        { role: 'assistant', text: 'echo: before' },
        { role: 'user', text: 'after' },
        { role: 'assistant', text: 'echo: after' },
      ])
    },
  )

  test('recovery failure stops admission and retains that fault across restart', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot({ name: 'fault', cwd: directory }, signal)
    await answer(ctx, created.botId, 'before')
    ctx.on(
      'agent/created',
      () => {
        throw new Error('Initialization unavailable')
      },
      { global: true },
    )
    await expect(
      ctx.botController.saveConfiguration(
        created.botId,
        edited(created, { model: 'fake-2' }),
        signal,
      ),
    ).rejects.toMatchObject({ code: 'bot/faulted' })
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
    expect(ctx.agents.get(SessionId(created.sessionId))).toBeUndefined()
    await expect(
      ctx.botController.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'unavailable' } })
    await expect(answer(ctx, created.botId, 'denied')).rejects.toMatchObject({
      code: 'bot/faulted',
    })
    await closeHost(ctx)
    const restarted = await host(directory)
    expect(await restarted.botController.getBot(created.botId, signal)).toEqual(created)
    await expect(answer(restarted, created.botId, 'still denied')).rejects.toMatchObject({
      code: 'bot/faulted',
    })
    await expect(
      restarted.botController.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'unavailable' } })
  })

  test('configuration save reports stopped admission before accessing a closed domain', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const controller = ctx.botController
    const created = await controller.createBot({ name: 'stopped', cwd: directory }, signal)
    await closeHost(ctx)
    await expect(
      controller.saveConfiguration(created.botId, edited(created), signal),
    ).rejects.toMatchObject({ code: 'bot/config-rejected', details: { reason: 'unavailable' } })
  })

  test.each([
    { model: 'missing' },
    { capabilities: ['missing'] },
    { capabilities: ['toString'] },
    { capabilities: ['probe', 'probe'] },
    { reasoningEffort: 'unsupported' },
    { maxTokens: 0 },
  ])(
    'invalid configuration %j leaves the committed record and Agent unchanged',
    async (changes) => {
      const directory = await home()
      const ctx = await host(directory)
      const created = await ctx.botController.createBot({ name: 'invalid', cwd: directory }, signal)
      await answer(ctx, created.botId, 'before')
      const original = ctx.agents.get(SessionId(created.sessionId))!
      await expect(
        ctx.botController.saveConfiguration(created.botId, edited(created, changes), signal),
      ).rejects.toMatchObject({ code: 'bot/config-invalid' })
      expect(await ctx.botController.getBot(created.botId, signal)).toEqual(created)
      expect(ctx.agents.get(SessionId(created.sessionId))).toBe(original)
      expect(await answer(ctx, created.botId, 'after')).toBe('echo: after')
    },
  )

  test('saving idle configuration replaces the Agent on the same Session before returning', async () => {
    const directory = await home()
    const ctx = await host(directory)
    const created = await ctx.botController.createBot(
      { name: 'configured', cwd: directory },
      signal,
    )
    for await (const _frame of ctx.botController.send(created.botId, 'before', signal)) {
      /* Complete the first turn. */
    }
    const original = ctx.agents.get(SessionId(created.sessionId))!
    const prefix = original.session.snapshotEvents()
    const saved = await ctx.botController.saveConfiguration(
      created.botId,
      {
        expectedRevision: 0,
        configuration: {
          cwd: directory,
          provider: 'fake',
          model: 'fake-2',
          instructions: 'Treat {{literal}} as text.',
          capabilities: [],
          maxTokens: 123,
          reasoningEffort: null,
        },
      },
      signal,
    )
    expect(saved.revision).toBe(1)
    expect(saved.sessionId).toBe(created.sessionId)
    expect(await ctx.botController.getBot(created.botId, signal)).toEqual(saved)
    const current = ctx.agents.get(SessionId(created.sessionId))!
    expect(current).not.toBe(original)
    expect(current.session.snapshotEvents().slice(0, prefix.length)).toEqual(prefix)
    const frames = []
    for await (const frame of ctx.botController.send(created.botId, 'after', signal))
      frames.push(frame)
    expect(
      frames
        .filter((frame) => frame.type === 'text')
        .map((frame) => frame.text)
        .join(''),
    ).toBe('echo-v2: after')
    expect(await ctx.botController.history(created.botId, signal)).toEqual([
      { role: 'user', text: 'before' },
      { role: 'assistant', text: 'echo: before' },
      { role: 'user', text: 'after' },
      { role: 'assistant', text: 'echo-v2: after' },
    ])
  })
  test('a Bot keeps one Session across a restart and streams each turn', async () => {
    const directory = await home()
    const first = await host(directory)
    const created = await first.botController.createBot({ name: 'echo', cwd: directory }, signal)
    expect(await first.botController.history(created.botId, signal)).toEqual([])
    const frames = []
    for await (const frame of first.botController.send(created.botId, 'hello', signal))
      frames.push(frame)
    expect(
      frames
        .filter((frame) => frame.type === 'text')
        .map((frame) => frame.text)
        .join(''),
    ).toBe('echo: hello')
    expect(frames.filter((frame) => frame.type === 'text').length).toBeGreaterThan(1)
    expect(frames.at(-1)).toEqual({ type: 'done' })
    const before = await first.botController.history(created.botId, signal)
    await first.fiber.dispose()
    const second = await host(directory)
    expect(await second.botController.getBot(created.botId, signal)).toEqual(created)
    expect(await second.botController.history(created.botId, signal)).toEqual(before)
    for await (const _frame of second.botController.send(created.botId, 'again', signal)) {
      /* Drain through the durability acknowledgement. */
    }
    expect(await second.botController.history(created.botId, signal)).toEqual([
      { role: 'user', text: 'hello' },
      { role: 'assistant', text: 'echo: hello' },
      { role: 'user', text: 'again' },
      { role: 'assistant', text: 'echo: again' },
    ])
  })
})
