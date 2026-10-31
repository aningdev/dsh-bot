import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'
import { DialogFrame } from '../shared/DialogFrame'

export function BotSettingsDialog(props: { model: Workbench; close(): void }) {
  const { damaged, online, problem, formPreset, formModel, formWorkspace, currentModel, selected, modelKey, modelLabel, presetLabel, recheck, toggleArchive, repair } = props.model
  return <DialogFrame title="Bot 设置" close={props.close}>{selected() ? <View class="gap-3">
    <Button id="bot-archive" label={selected()!.archived ? '取消归档' : '归档 Bot'} onPress={() => { void toggleArchive() }} />

    <Text class="text-sm font-semibold text-foreground">当前对话只读配置</Text>
    <Text class="text-xs text-muted-foreground">{selected()!.sessionId ? `对话标识：${selected()!.sessionId}` : selected()!.initializing ? `候选对话标识：${selected()!.initializing!.candidateSessionId}` : '尚未初始化对话'}</Text>
    <Text class="text-xs text-muted-foreground">模板：{presetLabel(selected()!.preset)}</Text>
    <Text class="text-xs text-muted-foreground">模型：{selected()!.sessionId ? modelLabel(currentModel()) : modelLabel(modelKey(selected()!.model))}</Text>
    <Text class="text-xs text-muted-foreground">工作区：{selected()!.workspace}</Text>
    <Text class="text-xs text-muted-foreground">名称与模型请在右侧信息栏修改；初始化后模板与工作区固定。</Text>

    {!selected()!.sessionId && !selected()!.initializing ? <View class="gap-2">
      <Text class="text-sm font-semibold text-foreground">修复未初始化配置</Text>
      <Input testID="repair-preset" accessibilityLabel="修复模板" class={field} value={formPreset()} onChange={value => formPreset.set(value)} />
      <Input testID="repair-workspace" accessibilityLabel="修复工作区" class={field} value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
      <Input testID="repair-model" accessibilityLabel="修复模型" class={field} value={formModel()} onChange={value => formModel.set(value)} />
      <Button id="repair-save" label="保存并重新初始化" disabled={!online()} onPress={() => { void repair() }} />
    </View> : null}

    <Text class="text-sm font-semibold text-foreground">待修复原因</Text>
    <Text class="text-xs text-muted-foreground">{problem() || '没有待修复的问题'}</Text>
    <Button id="dialog-recheck" label="重新检查对话" disabled={!online() || (!selected()!.sessionId && !selected()!.initializing)} onPress={() => { void recheck() }} />
    {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
  </View> : null}</DialogFrame>
}
