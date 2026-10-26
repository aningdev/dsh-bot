/** Product-owned admission for Session operations and Bot configuration replacement. */
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session'
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'

import type {} from './index.ts'
import { OperationGuardRegistry } from './operation-guard.ts'

/** Operation classes the Bot keeps addressable through one access lease. */
export interface BotAdmissionRequest {
  readonly sessionId: SessionId
  readonly mode: 'read' | 'write' | 'prompt'
  /** Follow opens a stream before promotion, so its lease ends with the opening frame. */
  readonly follow?: boolean
  readonly signal?: AbortSignal
}

/** Withdrawal stops admission, aborts accepted consumers, and waits for their cleanup. */
export interface BotAdmission extends OperationGuardRegistry<BotAdmissionRequest> {
  close(): Promise<void>
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Admission shared by every product service that addresses a Bot Session. */
    botAdmission: BotAdmission
  }
}

/** Cancellation stand-in for calls whose public API carries no signal. */
export const neverAborted: AbortSignal = new AbortController().signal

/** Stable Loader identity for the product admission boundary. */
export const name = 'bot-admission'
/** Ownership answers come from the Bot Controller only. */
export const inject = ['botController']

/**
 * Compose Bot ownership into one admission boundary for every Session consumer.
 * @param ctx - Context owning the Bot Controller that answers ownership and replacement.
 */
export function apply(ctx: Context): void {
  const registry = new OperationGuardRegistry<BotAdmissionRequest>(
    () =>
      new RemoteError('bot/operation-unavailable', 'Bot Session admission is closed', {
        operation: 'admission',
      }),
  )
  const close = registry.register(async (request) => {
    const owner = await ctx.botController.sessionOwner(request.sessionId, request.signal)
    if (owner === undefined) return undefined
    const lease = ctx.botController.acquireSessionAccess(owner, request.mode, request.signal)
    try {
      if (request.follow === true)
        await ctx.botController.prepareSessionFollow(owner, request.signal)
      return {
        lifetime: request.follow === true ? ('opening' as const) : ('call' as const),
        release: () => lease.release(),
      }
    } catch (error) {
      await lease.release()
      throw error
    }
  })
  ctx.provide('botAdmission', Object.assign(registry, { close }))
  ctx.effect(() => close)
}
