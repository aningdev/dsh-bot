import type {} from '@deepseek-ai/dsh-typert-protocol'

/** One Bot's explicit execution settings; null clears a provider-specific override. */
export interface BotConfiguration {
  readonly cwd: string
  readonly provider: string
  readonly model: string
  readonly baseInstructions?: string
  readonly instructions: string
  readonly capabilities: readonly string[]
  readonly maxTokens: number | null
  /** Pending inputs join the next turn by default, or the next step when steering. */
  readonly inputMode?: 'queue' | 'steer'
  readonly reasoningEffort: string | null
}

/** Persisted product identity, committed configuration, and single Session association. */
export interface BotRecord extends BotConfiguration {
  readonly botId: string
  readonly name: string
  readonly sessionId: string
  readonly revision: number
}

/** Input for a new independent Bot. */
export interface CreateBotRequest {
  readonly name: string
  readonly cwd: string
  readonly templateId?: string
}

/** A deployment template is copied at creation; it is never a live parent. */
export interface BotTemplate {
  readonly id: string
  readonly name: string
  readonly configuration: Omit<BotConfiguration, 'cwd'>
}

/** Safe configuration choices; approved plugin implementations remain execution-side. */
export interface BotConfigurationOptions {
  readonly templates: readonly BotTemplate[]
  readonly capabilities: readonly string[]
}

/** A complete replacement based on the configuration version the caller read. */
export interface SaveBotConfigurationRequest {
  readonly expectedRevision: number
  readonly configuration: BotConfiguration
}

/** Why an existing Bot cannot apply a configuration immediately. */
export type ConfigurationRejectionReason =
  | 'running'
  | 'pending-input'
  | 'maintenance'
  | 'replacing'
  | 'unavailable'

/** Text published by an executing turn, followed by a durability acknowledgement. */
export type BotFrame = { readonly type: 'text'; readonly text: string } | { readonly type: 'done' }

/** A text input still owned by the standard Harness inbox. */
export interface PendingInput {
  readonly id: string
  readonly text: string
  readonly mode: 'queue' | 'steer'
}

/** Current execution and canonical pending input; reading does not start work. */
export interface BotInputState {
  readonly status: 'idle' | 'running'
  readonly mode: 'queue' | 'steer'
  readonly pending: readonly PendingInput[]
}

/** A user or assistant message projected from the canonical Session log. */
export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly text: string
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    /** This standard API operation must use Bot management instead. */
    'bot/operation-unavailable': { readonly operation: string }
    /** A requested Bot does not exist. */
    'bot/not-found': { readonly botId: string }
    /** One turn is already admitted for this Bot. */
    'bot/busy': { readonly botId: string }
    /** The model or execution driver failed this turn. */
    'bot/turn-failed': { readonly botId: string }
    /** Input cannot identify or create a Bot. */
    'bot/invalid-input': { readonly field: string }
    /** No configuration was applied because the Bot cannot grant an idle window. */
    'bot/config-rejected': {
      readonly botId: string
      readonly reason: ConfigurationRejectionReason
      readonly pendingCount?: number
    }
    /** The caller edited an obsolete configuration revision. */
    'bot/config-conflict': {
      readonly botId: string
      readonly expectedRevision: number
      readonly actualRevision: number
    }
    /** Configuration failed validation before replacing the Agent. */
    'bot/config-invalid': { readonly botId: string; readonly field: string }
    /** Applying failed; old configuration and its Agent were restored. */
    'bot/config-failed': { readonly botId: string; readonly rolledBack: true }
    /** Execution admission stopped because recovery could not establish trusted state. */
    'bot/faulted': { readonly botId: string }
  }
}
