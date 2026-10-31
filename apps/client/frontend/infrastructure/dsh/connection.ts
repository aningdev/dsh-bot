// Official `dsh web` protocol client: bootstrap cookie, Remote streams, no
// custom endpoints. Everything the UI needs is projected to plain values.
import { AuthenticatedSocket } from './socket'
import { Context, installConnection, TypertRegistry, Gateway, sessionRemote } from './sdk.js'
import { agentPresetsRemote, settingsRemote, llmRemote } from './presets.js'

export type ApprovalDecision = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable'

export interface ApprovalRequest {
  sessionId: string
  toolName: string
  callId?: string
  reason: string
  details: string
  signal?: AbortSignal
}

export interface CatalogReasoningEffort {
  id: string
  name: string
  description?: string
}

export interface CatalogModel {
  provider: string
  providerName: string
  model: string
  name: string
  description?: string
  /** Present when the provider advertises adjustable reasoning effort for this model. */
  reasoning?: {
    efforts: CatalogReasoningEffort[]
    defaultEffort?: string
  }
}

export interface CatalogPreset {
  id: string
  name: string
  description?: string
  broken?: string
  isDefault: boolean
}

export interface ModelCatalog {
  default: { provider: string; model: string }
  models: CatalogModel[]
  failures: { name: string; message: string }[]
}

const messages: Record<string, string> = {
  'session/provider-credentials-unavailable': '后台没有可用的模型凭据。',
  'session/provider-models-unavailable': '模型提供方暂时不可用，请检查端点与凭据。',
  'session/model-unavailable': '所选模型当前不可用。',
  'session/conflict': '该工作区已被另一个对话占用。',
  'session/projections-unavailable': '后台未提供该对话的配置快照。',
  'session/writer-held': '该对话正被另一个客户端写入。',
  'session/agent-busy': '该对话正在执行，请稍后再操作。',
  'agent-preset/not-found': '后台不存在该模板。',
  'agent-preset/invalid': '该模板无法在当前后台组合。',
  'agent-preset/locked': '对话已初始化，不能更换模板。',
}

/** Turn a Remote failure into one readable Chinese sentence. */
export function readableError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  const match = /^([a-z0-9-]+\/[a-z0-9-]+):\s*(.*)$/.exec(raw.trim())
  if (match) {
    const known = messages[match[1]!]
    return match[2] ? `${known ?? match[1]}（${match[2]}）` : (known ?? raw)
  }
  if (/Failed to fetch|NetworkError|connection/i.test(raw)) return `连接后台失败：${raw}`
  return raw
}

function unwrap<T = any>(result: any): T {
  if (!result || result.ok !== true) {
    const error = result?.error ?? { code: 'unknown/error', message: String(result) }
    throw new Error(`${error.code}: ${error.message}`)
  }
  return result.value as T
}

const agentTag = Symbol('dsh-bot.agent')
function agentScope() {}
interface Scope {
  ctx: any
  dispose(): Promise<void> | void
}

export class Connection {
  private epoch = 0
  private connecting?: AbortController
  private generationSubscription?: () => void
  private ctx?: any
  private scopes = new Map<string, Scope>()
  private followId = 0
  private approval?: (request: ApprovalRequest) => Promise<ApprovalDecision>
  /** The backend has a live Event generation (reconnects replace it). */
  ready = false
  origin = ''

  onGenerationChange?: (ready: boolean) => void

  /** Decide what a pending approval gets; without a handler the ask fails closed. */
  approvals(handler: (request: ApprovalRequest) => Promise<ApprovalDecision>): void {
    this.approval = handler
  }

  async connect(loginUrl: string): Promise<void> {
    if (this.ctx) throw new Error('已经连接后台')
    const epoch = ++this.epoch
    const controller = new AbortController()
    this.connecting = controller
    const login = new URL(loginUrl)
    if (login.protocol !== 'http:' || login.hostname !== '127.0.0.1') throw new Error('后台地址必须是本机回环地址')
    const token = login.searchParams.get('token')
    if (!token) throw new Error('启动链接缺少认证令牌')
    const url = new URL('/connect', login)
    url.searchParams.set('token', token)
    url.searchParams.set('interactions', 'answer')
    let response: Response
    try {
      response = await fetch(url.toString(), { redirect: 'manual', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
    } catch (error) {
      throw new Error(`认证请求失败：${readableError(error).replaceAll(token, '<已隐藏>')}`)
    }
    const cookie = response.headers.getSetCookie().map(value => value.split(';', 1)[0]).filter(Boolean).join('; ')
    if (response.status !== 302 || !cookie) throw new Error(`认证失败：后台返回 ${response.status}，未取得 Cookie`)
    if (epoch !== this.epoch) throw new Error('连接已被新的宿主状态替代')
    const ctx: any = new Context()
    this.ctx = ctx
    this.origin = login.origin
    try {
      installConnection(ctx, {
        interactions: 'answer',
        transport: {
          streamBaseUrl: login.origin + '/',
          fetch: (input: string | URL, init: RequestInit) => {
            const headers = new Headers(init.headers)
            headers.set('cookie', cookie)
            const signal = init.signal ? AbortSignal.any([init.signal, controller.signal]) : controller.signal
            return fetch(new URL(String(input), login.origin).toString(), { ...init, headers, signal })
          },
          createWebSocket: (target: string) => new AuthenticatedSocket(target, cookie),
        },
      })
      await ctx.plugin(TypertRegistry)
      ctx.typert.contexts.registerClient('agent', {
        identity: (candidate: any) => candidate?.[agentTag],
        resolve: (id: unknown) => {
          if (typeof id !== 'string' || epoch !== this.epoch || this.ctx !== ctx) return undefined
          this.scope(id)
          return this.scopes.get(id)?.ctx
        },
      })
      await ctx.plugin(Gateway)
      await ctx.remote.$mount(sessionRemote)
      await ctx.remote.$mount(agentPresetsRemote)
      await ctx.remote.$mount(settingsRemote)
      await ctx.remote.$mount(llmRemote)
      const owner = this
      ctx.remote.$on('approval/request', function (this: any, request: any) {
        return owner.answerApproval(request.agent?.[agentTag] ?? this?.[agentTag], request)
      })
      if (epoch !== this.epoch || this.ctx !== ctx) throw new Error('连接已被新的宿主状态替代')
      await this.waitForGeneration(ctx, controller.signal)
      if (epoch !== this.epoch || this.ctx !== ctx) throw new Error('连接已被新的宿主状态替代')
      this.ready = true
      this.onGenerationChange?.(true)
      this.generationSubscription = ctx.connection.generation.subscribe(() => {
        if (epoch !== this.epoch || this.ctx !== ctx) return
        const next = !!ctx.connection.generation.getSnapshot()
        if (next === this.ready) return
        this.ready = next
        this.onGenerationChange?.(next)
      })
    } catch (error) {
      await ctx.fiber.dispose().catch(() => undefined)
      if (this.ctx === ctx) this.ctx = undefined
      throw error instanceof Error ? error : new Error(readableError(error))
    }
  }

  private waitForGeneration(ctx: any, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let unsubscribe = () => {}
      const finish = (error?: Error) => {
        clearTimeout(timer)
        unsubscribe()
        signal.removeEventListener('abort', abort)
        if (error) reject(error)
        else resolve()
      }
      const abort = () => finish(new Error('连接已被新的宿主状态替代'))
      const timer = setTimeout(() => finish(new Error('等待后台事件流超时。')), 15000)
      const check = () => {
        if (ctx.connection.generation.getSnapshot()) finish()
      }
      unsubscribe = ctx.connection.generation.subscribe(check)
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) abort()
      else check()
    })
  }

  private get remote(): any {
    if (!this.ctx) throw new Error('尚未连接后台')
    return this.ctx.remote
  }

  async modelCatalog(): Promise<ModelCatalog> {
    const value = unwrap(await this.remote.session.modelCatalog())
    return {
      default: { provider: value.default.provider, model: value.default.model },
      models: (value.groups ?? []).flatMap((group: any) =>
        (group.models ?? []).map((model: any) => ({
          provider: group.id,
          providerName: group.name,
          model: model.id,
          name: model.name,
          ...(model.description ? { description: model.description } : {}),
          ...(model.reasoning?.efforts?.length ? {
            reasoning: {
              efforts: model.reasoning.efforts.map((effort: any) => ({
                id: String(effort.id),
                name: String(effort.name ?? effort.id),
                ...(effort.description ? { description: String(effort.description) } : {}),
              })),
              ...(model.reasoning.defaultEffort ? { defaultEffort: String(model.reasoning.defaultEffort) } : {}),
            },
          } : {}),
        }))),
      failures: (value.failures ?? []).map((failure: any) => ({ name: failure.name, message: failure.message })),
    }
  }

  async presetCatalog(): Promise<CatalogPreset[]> {
    const roster = unwrap(await this.remote.agentPresets.list())
    return (roster.presets ?? []).map((preset: any) => ({
      id: preset.id,
      name: typeof preset.name === 'string' ? preset.name : preset.id,
      ...(preset.description ? { description: preset.description } : {}),
      ...(preset.broken ? { broken: String(preset.broken) } : {}),
      isDefault: preset.isDefault === true,
    }))
  }

  async createSession(request: { cwd: string; agentPreset: string; sessionId?: string; workspaceId?: string }): Promise<{ sessionId: string; agentPreset?: string }> {
    const value = unwrap(await this.remote.session.create({
      cwd: request.cwd,
      agentPreset: request.agentPreset,
      ...(request.sessionId ? { sessionId: request.sessionId } : {}),
      ...(request.workspaceId ? { workspaceId: request.workspaceId } : {}),
    }))
    return { sessionId: String(value.sessionId), ...(value.agentPreset ? { agentPreset: value.agentPreset } : {}) }
  }

  async listSessions(): Promise<{ sessionId: string; cwd?: string; blank: boolean; agentAvailable: boolean; updatedAt: number }[]> {
    const items: any[] = []
    let cursor: string | undefined
    for (let page = 0; page < 20; page++) {
      const value = unwrap(await this.remote.session.list(cursor ? { cursor } : {}))
      items.push(...(value.items ?? []))
      cursor = typeof value.cursor === 'string' ? value.cursor : undefined
      if (!cursor) break
    }
    return items.map(item => ({
      sessionId: String(item.sessionId),
      ...(typeof item.cwd === 'string' ? { cwd: item.cwd } : {}),
      blank: item.blank === true,
      agentAvailable: item.agentAvailable === true,
      updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : 0,
    }))
  }

  async selectModel(request: { sessionId: string; provider: string; model: string; reasoningEffort?: string }): Promise<void> {
    unwrap(await this.remote.session.selectModel({
      sessionId: request.sessionId,
      provider: request.provider,
      model: request.model,
      ...(request.reasoningEffort ? { reasoningEffort: request.reasoningEffort } : {}),
    }))
  }

  /** The Session's current settings, or `undefined` when the backend has no snapshot. */
  async projections(sessionId: string): Promise<any> {
    const value = unwrap(await this.remote.session.projections({ sessionId }))
    return value?.values
  }

  async queue(sessionId: string): Promise<any[]> {
    const values = await this.projections(sessionId)
    return [...(values?.inbox?.['next-turn'] ?? []), ...(values?.inbox?.['next-step'] ?? [])]
  }

  async withdraw(sessionId: string, itemId: string): Promise<void> {
    unwrap(await this.remote.session.updateQueue({ sessionId, itemId, action: { kind: 'remove' } }))
  }

  /** A positive correlation is evidence; absence always remains unknown. */
  async admitted(sessionId: string, requestId: string): Promise<boolean> {
    const contains = (value: any): boolean => {
      if (!value || typeof value !== 'object') return false
      if (value.source?.kind === 'user' && value.source.rpcId === requestId) return true
      return Object.values(value).some(item => Array.isArray(item) ? item.some(contains) : contains(item))
    }
    if (contains(await this.queue(sessionId))) return true
    const stream = this.remote.session.follow({ address: { kind: 'session', sessionId } })
    try {
      const opening = await stream[Symbol.asyncIterator]().next()
      const snapshot = opening.value
      if (!snapshot || snapshot.type !== 'snapshot') throw new Error('无法取得核对历史')
      if (contains(snapshot)) return true
      let records = snapshot.records, hasMore = snapshot.hasMore
      while (hasMore) {
        const beforeSeq = Math.min(...records.map((record: any) => record.event.seq))
        if (!Number.isFinite(beforeSeq)) throw new Error('历史分页未推进，结果仍未知')
        const page: any = unwrap(await this.remote.session.page({
          address: { kind: 'session', sessionId }, throughSeq: snapshot.cursor, beforeSeq, maxMessages: 100,
        }))
        if (contains(page.records)) return true
        records = page.records
        hasMore = page.hasMore
      }
      return false
    } finally { stream.dispose() }
  }

  async settings(): Promise<any> { return unwrap(await this.remote.settings.describe()) }
  async providers(): Promise<any> { return unwrap(await this.remote.llm.listConfigurableProviders()) }
  async mutate(ns: string, ops: any[], revision: number): Promise<any> {
    return unwrap(await this.remote.settings.mutate(ns, ops, revision))
  }
  async credential(ref: string, value?: string): Promise<void> {
    unwrap(await (value === undefined ? this.remote.credentials.unset(ref) : this.remote.credentials.set(ref, value)))
  }
  async credentialInfo(ref: string): Promise<any> { return unwrap<any>(await this.remote.credentials.describe([ref]))[ref] }

  async prompt(request: { sessionId: string; requestId: string; text: string }): Promise<void> {
    unwrap(await this.remote.session.prompt({
      sessionId: request.sessionId,
      requestId: request.requestId,
      mode: 'queue',
      content: [{ type: 'text', text: request.text }],
    }))
  }

  async cancel(sessionId: string): Promise<void> {
    unwrap(await this.remote.session.cancel({ sessionId }))
  }

  /** Follow one Session's history; returns the disposer that stops the stream. */
  follow(sessionId: string, onFrame: (frame: unknown) => void, onError?: (error: Error) => void): () => void {
    if (!this.ctx) throw new Error('尚未连接后台')
    this.scope(sessionId)
    const stream = this.remote.session.follow({ address: { kind: 'session', sessionId }, assistantStream: true })
    const id = ++this.followId
    let closed = false
    void (async () => {
      try {
        for await (const frame of stream) {
          if (closed || id !== this.followId) return
          onFrame(frame)
        }
        if (!closed && id === this.followId) onError?.(new Error('后台历史流已结束，正在重新连接。'))
      } catch (error) {
        if (!closed && id === this.followId) onError?.(new Error(`后台历史流中断：${readableError(error)}`))
      }
    })()
    return () => {
      closed = true
      try { stream.dispose() } catch { /* already closed */ }
    }
  }

  /** Register the Client scope that answers this Session's approvals. */
  private scope(sessionId: string): void {
    if (this.scopes.has(sessionId) || !this.ctx) return
    const fiber = this.ctx.plugin(agentScope)
    const identity = { sessionId }
    const agent = fiber.ctx.extend({
      [agentTag]: sessionId,
      [Context.filter](listener: any) { return listener[agentTag] === undefined || listener[agentTag] === identity.sessionId },
    })
    this.scopes.set(sessionId, { ctx: agent, dispose: () => fiber.dispose() })
  }

  private async answerApproval(sessionId: string | undefined, request: any): Promise<ApprovalDecision> {
    if (!sessionId || !this.scopes.has(sessionId)) return 'unavailable'
    if (request.signal?.aborted) return 'cancelled'
    if (!this.approval) return 'unavailable'
    try {
      return await this.approval({
        sessionId,
        toolName: String(request.toolName ?? '工具'),
        ...(request.callId ? { callId: String(request.callId) } : {}),
        reason: String(request.displayReason?.zh ?? request.reason ?? '需要你的确认'),
        details: JSON.stringify({ toolName: request.toolName, callId: request.callId, reason: request.reason, displayReason: request.displayReason }, null, 2),
        signal: request.signal,
      })
    } catch { return 'rejected' }
  }

  async dispose(): Promise<void> {
    this.epoch++
    this.connecting?.abort()
    this.connecting = undefined
    this.generationSubscription?.()
    this.generationSubscription = undefined
    const ctx = this.ctx
    this.ctx = undefined
    this.ready = false
    const scopes = [...this.scopes.values()]
    this.scopes.clear()
    for (const scope of scopes) {
      try { await scope.dispose() } catch { /* already gone */ }
    }
    if (ctx) await ctx.fiber.dispose().catch(() => undefined)
  }
}
