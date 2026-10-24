import type {} from '@deepseek-ai/dsh-typert-protocol'

/** Persisted product identity and its single Harness Session association. */
export interface BotRecord {
  readonly botId: string
  readonly name: string
  readonly cwd: string
  readonly provider: string
  readonly model: string
  readonly sessionId: string
}

/** Input for a new independent Bot. */
export interface CreateBotRequest {
  readonly name: string
  readonly cwd: string
}

/** Text published by an executing turn, followed by a durability acknowledgement. */
export type BotFrame = { readonly type: 'text'; readonly text: string } | { readonly type: 'done' }

/** A user or assistant message projected from the canonical Session log. */
export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly text: string
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    /** A requested Bot does not exist. */
    'bot/not-found': { readonly botId: string }
    /** One turn is already admitted for this Bot. */
    'bot/busy': { readonly botId: string }
    /** The model or execution driver failed this turn. */
    'bot/turn-failed': { readonly botId: string }
    /** Input cannot identify or create a Bot. */
    'bot/invalid-input': { readonly field: string }
  }
}
