/** Product-owned operation admission and retirement; independent of Harness patches. */
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { LlmCallConfig } from '@deepseek-ai/dsh-llm'

/** The Bot retains the AgentHandle; consumers borrow only the Agent and model selection. */
export interface BotSessionAgent {
  readonly agent: Agent
  readonly selection: LlmCallConfig
}

/** Replacement access can end at opening while consumer cleanup remains tracked. */
export interface OperationLease {
  readonly lifetime?: 'opening' | 'call'
  release(): void | Promise<void>
}

export interface ManagedOperationLease {
  readonly signal: AbortSignal
  releaseOpening(): Promise<void>
  release(error?: unknown): Promise<void>
}

type Provider<Request> = (
  request: Request & { readonly signal: AbortSignal },
) => OperationLease | undefined | Promise<OperationLease | undefined>

/** One provider owns admission until all accepted consumers finish cleanup. */
export class OperationGuardRegistry<Request extends { readonly signal?: AbortSignal }> {
  private registration:
    | {
        provider: Provider<Request>
        lifetime: AbortController
        active: Set<Promise<void>>
        failures: unknown[]
        closing?: Promise<void>
      }
    | undefined
  private retired = false

  constructor(private readonly unavailable: () => Error) {}

  get enabled(): boolean {
    return this.registration !== undefined || this.retired
  }

  register(provider: Provider<Request>): () => Promise<void> {
    if (this.registration !== undefined) throw new Error('Operation guard already registered')
    const registration = {
      provider,
      lifetime: new AbortController(),
      active: new Set<Promise<void>>(),
      failures: [] as unknown[],
      closing: undefined as Promise<void> | undefined,
    }
    this.registration = registration
    this.retired = false
    return () => {
      if (registration.closing !== undefined) return registration.closing
      this.retired = true
      registration.lifetime.abort(this.unavailable())
      return (registration.closing = (async () => {
        await Promise.all([...registration.active])
        if (this.registration === registration) this.registration = undefined
        if (registration.failures.length > 0)
          throw new AggregateError(registration.failures, 'Operation cleanup failed')
      })())
    }
  }

  async acquire(request: Request): Promise<ManagedOperationLease | undefined> {
    const registration = this.registration
    if (registration?.lifetime.signal.aborted || (registration === undefined && this.retired))
      throw this.unavailable()
    if (registration === undefined) return undefined
    const signal =
      request.signal === undefined
        ? registration.lifetime.signal
        : AbortSignal.any([request.signal, registration.lifetime.signal])
    signal.throwIfAborted()
    const completed = Promise.withResolvers<void>()
    registration.active.add(completed.promise)
    const finish = (): void => {
      registration.active.delete(completed.promise)
      completed.resolve()
    }
    let lease: OperationLease | undefined
    let accessRelease: Promise<void> | undefined
    const releaseAccess = (): Promise<void> =>
      (accessRelease ??= Promise.resolve().then(() => lease?.release()))
    try {
      lease = await registration.provider({ ...request, signal })
      signal.throwIfAborted()
    } catch (error) {
      try {
        await releaseAccess()
      } catch (cleanup) {
        registration.failures.push(cleanup)
      } finally {
        finish()
      }
      throw error
    }
    let releasing: Promise<void> | undefined
    return {
      signal,
      releaseOpening: () => (lease?.lifetime === 'opening' ? releaseAccess() : Promise.resolve()),
      release: (error) => {
        if (releasing !== undefined) return releasing
        return (releasing = (async () => {
          if (error !== undefined) registration.failures.push(error)
          try {
            await releaseAccess()
          } catch (failure) {
            registration.failures.push(failure)
            throw failure
          } finally {
            finish()
          }
        })())
      },
    }
  }

  async run<T>(
    request: Request,
    operation: (signal: AbortSignal | undefined) => Promise<T>,
  ): Promise<T> {
    const lease = await this.acquire(request)
    try {
      return await operation(lease?.signal ?? request.signal)
    } finally {
      await lease?.release()
    }
  }
}
