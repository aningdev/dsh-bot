import type { Connection, CatalogPreset } from '../../infrastructure/dsh/connection'
import { readableError } from '../../infrastructure/dsh/connection'
import { loadBot, updateBot, newSessionId, type BotRecord } from '../bots/registry'
import { isWorkspace } from '../../infrastructure/storage/records'
import type { ConversationState } from './state'
import { fault, consumedFault } from './fault'
import { modelKey } from '../models/selection'

export function createInitialization(connection: Connection, state: ConversationState, hooks: {
  waitDrafts(): Promise<unknown>; disposed(): boolean; watch(bot: BotRecord): void; replace(bot: BotRecord): void
}) {
  const { selectedId, models, presets, unrecoverable, problem, note, currentModel } = state
  let initLock: Promise<unknown> = Promise.resolve()
  /** Serializes Session initialization for this client; never two creates at once. */
  async function serialized<T>(work: () => Promise<T>): Promise<T> {
    const previous = initLock
    let release!: () => void
    initLock = new Promise<void>(resolve => { release = resolve })
    await previous
    try { return await work() } finally { release() }
  }

  async function findSession(bot: BotRecord, candidate: string): Promise<{ kind: 'found'; sessionId: string } | { kind: 'none' } | { kind: 'ambiguous' }> {
    const sessions = await connection.listSessions()
    const exact = sessions.find(item => item.sessionId === candidate)
    if (exact) return { kind: 'found', sessionId: exact.sessionId }
    // Only an exact durable identity proves ownership. A nearby blank Session
    // can belong to another Bot or the official Web client.
    return { kind: 'none' }
  }

  async function commit(intent: BotRecord, sessionId: string): Promise<boolean> {
    if (fault('delay-init-commit')) await new Promise(resolve => setTimeout(resolve, 700))
    const { initializing } = intent
    const keep = async (reason: string) => {
      await hooks.waitDrafts()
      if (!hooks.disposed() && selectedId() === intent.id) {
        unrecoverable.set(true)
        problem.set(reason)
      }
      return updateBot(intent.id, latest => ({
        ...latest,
        initializing: { ...(initializing ?? { startedAt: new Date().toISOString(), candidateSessionId: sessionId }), createdSessionId: sessionId },
      })).then(pending => { hooks.replace(pending); return false }, () => false)
    }
    try {
      await connection.selectModel({ sessionId, provider: intent.model.provider, model: intent.model.model })
    } catch (error) {
      return keep(`对话已创建，但设置默认模型失败：${readableError(error)}。修复前不能发送。`)
    }
    if (fault('drop-pointer')) return keep('对话已创建，但正式指针保存失败。修复前不能发送。')
    // Model selection may take time; preserve drafts, names and archive changes
    // written while the Host was initializing this Session.
    await hooks.waitDrafts()
    let next: BotRecord
    try {
      next = await updateBot(intent.id, latest => {
        const { initializing: completed, ...rest } = latest
        return { ...rest, sessionId }
      })
    } catch (error) {
      return keep(`对话已创建，但正式指针保存失败：${readableError(error)}。修复前不能发送。`)
    }
    hooks.replace(next)
    if (!hooks.disposed() && selectedId() === next.id) {
      problem.set('')
      unrecoverable.set(false)
      note.set('对话已就绪')
      currentModel.set(modelKey(next.model))
    }
    hooks.watch(next)
    return true
  }

  /** Creates the single Session, or adopts the one the backend already made. */
  async function initialize(bot: BotRecord): Promise<boolean> {
    return serialized(async () => {
      const stored = (await loadBot(bot.id)) ?? bot
      if (bot.id === selectedId()) hooks.replace(stored)
      if (stored.sessionId) { hooks.watch(stored); return true }
      if (stored.initializing && !stored.initializing.createdSessionId) {
        const found = await findSession(stored, stored.initializing.candidateSessionId)
        if (found.kind === 'found') {
          const ok = await commit(stored, found.sessionId)
          if (ok) note.set('已复用后台已创建的对话')
          return ok
        }
        problem.set('初始化结果仍未知：未找到可证明归属的候选对话。保留记录，不自动再次创建。')
        return false
      }
      if (!await isWorkspace(stored.workspace)) {
        problem.set('工作区不是可用的绝对目录。请修改工作区后重试，尚未创建后台对话。')
        return false
      }
      if (!stored.initializing) {
        if (!stored.model.provider || !stored.model.model) {
          problem.set(models().length ? '请选择默认模型，选定后会初始化对话。' : '请先配置供应商与凭据，再选择默认模型。草稿已保留。')
          return false
        }
        try { await ensurePreset(stored) }
        catch (error) { problem.set(readableError(error)); return false }
      }
      const candidateSessionId = stored.initializing?.candidateSessionId ?? newSessionId()
      const startedAt = stored.initializing?.startedAt ?? new Date().toISOString()
      let intent: BotRecord
      try {
        intent = await updateBot(stored.id, latest => ({ ...latest, initializing: { startedAt, candidateSessionId, ...(stored.initializing?.createdSessionId ? { createdSessionId: stored.initializing.createdSessionId } : {}) } }))
      } catch (error) {
        problem.set(`无法保存初始化意图：${readableError(error)}。未向后台发起创建。`)
        return false
      }
      hooks.replace(intent)
      const created = intent.initializing?.createdSessionId
      if (created) return commit(intent, created)
      try {
        const found = await findSession(intent, candidateSessionId)
        if (found.kind === 'ambiguous') {
          problem.set('后台存在多个可能匹配的空白对话。登记指针未写入，请人工核对后再试。')
          return false
        }
        if (found.kind === 'found') {
          const ok = await commit(intent, found.sessionId)
          if (ok) note.set('已复用后台已创建的对话')
          return ok
        }
      } catch (error) {
        problem.set(`核对后台失败：${readableError(error)}。可重试核对，不会重复创建。`)
        return false
      }
      try {
        const value = await connection.createSession({ cwd: intent.workspace, agentPreset: intent.preset, sessionId: candidateSessionId })
        if (fault('drop-create-result')) throw new Error('后台连接中断，创建结果未知')
        return commit(intent, value.sessionId)
      } catch (error) {
        if (!consumedFault('drop-create-result')) {
          try {
            const found = await findSession(intent, candidateSessionId)
            if (found.kind === 'found') {
              const ok = await commit(intent, found.sessionId)
              if (ok) note.set('已复用后台已创建的对话')
              return ok
            }
          } catch { /* the backend stays unreachable */ }
        }
        problem.set(`初始化结果未知：${readableError(error)}。候选对话标识已保存，重试会先核对后台，不会重复创建。`)
        return false
      }
    })
  }

  async function ensurePreset(bot: BotRecord): Promise<void> {
    let roster: CatalogPreset[]
    try {
      roster = await connection.presetCatalog()
      presets.set(roster)
    } catch (error) {
      throw new Error(`无法读取后台模板目录：${readableError(error)}。已阻止发送。`)
    }
    const preset = roster.find(item => item.id === bot.preset)
    if (!preset) throw new Error(`后台模板目录中没有「${bot.preset}」。请修改 Bot 模板后重试；已阻止发送。`)
    if (preset.broken) throw new Error(`模板「${preset.id}」当前不可用：${preset.broken}。已阻止发送。`)
  }

  return { initialize, ensurePreset }
}
