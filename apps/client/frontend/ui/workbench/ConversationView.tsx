import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'
import { MessageList } from './MessageList'
export function ConversationView(props: { model: Workbench; openSettings(): void; openApproval(): void }) {
  const { online, ready, problem, running, input, sending, models, catalogError, pendingApproval, queue, selected, blocked, send, stop, persistDraft, withdraw } = props.model
  return <View class="flex-1 min-w-0">
        <View class="border-b border-border p-4 gap-1">
          <Text class="text-lg font-semibold text-foreground">{selected()?.name ?? '选择或新建 Bot'}</Text>
          <Text class="text-xs text-muted-foreground">{online() ? (ready() ? '后台已连接' : '后台正在同步') : '后台未连接'}</Text>
        </View>
        <MessageList model={props.model} />
        {pendingApproval() ? <View class="border-t border-border p-4 gap-2">
          <Text class="text-sm text-foreground">等待审批：{pendingApproval()!.toolName}</Text>
          <Button id="approval-open" label="查看待审批操作" onPress={props.openApproval} />
        </View> : null}
        {queue().length ? <View class="border-t border-border p-3 gap-2">
          <Text class="text-xs text-muted-foreground">已接纳，待处理（{queue().length}）</Text>
          {queue().map(item => <View class="flex-row gap-2">
            <Text class="flex-1 text-sm text-foreground">{(item.content ?? []).filter((block: any) => block.type === 'text').map((block: any) => block.text).join('')}</Text>
            <Button id={`withdraw-${item.id}`} label="撤回" onPress={() => { void withdraw(item.id) }} />
          </View>)}
        </View> : null}
        <View class="border-t border-border p-4 gap-3">
          {catalogError() ? <Text testID="model-catalog-error" class="text-xs text-muted-foreground">{catalogError()}</Text> : null}
          {ready() && !models().length ? <Button id="configure-model" label="配置供应商与凭据" onPress={() => props.openSettings()} /> : null}
          <Text testID="problem" class="text-xs text-muted-foreground">{problem()}</Text>
          <Text class="text-xs text-muted-foreground">{running() ? '执行中 · ' : ''}{sending() ? '提交中…' : ''}</Text>
          <Input testID="message-input" class={`${field} min-h-20`} multiline value={input()} accessibilityLabel="消息" placeholder="输入纯文本消息" disabled={sending() || selected()?.draft?.state === 'unknown' || selected()?.draft?.state === 'pending'}
            onChange={value => {
              input.set(value)
              const bot = selected()
              if (bot) persistDraft(bot, value)
            }} />
          <View class="flex-row gap-2">
            <Button id="send" label="发送" disabled={blocked()} onPress={() => { void send() }} />
            <Button id="stop" label="停止当前执行" disabled={!ready() || !!selected()?.archived || !selected()?.sessionId} onPress={() => { void stop() }} />
          </View>
        </View>
  </View>
}
