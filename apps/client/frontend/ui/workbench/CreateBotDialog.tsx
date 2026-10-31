import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { modelKey } from '../../application/models/selection'
import { DialogFrame } from '../shared/DialogFrame'

const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'

export function CreateBotDialog(props: { model: Workbench }) {
  const { note, creating, creation, models, presets, catalogError, saveNew } = props.model
  const { name: formName, preset: formPreset, model: formModel, reasoningEffort, workspace: formWorkspace } = creation
  const activeCatalog = () => models().find(item => modelKey(item) === formModel())
  const efforts = () => activeCatalog()?.reasoning?.efforts ?? []

  return <DialogFrame title="新建 Bot" close={() => creating.set(false)}><View class="gap-3">
    <Text class="text-sm text-foreground">名称</Text>
    <Input testID="bot-name" class={field} accessibilityLabel="Bot 名称" value={formName()} onChange={value => formName.set(value)} />

    <Text class="text-sm text-foreground">模板</Text>
    {presets().length ? <View class="gap-1">{presets().map(item =>
      <Button id={`create-preset-${item.id}`} label={`${item.name}${item.isDefault ? '（默认）' : ''}${item.broken ? ' · 不可用' : ''}`}
        disabled={!!item.broken}
        selected={formPreset() === item.id}
        onPress={() => formPreset.set(item.id)} />)}</View>
      : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模板目录，可手动填写模板标识'}</Text>}
    <Input testID="bot-preset" class={field} accessibilityLabel="模板标识" value={formPreset()} onChange={value => formPreset.set(value)} />

    <Text class="text-sm text-foreground">默认模型</Text>
    {models().length ? <View class="gap-1">{models().map(item =>
      <Button id={`create-model-${item.provider}-${item.model}`} label={`${item.name}（${item.providerName}）`}
        selected={formModel() === modelKey(item)}
        onPress={() => {
          formModel.set(modelKey(item))
          reasoningEffort.set(item.reasoning?.defaultEffort)
        }} />)}</View>
      : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模型目录'}</Text>}

    {efforts().length ? <View class="gap-1">
      <Text class="text-sm text-foreground">推理强度</Text>
      {efforts().map(effort =>
        <Button id={`create-reasoning-${effort.id}`} label={effort.name}
          selected={reasoningEffort() === effort.id}
          onPress={() => reasoningEffort.set(effort.id)} />)}
    </View> : null}

    <Text class="text-sm text-foreground">工作区</Text>
    <Input testID="bot-workspace" class={field} accessibilityLabel="工作区" value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
    <Text class="text-xs text-muted-foreground">默认是每 Bot 的稳定目录；初始化后工作区固定。工作区不是权限沙箱。</Text>
    <Text class="text-xs text-muted-foreground">{note()}</Text>
    <Button id="bot-save" label="保存 Bot" onPress={() => { void saveNew() }} />
    {catalogError() ? <Text class="text-xs text-muted-foreground">模板目录：{catalogError()}</Text> : null}
  </View></DialogFrame>
}
