/** Bot product service: one Bot, one Chat, one stable Session. */
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Service, type Context } from '@deepseek-ai/cordis'
import { installModelSelection, type Agent, type AgentHandle } from '@deepseek-ai/dsh-agent'
import { createUserMessage, type MessageSource } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'

/** Stored Bot record; the product-level identity of one ongoing conversation. */
export interface BotRecord {
  readonly botId: string
  readonly name: string
  readonly cwd: string
  readonly provider: string
  readonly model: string
  readonly sessionId: string
}

/** One frame the caller receives while a turn runs. */
export type BotFrame =
  | { readonly type: 'text'; readonly text: string }
  | { readonly type: 'done' }

/** One message read back from the Bot's Chat. */
export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly text: string
}

/** Configuration for the Bot service. */
export interface BotConfig {
  /** Root directory holding Bot records; defaults to `bots` under the Runner home. */
  readonly root: string
  /** Preset every Bot mounts; the Runner registers it at boot. */
  readonly presetId: string
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Bot product service. */
    botService: BotService
  }
}

const USER_SOURCE: MessageSource = { kind: 'user' }

/**
 * Owns Bot records, their Session association, and the Agent handle for each Bot.
 * All Agent activation for a Bot goes through this service.
 */
export class BotService extends Service {
  private readonly handles = new Map<string, AgentHandle>()

  /**
   * @param ctx - owning plugin context.
   * @param config - resolved service configuration.
   */
  constructor(ctx: Context, private readonly config: BotConfig) {
    super(ctx, 'botService')
    ctx.effect(() => async () => {
      const handles = [...this.handles.values()]
      this.handles.clear()
      for (const handle of handles) await handle.dispose()
    }, 'bot-service: agent handles')
  }

  /**
   * Create a Bot and its Session association.
   * @param input - display name and working directory for the new Bot.
   * @returns the stored Bot record.
   */
  async createBot(input: { readonly name: string; readonly cwd: string }): Promise<BotRecord> {
    const botId = randomUUID()
    const record: BotRecord = {
      botId,
      name: input.name,
      cwd: input.cwd,
      provider: 'fake',
      model: 'fake-1',
      sessionId: botId,
    }
    await this.write(record)
    return record
  }

  /**
   * Read one Bot record.
   * @param botId - identity returned by {@link createBot}.
   * @returns the stored record.
   */
  async getBot(botId: string): Promise<BotRecord> {
    const raw = await readFile(this.recordPath(botId), 'utf8')
    return JSON.parse(raw) as BotRecord
  }

  /**
   * List every stored Bot.
   * @returns Bot records in directory order.
   */
  async listBots(): Promise<readonly BotRecord[]> {
    let entries: string[]
    try {
      entries = await readdir(this.config.root)
    } catch {
      return []
    }
    const records: BotRecord[] = []
    for (const entry of entries) {
      if (!entry.endsWith('.json')) continue
      records.push(JSON.parse(await readFile(path.join(this.config.root, entry), 'utf8')) as BotRecord)
    }
    return records
  }

  /**
   * Send one message to a Bot and stream the turn's assistant text.
   * @param botId - target Bot identity.
   * @param text - user message text.
   * @returns frames for this turn; the iteration ends when the turn settles.
   */
  async *send(botId: string, text: string): AsyncIterable<BotFrame> {
    const record = await this.getBot(botId)
    const agent = await this.resolveAgent(record)
    const queue = new TextQueue()
    const stop = this.ctx.on('agent/assistant-stream', ({ agent: owner, frame }) => {
      if (owner.id !== agent.id) return
      if (frame.type !== 'chunk') return
      if (frame.chunk.type === 'text-delta') queue.push(frame.chunk.text)
    }, { global: true })
    // Attach before the prompt: a fast model can finish the turn before the
    // caller observes it, and an idle agent would then close an empty queue.
    const running = Promise.withResolvers<void>()
    const stopStatus = this.ctx.on('agent/status', ({ agent: owner, status }) => {
      if (owner.id === agent.id && status === 'running') running.resolve()
    }, { global: true })

    try {
      agent.followup(createUserMessage({ content: [{ type: 'text', text }], source: USER_SOURCE }))
      if (agent.status !== 'running') await running.promise
      const settled = agent.whenIdle().then(() => queue.close())
      for await (const chunk of queue) yield { type: 'text', text: chunk }
      await settled
      yield { type: 'done' }
    } finally {
      stopStatus()
      stop()
    }
  }

  /**
   * Read the Bot's Chat back from its durable Session log.
   * @param botId - target Bot identity.
   * @returns user and assistant messages in log order.
   */
  async history(botId: string): Promise<readonly ChatMessage[]> {
    const record = await this.getBot(botId)
    const session = this.ctx.sessions.get(SessionId(record.sessionId))
    const events = session === undefined
      ? await this.ctx.sessions.load(SessionId(record.sessionId))
      : session.snapshotEvents()
    const messages: ChatMessage[] = []
    for (const event of events) {
      if (event.type === 'user/message') {
        const text = event.data.content
          .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
          .map(block => block.text)
          .join('')
        messages.push({ role: 'user', text })
      }
      if (event.type === 'assistant/message') {
        const text = event.data.content
          .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
          .map(block => block.text)
          .join('')
        messages.push({ role: 'assistant', text })
      }
    }
    return messages
  }

  private async resolveAgent(record: BotRecord): Promise<Agent> {
    const sessionId = SessionId(record.sessionId)
    const live = this.ctx.agents.get(sessionId)
    if (live !== undefined) return live

    const selection = { current: { provider: record.provider, model: record.model }, assembled: undefined }
    const setup = async (agentCtx: Context): Promise<void> => {
      // Without an installed selection the loop assembles no request and the turn
      // ends with no model call at all.
      installModelSelection(agentCtx, selection)
    }
    const agentOptions = { provider: record.provider, model: record.model }
    const handle = this.ctx.sessions.get(sessionId) === undefined
      ? await this.ctx.agents.create({ sessionId, meta: { cwd: record.cwd }, agentOptions, setup })
      : await this.ctx.agents.resume({ resumeSessionId: sessionId, agentOptions, setup })
    this.handles.set(record.botId, handle)
    return handle.agent
  }

  private recordPath(botId: string): string {
    return path.join(this.config.root, `${botId}.json`)
  }

  private async write(record: BotRecord): Promise<void> {
    await mkdir(this.config.root, { recursive: true })
    const target = this.recordPath(record.botId)
    const temporary = `${target}.${process.pid}.tmp`
    await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
    await rename(temporary, target)
  }
}

/** Bridges synchronous stream notifications into one async iteration. */
class TextQueue implements AsyncIterable<string> {
  private readonly buffer: string[] = []
  private waiter: (() => void) | undefined
  private done = false

  push(text: string): void {
    if (this.done) return
    this.buffer.push(text)
    this.waiter?.()
    this.waiter = undefined
  }

  close(): void {
    this.done = true
    this.waiter?.()
    this.waiter = undefined
  }

  async *[Symbol.asyncIterator](): AsyncIterator<string> {
    while (true) {
      while (this.buffer.length > 0) yield this.buffer.shift() as string
      if (this.done) return
      await new Promise<void>((resolve) => { this.waiter = resolve })
    }
  }
}

/**
 * Cordis plugin entry for the Bot service.
 * @param ctx - plugin context.
 * @param config - service configuration supplied by the profile.
 */
export function apply(ctx: Context, config: BotConfig): void {
  ctx.plugin(BotService, config)
}

/** Stable plugin name. */
export const name = 'bot'
