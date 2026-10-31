import { homedir } from 'os'
import { readableError } from '../../infrastructure/dsh/connection'
import { saveBot, updateBot, newBotId, type BotRecord } from './registry'
import type { ConversationState } from '../conversation/state'
import { splitModel } from '../models/selection'

export function createBotCommands(state: ConversationState, hooks: {
  select(id: string): Promise<void>; initialize(bot: BotRecord): Promise<boolean>; replace(bot: BotRecord): void; report(error: unknown): void
}) {
  const { bots, selectedId, creation, formPreset, formModel, formWorkspace, creating, rename, note, problem, unrecoverable, online } = state
  const current = () => bots().find(item => item.id === selectedId())
  async function saveNew() {
    const name = creation.name().trim()
    if (!name) { note.set('请填写 Bot 名称'); return }
    if (!creation.preset().trim()) { note.set('请选择模板'); return }
    const record: BotRecord = {
      id: newBotId(), name, preset: creation.preset().trim(), model: splitModel(creation.model()),
      workspace: creation.workspace().trim() || homedir(), archived: false, createdAt: new Date().toISOString(),
    }
    try {
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
      const changes = { preset: formPreset().trim(), workspace: formWorkspace().trim(), model: splitModel(formModel()) }
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

  return { saveNew, saveRename, toggleArchive, repair, changePreset }
}
