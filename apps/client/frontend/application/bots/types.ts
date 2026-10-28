/** The model a Bot asked for before its Session existed. */
export interface BotModel {
  provider: string
  model: string
  reasoningEffort?: string
}

/** A Session the client asked for but has not confirmed as its pointer yet. */
export interface Initializing {
  /** When the initialization intent was written; not evidence for claiming a Session. */
  startedAt: string
  /** The identity handed to `session.create`, so a retry reuses the same blank Session. */
  candidateSessionId: string
  /** The backend made the Session but the pointer was not persisted; repaired without a new create. */
  createdSessionId?: string
}

/** Text typed but not confirmed: kept so a lost outcome is never blindly resent. */
export interface Draft {
  text: string
  /** Only present once the text was handed to `session.prompt`. */
  requestId?: string
  /**
   * `typing`: never submitted, restored on reopen.
   * `pending`: submitted, the outcome not yet known.
   * `unknown`: submitted with a lost outcome;核对 before resending.
   */
  state: 'typing' | 'pending' | 'unknown'
}

export interface BotRecord {
  id: string
  name: string
  preset: string
  model: BotModel
  workspace: string
  archived: boolean
  createdAt: string
  /** The official Session pointer; absent until initialization committed. */
  sessionId?: string
  initializing?: Initializing
  draft?: Draft
}
