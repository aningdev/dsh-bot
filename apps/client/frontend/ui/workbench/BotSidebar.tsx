import { View, Text, Scroll } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'

function statusLine(item: { sessionId?: string; archived: boolean; id: string }, approvalSessions: string[]): string {
  const parts = [
    item.sessionId ? '对话已就绪' : '待初始化',
    item.archived ? '已归档' : '',
    item.sessionId && approvalSessions.includes(item.sessionId) ? '有待处理审批' : '',
  ].filter(Boolean)
  return parts.join(' · ')
}

export function BotSidebar(props: { model: Workbench; openSettings(): void }) {
  const { bots, selectedId, archivedView, note, creating, approvalSessions, visible, select, beginCreate } = props.model
  return <View class="w-[280px] border-r border-border bg-background p-3 gap-2">
    <View class="gap-2 px-1 pt-1">
      <Button id="bot-new" label="新建 Bot" onPress={() => { beginCreate() }} />
      <Button id="archive-toggle" label={archivedView() ? '返回 Bot 列表' : '归档区'} onPress={() => {
        const next = !archivedView(); archivedView.set(next)
        const first = bots().find(item => item.archived === next)
        if (first) void select(first.id)
      }} />
    </View>
    <Text class="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground">BOTS</Text>
    <Scroll class="flex-1">
      <View class="gap-0.5">
        {visible().map(item => <View role="button" accessibilityLabel={item.name} testID={`bot-${item.id}`}
          onPress={() => { creating.set(false); void select(item.id) }}
          class={selectedId() === item.id ? 'rounded-md bg-accent px-3 py-2.5 gap-0.5' : 'rounded-md px-3 py-2.5 gap-0.5 hover:bg-card active:bg-accent'}>
          <Text class={selectedId() === item.id ? 'text-sm font-semibold text-foreground' : 'text-sm text-foreground'} numberOfLines={1}>{item.name}</Text>
          <Text class="text-xs text-muted-foreground" numberOfLines={1}>{statusLine(item, approvalSessions())}</Text>
        </View>)}
      </View>
    </Scroll>
    <View class="gap-2 border-t border-border pt-3">
      <Button id="model-settings" label="设置" onPress={props.openSettings} />
      <Text testID="status" class="px-1 text-xs text-muted-foreground">{note()}</Text>
    </View>
  </View>
}
