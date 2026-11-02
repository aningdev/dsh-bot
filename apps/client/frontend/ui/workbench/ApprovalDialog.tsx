import { View, Text } from 'nsh'
import { Button as BaseButton } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { DialogFrame } from '../shared/DialogFrame'

export function ApprovalDialog(props: { model: Workbench; close(): void }) {
  const { pendingApproval, approvalDetails, decide } = props.model
  return <DialogFrame title="工具审批" close={props.close} footer={pendingApproval() ? <View class="flex-row gap-2">
    <BaseButton testID="approve" accessibilityLabel="允许一次" onPress={() => decide('allowed-once')}
      class="rounded-md bg-primary px-4 py-2 active:opacity-80">
      <Text class="text-sm font-medium text-primary-foreground">允许一次</Text>
    </BaseButton>
    <BaseButton testID="reject" accessibilityLabel="拒绝" onPress={() => decide('rejected')}
      class="rounded-md border border-border px-4 py-2 hover:bg-muted active:opacity-70">
      <Text class="text-sm text-foreground">拒绝</Text>
    </BaseButton>
  </View> : undefined}>{pendingApproval() ? <View class="gap-3">
    <Text class="text-sm font-semibold text-foreground">需要确认：{pendingApproval()!.toolName}</Text>
    <Text class="text-xs text-muted-foreground">{pendingApproval()!.reason}{pendingApproval()!.callId ? `（调用 ${pendingApproval()!.callId}）` : ''}</Text>
    <Button id="approval-details" label={approvalDetails() ? '收起详情' : '展开详情'} onPress={() => approvalDetails.set(!approvalDetails())} />
    {approvalDetails() ? <View selectable><Text class="text-xs text-muted-foreground">{pendingApproval()!.details}</Text></View> : null}
  </View> : null}</DialogFrame>
}
