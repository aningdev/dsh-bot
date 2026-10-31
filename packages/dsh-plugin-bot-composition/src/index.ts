/** Host Cordis service: derive per-Bot agent presets from a base template. */
import { Context, Service } from '@deepseek-ai/cordis'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  buildDefinition,
  compositionId,
  isDerivedPreset,
  listToggleable,
  parsePluginRows,
  type CompositionRecord,
  type ToggleablePlugin,
} from './composition.js'
import { compositionsPath, loadCompositions, removeComposition, upsertComposition } from './store.js'

declare module '@deepseek-ai/cordis' {
  interface Context {
    botComposition: BotCompositionService
  }
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'bot-composition/base-unavailable': { readonly basePreset: string; readonly reason: string }
    'bot-composition/not-found': { readonly id: string }
    'bot-composition/invalid': { readonly reason: string }
  }
}

interface AgentPresetsHost {
  readDocument(agentPreset: string): Promise<{ agentPreset: string; content: string; name?: string; description?: string }>
  register(definition: { id: string; name?: string; description?: string; plugins: unknown[] }): Promise<() => Promise<void>>
}

export interface PreviewResult {
  basePreset: string
  plugins: ToggleablePlugin[]
}

export interface ComposeRequest {
  basePreset: string
  disabledEntryIds?: string[]
  name?: string
}

export interface ComposeResult {
  agentPreset: string
  basePreset: string
  disabledEntryIds: string[]
}

export default class BotCompositionService extends TypertRemoteService {
  static inject = ['agentPresets']
  private readonly disposers = new Map<string, () => Promise<void>>()
  private readonly path: string

  constructor(ctx: Context) {
    super(ctx, 'botComposition')
    const home = process.env.DSH_HOME
    if (!home) throw new Error('DSH_HOME is required for bot composition storage')
    this.path = compositionsPath(home)
    // Cordis event map is host-specific; dispose is always available on Service trees.
    ;(ctx as { on(event: string, listener: () => void): void }).on('dispose', () => {
      void Promise.all([...this.disposers.values()].map(dispose => dispose().catch(() => undefined)))
    })
  }

  protected async [Service.init](): Promise<void> {
    const records = await loadCompositions(this.path)
    for (const record of records) {
      try { await this.mount(record) }
      catch (error) { this.ctx.logger.warn(`bot composition ${record.id}: ${(error as Error).message}`) }
    }
  }

  private presets(): AgentPresetsHost {
    return (this.ctx as unknown as { agentPresets: AgentPresetsHost }).agentPresets
  }

  private async mount(record: CompositionRecord): Promise<void> {
    if (this.disposers.has(record.id)) return
    const document = await this.presets().readDocument(record.basePreset)
    const rows = parsePluginRows(document.content)
    const built = buildDefinition(record.basePreset, rows, record.disabledEntryIds, record.name)
    const dispose = await this.presets().register(built.definition)
    this.disposers.set(record.id, dispose)
  }

  @Remote('preview')
  async preview(basePreset: string): Promise<PreviewResult> {
    const id = basePreset.trim()
    if (!id) throw new RemoteError('bot-composition/invalid', 'basePreset is required', { reason: 'empty-base' })
    try {
      const document = await this.presets().readDocument(id)
      return { basePreset: id, plugins: listToggleable(parsePluginRows(document.content)) }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      throw new RemoteError('bot-composition/base-unavailable', reason, { basePreset: id, reason }, { cause: error })
    }
  }

  @Remote('compose')
  async compose(request: ComposeRequest): Promise<ComposeResult> {
    const basePreset = request.basePreset?.trim()
    if (!basePreset) throw new RemoteError('bot-composition/invalid', 'basePreset is required', { reason: 'empty-base' })
    const disabledEntryIds = request.disabledEntryIds ?? []
    const id = compositionId(basePreset, disabledEntryIds)
    if (!isDerivedPreset(id)) {
      return { agentPreset: basePreset, basePreset, disabledEntryIds: [] }
    }
    try {
      const document = await this.presets().readDocument(basePreset)
      const built = buildDefinition(basePreset, parsePluginRows(document.content), disabledEntryIds, request.name)
      await upsertComposition(this.path, built.record)
      const previous = this.disposers.get(built.id)
      if (previous) {
        await previous().catch(() => undefined)
        this.disposers.delete(built.id)
      }
      await this.mount(built.record)
      return { agentPreset: built.id, basePreset, disabledEntryIds: built.record.disabledEntryIds }
    } catch (error) {
      if (error instanceof RemoteError) throw error
      const reason = error instanceof Error ? error.message : String(error)
      throw new RemoteError('bot-composition/base-unavailable', reason, { basePreset, reason }, { cause: error })
    }
  }

  @Remote('ensure')
  async ensure(agentPreset: string): Promise<ComposeResult> {
    const id = agentPreset.trim()
    if (!id) throw new RemoteError('bot-composition/invalid', 'agentPreset is required', { reason: 'empty-id' })
    if (!isDerivedPreset(id)) return { agentPreset: id, basePreset: id, disabledEntryIds: [] }
    const records = await loadCompositions(this.path)
    const record = records.find(item => item.id === id)
    if (!record) throw new RemoteError('bot-composition/not-found', `Unknown composition ${id}`, { id })
    await this.mount(record)
    return { agentPreset: record.id, basePreset: record.basePreset, disabledEntryIds: record.disabledEntryIds }
  }

  @Remote('release')
  async release(agentPreset: string): Promise<{ agentPreset: string }> {
    const id = agentPreset.trim()
    if (!isDerivedPreset(id)) return { agentPreset: id }
    const dispose = this.disposers.get(id)
    if (dispose) {
      await dispose().catch(() => undefined)
      this.disposers.delete(id)
    }
    await removeComposition(this.path, id)
    return { agentPreset: id }
  }
}
