import type { Connection, ApprovalDecision } from '../../infrastructure/dsh/connection'
import type { ConversationState } from './state'

export function createApprovals(connection: Connection, state: ConversationState, disposed: () => boolean) {
  const { bots, selectedId, approvals, approvalSessions, pendingApproval } = state
  const current = () => bots().find(item => item.id === selectedId())
  connection.approvals(async request => {
    if (disposed() || request.signal?.aborted) return 'cancelled'
    if (!bots().some(bot => bot.sessionId === request.sessionId)) return 'unavailable'
    return new Promise<ApprovalDecision>(resolve => {
      const key = `${request.sessionId}/${request.callId ?? crypto.randomUUID()}`
      const finish = (outcome: ApprovalDecision) => {
        request.signal?.removeEventListener('abort', abort)
        approvals.delete(key)
        refreshApproval()
        resolve(outcome)
      }
      const abort = () => finish('cancelled')
      approvals.set(key, { request, resolve: finish })
      request.signal?.addEventListener('abort', abort, { once: true })
      refreshApproval()
    })
  })

  function refreshApproval() {
    approvalSessions.set([...approvals.values()].map(item => item.request.sessionId))
    const request = [...approvals.values()].find(item => item.request.sessionId === current()?.sessionId)?.request
    pendingApproval.set(request)
  }

  function decide(decision: ApprovalDecision) {
    const pending = [...approvals.values()].find(item => item.request === pendingApproval())
    pending?.resolve(decision)
  }

  return { refreshApproval, decide, dispose() {
    for (const pending of [...approvals.values()]) pending.resolve('cancelled')
  } }
}
