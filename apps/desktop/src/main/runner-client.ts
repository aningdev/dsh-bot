import { randomUUID } from 'node:crypto'

import { Context } from '@deepseek-ai/cordis'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import SessionRemote from '@deepseek-ai/dsh-api-session-controller/remote'
import SettingsRemote from '@deepseek-ai/dsh-api-settings-controller/remote'
import { installConnection } from '@deepseek-ai/dsh-client-connection/client'
import { SessionId } from '@deepseek-ai/dsh-session/types'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import BotRemote from '@dsh-bot/bot/remote'
import WebSocket from 'ws'
import { z } from 'zod'

import type {
  BotConfiguration,
  BotDetails,
  BotConfigurationOptions,
  ApprovalDecision,
  BotFrame,
  BotInputState,
  PendingInput,
  BotSummary,
  ChatMessage,
  ToolActivity,
  ToolActivityFrame,
} from '@/shared/bot'

import { botConfigurationSchema } from './ipc/bot/schemas'
import { PendingApprovals } from './pending-approvals'
import {
  readRunnerDescriptor,
  RunnerError,
  runnerUnavailable,
  type RunnerDescriptor,
} from './runner-connection'
import { ToolActivityProjection } from './tool-activity'

const summarySchema = z.object({
  botId: z.uuid(),
  name: z.string(),
  status: z.enum(['idle', 'running', 'unavailable']),
})
const detailsSchema = botConfigurationSchema.extend({
  botId: z.uuid(),
  name: z.string(),
  sessionId: z.uuid(),
  revision: z.number().int().nonnegative(),
})
const choicesSchema = z.object({
  templates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      configuration: botConfigurationSchema.omit({ cwd: true }),
    }),
  ),
  capabilities: z.array(z.string()),
})
const pendingInputSchema = z.object({
  id: z.uuid(),
  text: z.string(),
  mode: z.enum(['queue', 'steer']),
})
const inputStateSchema = z.object({
  interrupted: z.boolean().default(false),
  status: z.enum(['idle', 'running']),
  mode: z.enum(['queue', 'steer']),
  pending: z.array(pendingInputSchema),
})
const historySchema = z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string() }))
const frameSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('done') }),
])

interface Session {
  readonly descriptor: RunnerDescriptor
  readonly ctx: Context
  readonly lifetime: AbortController
  usable: boolean
  close(): Promise<void>
}

/** Only external process boundaries are replaceable, including for security tests. */
interface RunnerClientOptions {
  readonly home: () => string
  readonly fetch?: typeof globalThis.fetch
}

function safeRemoteError(error: unknown, sending = false): RunnerError {
  if (error instanceof RunnerError) return error
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined
  switch (code) {
    case 'bot/not-found':
      return new RunnerError('该 Bot 已不存在，请刷新列表。', 'BAD_REQUEST')
    case 'bot/busy':
      return new RunnerError('该 Bot 正在执行，请等待完成后再发送。', 'CONFLICT')
    case 'bot/config-rejected': {
      const details =
        typeof error === 'object' && error !== null && 'details' in error
          ? error.details
          : undefined
      const reason =
        typeof details === 'object' && details !== null && 'reason' in details
          ? details.reason
          : undefined
      const count =
        typeof details === 'object' &&
        details !== null &&
        'pendingCount' in details &&
        typeof details.pendingCount === 'number' &&
        Number.isSafeInteger(details.pendingCount) &&
        details.pendingCount >= 0
          ? details.pendingCount
          : undefined
      const remaining = count === undefined ? '' : `，还有 ${count} 条待处理消息`
      const message =
        reason === 'running'
          ? `Bot 正在执行${remaining}，请停止或等待完成后保存。`
          : reason === 'pending-input'
            ? `尚有待处理输入${remaining}，请处理或撤回后保存。`
            : reason === 'replacing'
              ? '配置正在应用，请等待完成后重试。'
              : reason === 'maintenance'
                ? 'Bot 正在维护，请稍后重试。'
                : 'Bot 暂时不可用，请检查 Runner 状态。'
      return new RunnerError(message, 'CONFLICT')
    }
    case 'bot/config-conflict':
      return new RunnerError('配置已被其他操作更新。请重新加载后再编辑。', 'CONFLICT')
    case 'bot/config-invalid':
      return new RunnerError('配置无效，请检查工作目录、模型和能力选择。', 'BAD_REQUEST')
    case 'bot/config-failed':
      return new RunnerError('新配置未能生效，已恢复原配置。请修改后重试。')
    case 'bot/invalid-input': {
      const field =
        typeof error === 'object' &&
        error !== null &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'field' in error.details
          ? error.details.field
          : undefined
      const message =
        field === 'cwd'
          ? '工作目录不存在或不可访问，请检查后重试。'
          : field === 'templateId'
            ? '模板已不可用，请重新加载后选择。'
            : field === 'name'
              ? 'Bot 名称无效，请修改后重试。'
              : '输入内容无效，请修改后重试。'
      return new RunnerError(message, 'BAD_REQUEST')
    }
    case 'bot/turn-failed':
      return new RunnerError('本次执行失败。请检查「API 设置」中的密钥和 Bot 配置，并查看历史。')
    case 'bot/faulted':
      return new RunnerError('该 Bot 暂时无法执行，请检查 Runner 状态。')
    default:
      return sending
        ? new RunnerError('连接中断，发送结果尚未确认。请重新连接并查看历史，避免重复发送。')
        : runnerUnavailable()
  }
}

/** Bounded observation; abandoning it never cancels the Main-owned execution. */
function observation(signal?: AbortSignal) {
  let frames: BotFrame[] = []
  let bytes = 0
  let attached = !signal?.aborted
  let ended = false
  let failure: RunnerError | undefined
  let wake: (() => void) | undefined
  const detach = () => {
    attached = false
    frames = []
    bytes = 0
    wake?.()
  }
  signal?.addEventListener('abort', detach, { once: true })
  return {
    push(frame: BotFrame) {
      if (!attached || ended) return
      bytes += frame.type === 'text' ? frame.text.length * 2 : 0
      if (bytes > 1_048_576 || frames.length >= 4096) {
        failure = new RunnerError('回复接收过慢，请重新打开对话查看完整历史。')
        ended = true
        frames = []
      } else frames.push(frame)
      wake?.()
    },
    end(error?: RunnerError) {
      failure ??= error
      ended = true
      wake?.()
    },
    stream: (async function* (): AsyncGenerator<BotFrame> {
      try {
        while (attached) {
          const frame = frames.shift()
          if (frame) {
            if (frame.type === 'text') bytes -= frame.text.length * 2
            yield frame
          } else if (ended) {
            if (failure) throw failure
            return
          } else {
            await new Promise<void>((resolve) => {
              wake = resolve
            })
            wake = undefined
          }
        }
      } finally {
        detach()
        signal?.removeEventListener('abort', detach)
      }
    })(),
  }
}

/** Main owns authentication, physical carriers, admitted send pumps and their cleanup. */
export class RunnerClient {
  private readonly doFetch: typeof globalThis.fetch
  private readonly lifetime = new AbortController()
  private readonly sessions = new Set<Session>()
  private readonly jobs = new Set<Promise<void>>()
  private readonly approvals = new PendingApprovals()
  private readonly toolAcknowledgements = new Map<string, (revision: number) => void>()
  private current: Session | undefined
  private connecting: Promise<Session> | undefined
  private shutdown: Promise<void> | undefined

  private readonly options: RunnerClientOptions

  constructor(options: RunnerClientOptions) {
    this.options = options
    this.doFetch = options.fetch ?? globalThis.fetch
  }

  async configurationOptions(): Promise<BotConfigurationOptions> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.configurationOptions(this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return choicesSchema.parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  async configuration(botId: string): Promise<BotDetails> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.get(botId, this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return detailsSchema.parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  async create(input: { name: string; cwd: string; templateId: string }): Promise<BotDetails> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.create(input, this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return detailsSchema.parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  async saveConfiguration(
    botId: string,
    request: { expectedRevision: number; configuration: BotConfiguration },
  ): Promise<BotDetails> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.saveConfiguration(
        botId,
        request,
        this.requestSignal(session),
      )
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return detailsSchema.parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  /** Only status crosses back to the renderer; the reference is product-owned. */
  async credentialStatus(): Promise<{ configured: boolean; writable: boolean }> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.credentials.describe(['DEEPSEEK_API_KEY'])
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return z
        .object({ configured: z.boolean(), writable: z.boolean() })
        .parse(result.value.DEEPSEEK_API_KEY)
    } catch {
      throw new RunnerError('无法读取 API 密钥状态，请检查后台连接后重试。')
    }
  }

  async saveCredential(value: string): Promise<void> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.credentials.set('DEEPSEEK_API_KEY', value)
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
    } catch {
      // Neither remote diagnostics nor the submitted value enter renderer errors.
      throw new RunnerError('密钥未能保存，请检查后台连接及凭据文件权限后重试。')
    }
  }

  async removeCredential(): Promise<void> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.credentials.unset('DEEPSEEK_API_KEY')
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
    } catch {
      throw new RunnerError('密钥未能删除，请检查后台连接及凭据文件权限后重试。')
    }
  }

  async list(): Promise<BotSummary[]> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.list(this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      // Explicit projection keeps configuration and future Host fields inside Main.
      return z.array(summarySchema).parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  async history(botId: string): Promise<ChatMessage[]> {
    try {
      const session = await this.session()
      const result = await session.ctx.remote.bot.history(botId, this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return historySchema.parse(result.value)
    } catch (error) {
      throw safeRemoteError(error)
    }
  }

  async inputState(botId: string): Promise<BotInputState> {
    return inputStateSchema.parse(
      await this.inputCommand((ctx, signal) => ctx.remote.bot.inputState(botId, signal)),
    )
  }

  async submit(botId: string, text: string): Promise<PendingInput> {
    return pendingInputSchema.parse(
      await this.inputCommand((ctx, signal) => ctx.remote.bot.submit(botId, text, signal), true),
    )
  }

  async stop(botId: string): Promise<void> {
    await this.inputCommand((ctx, signal) => ctx.remote.bot.stop(botId, signal))
  }

  async withdraw(botId: string, messageId: string): Promise<{ removed: boolean }> {
    return z
      .object({ removed: z.boolean() })
      .parse(
        await this.inputCommand((ctx, signal) => ctx.remote.bot.withdraw(botId, messageId, signal)),
      )
  }

  private async inputCommand<T>(
    operation: (
      ctx: Context,
      signal: AbortSignal,
    ) => Promise<{ ok: true; value: T } | { ok: false; error: unknown }>,
    sending = false,
  ): Promise<T> {
    try {
      const session = await this.session()
      const result = await operation(session.ctx, this.requestSignal(session))
      if (!result.ok) {
        this.invalidateTransportFailure(session, result.error)
        throw result.error
      }
      return result.value
    } catch (error) {
      throw safeRemoteError(error, sending)
    }
  }

  async pendingApprovals(botId: string) {
    // Reconnection withdraws old requests before any new snapshot is returned.
    await this.session()
    return this.approvals.list(botId)
  }

  decideApproval(botId: string, id: string, decision: ApprovalDecision): void {
    if (!this.approvals.decide(botId, id, decision)) {
      throw new RunnerError('该审批已结束，请查看最新状态。', 'CONFLICT')
    }
  }

  acknowledgeTools(observationId: string, revision: number): void {
    this.toolAcknowledgements.get(observationId)?.(revision)
  }

  /** One IPC frame in flight; canonical events drain into a bounded latest snapshot. */
  async *tools(botId: string, signal?: AbortSignal): AsyncGenerator<ToolActivityFrame> {
    const session = await this.session()
    const observation = new AbortController()
    const active = AbortSignal.any([
      session.lifetime.signal,
      observation.signal,
      ...(signal ? [signal] : []),
    ])
    try {
      active.throwIfAborted()
      const bot = await session.ctx.remote.bot.get(
        botId,
        AbortSignal.any([active, AbortSignal.timeout(10_000)]),
      )
      if (!bot.ok) throw bot.error
      const { sessionId } = z.object({ sessionId: z.uuid() }).parse(bot.value)
      const stream = session.ctx.remote.session.follow(
        { address: { kind: 'session', sessionId: SessionId(sessionId) }, maxMessages: 500 },
        active,
      )
      const projection = new ToolActivityProjection()
      const observationId = randomUUID()
      let latest: readonly ToolActivity[] = []
      let revision = 0
      let delivered = 0
      let acknowledged = 0
      let ended = false
      let failure: { error: unknown } | undefined
      let wake: (() => void) | undefined
      const notify = () => wake?.()
      active.addEventListener('abort', notify, { once: true })
      this.toolAcknowledgements.set(observationId, (value) => {
        if (value !== delivered) return
        acknowledged = value
        notify()
      })
      // This pump never waits for renderer consumption. Only its latest bounded
      // projection is retained while an IPC frame awaits acknowledgement.
      const pump = (async () => {
        try {
          for await (const frame of stream) {
            active.throwIfAborted()
            const activities = projection.accept(frame)
            if (activities) {
              latest = activities
              revision++
              notify()
            }
          }
          if (!active.aborted) throw new Error('Tool observation ended unexpectedly')
        } catch (error) {
          failure = { error }
        } finally {
          ended = true
          notify()
        }
      })()
      this.jobs.add(pump)
      try {
        while (!active.aborted) {
          if (ended) {
            if (failure) throw failure.error
            break
          }
          if (revision > delivered && acknowledged === delivered) {
            delivered = revision
            yield { observationId, revision, activities: latest }
          } else {
            await new Promise<void>((resolve) => {
              wake = resolve
            })
            wake = undefined
          }
        }
      } finally {
        observation.abort()
        active.removeEventListener('abort', notify)
        this.toolAcknowledgements.delete(observationId)
        stream.dispose()
        await pump
        this.jobs.delete(pump)
      }
    } catch (error) {
      if (!signal?.aborted && !this.lifetime.signal.aborted) {
        this.invalidateTransportFailure(session, error)
        throw safeRemoteError(error)
      }
    } finally {
      observation.abort()
    }
  }

  /** Start at admission, independently of the observer's first/last next() call. */
  send(botId: string, text: string, signal?: AbortSignal): AsyncIterable<BotFrame> {
    const observer = observation(signal)
    const task = this.pump(botId, text, observer).catch((error: unknown) => {
      observer.end(safeRemoteError(error, true))
    })
    this.jobs.add(task)
    void task.then(() => {
      this.jobs.delete(task)
    })
    return observer.stream
  }

  /** Real app quit only: stop admission, release carriers, then await all owned work. */
  close(): Promise<void> {
    return (this.shutdown ??= (async () => {
      this.lifetime.abort()
      await this.connecting?.catch(() => undefined)
      await Promise.all([...this.sessions].map((session) => session.close()))
      await Promise.all(this.jobs)
    })())
  }

  private requestSignal(session: Session): AbortSignal {
    return AbortSignal.any([session.lifetime.signal, AbortSignal.timeout(10_000)])
  }

  private async pump(
    botId: string,
    text: string,
    observer: ReturnType<typeof observation>,
  ): Promise<void> {
    const session = await this.session()
    const stream = session.ctx.remote.bot.send(botId, text, session.lifetime.signal)
    let done = false
    try {
      for await (const value of stream) {
        const frame = frameSchema.parse(value)
        if (done) throw new Error('Invalid stream completion')
        done = frame.type === 'done'
        observer.push(frame)
      }
      if (!done) throw new Error('Missing durable completion')
      observer.end()
    } catch (error) {
      this.invalidateTransportFailure(session, error)
      throw safeRemoteError(error, true)
    } finally {
      stream.dispose()
    }
  }

  private invalidateTransportFailure(session: Session, error: unknown): void {
    const code =
      typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined
    // Request cancellation says nothing about the authenticated lifecycle socket.
    if (code === 'gateway/cancelled') return
    if (typeof code !== 'string' || !code.startsWith('bot/')) session.usable = false
  }

  private async session(): Promise<Session> {
    if (this.lifetime.signal.aborted) throw runnerUnavailable()
    // One serialized factory per client; failed attempts are never memoized.
    if (this.connecting) return this.connecting
    const attempt = (async () => {
      const descriptor = await readRunnerDescriptor(this.options.home())
      if (this.lifetime.signal.aborted) throw runnerUnavailable()
      if (this.current?.usable && this.current.descriptor.instanceId === descriptor.instanceId)
        return this.current
      if (this.current) await this.current.close()
      const session = await this.authenticate(descriptor)
      this.current = session
      return session
    })()
    this.connecting = attempt
    try {
      return await attempt
    } finally {
      if (this.connecting === attempt) this.connecting = undefined
    }
  }

  private async authenticate(descriptor: RunnerDescriptor): Promise<Session> {
    const lifetime = new AbortController()
    const abort = () => {
      lifetime.abort()
    }
    this.lifetime.signal.addEventListener('abort', abort, { once: true })
    if (this.lifetime.signal.aborted) abort()
    const ctx = new Context()
    const sockets = new Set<WebSocket>()
    let closing: Promise<void> | undefined
    const session: Session = {
      descriptor,
      ctx,
      lifetime,
      usable: false,
      close: () =>
        (closing ??= (async () => {
          session.usable = false
          lifetime.abort()
          try {
            // terminate guarantees physical close even for an unresponsive local server.
            for (const socket of sockets) socket.terminate()
            await ctx.fiber.dispose()
          } finally {
            this.lifetime.signal.removeEventListener('abort', abort)
            this.sessions.delete(session)
          }
        })()),
    }
    this.sessions.add(session)
    try {
      const connectUrl = new URL(descriptor.connectUrl)
      connectUrl.searchParams.set('interactions', 'answer')
      const response = await this.doFetch(connectUrl, {
        redirect: 'manual',
        signal: AbortSignal.any([lifetime.signal, AbortSignal.timeout(5000)]),
      })
      try {
        const location = response.headers.get('location')
        const target = location === null ? undefined : new URL(location, descriptor.origin)
        const cookies = response.headers.getSetCookie().map((value) => value.split(';', 1)[0])
        if (
          response.status !== 302 ||
          target?.origin !== descriptor.origin ||
          target.pathname !== '/api/remote.mux' ||
          target.search ||
          target.hash ||
          target.username ||
          target.password ||
          cookies.length === 0 ||
          cookies.some(
            (value) => !value || !/^[!#$%&'*+.^_`|~\w-]+=[\x21-\x3A\x3C-\x7E]+$/.test(value),
          )
        )
          throw runnerUnavailable()
        const cookie = cookies.join('; ')
        const opened = Promise.withResolvers<void>()
        // A plugin may fail before we await readiness; contain early rejection too.
        void opened.promise.catch(() => undefined)
        installConnection(ctx, {
          interactions: 'answer',
          transport: {
            streamBaseUrl: descriptor.origin + '/',
            fetch: (input, init) => {
              const url = new URL(input, descriptor.origin + '/')
              if (
                !session.usable ||
                url.origin !== descriptor.origin ||
                !url.pathname.startsWith('/api/') ||
                url.username ||
                url.password ||
                url.hash
              )
                return Promise.reject(runnerUnavailable())
              const headers = new Headers(init.headers)
              headers.set('cookie', cookie)
              return this.doFetch(url, {
                ...init,
                headers,
                redirect: 'error',
                signal: AbortSignal.any([lifetime.signal, ...(init.signal ? [init.signal] : [])]),
              })
            },
            createWebSocket: (input) => {
              // Passive Gateway creates exactly one socket per authenticated Context.
              if (sockets.size || lifetime.signal.aborted) throw runnerUnavailable()
              const url = new URL(input)
              if (
                url.protocol !== 'ws:' ||
                url.host !== new URL(descriptor.origin).host ||
                url.pathname !== '/api/remote.mux' ||
                url.search ||
                url.hash ||
                url.username ||
                url.password
              )
                throw runnerUnavailable()
              const socket = new WebSocket(url, {
                headers: { cookie },
                handshakeTimeout: 5000,
                followRedirects: false,
              })
              sockets.add(socket)
              socket.once('open', () => {
                session.usable = true
                opened.resolve()
              })
              socket.on('error', () => {
                opened.reject(runnerUnavailable())
              })
              socket.once('close', () => {
                lifetime.abort()
                session.usable = false
                opened.reject(runnerUnavailable())
              })
              return socket
            },
          },
        })
        await ctx.plugin(TypertRegistry)
        await ctx.plugin(Gateway)
        await ctx.remote.$mount(BotRemote)
        await ctx.remote.$mount(SessionRemote)
        await ctx.remote.$mount(SettingsRemote)
        // Published Controller client JS is a browser plugin, so Main registers
        // a minimal public Typert Context adapter instead of loading its UI.
        const sessionScopes = new WeakMap<Context, ReturnType<typeof SessionId>>()
        ctx.typert.contexts.registerClient('agent', {
          identity: (candidate) => sessionScopes.get(candidate),
          resolve: (id) => {
            const parsed = z.uuid().safeParse(id)
            if (!parsed.success) return undefined
            const scope = ctx.extend()
            sessionScopes.set(scope, SessionId(parsed.data))
            return scope
          },
        })
        const approvals = this.approvals
        ctx.remote.$on('approval/request', async function (request, next) {
          const sessionId = sessionScopes.get(this)
          if (!sessionId || lifetime.signal.aborted) return next()
          const signal = AbortSignal.any([
            lifetime.signal,
            ...(request.signal ? [request.signal] : []),
          ])
          const bots = await ctx.remote.bot.list(
            AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
          )
          if (!bots.ok || signal.aborted) return next()
          const bot = bots.value.find((candidate) => candidate.sessionId === sessionId)
          if (!bot) return next()
          return approvals.request(
            {
              botId: bot.botId,
              toolName: request.toolName.slice(0, 256),
              ...(request.callId ? { callId: request.callId } : {}),
              reason: (request.reason ?? request.displayReason?.en ?? '').slice(0, 16_384),
            },
            signal,
          )
        })
        await opened.promise
        lifetime.signal.throwIfAborted()
        if (!session.usable) throw runnerUnavailable()
        return session
      } finally {
        await response.body?.cancel()
      }
    } catch {
      await session.close()
      throw runnerUnavailable()
    }
  }
}
