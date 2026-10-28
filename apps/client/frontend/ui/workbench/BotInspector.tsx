import { View, Text, Scroll } from 'nsh'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
export function BotInspector(props: { model: Workbench; edit(): void; chooseModel(): void }) {
  const { damaged, online, problem, running, pendingApproval, currentModel, selected, modelKey, modelLabel, presetLabel, recheck } = props.model
  return <Scroll class="w-80 border-l border-border"><View class="p-5 gap-4">
    {selected() ? <View class="gap-3">
      <Text class="text-lg font-semibold text-foreground">{selected()!.name}</Text>
      <Button id="bot-settings" label="Bot 设置" onPress={props.edit} />
      <Text testID="session-pointer" class="text-xs text-muted-foreground">{selected()!.sessionId ? `对话标识：${selected()!.sessionId}` : selected()!.initializing ? `候选对话标识：${selected()!.initializing!.candidateSessionId}` : '尚未初始化对话'}</Text>
      <Text class="text-xs text-muted-foreground">模板：{presetLabel(selected()!.preset)}</Text>
      <Text class="text-xs text-muted-foreground">模型：{selected()!.sessionId ? modelLabel(currentModel()) : modelLabel(modelKey(selected()!.model))}</Text>
      <Button id="model-picker" label="选择模型" disabled={running() || !!pendingApproval() || !!selected()!.archived} onPress={props.chooseModel} />
      <Text class="text-xs text-muted-foreground">工作区：{selected()!.workspace}</Text>
      <Text class="text-xs text-muted-foreground">初始化后模板与工作区固定。</Text>
      <Text testID="inspector-problem" class="text-xs text-muted-foreground">{problem()}</Text>
      <Button id="recheck" label="重新检查对话" disabled={!online() || (!selected()!.sessionId && !selected()!.initializing)} onPress={() => { void recheck() }} />
      {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
    </View> : <Text class="text-sm text-muted-foreground">选择或新建 Bot</Text>}
  </View></Scroll>
}
