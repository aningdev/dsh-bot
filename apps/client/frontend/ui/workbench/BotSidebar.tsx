import { View, Text, Scroll } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
export function BotSidebar(props: { model: Workbench; openSettings(): void }) {
  const { bots, selectedId, archivedView, note, creating, approvalSessions, visible, select, beginCreate } = props.model
  return <View class="w-56 border-r border-border p-4 gap-3">
        <Text class="text-xl font-semibold text-foreground">DSH Bot</Text>
        <Button id="model-settings" label="设置" onPress={props.openSettings} />
        <Button id="bot-new" label="新建 Bot" onPress={() => { beginCreate() }} />
        <Button id="archive-toggle" label={archivedView() ? '返回 Bot 列表' : '归档区'} onPress={() => {
          const next = !archivedView(); archivedView.set(next)
          const first = bots().find(item => item.archived === next)
          if (first) void select(first.id)
        }} />
        <Scroll class="flex-1"><View class="gap-2">
          {visible().map(item => <View role="button" accessibilityLabel={item.name} testID={`bot-${item.id}`} onPress={() => { creating.set(false); void select(item.id) }}
            class={selectedId() === item.id ? 'rounded-md bg-muted p-3' : 'rounded-md p-3 hover:bg-muted'}>
            <Text class="text-foreground">{item.name}</Text>
            <Text class="text-xs text-muted-foreground">{item.sessionId ? '对话已就绪' : '待初始化'}{item.archived ? ' · 已归档' : ''}{item.sessionId && approvalSessions().includes(item.sessionId) ? ' · 有待处理审批' : ''}</Text>
          </View>)}
        </View></Scroll>
        <Text testID="status" class="text-xs text-muted-foreground">{note()}</Text>
  </View>
}
