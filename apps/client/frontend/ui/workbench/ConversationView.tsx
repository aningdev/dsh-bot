import { View, Text } from 'nsh'
import { Button as BaseButton, Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { MessageList } from './MessageList'

export function ConversationView(props: {
  model: Workbench
  openSettings(): void
  openApproval(): void
  sidebarCollapsed: () => boolean
  expandSidebar(): void
}) {
  const { online, ready, problem, running, input, sending, models, catalogError, pendingApproval, queue, selected, blocked, send, stop, persistDraft, withdraw } = props.model
  const name = () => selected()?.name ?? '选择或新建 Bot'
  return <View class="flex-1 min-w-0 bg-background">
    <View class="flex-row items-center gap-2 border-b border-border px-4 py-3">
      {props.sidebarCollapsed() ? <BaseButton testID="sidebar-expand" accessibilityLabel="展开侧栏"
        onPress={props.expandSidebar}
        class="rounded-md border border-border px-2 py-1.5 hover:bg-muted active:opacity-70">
        <Text class="text-xs text-muted-foreground">⟩</Text>
      </BaseButton> : null}
      <View class="flex-1 gap-0.5">
        <Text class="text-lg font-semibold text-foreground">{name()}</Text>
        <Text class="text-xs text-muted-foreground">{online() ? (ready() ? '后台已连接' : '后台正在同步') : '后台未连接'}</Text>
      </View>
    </View>
    <MessageList model={props.model} />
    {pendingApproval() ? <View class="border-t border-border px-5 py-3 gap-2">
      <Text class="text-sm text-foreground">等待审批：{pendingApproval()!.toolName}</Text>
      <Button id="approval-open" label="查看待审批操作" onPress={props.openApproval} />
    </View> : null}
    {queue().length ? <View class="border-t border-border px-5 py-3 gap-2">
      <Text class="text-xs text-muted-foreground">已接纳，待处理（{queue().length}）</Text>
      {queue().map(item => <View class="flex-row gap-2 items-center">
        <Text class="flex-1 text-sm text-foreground">{(item.content ?? []).filter((block: any) => block.type === 'text').map((block: any) => block.text).join('')}</Text>
        <Button id={`withdraw-${item.id}`} label="撤回" onPress={() => { void withdraw(item.id) }} />
      </View>)}
    </View> : null}
    <View class="border-t border-border px-4 py-3 gap-2" style={{ maxWidth: 820, alignSelf: 'center', width: '100%' }}>
      {catalogError() ? <Text testID="model-catalog-error" class="text-xs text-muted-foreground">{catalogError()}</Text> : null}
      {ready() && !models().length ? <Button id="configure-model" label="配置供应商与凭据" onPress={() => props.openSettings()} /> : null}
      <Text testID="problem" class="text-xs text-muted-foreground">{problem()}</Text>
      <Text class="text-xs text-muted-foreground">{running() ? '执行中 · ' : ''}{sending() ? '提交中…' : ''}</Text>
      <View class="rounded-3xl border border-border bg-card px-3 py-2 gap-2 shadow-sm">
        <Input testID="message-input" class="min-h-16 text-[15px] text-foreground" multiline
          value={input()} accessibilityLabel="消息" placeholder={`发送消息给 ${name()}`}
          disabled={sending() || selected()?.draft?.state === 'unknown' || selected()?.draft?.state === 'pending'}
          onChange={value => {
            input.set(value)
            const bot = selected()
            if (bot) persistDraft(bot, value)
          }} />
        <View class="flex-row gap-2 justify-end">
          <Button id="stop" label="停止" disabled={!ready() || !!selected()?.archived || !selected()?.sessionId} onPress={() => { void stop() }} />
          <BaseButton testID="send" accessibilityLabel="发送" disabled={blocked()} onPress={() => { void send() }}
            class="rounded-full bg-primary px-4 py-2 disabled:opacity-40 active:opacity-80">
            <Text class="text-sm font-medium text-primary-foreground">发送</Text>
          </BaseButton>
        </View>
      </View>
    </View>
  </View>
}
