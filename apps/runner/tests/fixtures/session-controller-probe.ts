/** Test-only lifecycle observations and deterministic operation barriers. */
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-api-gateway'
import type {} from '@deepseek-ai/dsh-api-session-controller'
import { Peer } from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-client-file-upload'
import { FileReferenceService } from '@deepseek-ai/dsh-file-reference'
import { SessionId } from '@deepseek-ai/dsh-session'
import { remoteErrorOf } from '@deepseek-ai/dsh-typert-protocol'
import schema from '@deepseek-ai/schemastery'
import type {} from '@dsh-bot/bot'

export const name = 'session-controller-compatibility-probe'
export const inject = ['botController', 'sessionController', 'fileUploads', 'typertGateway']

/** Experimental setup; production never loads this plugin. */
export interface Config {
  readonly ownerLifecycle: boolean
  readonly holdFileReferences: boolean
  readonly holdCleanup: boolean
  readonly holdModel: string
}
export const Config: schema<Config> = schema.object({
  ownerLifecycle: schema.boolean().default(false),
  holdFileReferences: schema.boolean().default(false),
  holdCleanup: schema.boolean().default(false),
  holdModel: schema.string().default(''),
})

/** Send compatibility evidence over the private test channel. */
function report(event: string, sessionId: string, detail = ''): void {
  if (process.send === undefined)
    throw new Error('Compatibility tests require a private IPC channel')
  process.send({ type: 'compatibility', event, sessionId, detail }, (error) => {
    if (error !== null) throw error
  })
}

/**
 * Install observations and cancellable barriers over real profile services.
 * @param ctx - Profile context owning this test's probes and IPC listener.
 * @param config - Explicit preset, integration, and barrier modes.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const operations = new Map<string, () => void>()
  const active = new Set<Promise<unknown>>()
  const track = <T>(task: Promise<T>): Promise<T> => {
    active.add(task)
    const release = (): void => {
      active.delete(task)
    }
    void task.then(release, release)
    return task
  }
  const hold = async (phase: string, sessionId: string, signal: AbortSignal): Promise<void> => {
    signal.throwIfAborted()
    const gate = Promise.withResolvers<void>()
    operations.set(phase, gate.resolve)
    const abort = (): void => {
      gate.reject(signal.reason)
    }
    signal.addEventListener('abort', abort, { once: true })
    report(`${phase}-blocked`, sessionId)
    try {
      await gate.promise
    } finally {
      signal.removeEventListener('abort', abort)
      operations.delete(phase)
    }
  }
  if (config.holdFileReferences) {
    class HeldReferences extends FileReferenceService {
      static inject = ['agents']
      list(agent: Agent, _query: string, signal: AbortSignal): Promise<[]> {
        const activeState = agent.ctx.fiber.state
        return track(
          (async () => {
            try {
              await hold('references', agent.id, signal)
              if (this.ctx.agents.get(agent.id) !== agent)
                throw new Error('Agent retired during discovery')
              return []
            } finally {
              if (config.holdCleanup) {
                let readable = false
                try {
                  await ctx.botController.getBot(agent.id, new AbortController().signal)
                  readable = true
                } catch (error) {
                  report('record-read-failed', agent.id, String(error))
                }
                report(
                  'cleanup-resources',
                  agent.id,
                  JSON.stringify({
                    agentLive: agent.ctx.fiber.state === activeState,
                    recordsReadable: readable,
                  }),
                )
                await hold('references-cleanup', agent.id, new AbortController().signal)
              }
              report(
                'references-cleanup',
                agent.id,
                agent.ctx.fiber.state === activeState ? 'live' : 'disposed',
              )
            }
          })(),
        )
      }
    }
    await ctx.plugin(HeldReferences)
  }
  const bridge = config.ownerLifecycle
    ? await ctx.plugin(await import('@dsh-bot/bot/session-controller'))
    : undefined
  const initialization = Promise.withResolvers<void>()
  ctx.on(
    'api-session/error',
    (id, error) => {
      report('activation-error', id, error)
    },
    { global: true },
  )
  ctx.on(
    'agent/created',
    async ({ agent }) => {
      report('agent-announced', agent.id, agent.options.model ?? '')
      if (config.holdModel.length > 0 && agent.options.model === config.holdModel) {
        report('initialization-blocked', agent.id)
        await initialization.promise
      }
    },
    { global: true },
  )
  const control = (message: unknown): void => {
    if (typeof message !== 'object' || message === null || !('type' in message)) return
    if (message.type === 'compatibility:release') {
      if ('phase' in message && typeof message.phase === 'string') operations.get(message.phase)?.()
      else initialization.resolve()
    }
    if (message.type === 'compatibility:withdraw') {
      if (bridge === undefined) throw new Error('No lifecycle integration to withdraw')
      void bridge.dispose().then(
        () => report('bridge-withdrawn', ''),
        (error) => report('probe-error', '', String(error)),
      )
    }
    if (
      message.type === 'compatibility:close-unstarted-stream' &&
      'sessionId' in message &&
      typeof message.sessionId === 'string'
    ) {
      const sessionId = SessionId(message.sessionId)
      void track(
        (async () => {
          const peer = new Peer(ctx, { principal: { kind: 'owner' } })
          try {
            const stream = await ctx.typertGateway.stream({
              namespace: 'session',
              method: 'follow',
              args: { request: { address: { kind: 'session', sessionId } } },
              peer,
            })
            const iterator = stream[Symbol.asyncIterator]()
            const closing = iterator.return?.()
            const next = iterator.next()
            await closing
            if (!(await next).done) throw new Error('Closed stream executed a later read')
            report('unstarted-stream-closed', sessionId)
          } finally {
            await peer.dispose()
          }
        })(),
      ).catch((error: unknown) => report('probe-error', sessionId, String(error)))
    }
    if (
      message.type === 'compatibility:upload' &&
      'sessionId' in message &&
      typeof message.sessionId === 'string'
    ) {
      const sessionId = SessionId(message.sessionId)
      const upload = track(
        ctx.fileUploads.uploadStream({
          sessionId,
          name: 'held.txt',
          data: async function* (signal) {
            try {
              yield Buffer.from('first chunk\n')
              await hold('upload', sessionId, signal)
              yield Buffer.from('last chunk\n')
            } finally {
              report('upload-cleanup', sessionId)
            }
          },
        }),
      )
      void upload.then(
        (value) => report('upload-complete', sessionId, JSON.stringify(value)),
        (error) => report('upload-failed', sessionId, remoteErrorOf(error)?.code ?? String(error)),
      )
    }
  }
  ctx.effect(() => {
    process.on('message', control)
    return async () => {
      initialization.resolve()
      await Promise.allSettled(active)
      process.off('message', control)
    }
  })
  report('ready', '')
}
