/** Bot Remote owner; execution and durable history belong to Harness services. */
import { randomUUID } from 'node:crypto'
import { stat } from 'node:fs/promises'
import path from 'node:path'

import type { Context } from '@deepseek-ai/cordis'
import { installModelSelection, type Agent, type AgentHandle } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-loop'
import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { deriveEventMessage, SessionId, type SessionEvent } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-persistence'
import { defineDomain, domainTable, type KvTable } from '@deepseek-ai/dsh-storage-domain'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import schema from '@deepseek-ai/schemastery'
import { z } from 'zod'

import type { BotFrame, BotRecord, ChatMessage, CreateBotRequest } from './types.ts'
export type { BotFrame, BotRecord, ChatMessage, CreateBotRequest } from './types.ts'

/** Deployment-owned initial model selection; storage routing belongs to storageDomain. */
export interface Config {
  readonly provider: string
  readonly model: string
}

/** Validates deployment values before the plugin activates. */
export const Config: schema<Config> = schema.object({
  provider: schema.string().default('deepseek-official'),
  model: schema.string().default('deepseek-flash'),
})

const storedBot = z.object({
  botId: z.uuid(),
  name: z.string().trim().min(1),
  cwd: z.string().refine(path.isAbsolute, 'Working directory must be absolute'),
  provider: z.string().min(1),
  model: z.string().min(1),
  sessionId: z.uuid(),
})

const createBotInput = storedBot.pick({ name: true, cwd: true })
const botDomain = defineDomain({
  name: 'dsh_bot',
  version: 1,
  tables: { bots: domainTable(storedBot) },
})

/** Whether a filesystem failure means a requested file is absent. */
function missing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Bot records, Remote operations, and owned Agent lifetimes. */
    botController: BotController
  }
}

/** Owns Bot identity and Agent handles without replacing Harness execution. */
export class BotController extends TypertRemoteService {
  static inject = [
    'agents',
    'agentLoop',
    'agentPresets',
    'sessions',
    'sessionPersistence',
    'storageDomain',
  ]
  private readonly handles = new Map<string, AgentHandle>()
  private readonly presets = new Map<string, () => Promise<void>>()
  private readonly busy = new Set<string>()
  private stopping = false

  /**
   * @param ctx - Owning plugin context.
   * @param config - Validated deployment values.
   * @param records - Validated domain table, closed by the owning plugin after Agent teardown.
   */
  constructor(
    ctx: Context,
    private readonly config: Config,
    private readonly records: KvTable<string, BotRecord>,
  ) {
    super(ctx, 'botController', { namespace: 'bot' })
    ctx.effect(
      () => async () => {
        this.stopping = true
        const failures: unknown[] = []
        for (const handle of this.handles.values()) {
          try {
            await handle.dispose()
          } catch (error) {
            failures.push(error)
          }
        }
        this.handles.clear()
        for (const dispose of this.presets.values()) {
          try {
            await dispose()
          } catch (error) {
            failures.push(error)
          }
        }
        this.presets.clear()
        if (failures.length > 0) throw new AggregateError(failures, 'Bot cleanup failed')
      },
      'bot: Agent handles and preset declarations',
    )
  }

  /**
   * Create a Bot with its own initial model and stable Session identity.
   * @param input - Display name and absolute working directory.
   * @param signal - Caller cancellation before the record is committed.
   * @returns The committed Bot record.
   */
  @Remote('create')
  async createBot(input: CreateBotRequest, signal: AbortSignal): Promise<BotRecord> {
    const parsed = createBotInput.safeParse(input)
    if (!parsed.success)
      throw new RemoteError('bot/invalid-input', 'Provide a name and absolute working directory', {
        field: 'input',
      })
    const directory = await stat(parsed.data.cwd).catch((error: unknown) => {
      if (missing(error)) return undefined
      throw error
    })
    if (directory === undefined || !directory.isDirectory()) {
      throw new RemoteError('bot/invalid-input', 'Choose an existing working directory', {
        field: 'cwd',
      })
    }
    signal.throwIfAborted()
    const botId = randomUUID()
    const record: BotRecord = {
      ...parsed.data,
      botId,
      sessionId: botId,
      provider: this.config.provider,
      model: this.config.model,
    }
    await this.records.put(botId, record)
    return record
  }

  /**
   * Read one persisted Bot.
   * @param botId - Identity returned by create.
   * @param signal - Caller cancellation.
   * @returns The validated record.
   */
  @Remote('get')
  async getBot(botId: string, signal: AbortSignal): Promise<BotRecord> {
    signal.throwIfAborted()
    this.validateBotId(botId)
    const record = this.records.get(botId)
    if (record === undefined) throw new RemoteError('bot/not-found', 'Bot not found', { botId })
    if (record.botId !== botId || record.sessionId !== botId)
      throw new Error('Bot record identity does not match its table key')
    return record
  }

  /**
   * List stored Bots without activating their Agents.
   * @param signal - Caller cancellation.
   * @returns The stored records in stable identity order.
   */
  @Remote('list')
  async listBots(signal: AbortSignal): Promise<readonly BotRecord[]> {
    const records: BotRecord[] = []
    for (const id of [...this.records.keys()].sort()) records.push(await this.getBot(id, signal))
    return records
  }

  /**
   * Admit one turn and stream assistant text; disconnecting stops observation only.
   * @param botId - Target Bot.
   * @param text - User prompt.
   * @param signal - Cancels observation, preserving accepted execution.
   * @returns Text frames and a final frame after durable flush; execution failures reject.
   */
  @Remote({ name: 'send', mode: 'stream' })
  async *send(botId: string, text: string, signal: AbortSignal): AsyncIterable<BotFrame> {
    if (typeof text !== 'string' || text.trim().length === 0)
      throw new RemoteError('bot/invalid-input', 'Message must not be empty', { field: 'text' })
    signal.throwIfAborted()
    if (this.stopping || this.busy.has(botId))
      throw new RemoteError('bot/busy', 'Bot is busy or stopping', { botId })
    this.busy.add(botId)
    let accepted = false
    try {
      const record = await this.getBot(botId, signal)
      const agent = await this.resolveAgent(record)
      signal.throwIfAborted()
      const queue = new TextQueue()
      let failure: unknown
      const stopStream = this.ctx.on(
        'agent/assistant-stream',
        ({ agent: owner, frame }) => {
          if (owner.id === agent.id && frame.type === 'chunk' && frame.chunk.type === 'text-delta')
            queue.push(frame.chunk.text)
        },
        { global: true },
      )
      const stopError = this.ctx.on(
        'agent/error',
        ({ agent: owner, error }) => {
          if (owner.id === agent.id) failure = error
        },
        { global: true },
      )
      const abort = (): void => {
        queue.close()
      }
      signal.addEventListener('abort', abort, { once: true })
      try {
        agent.followup(
          createUserMessage({ content: [{ type: 'text', text }], source: { kind: 'user' } }),
        )
        accepted = true
        const settled = agent
          .whenIdle()
          .then(async () => {
            if (!(await this.ctx.sessions.flush(agent.session)))
              throw new Error('Bot Session has no durability listener')
          })
          .catch((error: unknown) => {
            failure = error
          })
          .finally(() => {
            this.busy.delete(botId)
            queue.close()
          })
        for await (const chunk of queue) {
          signal.throwIfAborted()
          yield { type: 'text', text: chunk }
        }
        signal.throwIfAborted()
        await settled
        if (failure !== undefined)
          throw new RemoteError(
            'bot/turn-failed',
            'Bot execution failed',
            { botId },
            { cause: failure },
          )
        yield { type: 'done' }
      } finally {
        signal.removeEventListener('abort', abort)
        stopError()
        stopStream()
      }
    } finally {
      if (!accepted) this.busy.delete(botId)
    }
  }

  /**
   * Read canonical stored messages without creating or resuming an Agent.
   * @param botId - Target Bot.
   * @param signal - Caller cancellation.
   * @returns User and assistant text in event order.
   */
  @Remote('history')
  async history(botId: string, signal: AbortSignal): Promise<readonly ChatMessage[]> {
    const record = await this.getBot(botId, signal)
    const id = SessionId(record.sessionId)
    const live = this.ctx.sessions.get(id)
    let events: readonly SessionEvent[]
    if (live !== undefined) events = live.snapshotEvents()
    else {
      if ((await this.ctx.sessionPersistence.stat(id, { signal })) === undefined) return []
      await using stored = await this.ctx.sessionPersistence.open(id, 'read', { signal })
      events = (await stored.read()).events
    }
    const messages: ChatMessage[] = []
    for (const event of events) {
      const message = deriveEventMessage(event)
      if (message?.role !== 'user' && message?.role !== 'assistant') continue
      if (message.role === 'user' && message.source.kind !== 'user') continue
      const text = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
      messages.push({ role: message.role, text })
    }
    return messages
  }

  private async resolveAgent(record: BotRecord): Promise<Agent> {
    const owned = this.handles.get(record.botId)
    if (owned !== undefined) return owned.agent
    const sessionId = SessionId(record.sessionId)
    const presetId = `dsh-bot:${record.botId}`
    if (!this.presets.has(record.botId)) {
      this.presets.set(
        record.botId,
        await this.ctx.agentPresets.register({ id: presetId, plugins: [] }),
      )
    }
    const selection = {
      current: { provider: record.provider, model: record.model },
      assembled: undefined,
    }
    const setup = async (agentCtx: Context): Promise<void> => {
      installModelSelection(agentCtx, selection)
      await this.ctx.agentPresets.mount(agentCtx, presetId)
    }
    const agentOptions = { provider: record.provider, model: record.model }
    const handle =
      (await this.ctx.sessionPersistence.stat(sessionId)) === undefined
        ? await this.ctx.agents.create({
            sessionId,
            meta: { cwd: record.cwd, agentPreset: presetId },
            agentOptions,
            setup,
          })
        : await this.ctx.agents.resume({ resumeSessionId: sessionId, agentOptions, setup })
    this.handles.set(record.botId, handle)
    return handle.agent
  }

  private validateBotId(botId: string): void {
    if (!z.uuid().safeParse(botId).success)
      throw new RemoteError('bot/invalid-input', 'Invalid Bot identity', { field: 'botId' })
  }
}

/** Bridges live notifications for one observed turn. */
class TextQueue implements AsyncIterable<string> {
  private readonly buffer: string[] = []
  private waiter: (() => void) | undefined
  private done = false
  push(text: string): void {
    if (!this.done) {
      this.buffer.push(text)
      this.waiter?.()
    }
  }
  close(): void {
    this.done = true
    this.waiter?.()
  }
  async *[Symbol.asyncIterator](): AsyncIterator<string> {
    while (true) {
      while (this.buffer.length > 0) yield this.buffer.shift()!
      if (this.done) return
      await new Promise<void>((resolve) => {
        this.waiter = resolve
      })
      this.waiter = undefined
    }
  }
}

/** Stable Loader plugin name. */
export const name = 'bot'
/** Required execution services; dependency disposal follows the Bot controller. */
export const inject = BotController.inject
/**
 * Register the product Controller in the profile tree.
 * @param ctx - Plugin context.
 * @param config - Validated deployment values.
 * @returns Resolution after the domain is open and the Controller is registered.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const domain = await ctx.storageDomain.open(botDomain)
  ctx.effect(() => () => domain.close(), 'bot: record domain')
  new BotController(ctx, config, domain.table('bots'))
}
