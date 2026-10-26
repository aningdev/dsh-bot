/** Product-owned file intake: Bot admission and Bot-owned cold Agent resolution. */
import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import {
  FileUploads,
  type AgentResolver,
  type EncodedFileUploadRequest,
  type FileUploadValue,
} from '@deepseek-ai/dsh-client-file-upload'

import { neverAborted, type BotAdmission } from './admission.ts'
import type { BotController } from './index.ts'

/** Stable Loader identity for the product file intake service. */
export const name = 'bot-file-uploads'

/**
 * Keep the standard upload service while Bot Sessions resolve through their record.
 * The standard resolver remains the fallback for Sessions the Bot does not own.
 */
export default class BotFileUploads extends FileUploads {
  static override inject = [...FileUploads.inject, 'botAdmission', 'botController']

  private readonly bot: BotController
  private readonly admission: BotAdmission

  /** @param ctx - Host context carrying the Bot Controller and admission boundary. */
  constructor(ctx: Context) {
    super(ctx)
    this.bot = ctx.botController
    this.admission = ctx.botAdmission
  }

  /**
   * Compose Bot ownership in front of the standard Session resolver.
   * @param resolve - Standard resolver kept for Sessions outside Bot ownership.
   * @returns disposer of the composed resolver.
   */
  override registerAgentResolver(resolve: AgentResolver): () => void {
    return super.registerAgentResolver(async (sessionId) => {
      const owned = await this.bot.resolveSessionAgent(sessionId, neverAborted)
      return owned?.agent ?? (await resolve(sessionId))
    })
  }

  /**
   * Stage one encoded upload under write admission of its receiving Bot.
   * @param agent - Agent Typert selected as the receiver.
   * @param request - Canonical base64 bytes and optional display name.
   * @param signal - Caller cancellation before staging completes.
   * @returns staged receipt and durable file reference.
   */
  override async upload(
    agent: Agent,
    request: EncodedFileUploadRequest,
    signal: AbortSignal,
  ): Promise<FileUploadValue> {
    return this.admission.run({ sessionId: agent.id, mode: 'write', signal }, () =>
      super.upload(agent, request, signal),
    )
  }

  /**
   * Stream raw chunks under write admission of the addressed Bot.
   * @param request - Session identity, ordered bytes, and optional display name.
   * @returns staged receipt and durable file reference.
   */
  override async uploadStream(request: {
    readonly sessionId: Parameters<FileUploads['uploadStream']>[0]['sessionId']
    readonly data: AsyncIterable<Uint8Array>
    readonly signal?: AbortSignal
    readonly name?: string
  }): Promise<FileUploadValue> {
    return this.admission.run(
      { sessionId: request.sessionId, mode: 'write', signal: request.signal },
      (guarded) => super.uploadStream({ ...request, signal: guarded ?? request.signal }),
    )
  }
}
