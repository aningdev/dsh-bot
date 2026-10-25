import { Button } from '@dsh-bot/ui/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { botApprovalsQueryOptions, decideBotApprovalMutationOptions } from '@/renderer/actions/bot'
import type { ApprovalDecision } from '@/shared/bot'

export default function BotApprovals({ botId }: { botId: string }) {
  const client = useQueryClient()
  const options = botApprovalsQueryOptions(botId)
  const approvals = useQuery({
    ...options,
    refetchInterval: 500,
    refetchIntervalInBackground: true,
    // A cached question must never appear active after changing Bots or reconnecting.
    gcTime: 0,
  })
  const decision = useMutation({
    ...decideBotApprovalMutationOptions(),
    onSettled: () => client.invalidateQueries({ queryKey: options.queryKey }),
  })
  function decide(id: string, value: ApprovalDecision) {
    decision.mutate({ botId, id, decision: value })
  }
  if (!approvals.data?.length && !approvals.isError) return null
  return (
    <section aria-label="待审批操作" className="space-y-3">
      <h3 className="text-sm font-medium">待审批操作</h3>
      {!approvals.isError &&
        approvals.data?.map((approval) => (
          <div key={approval.id} className="space-y-2 text-sm">
            <p className="font-medium break-all">{approval.toolName}</p>
            <p className="break-words whitespace-pre-wrap">
              {approval.reason || '该操作需要你的授权。'}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={decision.isPending}
                onClick={() => decide(approval.id, 'allowed-once')}
              >
                允许一次
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={decision.isPending}
                onClick={() => decide(approval.id, 'rejected')}
              >
                拒绝
              </Button>
            </div>
          </div>
        ))}
      {approvals.isError && (
        <p role="alert" className="text-sm">
          无法更新审批状态，正在重新连接…
        </p>
      )}
      {decision.isError && (
        <p role="alert" className="text-sm">
          无法提交决定，该审批可能已结束。请查看最新状态。
        </p>
      )}
    </section>
  )
}
