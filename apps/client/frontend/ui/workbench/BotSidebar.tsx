import { signal, View, Text, Scroll } from 'nsh'
import { Button as BaseButton, Collapsible } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'

function statusLine(item: { sessionId?: string; id: string }, approvalSessions: string[]): string {
  const parts = [
    item.sessionId ? '对话已就绪' : '待初始化',
    item.sessionId && approvalSessions.includes(item.sessionId) ? '有待处理审批' : '',
  ].filter(Boolean)
  return parts.join(' · ')
}

export function BotSidebar(props: {
  model: Workbench
  openSettings(): void
  collapsed: () => boolean
  setCollapsed(value: boolean): void
}) {
  const { selectedId, note, creating, approvalSessions, visible, select, beginCreate } = props.model
  const listOpen = signal(true)
  return <View class="flex-1 bg-background p-3 gap-2">
    <View class="flex-row items-center gap-2">
      <View class="flex-1">
        <Button id="bot-new" label="新建 Bot" onPress={() => { beginCreate() }} />
      </View>
      <BaseButton testID="sidebar-collapse" accessibilityLabel="折叠侧栏"
        onPress={() => props.setCollapsed(true)}
        class="rounded-md border border-border px-2 py-2 hover:bg-muted active:opacity-70">
        <Text class="text-xs text-muted-foreground">⟨</Text>
      </BaseButton>
    </View>

    <Collapsible open={listOpen()} content={
      <Scroll class="flex-1">
        <View class="gap-0.5 pt-1">
          {visible().length ? visible().map(item => <View role="button" accessibilityLabel={item.name} testID={`bot-${item.id}`}
            onPress={() => { creating.set(false); void select(item.id) }}
            class={selectedId() === item.id
              ? 'rounded-md bg-accent px-3 py-2.5 gap-0.5'
              : 'rounded-md px-3 py-2.5 gap-0.5 hover:bg-muted active:bg-accent'}>
            <Text class={selectedId() === item.id ? 'text-sm font-semibold text-foreground' : 'text-sm text-foreground'} numberOfLines={1}>{item.name}</Text>
            <Text class="text-xs text-muted-foreground" numberOfLines={1}>{statusLine(item, approvalSessions())}</Text>
          </View>) : <Text class="px-3 py-2 text-xs text-muted-foreground">还没有 Bot</Text>}
        </View>
      </Scroll>
    }>
      <View role="button" accessibilityLabel="Bot 列表" accessibilityState={{ expanded: listOpen() }}
        testID="bot-list-toggle"
        onPress={() => listOpen.set(!listOpen())}
        class="flex-row items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
        <Text class="text-[11px] font-semibold tracking-wide text-muted-foreground">BOTS</Text>
        <Text class="flex-1 text-[11px] text-muted-foreground">{visible().length}</Text>
        <Text class="text-[11px] text-muted-foreground">{listOpen() ? '▾' : '▸'}</Text>
      </View>
    </Collapsible>

    <View class="gap-2 border-t border-border pt-3 mt-auto">
      <Button id="model-settings" label="设置" onPress={props.openSettings} />
      <Text testID="status" class="px-1 text-xs text-muted-foreground">{note()}</Text>
    </View>
  </View>
}
