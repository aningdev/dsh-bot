import { signal, cleanup, Scroll, Text, View, List } from 'nsh'
import { Input } from 'nsh/base'
import { homedir } from 'os'
import { ModelSettings } from './ModelSettings'
import {
  Connection, readableError,
  type CatalogModel, type CatalogPreset, type ApprovalRequest, type ApprovalDecision,
} from './connection'
import { BackendConnection } from './backend-connection'
import { backendHost, usesHostControl } from './host-control'
import { TextHistory, type Message } from './history'
import {
  hostEnv, isWorkspace, loadBot, loadBots, newBotId, newRequestId, newSessionId, saveBot,
  type BotRecord, type Draft,
} from './registry'

const consumed = new Set<string>()
/** A one-shot failure injected by the e2e driver; never active otherwise. */
function fault(name: string): boolean {
  const value = hostEnv('DSH_E2E_FAULT') ?? ''
  if (!value.split(',').includes(name) || consumed.has(name)) return false
  consumed.add(name)
  return true
}

function Button(props: { label: string; onPress: () => void; disabled?: boolean; id?: string }) {
  return <View role="button" testID={props.id} accessibilityLabel={props.label} disabled={props.disabled} onPress={props.onPress}
    class="rounded-md border border-border px-3 py-2 hover:bg-muted disabled:opacity-40">
    <Text class="text-sm text-foreground">{props.label}</Text>
  </View>
}

const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'

function modelKey(value: { provider: string; model: string }): string {
  return value.provider && value.model ? `${value.provider}/${value.model}` : ''
}
function projectedModel(projections: any): string {
  const value = projections?.modelSelection?.next ?? projections?.modelSelection?.lastUsed
  return value ? modelKey(value) : '后台未记录模型选择'
}

export function BotApp() {
  const connection = new Connection()
  const bots = signal<BotRecord[]>([])
  const damaged = signal<string[]>([])
  const selectedId = signal('')
  const archivedView = signal(false)
  const online = signal(false), ready = signal(false), connecting = signal(false)
  const note = signal('正在读取本地 Bot 注册表…')
  const problem = signal('')
  const messages = signal<Message[]>([]), running = signal(false)
  const input = signal(''), sending = signal(false)
  const creating = signal(false)
  const formName = signal(''), formPreset = signal(''), formModel = signal(''), formWorkspace = signal(homedir())
  const rename = signal('')
  const models = signal<CatalogModel[]>([]), presets = signal<CatalogPreset[]>([]), catalogError = signal('')
  const pendingApproval = signal<ApprovalRequest | undefined>(undefined)
  const approvalSessions = signal<string[]>([])
  const approvals = new Map<string, { request: ApprovalRequest; resolve: (value: ApprovalDecision) => void }>()
  const queue = signal<any[]>([]), settingsOpen = signal(false), currentModel = signal('')
  const approvalDetails = signal(false)
  let selectionEpoch = 0
  let polling = false
  /** The registered Session cannot be opened; sending stays blocked until it is checked. */
  const unrecoverable = signal(false)
  let resolveApproval: ((decision: ApprovalDecision) => void) | undefined

  let disposed = false
  let stopFollow: (() => void) | undefined
  let draftWrites: Promise<unknown> = Promise.resolve()
  let initLock: Promise<unknown> = Promise.resolve()

  const current = () => bots().find(item => item.id === selectedId())
  function replace(record: BotRecord) {
    bots.set(bots().map(item => (item.id === record.id ? record : item)))
  }
  function report(error: unknown) {
    note.set(error instanceof Error ? error.message : String(error))
  }
  function splitModel(value: string): { provider: string; model: string } {
    const index = value.indexOf('/')
    if (index <= 0) return { provider: '', model: value }
    return { provider: value.slice(0, index), model: value.slice(index + 1) }
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

  /** Serializes Session initialization for this client; never two creates at once. */
  async function serialized<T>(work: () => Promise<T>): Promise<T> {
    const previous = initLock
    let release!: () => void
    initLock = new Promise<void>(resolve => { release = resolve })
    await previous
    try { return await work() } finally { release() }
  }

  connection.approvals(async request => {
    if (disposed || request.signal?.aborted) return 'cancelled'
    if (!bots().some(bot => bot.sessionId === request.sessionId)) return 'unavailable'
    return new Promise<ApprovalDecision>(resolve => {
      const key = `${request.sessionId}/${request.callId ?? crypto.randomUUID()}`
      const finish = (outcome: ApprovalDecision) => {
        request.signal?.removeEventListener('abort', abort)
        approvals.delete(key)
        refreshApproval()
        resolve(outcome)
      }
      const abort = () => finish('cancelled')
      approvals.set(key, { request, resolve: finish })
      request.signal?.addEventListener('abort', abort, { once: true })
      refreshApproval()
    })
  })

  const backend = new BackendConnection(backendHost, connection, state => {
    online.set(state.phase === 'connected')
    ready.set(state.ready)
    connecting.set(state.phase === 'connecting')
    note.set(state.message)
    if (state.phase !== 'connected') {
      selectionEpoch++
      stopWatch()
      queue.set([])
    }
  }, () => {
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
  })

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
      await draftWrites
      const latest = await loadBot(intent.id) ?? intent
      const pending: BotRecord = {
        ...latest,
        initializing: { ...(initializing ?? { startedAt: new Date().toISOString(), candidateSessionId: sessionId }), createdSessionId: sessionId },
      }
      if (!disposed && selectedId() === intent.id) {
        unrecoverable.set(true)
        problem.set(reason)
      }
      return saveBot(pending).then(() => { replace(pending); return false }, () => false)
    }
    try {
      await connection.selectModel({ sessionId, provider: intent.model.provider, model: intent.model.model })
    } catch (error) {
      return keep(`对话已创建，但设置默认模型失败：${readableError(error)}。修复前不能发送。`)
    }
    if (fault('drop-pointer')) return keep('对话已创建，但正式指针保存失败。修复前不能发送。')
    // Model selection may take time; preserve drafts, names and archive changes
    // written while the Host was initializing this Session.
    await draftWrites
    const latest = await loadBot(intent.id) ?? intent
    const { initializing: completed, ...rest } = latest
    const next: BotRecord = { ...rest, sessionId }
    try {
      await saveBot(next)
    } catch (error) {
      return keep(`对话已创建，但正式指针保存失败：${readableError(error)}。修复前不能发送。`)
    }
    replace(next)
    if (!disposed && selectedId() === next.id) {
      problem.set('')
      unrecoverable.set(false)
      note.set('对话已就绪')
      currentModel.set(modelKey(next.model))
    }
    watch(next)
    return true
  }

  /** Creates the single Session, or adopts the one the backend already made. */
  async function initialize(bot: BotRecord): Promise<boolean> {
    return serialized(async () => {
      const stored = (await loadBot(bot.id)) ?? bot
      if (bot.id === selectedId()) replace(stored)
      if (stored.sessionId) { watch(stored); return true }
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
      if (!isWorkspace(stored.workspace)) {
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
      const intent: BotRecord = { ...stored, initializing: { startedAt, candidateSessionId, ...(stored.initializing?.createdSessionId ? { createdSessionId: stored.initializing.createdSessionId } : {}) } }
      try {
        await saveBot(intent)
      } catch (error) {
        problem.set(`无法保存初始化意图：${readableError(error)}。未向后台发起创建。`)
        return false
      }
      replace(intent)
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
        if (!consumed.has('drop-create-result')) {
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
      const pending: BotRecord = { ...fresh, draft: { text, requestId, state: 'pending' } }
      try {
        await saveBot(pending)
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
        try { const next = { ...pending, draft: unknown }; await saveBot(next); replace(next) } catch { /* keep pending */ }
        note.set(`提交结果未知：${readableError(error)}。内容已保留，请先核对会话，不要直接重发。`)
        return
      }
      if (disposed) return
      const cleared: BotRecord = { ...fresh, draft: undefined }
      try { await saveBot(cleared); replace(cleared) } catch (error) { note.set(`已提交，但本地草稿未能清除：${readableError(error)}`) }
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
      const next: BotRecord = { ...latest, draft: text ? { text, state: 'typing' } : undefined }
      await saveBot(next)
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
          const next = { ...(await loadBot(bot.id) ?? bot), draft: undefined }
          await saveBot(next); replace(next)
          if (selectedId() === bot.id) input.set('')
          note.set('已核对：后台已接纳该输入，不会重发。')
        } else note.set('发送结果仍待确认：未查到不能证明未接纳。请复制内容；修改后另发仍可能重复。')
      } catch (error) { note.set(`核对未完成：${readableError(error)}。保留待确认记录。`) }
    }
  }

  async function saveNew() {
    const name = formName().trim()
    if (!name) { note.set('请填写 Bot 名称'); return }
    if (!formPreset().trim()) { note.set('请选择模板'); return }
    const record: BotRecord = {
      id: newBotId(), name, preset: formPreset().trim(), model: splitModel(formModel()),
      workspace: formWorkspace().trim() || homedir(), archived: false, createdAt: new Date().toISOString(),
    }
    try {
      await saveBot(record)
      bots.set([...bots(), record])
      creating.set(false)
      await select(record.id)
    } catch (error) { note.set(`保存 Bot 失败：${readableError(error)}`) }
  }

  async function saveRename() {
    const bot = current()
    if (!bot || !rename().trim()) return
    const next: BotRecord = { ...bot, name: rename().trim() }
    try { await saveBot(next); replace(next); note.set('名称已保存') }
    catch (error) { report(error) }
  }

  async function toggleArchive() {
    const bot = current()
    if (!bot) return
    const next: BotRecord = { ...bot, archived: !bot.archived }
    try {
      await saveBot(next); replace(next)
      note.set(next.archived ? '已归档；已接纳的对话与其历史保留' : '已从归档恢复')
    } catch (error) { report(error) }
  }

  function refreshApproval() {
    approvalSessions.set([...approvals.values()].map(item => item.request.sessionId))
    const request = [...approvals.values()].find(item => item.request.sessionId === current()?.sessionId)?.request
    pendingApproval.set(request)
  }

  function decide(decision: ApprovalDecision) {
    const pending = [...approvals.values()].find(item => item.request === pendingApproval())
    pending?.resolve(decision)
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

  async function repair() {
    const bot = current()
    if (!bot || bot.sessionId || bot.initializing) return
    try {
      const next = { ...bot, preset: formPreset().trim(), workspace: formWorkspace().trim(), model: splitModel(formModel()) }
      await saveBot(next); replace(next)
      problem.set(''); unrecoverable.set(false)
      if (online()) await initialize(next)
    } catch (error) { report(error) }
  }

  cleanup(() => {
    disposed = true
    stopWatch()
    clearInterval(queueTimer)
    void backend.dispose().finally(() => {
      for (const pending of [...approvals.values()]) pending.resolve('cancelled')
    })
  })

  void (async () => {
    try {
      const loaded = await loadBots()
      bots.set(loaded.bots)
      damaged.set(loaded.damaged)
      if (loaded.damaged.length) note.set(`有 ${loaded.damaged.length} 个 Bot 文件无法读取，已跳过。`)
      if (!disposed) await backend.connect()
    } catch (error) { if (!disposed) note.set(readableError(error)) }
  })()

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
        const next = { ...fresh, model }; await saveBot(next); replace(next)
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

  return <View class="flex-1 bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
    <View class="flex-1 flex-row">
      <View class="w-56 border-r border-border p-4 gap-3">
        <Text class="text-xl font-semibold text-foreground">DSH Bot</Text>
        <Button id="backend-start" label="启动官方后台" disabled={connecting()} onPress={() => {
          void backend.start()
        }} />
        <Button id="backend-reconnect" label="重新发现并连接后台" disabled={connecting()} onPress={() => { void backend.connect() }} />
        {usesHostControl() ? <Button id="backend-unregister" label="停止全部 Bot 并卸载后台服务" disabled={connecting()} onPress={() => {
          void backend.unregister()
        }} /> : null}
        <Button id="model-settings" label="模型与供应商" onPress={() => settingsOpen.set(true)} />
        <Button id="bot-new" label="新建 Bot" onPress={() => {
          creating.set(true); selectionEpoch++; selectedId.set(''); stopWatch(); refreshApproval()
          formName.set(''); formPreset.set(presets().find(item => item.isDefault)?.id ?? presets()[0]?.id ?? '')
          formModel.set(models().length ? modelKey(models()[0]!) : ''); formWorkspace.set(homedir())
        }} />
        <Button id="archive-toggle" label={archivedView() ? '返回 Bot 列表' : '归档区'} onPress={() => {
          const next = !archivedView(); archivedView.set(next)
          const first = bots().find(item => item.archived === next)
          if (first) void select(first.id)
        }} />
        <Scroll class="flex-1"><View class="gap-2">
          {visible().map(item => <View role="button" accessibilityLabel={item.name} testID={`bot-${item.id}`} onPress={() => { creating.set(false); void select(item.id) }}
            class={selectedId() === item.id ? 'rounded-md bg-muted p-3' : 'rounded-md p-3 hover:bg-muted'}>
            <Text class="text-foreground">{item.name}</Text>
            <Text class="text-xs text-muted-foreground">{item.sessionId ? '对话已就绪' : '待初始化'}{item.archived ? ' · 已归档' : ''}{item.sessionId && approvalSessions().includes(item.sessionId) ? ' · 有待处理审批' : ''}</Text>
          </View>)}
        </View></Scroll>
        <Text testID="status" class="text-xs text-muted-foreground">{note()}</Text>
      </View>

      {settingsOpen() ? <ModelSettings connection={connection} changed={refreshModels} close={() => settingsOpen.set(false)} /> : <View class="flex-1 min-w-0">
        <View class="border-b border-border p-4 gap-1">
          <Text class="text-lg font-semibold text-foreground">{creating() ? '新建 Bot' : selected()?.name ?? '选择或新建 Bot'}</Text>
          <Text class="text-xs text-muted-foreground">{online() ? (ready() ? '后台已连接' : '后台正在同步') : '后台未连接'}</Text>
        </View>
        <View selectable style={{ flex: 1 }}>
          <List each={messages()} keyExtractor={item => item.id} estimatedItemSize={100} style={{ flex: 1 }}
            contentStyle={{ padding: 24, gap: 18 }} maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 50 }}>
            {item => <View class="gap-2">
              <Text class="text-xs text-muted-foreground">{item().role === 'user' ? '你' : 'Agent'}</Text>
              <Text class="text-base text-foreground">{item().text}</Text>
            </View>}
          </List>
        </View>
        {pendingApproval() ? <View class="border-t border-border p-4 gap-2">
          <Text class="text-sm font-semibold text-foreground">需要确认：{pendingApproval()!.toolName}</Text>
          <Text class="text-xs text-muted-foreground">{pendingApproval()!.reason}{pendingApproval()!.callId ? `（调用 ${pendingApproval()!.callId}）` : ''}</Text>
          <Button id="approval-details" label={approvalDetails() ? '收起详情' : '展开详情'} onPress={() => approvalDetails.set(!approvalDetails())} />
          {approvalDetails() ? <View selectable><Text class="text-xs text-muted-foreground">{pendingApproval()!.details}</Text></View> : null}
          <View class="flex-row gap-2">
            <Button id="approve" label="允许一次" onPress={() => decide('allowed-once')} />
            <Button id="reject" label="拒绝" onPress={() => decide('rejected')} />
          </View>
        </View> : null}
        {queue().length ? <View class="border-t border-border p-3 gap-2">
          <Text class="text-xs text-muted-foreground">已接纳，待处理（{queue().length}）</Text>
          {queue().map(item => <View class="flex-row gap-2">
            <Text class="flex-1 text-sm text-foreground">{(item.content ?? []).filter((block: any) => block.type === 'text').map((block: any) => block.text).join('')}</Text>
            <Button id={`withdraw-${item.id}`} label="撤回" onPress={() => { void withdraw(item.id) }} />
          </View>)}
        </View> : null}
        <View class="border-t border-border p-4 gap-3">
          {catalogError() ? <Text testID="model-catalog-error" class="text-xs text-muted-foreground">{catalogError()}</Text> : null}
          {ready() && !models().length ? <Button id="configure-model" label="配置供应商与凭据" onPress={() => settingsOpen.set(true)} /> : null}
          <Text testID="problem" class="text-xs text-muted-foreground">{problem()}</Text>
          <Text class="text-xs text-muted-foreground">{running() ? '执行中 · ' : ''}{sending() ? '提交中…' : ''}</Text>
          <Input testID="message-input" class={`${field} min-h-20`} multiline value={input()} accessibilityLabel="消息" placeholder="输入纯文本消息" disabled={sending() || selected()?.draft?.state === 'unknown' || selected()?.draft?.state === 'pending'}
            onChange={value => {
              input.set(value)
              const bot = current()
              if (bot) persistDraft(bot, value)
            }} />
          <View class="flex-row gap-2">
            <Button id="send" label="发送" disabled={blocked()} onPress={() => { void send() }} />
            <Button id="stop" label="停止当前执行" disabled={!ready() || !!selected()?.archived || !selected()?.sessionId} onPress={() => { void stop() }} />
          </View>
        </View>
      </View>}

      <Scroll class="w-80 border-l border-border"><View class="p-5 gap-4">
        {creating() ? <View class="gap-3">
          <Text class="text-lg font-semibold text-foreground">新建 Bot</Text>
          <Text class="text-sm text-foreground">名称</Text>
          <Input testID="bot-name" class={field} accessibilityLabel="Bot 名称" value={formName()} onChange={value => formName.set(value)} />
          <Text class="text-sm text-foreground">模板</Text>
          {presets().length ? <View class="gap-1">{presets().map(item =>
            <View role="button" testID={`preset-${item.id}`} accessibilityLabel={item.name} disabled={!!item.broken}
              onPress={() => formPreset.set(item.id)} class={formPreset() === item.id ? 'rounded-md bg-muted p-2' : 'rounded-md p-2 hover:bg-muted'}>
              <Text class="text-sm text-foreground">{item.name}{item.isDefault ? '（默认）' : ''}</Text>
              {item.broken ? <Text class="text-xs text-muted-foreground">不可用：{item.broken}</Text> : null}
            </View>)}</View>
            : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模板目录，可手动填写模板标识'}</Text>}
          <Input testID="bot-preset" class={field} accessibilityLabel="模板标识" value={formPreset()} onChange={value => formPreset.set(value)} />
          <Text class="text-sm text-foreground">默认模型</Text>
          {models().length ? <View class="gap-1">{models().map(item =>
            <View role="button" testID={`model-${item.provider}-${item.model}`} accessibilityLabel={item.name}
              onPress={() => formModel.set(modelKey(item))} class={formModel() === modelKey(item) ? 'rounded-md bg-muted p-2' : 'rounded-md p-2 hover:bg-muted'}>
              <Text class="text-sm text-foreground">{item.name}</Text>
              <Text class="text-xs text-muted-foreground">{item.providerName}</Text>
            </View>)}</View>
            : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模型目录'}</Text>}
          <Text class="text-sm text-foreground">工作区</Text>
          <Input testID="bot-workspace" class={field} accessibilityLabel="工作区" value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
          <Text class="text-xs text-muted-foreground">默认是当前用户主目录；初始化后工作区固定。工作区不是权限沙箱。</Text>
          <Button id="bot-save" label="保存 Bot" onPress={() => { void saveNew() }} />
          {catalogError() ? <Text class="text-xs text-muted-foreground">模板目录：{catalogError()}</Text> : null}
        </View> : selected() ? <View class="gap-3">
          <Text class="text-lg font-semibold text-foreground">Bot 配置</Text>
          <Text class="text-sm text-foreground">名称</Text>
          <Input testID="bot-rename" class={field} accessibilityLabel="Bot 名称" value={rename()} onChange={value => rename.set(value)} />
          <Button id="bot-rename-save" label="保存名称" disabled={!rename().trim() || rename().trim() === selected()!.name} onPress={() => { void saveRename() }} />
          <Button id="bot-archive" label={selected()!.archived ? '取消归档' : '归档 Bot'} onPress={() => { void toggleArchive() }} />

          <Text class="text-sm font-semibold text-foreground">当前对话只读配置</Text>
          <Text testID="session-pointer" class="text-xs text-muted-foreground">{selected()!.sessionId ? `对话标识：${selected()!.sessionId}` : selected()!.initializing ? `候选对话标识：${selected()!.initializing!.candidateSessionId}` : '尚未初始化对话'}</Text>
          <Text class="text-xs text-muted-foreground">模板：{presetLabel(selected()!.preset)}</Text>
          <Text class="text-xs text-muted-foreground">模型：{selected()!.sessionId ? modelLabel(currentModel()) : modelLabel(modelKey(selected()!.model))}</Text>
          {!running() && !pendingApproval() && !selected()!.archived ? <View class="gap-1">
            {models().map(model => <Button id={`select-model-${model.provider}-${model.model}`} label={model.name} onPress={() => { void changeModel(modelKey(model)) }} />)}
          </View> : null}
          <Text class="text-xs text-muted-foreground">工作区：{selected()!.workspace}</Text>
          <Text class="text-xs text-muted-foreground">初始化后模板与工作区固定；重启按模板标识读取当前定义。</Text>

          {!selected()!.sessionId && !selected()!.initializing ? <View class="gap-2">
            <Input testID="repair-preset" accessibilityLabel="修复模板" class={field} value={formPreset()} onChange={value => formPreset.set(value)} />
            <Input testID="repair-workspace" accessibilityLabel="修复工作区" class={field} value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
            <Input testID="repair-model" accessibilityLabel="修复模型" class={field} value={formModel()} onChange={value => formModel.set(value)} />
            <Button id="repair-save" label="保存并重新初始化" disabled={!online()} onPress={() => { void repair() }} />
          </View> : null}
          <Text class="text-sm font-semibold text-foreground">待修复原因</Text>
          <Text class="text-xs text-muted-foreground">{problem() || '没有待修复的问题'}</Text>
          <Button id="recheck" label="重新检查对话" disabled={!online() || (!selected()!.sessionId && !selected()!.initializing)} onPress={() => { void recheck() }} />
          {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
        </View> : <Text class="text-sm text-muted-foreground">选择或新建 Bot</Text>}
      </View></Scroll>
    </View>
  </View>
}
