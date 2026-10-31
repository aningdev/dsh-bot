import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { modelKey } from '../../application/models/selection'
import { DialogFrame } from '../shared/DialogFrame'

const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'

export function BotSettingsDialog(props: { model: Workbench; close(): void }) {
  const {
    damaged, online, problem, formPreset, formModel, formWorkspace, currentReasoningEffort,
    selected, models, presets, modelLabel, presetLabel, toggleArchive, repair,
  } = props.model

  const canRepair = () => !!selected() && !selected()!.sessionId && !selected()!.initializing
  const activeCatalog = () => models().find(item => modelKey(item) === formModel())
  const efforts = () => activeCatalog()?.reasoning?.efforts ?? []

  return <DialogFrame title="Bot 设置" close={props.close}>{selected() ? <View class="gap-3">
    <Button id="bot-archive" label={selected()!.archived ? '取消归档' : '归档 Bot'} onPress={() => { void toggleArchive() }} />
    <Text class="text-xs text-muted-foreground">名称、模板、模型与工作区请在右侧信息栏修改。此弹窗用于归档，以及未就绪时的集中修复。</Text>

    {canRepair() ? <View class="gap-2">
      <Text class="text-sm font-semibold text-foreground">修复未初始化配置</Text>
      <Text class="text-sm text-foreground">模板</Text>
      {presets().length ? <View class="gap-1">{presets().map(item =>
        <Button id={`repair-preset-${item.id}`} label={`${item.name}${item.isDefault ? '（默认）' : ''}${item.broken ? ' · 不可用' : ''}`}
          disabled={!!item.broken || !online()}
          selected={formPreset() === item.id}
          onPress={() => formPreset.set(item.id)} />)}</View>
        : <Text class="text-xs text-muted-foreground">尚未读取后台模板目录，可手动填写模板标识</Text>}
      <Input testID="repair-preset" accessibilityLabel="修复模板" class={field} value={formPreset()} onChange={value => formPreset.set(value)} />

      <Text class="text-sm text-foreground">工作区</Text>
      <Input testID="repair-workspace" accessibilityLabel="修复工作区" class={field} value={formWorkspace()} onChange={value => formWorkspace.set(value)} />

      <Text class="text-sm text-foreground">默认模型</Text>
      {models().length ? <View class="gap-1">{models().map(item =>
        <Button id={`repair-model-${item.provider}-${item.model}`} label={`${item.name}（${item.providerName}）`}
          disabled={!online()}
          selected={formModel() === modelKey(item)}
          onPress={() => {
            formModel.set(modelKey(item))
            currentReasoningEffort.set(item.reasoning?.defaultEffort)
          }} />)}</View>
        : <Text class="text-xs text-muted-foreground">尚未读取后台模型目录</Text>}
      <Input testID="repair-model" accessibilityLabel="修复模型" class={field} value={formModel()} onChange={value => formModel.set(value)} />

      {efforts().length ? <View class="gap-1">
        <Text class="text-sm text-foreground">推理强度</Text>
        {efforts().map(effort =>
          <Button id={`repair-reasoning-${effort.id}`} label={effort.name}
            selected={currentReasoningEffort() === effort.id}
            onPress={() => currentReasoningEffort.set(effort.id)} />)}
      </View> : null}

      <Button id="repair-save" label="保存并重新初始化" disabled={!online()} onPress={() => { void repair() }} />
    </View> : null}

    <Text class="text-sm font-semibold text-foreground">待修复原因</Text>
    <Text class="text-xs text-muted-foreground">{problem() || '没有待修复的问题'}</Text>
    <Text class="text-xs text-muted-foreground">模板：{presetLabel(selected()!.preset)} · 模型：{modelLabel(formModel() || modelKey(selected()!.model))}</Text>
    {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
  </View> : null}</DialogFrame>
}
