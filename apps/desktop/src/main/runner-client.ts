import { Context } from '@deepseek-ai/cordis'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import { installConnection } from '@deepseek-ai/dsh-client-connection/client'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import BotRemote from '@dsh-bot/bot/remote'
import WebSocket from 'ws'
import { z } from 'zod'

import type { BotFrame, BotSummary, ChatMessage } from '@/shared/bot'

import {
  readRunnerDescriptor,
  RunnerError,
  runnerUnavailable,
  type RunnerDescriptor,
} from './runner-connection'

const summarySchema = z.object({ botId: z.uuid(), name: z.string() })
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
    case 'bot/invalid-input':
      return new RunnerError('消息内容无效，请修改后重试。', 'BAD_REQUEST')
    case 'bot/turn-failed':
      return new RunnerError('本次执行失败，请检查后台配置并查看历史。')
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
  private current: Session | undefined
  private connecting: Promise<Session> | undefined
  private shutdown: Promise<void> | undefined

  private readonly options: RunnerClientOptions

  constructor(options: RunnerClientOptions) {
    this.options = options
    this.doFetch = options.fetch ?? globalThis.fetch
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
      const response = await this.doFetch(descriptor.connectUrl, {
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
          interactions: 'none',
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
