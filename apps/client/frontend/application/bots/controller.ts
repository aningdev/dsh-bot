import { mkdir } from 'fs/promises'
import { readableError } from '../../infrastructure/dsh/connection'
import { defaultBotWorkspace } from '../../infrastructure/storage/records'
import { saveBot, updateBot, newBotId, type BotRecord } from './registry'
import type { ConversationState } from '../conversation/state'
import { splitModel } from '../models/selection'
import type { BotModel } from './types'

export function createBotCommands(state: ConversationState, hooks: {
  select(id: string): Promise<void>; initialize(bot: BotRecord): Promise<boolean>; replace(bot: BotRecord): void; report(error: unknown): void
  resolveModel?(key: string, reasoningEffort?: string): BotModel
}) {
  const { bots, selectedId, creation, formPreset, formModel, formWorkspace, creating, rename, note, problem, unrecoverable, online, currentReasoningEffort } = state
  const current = () => bots().find(item => item.id === selectedId())

  function modelFromForm(): BotModel {
    const key = formModel()
    if (hooks.resolveModel) return hooks.resolveModel(key, currentReasoningEffort())
    return splitModel(key)
  }

  async function ensureOwnedWorkspace(botId: string, workspace: string): Promise<void> {
    // Only auto-create the product-owned default; user-chosen paths must already exist.
    if (workspace === defaultBotWorkspace(botId)) await mkdir(workspace, { recursive: true })
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
    const record: BotRecord = {
      id, name, preset: creation.preset().trim(), model,
      workspace, archived: false, createdAt: new Date().toISOString(),
    }
    try {
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
      const changes = { preset: formPreset().trim(), workspace, model: modelFromForm() }
      if (workspace) await ensureOwnedWorkspace(bot.id, workspace)
      const next = await updateBot(bot.id, latest => ({ ...latest, ...changes }))
      hooks.replace(next)
      problem.set(''); unrecoverable.set(false)
      if (online()) await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  /** Template (“指令”) may change only before the Session pointer exists. */
  async function changePreset(presetId: string) {
    const bot = current()
    const preset = presetId.trim()
    if (!bot || !preset || bot.sessionId || bot.initializing || bot.archived) return
    try {
      const next = await updateBot(bot.id, latest => latest.sessionId || latest.initializing ? latest : { ...latest, preset })
      hooks.replace(next)
      formPreset.set(preset)
      problem.set(''); unrecoverable.set(false)
      note.set('模板已保存')
      if (online()) await hooks.initialize(next)
    } catch (error) { hooks.report(error) }
  }

  /** Workspace may change only before the Session pointer exists. */
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

  return { saveNew, saveRename, toggleArchive, repair, changePreset, changeWorkspace }
}
