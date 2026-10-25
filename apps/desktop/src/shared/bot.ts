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

export type InputMode = 'queue' | 'steer'

export interface PendingInput {
  readonly id: string
  readonly text: string
  readonly mode: InputMode
}

export interface BotInputState {
  readonly status: 'idle' | 'running'
  readonly mode: InputMode
  readonly pending: readonly PendingInput[]
}

export type ApprovalDecision = 'allowed-once' | 'rejected'

export interface PendingApproval {
  readonly id: string
  readonly botId: string
  readonly toolName: string
  readonly callId?: string
  readonly reason: string
}

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
