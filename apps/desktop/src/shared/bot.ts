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

export interface ToolActivityFrame {
  readonly observationId: string
  readonly revision: number
  readonly activities: readonly ToolActivity[]
}

/** Safe display projection of canonical tool requests and results. */
export interface ToolActivity {
  readonly id: string
  readonly callId: string
  readonly name: string
  readonly arguments: string
  readonly status: 'waiting' | 'succeeded' | 'failed'
  readonly result: string
  readonly reason: string
}
