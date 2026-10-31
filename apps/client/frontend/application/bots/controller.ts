import { mkdir } from 'fs/promises'
import { readableError, type Connection } from '../../infrastructure/dsh/connection'
import { defaultBotWorkspace } from '../../infrastructure/storage/records'
import { saveBot, updateBot, newBotId, type BotRecord } from './registry'
import type { ConversationState } from '../conversation/state'
import { splitModel } from '../models/selection'
import type { BotModel } from './types'

export function createBotCommands(state: ConversationState, hooks: {
  select(id: string): Promise<void>; initialize(bot: BotRecord): Promise<boolean>; replace(bot: BotRecord): void; report(error: unknown): void
  resolveModel?(key: string, reasoningEffort?: string): BotModel
  connection(): Connection | undefined
  refreshCreationPlugins?(basePreset: string): Promise<void>
  refreshFormPlugins?(basePreset: string): Promise<void>
}) {
  const { bots, selectedId, creation, formPreset, formModel, formWorkspace, formDisabledPlugins, creating, rename, note, problem, unrecoverable, online, currentReasoningEffort } = state
  const current = () => bots().find(item => item.id === selectedId())

  function modelFromForm(): BotModel {
    const key = formModel()
    if (hooks.resolveModel) return hooks.resolveModel(key, currentReasoningEffort())
    return splitModel(key)
  }

  async function ensureOwnedWorkspace(botId: string, workspace: string): Promise<void> {
    if (workspace === defaultBotWorkspace(botId)) await mkdir(workspace, { recursive: true })
  }

  async function resolvePreset(basePreset: string, disabled: string[], name?: string): Promise<{ preset: string; basePreset?: string; disabledPlugins?: string[] }> {
    const connection = hooks.connection()
    if (!connection || !disabled.length) return { preset: basePreset }
    const composed = await connection.composePreset({ basePreset, disabledEntryIds: disabled, name })
    if (composed.agentPreset === basePreset) return { preset: basePreset }
    return {
      preset: composed.agentPreset,
      basePreset: composed.basePreset,
      disabledPlugins: composed.disabledEntryIds,
    }
  }

  async function saveNew() {
    const name = creation.name().trim()
    if (!name) { note.set('请填写 Bot 名称'); return }
    if (!creation.preset().trim()) { note.set('请选择模板'); return }
    const id = creation.id().trim() || newBotId()
    const workspace = creation.workspace().trim() || defaultBotWorkspace(id)
    const model = hooks.resolveModel
      ? hooks.resolveModel(creation.model(), creation.reasoningEffort())
      : splitModel(creation.model())
    try {
      const composition = await resolvePreset(creation.preset().trim(), creation.disabledPlugins(), name)
      const record: BotRecord = {
        id, name, preset: composition.preset, model,
        workspace, archived: false, createdAt: new Date().toISOString(),
        ...(composition.basePreset ? { basePreset: composition.basePreset } : {}),
        ...(composition.disabledPlugins?.length ? { disabledPlugins: composition.disabledPlugins } : {}),
      }
      await ensureOwnedWorkspace(id, workspace)
      await saveBot(record)
      bots.set([...bots(), record])
      creating.set(false)
      await hooks.select(record.id)
    } catch (error) { note.set(`保存 Bot 失败：${readableError(error)}`) }
  }

  async function saveRename() {
    const bot = current()
    if (!bot || !rename().trim()) return
    const name = rename().trim()
    try { hooks.replace(await updateBot(bot.id, latest => ({ ...latest, name }))); note.set('名称已保存') }
    catch (error) { hooks.report(error) }
  }

  async function toggleArchive() {
    const bot = current()
    if (!bot) return
    try {
      const next = await updateBot(bot.id, latest => ({ ...latest, archived: !latest.archived }))
      hooks.replace(next)
      note.set(next.archived ? '已归档；已接纳的对话与其历史保留' : '已从归档恢复')
    } catch (error) { hooks.report(error) }
  }

  async function repair() {
    const bot = current()
    if (!bot || bot.sessionId || bot.initializing) return
    try {
      const workspace = formWorkspace().trim()
      const base = formPreset().trim()
      const composition = await resolvePreset(base, formDisabledPlugins(), bot.name)
      const changes = {
        preset: composition.preset,
        workspace,
        model: modelFromForm(),
        ...(composition.basePreset ? { basePreset: composition.basePreset } : { basePreset: undefined }),
        ...(composition.disabledPlugins?.length ? { disabledPlugins: composition.disabledPlugins } : { disabledPlugins: undefined }),
      }
      if (workspace) await ensureOwnedWorkspace(bot.id, workspace)
      const next = await updateBot(bot.id, latest => {
        const { basePreset: _b, disabledPlugins: _d, ...rest } = latest
        return { ...rest, ...changes }
      })
      hooks.replace(next)
      problem.set(''); unrecoverable.set(false)
      if (online()) await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  async function changePreset(presetId: string) {
    const bot = current()
    const preset = presetId.trim()
    if (!bot || !preset || bot.sessionId || bot.initializing || bot.archived) return
    try {
      formDisabledPlugins.set([])
      await hooks.refreshFormPlugins?.(preset)
      const next = await updateBot(bot.id, latest => latest.sessionId || latest.initializing ? latest : {
        ...latest,
        preset,
        basePreset: undefined,
        disabledPlugins: undefined,
      })
      hooks.replace(next)
      formPreset.set(preset)
      problem.set(''); unrecoverable.set(false)
      note.set('模板已保存')
      if (online()) await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  async function changeWorkspace(path: string) {
    const bot = current()
    const workspace = path.trim()
    if (!bot || !workspace || bot.sessionId || bot.initializing || bot.archived) return
    try {
      await ensureOwnedWorkspace(bot.id, workspace)
      const next = await updateBot(bot.id, latest => latest.sessionId || latest.initializing ? latest : { ...latest, workspace })
      hooks.replace(next)
      formWorkspace.set(workspace)
      problem.set(''); unrecoverable.set(false)
      note.set('工作区已保存')
      if (online()) await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  async function changeDisabledPlugins(disabledEntryIds: string[]) {
    const bot = current()
    if (!bot || bot.sessionId || bot.initializing || bot.archived || !online()) return
    try {
      const base = bot.basePreset || bot.preset
      const composition = await resolvePreset(base, disabledEntryIds, bot.name)
      const next = await updateBot(bot.id, latest => latest.sessionId || latest.initializing ? latest : {
        ...latest,
        preset: composition.preset,
        ...(composition.basePreset ? { basePreset: composition.basePreset } : { basePreset: undefined }),
        ...(composition.disabledPlugins?.length ? { disabledPlugins: composition.disabledPlugins } : { disabledPlugins: undefined }),
      })
      hooks.replace(next)
      formPreset.set(next.preset)
      formDisabledPlugins.set(next.disabledPlugins ?? [])
      await hooks.refreshFormPlugins?.(base)
      problem.set(''); unrecoverable.set(false)
      note.set('插件组合已保存')
      await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  return { saveNew, saveRename, toggleArchive, repair, changePreset, changeWorkspace, changeDisabledPlugins }
}
