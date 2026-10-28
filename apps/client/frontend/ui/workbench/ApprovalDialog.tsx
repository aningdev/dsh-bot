import { View, Text } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { DialogFrame } from '../shared/DialogFrame'
export function ApprovalDialog(props: { model: Workbench; close(): void }) {
  const { pendingApproval, approvalDetails, decide } = props.model
  return <DialogFrame title="工具审批" close={props.close}>{pendingApproval() ? <View class="gap-3">
          <Text class="text-sm font-semibold text-foreground">需要确认：{pendingApproval()!.toolName}</Text>
          <Text class="text-xs text-muted-foreground">{pendingApproval()!.reason}{pendingApproval()!.callId ? `（调用 ${pendingApproval()!.callId}）` : ''}</Text>
          <Button id="approval-details" label={approvalDetails() ? '收起详情' : '展开详情'} onPress={() => approvalDetails.set(!approvalDetails())} />
          {approvalDetails() ? <View selectable><Text class="text-xs text-muted-foreground">{pendingApproval()!.details}</Text></View> : null}
          <View class="flex-row gap-2">
            <Button id="approve" label="允许一次" onPress={() => decide('allowed-once')} />
            <Button id="reject" label="拒绝" onPress={() => decide('rejected')} />
          </View>
  </View> : null}</DialogFrame>
}
