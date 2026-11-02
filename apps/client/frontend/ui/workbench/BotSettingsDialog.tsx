import { View, Text } from 'nsh'
import { Button as BaseButton, Input } from 'nsh/base'
import { Button } from '../shared/Button'
import { Select } from '../shared/Select'
import type { Workbench } from '../../application/conversation/controller'
import { modelKey } from '../../application/models/selection'
import { DialogFrame } from '../shared/DialogFrame'

const field = 'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'

export function BotSettingsDialog(props: { model: Workbench; close(): void }) {
  const {
    damaged, online, problem, formPreset, formModel, formWorkspace, currentReasoningEffort,
    selected, models, presets, modelLabel, presetLabel, toggleArchive, repair,
  } = props.model

  const canRepair = () => !!selected() && !selected()!.sessionId && !selected()!.initializing
  const activeCatalog = () => models().find(item => modelKey(item) === formModel())
  const efforts = () => activeCatalog()?.reasoning?.efforts ?? []

  return <DialogFrame title="Bot 设置" close={props.close} footer={
    <BaseButton testID="bot-archive" accessibilityLabel={selected()?.archived ? '取消归档' : '归档 Bot'}
      onPress={() => { void toggleArchive() }}
      class="rounded-md border border-border px-4 py-2 hover:bg-muted active:opacity-70">
      <Text class="text-sm text-foreground">{selected()?.archived ? '取消归档' : '归档 Bot'}</Text>
    </BaseButton>
  }>{selected() ? <View class="gap-4">
    <Text class="text-xs text-muted-foreground">名称、模板、模型与工作区请在右侧信息栏修改。归档后的 Bot 在设置页查看与恢复。</Text>

    {canRepair() ? <View class="gap-3">
      <Text class="text-sm font-semibold text-foreground">修复未初始化配置</Text>
      <View class="gap-2">
        <Text class="text-sm text-foreground">模板</Text>
        {presets().length
          ? <Select id="repair-preset-select" label="修复模板" value={formPreset()} disabled={!online()}
            options={presets().map(item => ({
              value: item.id,
              label: `${item.name}${item.isDefault ? '（默认）' : ''}${item.broken ? ' · 不可用' : ''}`,
              disabled: !!item.broken,
            }))}
            onChange={value => formPreset.set(value)} />
          : <Text class="text-xs text-muted-foreground">尚未读取后台模板目录，可手动填写模板标识</Text>}
        <Input testID="repair-preset" accessibilityLabel="修复模板" class={field} value={formPreset()} onChange={value => formPreset.set(value)} />
      </View>

      <View class="gap-2">
        <Text class="text-sm text-foreground">工作区</Text>
        <Input testID="repair-workspace" accessibilityLabel="修复工作区" class={field} value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
      </View>

      <View class="gap-2">
        <Text class="text-sm text-foreground">默认模型</Text>
        {models().length
          ? <Select id="repair-model-select" label="修复模型" value={formModel()} disabled={!online()}
            options={models().map(item => ({
              value: modelKey(item),
              label: `${item.name}（${item.providerName}）`,
            }))}
            onChange={value => {
              formModel.set(value)
              const catalog = models().find(item => modelKey(item) === value)
              currentReasoningEffort.set(catalog?.reasoning?.defaultEffort)
            }} />
          : <Text class="text-xs text-muted-foreground">尚未读取后台模型目录</Text>}
        <Input testID="repair-model" accessibilityLabel="修复模型" class={field} value={formModel()} onChange={value => formModel.set(value)} />
      </View>

      {efforts().length ? <View class="gap-2">
        <Text class="text-sm text-foreground">推理强度</Text>
        <Select id="repair-reasoning" label="修复推理强度" value={currentReasoningEffort() ?? ''}
          options={efforts().map(effort => ({ value: effort.id, label: effort.name }))}
          onChange={value => currentReasoningEffort.set(value)} />
      </View> : null}

      <Button id="repair-save" label="保存并重新初始化" disabled={!online()} onPress={() => { void repair() }} />
    </View> : null}

    <View class="gap-1">
      <Text class="text-sm font-semibold text-foreground">待修复原因</Text>
      <Text class="text-xs text-muted-foreground">{problem() || '没有待修复的问题'}</Text>
      <Text class="text-xs text-muted-foreground">模板：{presetLabel(selected()!.preset)} · 模型：{modelLabel(formModel() || modelKey(selected()!.model))}</Text>
      {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
    </View>
  </View> : null}</DialogFrame>
}
