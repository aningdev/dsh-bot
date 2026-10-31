import { signal } from 'nsh'
import { homedir } from 'os'
import type { BotRecord } from '../bots/types'
import type { BackendState } from '../backend/connection'
import type { Message } from '../../infrastructure/dsh/history'
import type { CatalogModel, CatalogPreset, ApprovalRequest, ApprovalDecision } from '../../infrastructure/dsh/connection'

export function createConversationState() {
  const bots = signal<BotRecord[]>([])
  const damaged = signal<string[]>([])
  const selectedId = signal('')
  const archivedView = signal(false)
  const online = signal(false), ready = signal(false), connecting = signal(false)
  const note = signal('正在读取本地 Bot 注册表…')
  const problem = signal('')
  const messages = signal<Message[]>([]), running = signal(false)
  const input = signal(''), sending = signal(false)
  const creating = signal(false)
  const creation = { name: signal(''), preset: signal(''), model: signal(''), workspace: signal(homedir()) }
  const backendStatus = signal<BackendState>({ phase: 'unavailable', ready: false, message: '尚未连接后台' })
  const formPreset = signal(''), formModel = signal(''), formWorkspace = signal(homedir())
  const rename = signal('')
  const models = signal<CatalogModel[]>([]), presets = signal<CatalogPreset[]>([]), catalogError = signal('')
  const pendingApproval = signal<ApprovalRequest | undefined>(undefined)
  const approvalSessions = signal<string[]>([])
  const approvals = new Map<string, { request: ApprovalRequest; resolve: (value: ApprovalDecision) => void }>()
  const queue = signal<any[]>([]), currentModel = signal(''), currentReasoningEffort = signal<string | undefined>(undefined)
  const approvalDetails = signal(false)
  const unrecoverable = signal(false)
  return { bots, damaged, selectedId, archivedView, online, ready, connecting, note, problem, messages, running, input, sending, creating, creation, backendStatus, formPreset, formModel, formWorkspace, rename, models, presets, catalogError, pendingApproval, approvalSessions, approvals, queue, currentModel, currentReasoningEffort, approvalDetails, unrecoverable }
}
export type ConversationState = ReturnType<typeof createConversationState>
