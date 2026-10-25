import { randomUUID } from 'node:crypto'

import type { PendingApproval, ApprovalDecision } from '@/shared/bot'

interface Entry {
  readonly value: PendingApproval
  finish(decision: ApprovalDecision | 'cancelled'): void
}

/** Main owns live answerers; a UI snapshot never becomes an authorization token. */
export class PendingApprovals {
  private readonly entries = new Map<string, Entry>()

  list(botId: string): readonly PendingApproval[] {
    return [...this.entries.values()]
      .filter((entry) => entry.value.botId === botId)
      .map((entry) => entry.value)
  }

  decide(botId: string, id: string, decision: ApprovalDecision): boolean {
    const entry = this.entries.get(id)
    if (!entry || entry.value.botId !== botId) return false
    entry.finish(decision)
    return true
  }

  request(
    value: Omit<PendingApproval, 'id'>,
    signal: AbortSignal,
  ): Promise<ApprovalDecision | 'cancelled'> {
    if (signal.aborted) return Promise.resolve('cancelled')
    return new Promise((resolve) => {
      const id = randomUUID()
      const cancel = () => finish('cancelled')
      const finish = (decision: ApprovalDecision | 'cancelled') => {
        if (!this.entries.delete(id)) return
        signal.removeEventListener('abort', cancel)
        resolve(decision)
      }
      this.entries.set(id, { value: { ...value, id }, finish })
      signal.addEventListener('abort', cancel, { once: true })
    })
  }
}
