/** Connect standard Session APIs to the Bot's owned lifecycle and admission. */
import type { Context } from '@deepseek-ai/cordis'
import type { GatewayOperation } from '@deepseek-ai/dsh-api-gateway'
import type { SessionOperation } from '@deepseek-ai/dsh-api-session-controller'
import type {} from '@deepseek-ai/dsh-client-file-upload'
import { SessionId } from '@deepseek-ai/dsh-session'
import { RemoteError, type OperationLease } from '@deepseek-ai/dsh-typert-protocol'

import type {} from './index.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Present while the Bot's standard Session bindings are installed. */
    botSessionController: { readonly close: () => Promise<void> }
  }
}

/** Lifecycle integration loads after both the product owner and standard API services. */
export const inject = ['botController', 'sessionController', 'typertGateway', 'fileUploads']
/** Stable Loader identity for the integration. */
export const name = 'bot-session-controller'

/**
 * Register bounded operation guards and external Agent resolution.
 * @param ctx - Owning plugin fiber, disposed before the Bot and API services.
 */
export function apply(ctx: Context): void {
  const acquire = async (
    request: SessionOperation & { readonly signal: AbortSignal },
  ): Promise<OperationLease> => {
    if (
      request.action === 'create' ||
      request.action === 'fork' ||
      request.action === 'selectModel'
    )
      throw new RemoteError('bot/operation-unavailable', 'Use Bot management for this operation', {
        operation: request.action,
      })
    if (request.sessionId === undefined) return { release() {} }
    const owner = await ctx.botController.sessionOwner(request.sessionId, request.signal)
    if (owner === undefined) return { release() {} }
    const read = ['page', 'follow', 'projections', 'inspect', 'attachment'].includes(request.action)
    const lease = ctx.botController.acquireSessionAccess(
      owner,
      read ? 'read' : request.action === 'prompt' ? 'prompt' : 'write',
      request.signal,
    )
    try {
      if (request.action === 'follow')
        await ctx.botController.prepareSessionFollow(owner, request.signal)
      return lease
    } catch (error) {
      await lease.release()
      throw error
    }
  }
  const controller = ctx.sessionController.registerLifecycle({
    acquire,
    resolveAgent: (sessionId, signal) => ctx.botController.resolveSessionAgent(sessionId, signal),
  })
  const uploads = ctx.fileUploads.registerUploadGuard(async (request) => {
    const owner = await ctx.botController.sessionOwner(request.sessionId, request.signal)
    return owner === undefined
      ? undefined
      : ctx.botController.acquireSessionAccess(owner, 'write', request.signal)
  })
  const gateway = ctx.typertGateway.registerOperationGuard(
    async (request: GatewayOperation & { readonly signal: AbortSignal }) => {
      if (request.namespace === 'bot') return undefined
      if (request.resources === undefined)
        throw new RemoteError('gateway/bad-request', 'Session resources could not be resolved', {})
      const owners = new Set<SessionId>()
      for (const resource of request.resources) {
        if (resource.kind !== 'session') continue
        const owner = await ctx.botController.sessionOwner(SessionId(resource.id), request.signal)
        if (owner !== undefined) owners.add(owner)
      }
      if (owners.size === 0) return undefined
      const leases: OperationLease[] = []
      try {
        const history =
          request.namespace === 'session' &&
          ['follow', 'page', 'projections', 'attachment'].includes(request.method)
        for (const owner of [...owners].sort())
          leases.push(
            ctx.botController.acquireSessionAccess(
              owner,
              history ? 'read' : 'write',
              request.signal,
            ),
          )
        return {
          lifetime:
            request.namespace === 'session' && request.method === 'follow' ? 'opening' : 'call',
          release: async () => {
            for (const lease of leases.toReversed()) await lease.release()
          },
        }
      } catch (error) {
        for (const lease of leases.toReversed()) await lease.release()
        throw error
      }
    },
  )
  let closing: Promise<void> | undefined
  const close = (): Promise<void> =>
    (closing ??= (async () => {
      const outcomes = await Promise.allSettled([gateway(), uploads(), controller()])
      const failures = outcomes.flatMap((outcome) =>
        outcome.status === 'rejected' ? [outcome.reason] : [],
      )
      if (failures.length > 0)
        throw new AggregateError(failures, 'Session lifecycle withdrawal failed')
    })())
  ctx.provide('botSessionController', { close })
  ctx.effect(() => close)
}
