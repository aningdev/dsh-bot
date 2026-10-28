import { homedir } from 'os'
import { Connection, readableError } from '../../infrastructure/dsh/connection'
import { TextHistory } from '../../infrastructure/dsh/history'
import { loadBot, loadBots, updateBot, newRequestId, type BotRecord, type Draft } from '../bots/registry'
import type { BackendConnection, BackendState } from '../backend/connection'
import { createConversationState } from './state'
import { createInitialization } from './initialization'
import { createApprovals } from './approvals'
import { createBotCommands } from '../bots/controller'
import { fault } from './fault'
import { modelKey, projectedModel, splitModel } from '../models/selection'

export function createConversation(connection: Connection, backend: BackendConnection) {
  const state = createConversationState()
  const { bots, damaged, selectedId, archivedView, online, ready, connecting, note, problem, messages, running, input, sending, creating, formPreset, formModel, formWorkspace, rename, models, presets, catalogError, pendingApproval, approvalSessions, approvals, queue, currentModel, approvalDetails, unrecoverable } = state
  let selectionEpoch = 0, polling = false, disposed = false
  let stopFollow: (() => void) | undefined
  let draftWrites: Promise<unknown> = Promise.resolve()
  const approval = createApprovals(connection, state, () => disposed)
  const { refreshApproval, decide } = approval
  const { initialize, ensurePreset } = createInitialization(connection, state, {
    waitDrafts: () => draftWrites, disposed: () => disposed, replace, watch,
  })
  const botCommands = createBotCommands(state, { select, initialize, replace, report })
  function backendChanged(status: BackendState) {
    state.backendStatus.set(status)
    online.set(status.phase === 'connected')
    ready.set(status.ready)
    connecting.set(status.phase === 'connecting')
    note.set(status.message)
    if (status.phase !== 'connected') {
      selectionEpoch++
      stopWatch()
      queue.set([])
    }
  }
  function connected() {
    void backend.read(() => Promise.all([connection.modelCatalog(), connection.presetCatalog()]), ([catalog, roster]) => {
      applyModels(catalog)
      presets.set(roster)
      if (!formPreset()) formPreset.set(roster.find(item => item.isDefault)?.id ?? roster[0]?.id ?? '')
      const bot = current() ?? bots().find(item => !item.archived)
      if (bot) void select(bot.id)
    }, error => {
      catalogError.set(`读取后台模板与模型目录失败：${readableError(error)}`)
      const bot = current() ?? bots().find(item => !item.archived)
      if (bot) void select(bot.id)
    })
  }
  const current = () => bots().find(item => item.id === selectedId())
  function replace(record: BotRecord) {
    bots.set(bots().map(item => (item.id === record.id ? record : item)))
  }
  function report(error: unknown) {
    note.set(error instanceof Error ? error.message : String(error))
  }
  function modelLabel(value: string): string {
    const found = models().find(item => modelKey(item) === value)
    return found ? `${found.name}（${found.providerName}）` : value || '未选择'
  }
  function presetLabel(id: string): string {
    const found = presets().find(item => item.id === id)
    if (!found) return id || '未选择'
    return found.name === found.id ? found.id : `${found.name}（${found.id}）`
  }

  function applyModels(catalog: Awaited<ReturnType<Connection['modelCatalog']>>) {
    models.set(catalog.models)
    const failures = catalog.failures.length ? `不可用的提供方：${catalog.failures.map(item => `${item.name}（${item.message}）`).join('、')}` : ''
    catalogError.set(catalog.models.length ? failures : `后台没有可用的模型，请先配置供应商与凭据。${failures}`)
    if (!formModel() && catalog.models.some(item => modelKey(item) === modelKey(catalog.default))) {
      formModel.set(modelKey(catalog.default))
    }
  }

  async function refreshModels() {
    await backend.read(() => connection.modelCatalog(), applyModels, error => {
      catalogError.set(`读取后台模型目录失败：${readableError(error)}`)
    })
  }

  function stopWatch() {
    stopFollow?.()
    stopFollow = undefined
    messages.set([])
    running.set(false)
  }

  async function select(id: string) {
    selectionEpoch++
    stopWatch()
    queue.set([])
    selectedId.set(id)
    refreshApproval()
    problem.set('')
    unrecoverable.set(false)
    const bot = bots().find(item => item.id === id)
    if (!bot) return
    formPreset.set(bot.preset)
    formWorkspace.set(bot.workspace)
    formModel.set(modelKey(bot.model))
    rename.set(bot.name)
    input.set(bot.draft?.text ?? '')
    if (bot.draft?.state === 'unknown' || bot.draft?.state === 'pending') {
      note.set('上次发送结果待确认，请重新核对；不会自动重发。')
    }
    if (bot.sessionId) { await resume(bot); return }
    if (disposed) return
    if (bot.initializing) {
      unrecoverable.set(true)
      problem.set('上次初始化没有确认结果。候选对话标识已保存，请先重新检查，修复前不能发送。')
    } else if (ready() && !bot.archived) {
      await initialize(bot)
    } else note.set('尚未初始化对话；连接后台并补齐配置后会创建唯一对话。')
  }

  async function resume(bot: BotRecord) {
    const epoch = selectionEpoch
    try {
      const projection = await connection.projections(bot.sessionId!)
      if (disposed || epoch !== selectionEpoch) return
      currentModel.set(projectedModel(projection))
      if (!projection) {
        unrecoverable.set(true)
        problem.set('对话无法恢复：后台找不到这段对话。登记指针已保留，不会自动重建；可另建 Bot。')
        return
      }
      const actual = projection.agentPreset ?? ''
      if (actual && actual !== bot.preset) {
        problem.set(`对话实际模板为「${actual}」，与登记「${bot.preset}」不一致。登记指针保留，可更新登记或另建 Bot。`)
      } else {
        note.set(`已恢复对话（模板 ${presetLabel(actual || bot.preset)}）`)
      }
      watch(bot)
    } catch (error) {
      if (disposed || epoch !== selectionEpoch) return
      unrecoverable.set(true)
      problem.set(`对话无法恢复：${readableError(error)}。登记指针已保留，不会自动创建、重绑或更换模板；可重新检查或另建 Bot。`)
    }
  }

  function watch(bot: BotRecord) {
    if (!bot.sessionId || selectedId() !== bot.id || disposed) return
    stopFollow?.()
    const history = new TextHistory()
    messages.set([])
    stopFollow = connection.follow(bot.sessionId, frame => {
      if (disposed) return
      try {
        messages.set(history.receive(frame))
        running.set(history.running)
        if (history.status) note.set(history.status)
      } catch (error) { report(error) }
    }, error => {
      if (disposed) return
      online.set(false)
      note.set(`${error.message} 请稍后重新检查。`)
    })
  }

  async function send() {
    const bot = current()
    const text = input().trim()
    if (!bot || bot.archived || unrecoverable() || !text || sending()) return
    await draftWrites
    if (bot.draft?.state === 'unknown' || bot.draft?.state === 'pending') {
      note.set('请先核对会话，确认上次提交的结果后再发送。')
      return
    }
    if (!ready()) { note.set('后台未连接，无法发送。'); return }
    if (!bot.model.provider || !bot.model.model) { note.set('Bot 尚未选择默认模型，请先修复。'); return }
    sending.set(true)
    try {
      await ensurePreset(bot)
      if (disposed) return
      if (!bot.sessionId) {
        const ok = await initialize(bot)
        if (!ok) return
      }
      const fresh = bots().find(item => item.id === bot.id)!
      if (!fresh.sessionId) return
      const requestId = newRequestId()
      try {
        const pending = await updateBot(fresh.id, latest => ({ ...latest, draft: { text, requestId, state: 'pending' } }))
        if (disposed) return
        replace(pending)
      } catch (error) {
        note.set(`无法保存发送草稿：${readableError(error)}。未向后台提交。`)
        return
      }
      try {
        await connection.prompt({ sessionId: fresh.sessionId, requestId, text })
        if (fault('drop-prompt-result')) throw new Error('发送响应丢失（故障注入）')
      } catch (error) {
        if (disposed) return
        const unknown: Draft = { text, requestId, state: 'unknown' }
        try { replace(await updateBot(fresh.id, latest => ({ ...latest, draft: unknown }))) } catch { /* keep pending */ }
        note.set(`提交结果未知：${readableError(error)}。内容已保留，请先核对会话，不要直接重发。`)
        return
      }
      if (disposed) return
      try { replace(await updateBot(fresh.id, latest => ({ ...latest, draft: undefined }))) } catch (error) { note.set(`已提交，但本地草稿未能清除：${readableError(error)}`) }
      if (selectedId() === bot.id) input.set('')
      note.set('已接纳，等待处理')
      await refreshQueue()
    } catch (error) {
      if (!disposed) note.set(readableError(error))
    } finally {
      if (!disposed) sending.set(false)
    }
  }

  async function stop() {
    const bot = current()
    if (!bot?.sessionId) return
    try { await connection.cancel(bot.sessionId); note.set('已请求停止当前执行；队列保留') }
    catch (error) { note.set(readableError(error)) }
  }

  function persistDraft(bot: BotRecord, text: string) {
    draftWrites = draftWrites.then(async () => {
      const latest = bots().find(item => item.id === bot.id)
      if (!latest || latest.draft?.state === 'pending' || latest.draft?.state === 'unknown') return
      const next = await updateBot(bot.id, stored => {
        if (stored.draft?.state === 'pending' || stored.draft?.state === 'unknown') return stored
        return { ...stored, draft: text ? { text, state: 'typing' } : undefined }
      })
      if (!disposed) replace(next)
    }).catch(() => undefined)
  }

  async function recheck() {
    const bot = current()
    if (!bot) return
    if (!bot.sessionId) { await initialize(bot); return }
    await resume(bot)
    if (bot.draft?.requestId && (bot.draft.state === 'unknown' || bot.draft.state === 'pending')) {
      try {
        if (await connection.admitted(bot.sessionId, bot.draft.requestId)) {
          replace(await updateBot(bot.id, latest => ({ ...latest, draft: undefined })))
          if (selectedId() === bot.id) input.set('')
          note.set('已核对：后台已接纳该输入，不会重发。')
        } else note.set('发送结果仍待确认：未查到不能证明未接纳。请复制内容；修改后另发仍可能重复。')
      } catch (error) { note.set(`核对未完成：${readableError(error)}。保留待确认记录。`) }
    }
  }

  async function refreshQueue() {
    const bot = current()
    if (!online() || !bot?.sessionId || polling || disposed) return
    polling = true
    try {
      await backend.read(() => connection.queue(bot.sessionId!), items => {
        if (selectedId() === bot.id) queue.set(items)
      })
    } catch { /* A transient read failure cannot change the last known queue. */ }
    finally { polling = false }
  }
  const queueTimer = setInterval(() => { void refreshQueue() }, 1500)

  async function withdraw(itemId: string) {
    const bot = current()
    if (!bot?.sessionId) return
    try { await connection.withdraw(bot.sessionId, itemId); note.set('已撤回尚未领取的输入') }
    catch (error) { note.set(`无法撤回，可能已被领取：${readableError(error)}`) }
    await refreshQueue()
  }

  function dispose(): Promise<void> {
    disposed = true
    stopWatch()
    clearInterval(queueTimer)
    return backend.dispose().finally(() => approval.dispose())
  }
  async function start() {
    try {
      const loaded = await loadBots()
      if (disposed) return
      bots.set(loaded.bots)
      damaged.set(loaded.damaged)
      if (loaded.damaged.length) note.set(`有 ${loaded.damaged.length} 个 Bot 文件无法读取，已跳过。`)
      await backend.connect()
    } catch (error) { if (!disposed) note.set(readableError(error)) }
  }

  const visible = () => bots().filter(item => item.archived === archivedView())
  // Derived values stay functions: the component body runs once, only signal
  // reads inside JSX are re-evaluated when state changes.
  async function changeModel(key: string) {
    const bot = current()
    if (!bot || !online() || bot.initializing || running() || pendingApproval()) return
    try {
      const model = splitModel(key)
      if (bot.sessionId) {
        await connection.selectModel({ sessionId: bot.sessionId, ...model })
        const projections = await connection.projections(bot.sessionId)
        if (current()?.id === bot.id) currentModel.set(projectedModel(projections))
      } else {
        await draftWrites
        const fresh = await loadBot(bot.id)
        if (!fresh || fresh.sessionId || fresh.initializing) return
        const next = await updateBot(bot.id, latest => latest.sessionId || latest.initializing ? latest : { ...latest, model })
        replace(next)
        if (current()?.id === bot.id) formModel.set(key)
        if (!await initialize(next)) return
      }
      note.set('模型已保存')
    } catch (error) { report(error) }
  }

  const selected = () => current()
  const blocked = () => {
    const bot = current()
    return !bot || bot.archived || !ready() || sending() || unrecoverable() || !input().trim()
      || bot?.draft?.state === 'unknown' || bot?.draft?.state === 'pending'
      || (!!bot && !bot.sessionId && !!bot.initializing)
      || (!!bot && !bot.preset) || (!!bot && (!bot.model.provider || !bot.model.model))
  }

  function beginCreate() {
    creating.set(true)
    state.creation.name.set('')
    state.creation.preset.set(presets().find(item => item.isDefault)?.id ?? presets()[0]?.id ?? '')
    state.creation.model.set(models().length ? modelKey(models()[0]!) : '')
    state.creation.workspace.set(homedir())
  }
  return { ...state, ...botCommands, selected, visible, blocked, modelKey, modelLabel, presetLabel,
    select, send, stop, persistDraft, recheck, changeModel, decide, refreshModels, beginCreate,
    withdraw, backendChanged, connected, start, dispose,
  }
}
export type Workbench = ReturnType<typeof createConversation>
