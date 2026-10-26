/** Product-owned Session Remote: Bot admission, ownership, and configuration policy. */
import type { Context } from '@deepseek-ai/cordis'
import {
  SessionController,
  type Config,
  type SessionAttachmentRequest,
  type SessionAttachmentValue,
  type SessionCreateRequest,
  type SessionCreateValue,
  type SessionFollowFrame,
  type SessionFollowRequest,
  type SessionForkRequest,
  type SessionForkValue,
  type SessionPage,
  type SessionPageRequest,
  type SessionProjectionsRequest,
  type SessionProjectionsValue,
  type SessionPromptRequest,
  type SessionPromptValue,
  type SessionRenameRequest,
  type SessionRenameValue,
  type SessionSelectModelRequest,
  type SessionSelectModelValue,
  type SessionUpdateQueueRequest,
  type SessionUpdateQueueValue,
} from '@deepseek-ai/dsh-api-session-controller'
import type { SessionAddress } from '@deepseek-ai/dsh-api-session-controller'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { SessionInspection } from '@deepseek-ai/dsh-session-persistence'
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'

import { neverAborted, type BotAdmission } from './admission.ts'
import type { BotController } from './index.ts'

/** Live Agent or stable Session failure for one Session identity. */
type AgentResolution = Awaited<ReturnType<SessionController['resolveAgent']>>

/** Stable Loader identity for the product Session Remote. */
export const name = 'bot-session-controller'

/**
 * Keep the standard Session Remote while the Bot owns activation and admission.
 * Creation, forking, and model selection belong to Bot management instead.
 */
export default class BotSessionController extends SessionController {
  static override inject = [...SessionController.inject, 'botAdmission', 'botController']

  private readonly bot: BotController
  private readonly admission: BotAdmission

  /**
   * @param ctx - Host context carrying the Bot Controller and admission boundary.
   * @param config - Deployment policy forwarded to the standard Session Remote.
   */
  constructor(ctx: Context, config: Config) {
    super(ctx, config)
    console.error('[dbg ctor] bot-session-controller')
    this.bot = ctx.botController
    this.admission = ctx.botAdmission
  }

  /**
   * Resolve a Session the Bot owns instead of activating it through generic routing.
   * @param sessionId - Ordinary Session identity addressed by any Remote operation.
   * @returns the Bot-owned Agent, or the standard resolution for unowned Sessions.
   */
  override async resolveAgent(sessionId: SessionId): Promise<AgentResolution> {
    return this.admission.run({ sessionId, mode: 'write' }, async (signal) => {
      const owned = await this.bot.resolveSessionAgent(sessionId, signal ?? neverAborted)
      console.error('[dbg owned]', sessionId, owned === undefined ? 'unowned' : 'owned')
      return owned === undefined ? super.resolveAgent(sessionId) : { agent: owned.agent }
    })
  }

  /**
   * Read one Session's inspection while the Bot's record stays replaceable.
   * @param sessionId - Ordinary Session identity.
   * @param signal - Caller cancellation of the durable read.
   * @returns the standard inspection value.
   */
  override async inspect(sessionId: SessionId, signal?: AbortSignal): Promise<SessionInspection> {
    return this.admission.run({ sessionId, mode: 'read', signal }, (guarded) =>
      super.inspect(sessionId, guarded ?? signal),
    )
  }

  /**
   * Reject creation: the Bot creates Sessions with its configuration and workspace.
   * @param _request - Ignored standard creation request.
   * @returns never; creation is unavailable through this namespace.
   */
  override create(_request: SessionCreateRequest): Promise<SessionCreateValue> {
    return reject('create')
  }

  /**
   * Reject model selection: the Bot owns the model of every Agent it activates.
   * @param _request - Ignored standard selection request.
   * @returns never; selection is unavailable through this namespace.
   */
  override selectModel(_request: SessionSelectModelRequest): Promise<SessionSelectModelValue> {
    return reject('selectModel')
  }

  /**
   * Reject forking: configuration and workspace copying belong to Bot management.
   * @param _request - Ignored standard fork request.
   * @returns never; forking is unavailable through this namespace.
   */
  override fork(_request: SessionForkRequest): Promise<SessionForkValue> {
    return reject('fork')
  }

  /**
   * Rename a Session under write admission.
   * @param request - Session identity and the normalized title.
   * @returns title and committed event position.
   */
  override async rename(request: SessionRenameRequest): Promise<SessionRenameValue> {
    console.error(
      '[dbg rename-entry]',
      this.constructor.name,
      String(this.resolveAgent === BotSessionController.prototype.resolveAgent),
      String(
        this.resolveAgent === Object.getPrototypeOf(BotSessionController.prototype).resolveAgent,
      ),
    )
    try {
      return await this.admission.run({ sessionId: request.sessionId, mode: 'write' }, () =>
        super.rename(request),
      )
    } catch (error) {
      throw new RemoteError('bot/operation-unavailable', String((error as Error)?.stack ?? error), {
        operation: 'rename',
      })
    }
  }

  /**
   * Admit one streamed prompt for the Session's Bot.
   * @param request - Prompt content and its target Session.
   * @param signal - Caller cancellation of the streamed turn.
   * @returns the standard prompt receipt.
   */
  override async prompt(
    request: SessionPromptRequest,
    signal: AbortSignal,
  ): Promise<SessionPromptValue> {
    return this.admission.run({ sessionId: request.sessionId, mode: 'prompt', signal }, (guarded) =>
      super.prompt(request, guarded ?? signal),
    )
  }

  /**
   * Read one attachment under read admission.
   * @param request - Session identity and attachment reference.
   * @returns the standard attachment value.
   */
  override async attachment(request: SessionAttachmentRequest): Promise<SessionAttachmentValue> {
    return this.admission.run({ sessionId: request.sessionId, mode: 'read' }, () =>
      super.attachment(request),
    )
  }

  /**
   * Update the queue of a Session under write admission.
   * @param request - Queue action and its target Session.
   * @returns the standard queue receipt.
   */
  override async updateQueue(request: SessionUpdateQueueRequest): Promise<SessionUpdateQueueValue> {
    return this.admission.run({ sessionId: request.sessionId, mode: 'write' }, () =>
      super.updateQueue(request),
    )
  }

  /**
   * Read one history page under read admission.
   * @param request - Page window and its target Session.
   * @param signal - Caller cancellation of the read.
   * @returns the standard history page.
   */
  override async page(request: SessionPageRequest, signal: AbortSignal): Promise<SessionPage> {
    return this.admission.run(
      { sessionId: addressSessionId(request.address), mode: 'read', signal },
      (guarded) => super.page(request, guarded ?? signal),
    )
  }

  /**
   * Follow a Session, admitting replacement only until the stream has opened.
   * @param request - Follow window and its target Session.
   * @param signal - Caller cancellation of the stream.
   * @returns frames produced by the standard Session history stream.
   */
  override async *follow(
    request: SessionFollowRequest,
    signal: AbortSignal,
  ): AsyncIterable<SessionFollowFrame> {
    const lease = await this.admission.acquire({
      sessionId: addressSessionId(request.address),
      mode: 'read',
      follow: true,
      signal,
    })
    try {
      await lease?.releaseOpening()
      yield* super.follow(request, lease?.signal ?? signal)
    } finally {
      await lease?.release()
    }
  }

  /**
   * Read Session projections under read admission.
   * @param request - Projection request and its target Session.
   * @param signal - Caller cancellation of the read.
   * @returns the standard projection value.
   */
  override async projections(
    request: SessionProjectionsRequest,
    signal: AbortSignal,
  ): Promise<SessionProjectionsValue> {
    return this.admission.run({ sessionId: request.sessionId, mode: 'read', signal }, (guarded) =>
      super.projections(request, guarded ?? signal),
    )
  }
}

/**
 * Address the Session a page or follow request names, including subagent conversations.
 * @param address - Session or subagent address carried by the request.
 * @returns the addressed Session identity whose lineage the Bot answers for.
 */
function addressSessionId(address: SessionAddress): SessionId {
  return address.kind === 'session' ? address.sessionId : address.childSessionId
}

/**
 * Report that one standard Session operation belongs to Bot management.
 * @param operation - Standard operation the caller attempted.
 * @returns never; the caller receives a stable unavailable error.
 */
function reject(operation: string): never {
  throw new RemoteError(
    'bot/operation-unavailable',
    'Session management belongs to the Bot Remote',
    {
      operation,
    },
  )
}
