/** Bot Remote owner; execution and durable history belong to Harness services. */
import { randomUUID } from 'node:crypto'
import { stat } from 'node:fs/promises'
import path from 'node:path'

import type { Context } from '@deepseek-ai/cordis'
import { installModelSelection, type Agent, type AgentHandle } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-loop'
import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import type { OwnedSessionAgent } from '@deepseek-ai/dsh-api-session-controller'
import { createUserMessage, ReasoningEffortId, type LlmCallConfig } from '@deepseek-ai/dsh-llm'
import {
  deriveEventMessage,
  SessionId,
  SessionLogOffset,
  type SessionEvent,
} from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-persistence'
import type {} from '@deepseek-ai/dsh-session-projection'
import { defineDomain, domainTable, type KvTable } from '@deepseek-ai/dsh-storage-domain'
import type {} from '@deepseek-ai/dsh-system-prompt'
import {
  Remote,
  RemoteError,
  TypertRemoteService,
  type OperationLease,
} from '@deepseek-ai/dsh-typert-protocol'
import { snapshotJsonValue, type JsonValue } from '@deepseek-ai/dsh-util-values'
import type {} from '@deepseek-ai/dsh-working-directory'
import schema from '@deepseek-ai/schemastery'
import { z } from 'zod'

import type {
  BotInputState,
  PendingInput,
  BotConfiguration,
  BotConfigurationOptions,
  BotTemplate,
  BotListEntry,
  BotFrame,
  BotRecord,
  ChatMessage,
  ConfigurationRejectionReason,
  CreateBotRequest,
  SaveBotConfigurationRequest,
} from './types.ts'
export type {
  BotConfiguration,
  BotFrame,
  BotRecord,
  ChatMessage,
  ConfigurationRejectionReason,
  CreateBotRequest,
  SaveBotConfigurationRequest,
} from './types.ts'

/** Deployment-approved preset contribution; callers select its capability id. */
export interface CapabilityPlugin {
  readonly name: string
  readonly config: Record<string, JsonValue>
}

/** Initial model and approved capabilities; keys and plugin configuration stay execution-side. */
export interface Config {
  readonly provider: string
  readonly model: string
  readonly capabilities: Record<string, CapabilityPlugin[]>
  readonly templates?: BotTemplate[]
}

const capabilityConfiguration = schema.transform(
  schema.dict(schema.any<JsonValue>()).required(),
  (value) => {
    const snapshot = snapshotJsonValue(value)
    if (snapshot === undefined)
      throw new schema.ValidationError(
        'Bot capability configuration must contain lossless JSON values',
        {},
      )
    return snapshot
  },
)

/** Validates deployment values before the plugin activates. */
export const Config: schema<Config> = schema.object({
  provider: schema.string().default('deepseek-official'),
  model: schema.string().default('deepseek-flash'),
  templates: schema.array(schema.any<BotTemplate>()).default([]),
  capabilities: schema
    .dict(
      schema.array(
        schema.object({ name: schema.string().required(), config: capabilityConfiguration }),
      ),
    )
    .default({}),
})

const storedCapabilityPlugins = z.array(
  z.object({ name: z.string().min(1), config: z.record(z.string(), z.json()) }),
)

/** Execution-only configuration; never exposed through Bot Remote results. */
interface StoredBot extends BotRecord {
  readonly capabilityConfiguration?: Record<string, CapabilityPlugin[]>
}

const storedBot = z.object({
  botId: z.uuid(),
  name: z.string().trim().min(1),
  cwd: z.string().refine(path.isAbsolute, 'Working directory must be absolute'),
  provider: z.string().min(1),
  model: z.string().min(1),
  sessionId: z.uuid(),
  revision: z.number().int().nonnegative().default(0),
  baseInstructions: z.string().default(''),
  instructions: z.string().default(''),
  capabilities: z.array(z.string().min(1)).default([]),
  capabilityConfiguration: z.record(z.string(), storedCapabilityPlugins).optional(),
  maxTokens: z.number().int().positive().nullable().default(null),
  reasoningEffort: z.string().min(1).nullable().default(null),
  inputMode: z.enum(['queue', 'steer']).default('queue'),
})

const configurationInput = storedBot
  .pick({
    cwd: true,
    provider: true,
    model: true,
    instructions: true,
    baseInstructions: true,
    capabilities: true,
    maxTokens: true,
    reasoningEffort: true,
    inputMode: true,
  })
  .required()
  .extend({
    inputMode: storedBot.shape.inputMode,
    baseInstructions: storedBot.shape.baseInstructions,
  })
const saveConfigurationInput = z.object({
  expectedRevision: z.number().int().nonnegative(),
  configuration: configurationInput,
})
const storedTransaction = z.object({ previous: storedBot, candidate: storedBot })
interface ConfigurationTransaction {
  readonly previous: StoredBot
  readonly candidate: StoredBot
}

const templateInput = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  configuration: configurationInput.omit({ cwd: true }),
})
const createBotInput = storedBot
  .pick({ name: true, cwd: true })
  .extend({ templateId: z.string().min(1).optional() })
const botDomain = defineDomain({
  name: 'dsh_bot',
  version: 1,
  tables: {
    bots: domainTable(storedBot),
    configuration_transactions: domainTable(storedTransaction),
  },
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
    'llm',
    'systemPrompt',
    'workingDirectory',
    'sessionProjections',
  ]
  private readonly handles = new Map<string, AgentHandle>()
  private readonly presets = new Map<string, () => Promise<void>>()
  private readonly busy = new Set<string>()
  private readonly stoppingTurns = new Set<string>()
  private readonly prompts = new Map<string, number>()
  private readonly applying = new Map<string, StoredBot>()
  private readonly faults = new Set<string>()
  private readonly operations = new Set<Promise<BotRecord>>()
  private readonly turns = new Set<Promise<void>>()
  private shutdown: Promise<void> | undefined
  private readonly lifetime = new AbortController()
  private readonly owner: Context
  private readonly activations = new Map<string, Promise<Agent>>()
  private readonly access = new Map<string, number>()
  private accessDrained: (() => void) | undefined
  private stopping = false

  /**
   * @param ctx - Owning plugin context.
   * @param config - Validated deployment values.
   * @param records - Validated domain table, closed after Agent teardown.
   * @param transactions - Durable intents; an outstanding intent stops execution after restart.
   */
  constructor(
    ctx: Context,
    private readonly config: Config,
    private readonly records: KvTable<string, StoredBot>,
    private readonly transactions: KvTable<string, ConfigurationTransaction>,
  ) {
    super(ctx, 'botController', { namespace: 'bot' })
    this.owner = ctx
    for (const id of transactions.keys()) this.faults.add(id)
    ctx.effect(() => () => this.quiesce(), 'bot: Agent handles and preset declarations')
  }

  /** Stop new execution and configuration admission while accepted work can still clean up. */
  stopAdmission(): void {
    this.stopping = true
  }

  /**
   * Settle accepted operations and release owned Agents before profile dependencies close.
   * @returns The shared completion barrier, rejecting on resource cleanup failure.
   */
  quiesce(): Promise<void> {
    return (this.shutdown ??= (async () => {
      this.stopAdmission()
      this.lifetime.abort(new Error('Bot controller is stopping'))
      await Promise.allSettled([...this.operations, ...this.activations.values()])
      if (this.access.size > 0)
        await new Promise<void>((resolve) => {
          this.accessDrained = resolve
        })
      const failures: unknown[] = []
      for (const handle of this.handles.values()) {
        try {
          if (handle.agent.status === 'running')
            handle.agent.cancel({ kind: 'disposed' }, { keepInbox: true })
        } catch (error) {
          failures.push(error)
        }
      }
      await Promise.allSettled(this.turns)
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
    })())
  }

  /**
   * Create a Bot with its own initial model and stable Session identity.
   * @param input - Display name and absolute working directory.
   * @param signal - Caller cancellation before the record is committed.
   * @returns The committed Bot record.
   */
  @Remote('create')
  createBot(input: CreateBotRequest, signal: AbortSignal): Promise<BotRecord> {
    const operation = this.persistNewBot(input, signal)
    this.operations.add(operation)
    const release = (): void => {
      this.operations.delete(operation)
    }
    void operation.then(release, release)
    return operation
  }

  private async persistNewBot(input: CreateBotRequest, signal: AbortSignal): Promise<BotRecord> {
    signal.throwIfAborted()
    if (this.stopping)
      throw new RemoteError('bot/operation-unavailable', 'Runner is stopping', {
        operation: 'create',
      })
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
    const { name, cwd, templateId } = parsed.data
    const template = this.templateChoices().find((item) => item.id === (templateId ?? 'blank'))
    if (template === undefined)
      throw new RemoteError('bot/invalid-input', 'Choose an available template', {
        field: 'templateId',
      })
    const botId = randomUUID()
    const record: StoredBot = {
      ...template.configuration,
      capabilityConfiguration: snapshotCapabilities(
        template.configuration.capabilities,
        this.config,
        botId,
      ),
      name,
      cwd,
      botId,
      sessionId: botId,
      revision: 0,
    }
    await this.validateConfiguration(record, signal)
    await this.records.put(botId, record)
    return this.publicRecord(record)
  }

  private templateChoices(): BotTemplate[] {
    const defaults: BotTemplate = {
      id: 'blank',
      name: '空白助手',
      configuration: {
        provider: this.config.provider,
        model: this.config.model,
        baseInstructions: '',
        instructions: '',
        capabilities: [],
        maxTokens: null,
        reasoningEffort: null,
        inputMode: 'queue',
      },
    }
    const templates = [
      defaults,
      ...(this.config.templates ?? []).map((item) => templateInput.parse(item)),
    ]
    if (new Set(templates.map((item) => item.id)).size !== templates.length)
      throw new Error('Bot template identities must be unique')
    return templates
  }

  /**
   * List safe creation templates and approved capability identities.
   * @param signal - Caller cancellation.
   * @returns Detached choices without plugin configuration or credentials.
   */
  @Remote('configurationOptions')
  async configurationOptions(signal: AbortSignal): Promise<BotConfigurationOptions> {
    signal.throwIfAborted()
    return structuredClone({
      templates: this.templateChoices(),
      capabilities: Object.keys(this.config.capabilities).sort(),
    })
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
    return this.publicRecord(this.readBot(botId))
  }

  private publicRecord(record: StoredBot): BotRecord {
    return storedBot.omit({ capabilityConfiguration: true }).parse(record)
  }

  private readBot(botId: string): StoredBot {
    this.validateBotId(botId)
    const record =
      this.applying.get(botId) ?? this.transactions.get(botId)?.previous ?? this.records.get(botId)
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
  async listBots(signal: AbortSignal): Promise<readonly BotListEntry[]> {
    const records: BotListEntry[] = []
    for (const id of [...new Set([...this.records.keys(), ...this.transactions.keys()])].sort()) {
      const record = await this.getBot(id, signal)
      records.push({
        ...record,
        status:
          this.stopping || this.faults.has(id) || this.applying.has(id)
            ? 'unavailable'
            : (this.handles.get(id)?.agent.status ?? 'idle'),
      })
    }
    return records
  }

  /**
   * Persist and apply a complete configuration while preserving the Bot's Session.
   * @param botId - Bot whose committed revision the caller edited.
   * @param request - Expected revision and complete replacement configuration.
   * @param signal - Cancellation before the durable transaction begins; committed work finishes independently.
   * @returns The new committed record after its Agent is ready and persistence has flushed.
   */
  @Remote('saveConfiguration')
  saveConfiguration(
    botId: string,
    request: SaveBotConfigurationRequest,
    signal: AbortSignal,
  ): Promise<BotRecord> {
    const operation = this.applyConfiguration(botId, request, signal)
    this.operations.add(operation)
    const release = (): void => {
      this.operations.delete(operation)
    }
    void operation.then(release, release)
    return operation
  }

  private async applyConfiguration(
    botId: string,
    request: SaveBotConfigurationRequest,
    caller: AbortSignal,
  ): Promise<BotRecord> {
    caller.throwIfAborted()
    this.validateBotId(botId)
    if (this.applying.has(botId)) this.rejectConfiguration(botId, 'replacing')
    if (this.stopping || this.faults.has(botId)) this.rejectConfiguration(botId, 'unavailable')
    const previous = this.readBot(botId)
    const owned = this.handles.get(botId)
    if (this.busy.has(botId) || owned?.agent.status === 'running')
      this.rejectConfiguration(botId, 'running')
    if (owned !== undefined && this.hasPending(owned.agent))
      this.rejectConfiguration(botId, 'pending-input')
    if (this.access.has(botId) || this.activations.has(botId))
      this.rejectConfiguration(botId, 'maintenance')
    if (this.ctx.agents.get(SessionId(previous.sessionId)) !== owned?.agent)
      this.rejectConfiguration(botId, 'unavailable')
    const parsed = saveConfigurationInput.safeParse(request)
    if (!parsed.success)
      throw new RemoteError('bot/config-invalid', 'Provide a complete valid configuration', {
        botId,
        field: 'configuration',
      })
    if (parsed.data.expectedRevision !== previous.revision)
      throw new RemoteError(
        'bot/config-conflict',
        'Reload the current Bot configuration before saving',
        {
          botId,
          expectedRevision: parsed.data.expectedRevision,
          actualRevision: previous.revision,
        },
      )
    const candidate: StoredBot = {
      ...previous,
      ...parsed.data.configuration,
      capabilityConfiguration: snapshotCapabilities(
        parsed.data.configuration.capabilities,
        this.config,
        botId,
        previous.capabilityConfiguration,
      ),
      revision: previous.revision + 1,
    }
    this.applying.set(botId, previous)
    let persistAttempted = false
    let disposal: Promise<void> | undefined
    let runtimeChanged = false
    let disposalFailed = false
    const prepare = async (maintenance?: AbortSignal): Promise<void> => {
      const signal = AbortSignal.any([
        caller,
        this.lifetime.signal,
        ...(maintenance === undefined ? [] : [maintenance]),
      ])
      if (owned === undefined) await this.rejectStoredPending(previous, signal)
      await this.validateConfiguration(candidate, signal)
      signal.throwIfAborted()
      if (owned !== undefined && this.hasPending(owned.agent))
        this.rejectConfiguration(botId, 'pending-input')
      persistAttempted = true
      await this.transactions.put(botId, { previous, candidate })
      await this.records.put(botId, candidate)
      signal.throwIfAborted()
      if (owned !== undefined && this.hasPending(owned.agent))
        this.rejectConfiguration(botId, 'pending-input')
      if (owned !== undefined) {
        // Disposal cancels synchronously; waiting here would wait on this maintenance task itself.
        disposal = owned.dispose()
        void disposal.catch((_error: unknown) => {
          disposalFailed = true
        })
      }
    }
    try {
      let prepared: Promise<void>
      try {
        prepared = owned === undefined ? prepare() : owned.agent.runMaintenance(prepare)
      } catch (error: unknown) {
        this.rejectConfiguration(botId, 'maintenance', error)
      }
      await prepared
      if (disposal !== undefined) await disposal
      runtimeChanged = true
      this.handles.delete(botId)
      try {
        await this.removePreset(botId)
      } catch (error: unknown) {
        disposalFailed = true
        throw error
      }
      const agent = await this.resolveAgent(candidate, previous.cwd)
      if (!(await this.ctx.sessions.flush(agent.session)))
        throw new Error('Bot Session has no durability listener')
      await this.transactions.delete(botId)
      return this.publicRecord(candidate)
    } catch (error: unknown) {
      if (disposalFailed) {
        this.faults.add(botId)
        throw new RemoteError(
          'bot/faulted',
          'Agent teardown failed; Bot execution has stopped',
          { botId },
          { cause: error },
        )
      }
      try {
        if (persistAttempted) {
          if (runtimeChanged) {
            await this.handles.get(botId)?.dispose()
            this.handles.delete(botId)
            await this.removePreset(botId)
          }
          await this.records.put(botId, previous)
          if (runtimeChanged) {
            const restored = await this.resolveAgent(previous)
            if (!(await this.ctx.sessions.flush(restored.session)))
              throw new Error('Restored Bot Session has no durability listener')
          }
          await this.transactions.delete(botId)
        }
      } catch (recovery: unknown) {
        this.faults.add(botId)
        throw new RemoteError(
          'bot/faulted',
          'Configuration recovery failed; Bot execution has stopped',
          { botId },
          { cause: new AggregateError([error, recovery], 'Bot configuration recovery failed') },
        )
      }
      if (
        !persistAttempted ||
        (error instanceof RemoteError && error.code === 'bot/config-rejected')
      )
        throw error
      throw new RemoteError(
        'bot/config-failed',
        'Configuration could not be applied; previous configuration restored',
        { botId, rolledBack: true },
        { cause: error },
      )
    } finally {
      this.applying.delete(botId)
    }
  }

  private rejectConfiguration(
    botId: string,
    reason: ConfigurationRejectionReason,
    cause?: unknown,
  ): never {
    const handle = this.handles.get(botId)
    throw new RemoteError(
      'bot/config-rejected',
      'Bot cannot apply configuration now',
      {
        botId,
        reason,
        ...(handle === undefined ? {} : { pendingCount: this.pendingCount(handle.agent) }),
      },
      { cause },
    )
  }

  private pendingCount(agent: Agent): number {
    return agent.inbox.nextTurn.length + agent.inbox.nextStep.length
  }

  private hasPending(agent: Agent): boolean {
    return agent.inbox.nextTurn.length > 0 || agent.inbox.nextStep.length > 0
  }

  private async rejectStoredPending(record: BotRecord, signal: AbortSignal): Promise<void> {
    const id = SessionId(record.sessionId)
    if ((await this.ctx.sessionPersistence.stat(id, { signal })) === undefined) return
    await using stored = await this.ctx.sessionPersistence.open(id, 'read', { signal })
    const { events } = await stored.read(0, undefined, { signal })
    const { snapshot } = this.ctx.sessionProjections.restore(
      {},
      events,
      SessionLogOffset(0),
      stored.header,
      stored.inheritedEventCount,
    )
    const inbox = snapshot.values.inbox
    if (inbox === undefined)
      throw new Error('Bot configuration requires the standard inbox projection')
    const pendingCount = inbox['next-turn'].length + inbox['next-step'].length
    if (pendingCount > 0)
      throw new RemoteError('bot/config-rejected', 'Bot still owns pending input', {
        botId: record.botId,
        reason: 'pending-input',
        pendingCount,
      })
  }

  private modelOptions(configuration: BotConfiguration): LlmCallConfig {
    return {
      provider: configuration.provider,
      model: configuration.model,
      ...(configuration.maxTokens === null ? {} : { maxTokens: configuration.maxTokens }),
      ...(configuration.reasoningEffort === null
        ? {}
        : { reasoningEffort: ReasoningEffortId(configuration.reasoningEffort) }),
    }
  }

  private capabilityPlugins(configuration: StoredBot): CapabilityPlugin[] {
    return configuration.capabilities.flatMap((id) => {
      const plugins = configuration.capabilityConfiguration?.[id]
      if (plugins === undefined) throw new Error(`Missing Bot capability snapshot: ${id}`)
      return structuredClone(plugins)
    })
  }

  private async validateConfiguration(candidate: StoredBot, signal: AbortSignal): Promise<void> {
    try {
      const directory = await stat(candidate.cwd)
      if (!directory.isDirectory()) throw new Error('Working directory is not a directory')
      const names = candidate.capabilities
      if (new Set(names).size !== names.length) throw new Error('Capability ids must be unique')
      const plugins = this.capabilityPlugins(candidate)
      await this.ctx.llm.resolveCallConfig(this.modelOptions(candidate), signal)
      const presetId = `dsh-bot:${candidate.botId}:validate:${randomUUID()}`
      const dispose = await this.ctx.agentPresets.register({ id: presetId, plugins })
      try {
        await using _lease = await this.ctx.agentPresets.acquireScope(presetId)
        signal.throwIfAborted()
      } finally {
        await dispose()
      }
    } catch (error: unknown) {
      signal.throwIfAborted()
      throw new RemoteError(
        'bot/config-invalid',
        'Configuration cannot be assembled; check the directory, model, and capability selection',
        { botId: candidate.botId, field: 'configuration' },
        { cause: error },
      )
    }
  }

  private async removePreset(botId: string): Promise<void> {
    await this.presets.get(botId)?.()
    this.presets.delete(botId)
  }

  /**
   * Submit into the standard inbox using the Bot's committed input mode.
   * @param botId - Target Bot.
   * @param text - Text admitted once; callers must not retry an uncertain result.
   * @param signal - Cancellation before admission; accepted input remains owned by Runner.
   * @returns Durable identity and the actual mode used.
   */
  @Remote('submit')
  async submit(botId: string, text: string, signal: AbortSignal): Promise<PendingInput> {
    if (typeof text !== 'string' || text.trim().length === 0 || text.length > 32_768)
      throw new RemoteError('bot/invalid-input', 'Message must contain 1 to 32768 characters', {
        field: 'text',
      })
    return this.withInputAgent(botId, signal, async (agent, record) => {
      if (this.stoppingTurns.has(botId))
        throw new RemoteError('bot/busy', 'Bot is stopping its current execution', { botId })
      const message = createUserMessage({
        content: [{ type: 'text', text }],
        source: { kind: 'user' },
      })
      const mode = record.inputMode ?? 'queue'
      if (mode === 'steer') agent.steer(message)
      else agent.followup(message)
      // The execution belongs to Runner even if the submitting observer goes away.
      const settled = agent
        .whenIdle()
        .then(() => this.flushInput(agent))
        .catch(() => {
          this.faults.add(botId)
        })
      this.turns.add(settled)
      void settled.finally(() => this.turns.delete(settled))
      await this.flushInput(agent)
      return { id: message.id, text, mode }
    })
  }

  /**
   * Observe the canonical inbox without waking its driver.
   * @param botId - Target Bot.
   * @param signal - Caller cancellation before reading.
   * @returns Current execution state and removable pending identities.
   */
  @Remote('inputState')
  async inputState(botId: string, signal: AbortSignal): Promise<BotInputState> {
    return this.withInputAgent(botId, signal, async (agent, record) => {
      const lastTurn = agent.session.snapshotEvents().findLast((event) => event.type === 'turn/end')
      const reason = lastTurn?.data.reason
      return {
        interrupted:
          agent.status === 'idle' &&
          (reason?.kind === 'interrupted' ||
            (reason?.kind === 'aborted' && reason.reason.kind === 'disposed')),
        status: agent.status,
        mode: record.inputMode ?? 'queue',
        pending: [
          ...agent.inbox.nextTurn.map((message) => ({ message, mode: 'queue' as const })),
          ...agent.inbox.nextStep.map((message) => ({ message, mode: 'steer' as const })),
        ]
          .filter(({ message }) => message.source.kind === 'user')
          .map(({ message, mode }) => ({
            id: message.id,
            text: message.content
              .filter((block) => block.type === 'text')
              .map((block) => block.text)
              .join(''),
            mode,
          })),
      }
    })
  }

  /**
   * Stop only current execution and preserve every unclaimed inbox message.
   * @param botId - Target Bot.
   * @param signal - Cancellation before the stop is accepted.
   * @returns After execution settles and the retained inbox is durable.
   */
  @Remote('stop')
  async stop(botId: string, signal: AbortSignal): Promise<void> {
    await this.withInputAgent(botId, signal, async (agent) => {
      if (this.stoppingTurns.has(botId))
        throw new RemoteError('bot/busy', 'Bot is already stopping', { botId })
      this.stoppingTurns.add(botId)
      try {
        agent.cancel({ kind: 'user' }, { keepInbox: true })
        await agent.whenIdle()
        await this.flushInput(agent)
      } finally {
        this.stoppingTurns.delete(botId)
      }
    })
  }

  /**
   * Withdraw one still-pending identity without cancelling execution.
   * @param botId - Target Bot.
   * @param messageId - Exact identity returned on admission or by inputState.
   * @param signal - Cancellation before removal.
   * @returns False when the input has already been claimed or withdrawn.
   */
  @Remote('withdraw')
  async withdraw(
    botId: string,
    messageId: string,
    signal: AbortSignal,
  ): Promise<{ readonly removed: boolean }> {
    return this.withInputAgent(botId, signal, async (agent) => {
      for (const [target, messages] of [
        ['next-turn', agent.inbox.nextTurn],
        ['next-step', agent.inbox.nextStep],
      ] as const) {
        const index = messages.findIndex(
          (message) => message.id === messageId && message.source.kind === 'user',
        )
        if (index !== -1) {
          agent.inbox.splice(target, index, 1, [])
          await this.flushInput(agent)
          return { removed: true }
        }
      }
      return { removed: false }
    })
  }

  private async withInputAgent<T>(
    botId: string,
    signal: AbortSignal,
    operation: (agent: Agent, record: BotRecord) => Promise<T>,
  ): Promise<T> {
    const lease = this.acquireSessionAccess(SessionId(botId), 'write', signal)
    try {
      const record = this.readBot(botId)
      const agent = await this.observeActivation(this.resolveAgent(record), signal)
      signal.throwIfAborted()
      if (this.stopping) this.rejectConfiguration(botId, 'unavailable')
      return await operation(agent, record)
    } finally {
      await lease.release()
    }
  }

  private async flushInput(agent: Agent): Promise<void> {
    if (!(await this.owner.sessions.flush(agent.session)))
      throw new Error('Bot Session has no durability listener')
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
    if (this.faults.has(botId))
      throw new RemoteError('bot/faulted', 'Bot configuration recovery is required', { botId })
    if (
      this.stopping ||
      this.stoppingTurns.has(botId) ||
      this.busy.has(botId) ||
      this.prompts.has(botId) ||
      this.applying.has(botId)
    )
      throw new RemoteError('bot/busy', 'Bot is busy or stopping', { botId })
    this.busy.add(botId)
    let accepted = false
    try {
      const record = this.readBot(botId)
      const agent = await this.resolveAgent(record)
      signal.throwIfAborted()
      if (this.stopping) throw new RemoteError('bot/busy', 'Bot is stopping', { botId })
      if (
        agent.status === 'running' ||
        agent.inbox.nextTurn.length > 0 ||
        agent.inbox.nextStep.some((message) => message.source.kind === 'user')
      )
        throw new RemoteError('bot/busy', 'Bot already has running or pending input', { botId })
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
            if (!(await this.owner.sessions.flush(agent.session)))
              throw new Error('Bot Session has no durability listener')
          })
          .catch((error: unknown) => {
            failure = error
          })
          .finally(() => {
            this.busy.delete(botId)
            queue.close()
          })
        this.turns.add(settled)
        const releaseTurn = (): void => {
          this.turns.delete(settled)
        }
        void settled.then(releaseTurn, releaseTurn)
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
    if (this.applying.has(botId)) this.rejectConfiguration(botId, 'replacing')
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

  /**
   * Identify a Bot or a durable subagent's containing Bot without activation.
   * @param sessionId - Session addressed by a Host operation.
   * @param signal - Cancellation of metadata reads.
   * @returns The containing Bot Session, or undefined for unmanaged Sessions.
   */
  async sessionOwner(sessionId: SessionId, signal: AbortSignal): Promise<SessionId | undefined> {
    const seen = new Set<SessionId>()
    let current = sessionId
    while (true) {
      signal.throwIfAborted()
      if (this.stopping) this.rejectConfiguration(current, 'unavailable')
      if (this.records.get(current) !== undefined || this.transactions.get(current) !== undefined)
        return current
      if (seen.has(current)) throw new Error('Session ownership lineage contains a cycle')
      seen.add(current)
      const header =
        this.owner.sessions.get(current)?.header ??
        (await this.owner.sessionPersistence.stat(current, { signal }))?.header
      if (header?.origin !== 'subagent' || header.parentSession === undefined) return undefined
      current = header.parentSession
    }
  }

  /**
   * Protect a known Bot from replacement through an operation's cleanup.
   * @param sessionId - Bot Session returned by sessionOwner.
   * @param mode - Historical reads may remain available in a faulted Bot.
   * @param signal - Caller cancellation before acquisition.
   * @returns An idempotent operation lease; its caller owns release.
   */
  acquireSessionAccess(
    sessionId: SessionId,
    mode: 'read' | 'write' | 'prompt',
    signal: AbortSignal,
  ): OperationLease {
    signal.throwIfAborted()
    if (this.stopping) this.rejectConfiguration(sessionId, 'unavailable')
    this.readBot(sessionId)
    if (this.applying.has(sessionId)) this.rejectConfiguration(sessionId, 'replacing')
    if (mode === 'prompt' && this.busy.has(sessionId))
      throw new RemoteError('bot/busy', 'Bot already has an admitted streamed turn', {
        botId: sessionId,
      })
    if (mode !== 'read' && this.faults.has(sessionId))
      throw new RemoteError('bot/faulted', 'Bot configuration recovery is required', {
        botId: sessionId,
      })
    this.access.set(sessionId, (this.access.get(sessionId) ?? 0) + 1)
    if (mode === 'prompt') this.prompts.set(sessionId, (this.prompts.get(sessionId) ?? 0) + 1)
    let released = false
    return {
      release: () => {
        if (released) return
        released = true
        if (mode === 'prompt') {
          const prompts = this.prompts.get(sessionId)! - 1
          if (prompts === 0) this.prompts.delete(sessionId)
          else this.prompts.set(sessionId, prompts)
        }
        const remaining = this.access.get(sessionId)! - 1
        if (remaining === 0) this.access.delete(sessionId)
        else this.access.set(sessionId, remaining)
        if (this.access.size === 0) this.accessDrained?.()
      },
    }
  }

  /**
   * Resolve a Bot Agent while retaining its actual handle in this Controller.
   * @param sessionId - Ordinary Session identity; child routing remains with Harness.
   * @param signal - Cancels this observer without abandoning owned initialization.
   * @returns Owned Agent and exact selection, or undefined for another owner.
   */
  async resolveSessionAgent(
    sessionId: SessionId,
    signal: AbortSignal,
  ): Promise<OwnedSessionAgent | undefined> {
    const owner = await this.sessionOwner(sessionId, signal)
    if (owner !== sessionId) return undefined
    const lease = this.acquireSessionAccess(owner, 'write', signal)
    try {
      const record = this.readBot(owner)
      const agent = await this.observeActivation(this.resolveAgent(record), signal)
      return { agent, selection: this.modelOptions(record) }
    } finally {
      await lease.release()
    }
  }

  /**
   * Prepare follow without activating a stored, otherwise cold Session.
   * @param sessionId - Bot Session protected by a follow-opening lease.
   * @param signal - Cancellation while waiting for owned initialization.
   * @returns After pending initialization, or first empty Session creation, is ready.
   */
  async prepareSessionFollow(sessionId: SessionId, signal: AbortSignal): Promise<void> {
    const stored =
      this.owner.sessions.get(sessionId)?.header ??
      (await this.owner.sessionPersistence.stat(sessionId, { signal }))?.header
    const pending = this.activations.get(sessionId)
    if (pending !== undefined) await this.observeActivation(pending, signal)
    const live = this.owner.agents.get(sessionId)
    if (live !== undefined && this.handles.get(sessionId)?.agent !== live)
      this.rejectConfiguration(sessionId, 'unavailable')
    if (stored === undefined && this.owner.sessions.get(sessionId) === undefined)
      await this.resolveSessionAgent(sessionId, signal)
  }

  private async observeActivation(task: Promise<Agent>, signal: AbortSignal): Promise<Agent> {
    signal.throwIfAborted()
    let abort!: () => void
    const cancelled = new Promise<never>((_resolve, reject) => {
      abort = () => {
        reject(signal.reason)
      }
      signal.addEventListener('abort', abort, { once: true })
    })
    try {
      const agent = await Promise.race([task, cancelled])
      signal.throwIfAborted()
      return agent
    } finally {
      signal.removeEventListener('abort', abort)
    }
  }

  private async resolveAgent(record: StoredBot, originalCwd = record.cwd): Promise<Agent> {
    if (this.stopping) this.rejectConfiguration(record.botId, 'unavailable')
    const pending = this.activations.get(record.botId)
    if (pending !== undefined) return pending
    const operation = this.createOwnedAgent(record, originalCwd)
    this.activations.set(record.botId, operation)
    try {
      return await operation
    } finally {
      this.activations.delete(record.botId)
    }
  }

  private async createOwnedAgent(record: StoredBot, originalCwd: string): Promise<Agent> {
    const owned = this.handles.get(record.botId)
    if (owned !== undefined) return owned.agent
    const foreign = this.owner.agents.get(SessionId(record.sessionId))
    if (foreign !== undefined) this.rejectConfiguration(record.botId, 'unavailable')
    const sessionId = SessionId(record.sessionId)
    const presetId = `dsh-bot:${record.botId}`
    if (!this.presets.has(record.botId)) {
      this.presets.set(
        record.botId,
        await this.owner.agentPresets.register({
          id: presetId,
          plugins: this.capabilityPlugins(record),
        }),
      )
    }
    const selection = {
      current: this.modelOptions(record),
      assembled: undefined,
    }
    const setup = async (agentCtx: Context, agent: Agent): Promise<void> => {
      installModelSelection(agentCtx, selection)
      await this.ctx.agentPresets.mount(agentCtx, presetId)
      const baseInstructions = record.baseInstructions ?? ''
      if (baseInstructions)
        agentCtx.effect(() =>
          agentCtx.systemPrompt.section({
            name: 'dsh-bot:base-instructions',
            order: 10200,
            text: baseInstructions,
            interpolate: false,
          }),
        )
      if (record.instructions.length > 0)
        agentCtx.effect(() =>
          agentCtx.systemPrompt.section({
            name: 'dsh-bot:instructions',
            order: 10250,
            text: record.instructions,
            interpolate: false,
          }),
        )
      if (this.ctx.workingDirectory.get(agent.session) !== record.cwd)
        await this.ctx.workingDirectory.set(agent, record.cwd)
    }
    const agentOptions = this.modelOptions(record)
    const handle =
      (await this.ctx.sessionPersistence.stat(sessionId)) === undefined
        ? await this.owner.agents.create({
            sessionId,
            signal: this.lifetime.signal,
            meta: { cwd: originalCwd, agentPreset: presetId },
            agentOptions,
            setup,
          })
        : await this.owner.agents.resume({
            resumeSessionId: sessionId,
            agentOptions,
            setup,
            signal: this.lifetime.signal,
          })
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

/** Copy approved configurations; retained capabilities keep their original values. */
function snapshotCapabilities(
  ids: readonly string[],
  config: Config,
  botId: string,
  previous: Record<string, CapabilityPlugin[]> = {},
): Record<string, CapabilityPlugin[]> {
  return Object.fromEntries(
    ids.map((id) => {
      const plugins = Object.hasOwn(previous, id)
        ? previous[id]
        : Object.hasOwn(config.capabilities, id)
          ? config.capabilities[id]
          : undefined
      if (plugins === undefined)
        throw new RemoteError('bot/config-invalid', 'Unknown Bot capability', {
          botId,
          field: 'capabilities',
        })
      return [id, structuredClone(plugins)]
    }),
  )
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
  try {
    // Legacy records cannot recover historical options; freeze installed values once.
    const migrate = (record: z.output<typeof storedBot>) => ({
      ...record,
      capabilityConfiguration: snapshotCapabilities(
        record.capabilities,
        config,
        record.botId,
        record.capabilityConfiguration,
      ),
    })
    const records = domain.table('bots')
    for (const id of records.keys()) {
      const record = records.get(id)
      if (record !== undefined && record.capabilityConfiguration === undefined)
        await records.put(id, migrate(record))
    }
    const transactions = domain.table('configuration_transactions')
    for (const id of transactions.keys()) {
      const transaction = transactions.get(id)
      if (transaction !== undefined)
        await transactions.put(id, {
          previous: migrate(transaction.previous),
          candidate: migrate(transaction.candidate),
        })
    }
  } catch (error) {
    await domain.close()
    throw error
  }
  const controller = new BotController(
    ctx,
    config,
    domain.table('bots'),
    domain.table('configuration_transactions'),
  )
  ctx.effect(
    () => async () => {
      const failures: unknown[] = []
      for (const close of [() => controller.quiesce(), () => domain.close()]) {
        try {
          await close()
        } catch (error) {
          failures.push(error)
        }
      }
      if (failures.length > 0) throw new AggregateError(failures, 'Bot domain cleanup failed')
    },
    'bot: record domain after owned operations',
  )
}
