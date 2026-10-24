export const MAX_MESSAGE_LENGTH = 32_768

/** Credential-free desktop conversation values exchanged through controlled IPC. */
export interface BotSummary {
  readonly botId: string
  readonly name: string
}

export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly text: string
}

export type BotFrame = { readonly type: 'text'; readonly text: string } | { readonly type: 'done' }
