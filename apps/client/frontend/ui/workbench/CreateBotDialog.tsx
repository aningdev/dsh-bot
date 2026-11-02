import { View, Text } from 'nsh'
import { Button as BaseButton, Input } from 'nsh/base'
import { Button } from '../shared/Button'
import { Select } from '../shared/Select'
import type { Workbench } from '../../application/conversation/controller'
import { modelKey } from '../../application/models/selection'
import { DialogFrame } from '../shared/DialogFrame'

const field = 'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'

export function CreateBotDialog(props: { model: Workbench }) {
  const {
    note, creating, creation, models, presets, catalogError, saveNew,
    selectCreationPreset, toggleCreationPlugin,
  } = props.model
  const {
    name: formName, preset: formPreset, model: formModel, reasoningEffort,
    workspace: formWorkspace, toggleablePlugins,
  } = creation
  const activeCatalog = () => models().find(item => modelKey(item) === formModel())
  const efforts = () => activeCatalog()?.reasoning?.efforts ?? []

  return <DialogFrame title="新建 Bot" close={() => creating.set(false)} footer={
    <BaseButton testID="bot-save" accessibilityLabel="保存 Bot" onPress={() => { void saveNew() }}
      class="rounded-md bg-primary px-4 py-2 active:opacity-80">
      <Text class="text-sm font-medium text-primary-foreground">保存 Bot</Text>
    </BaseButton>
  }><View class="gap-4">
    <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">名称</Text>
      <Input testID="bot-name" class={field} accessibilityLabel="Bot 名称" value={formName()} onChange={value => formName.set(value)} />
    </View>

    <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">模板</Text>
      {presets().length
        ? <Select id="bot-preset-select" label="选择模板" value={formPreset()}
          placeholder="选择模板"
          options={presets().map(item => ({
            value: item.id,
            label: `${item.name}${item.isDefault ? '（默认）' : ''}${item.broken ? ' · 不可用' : ''}`,
            disabled: !!item.broken,
          }))}
          onChange={value => { void selectCreationPreset(value) }} />
        : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模板目录，可手动填写模板标识'}</Text>}
      <Input testID="bot-preset" class={field} accessibilityLabel="模板标识" value={formPreset()}
        onChange={value => { void selectCreationPreset(value) }} />
    </View>

    {toggleablePlugins().length ? <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">子插件（可关闭）</Text>
      <Text class="text-xs text-muted-foreground">关闭项会写入后台派生模板，不影响共享 profile 全局开关。指令仍来自模板与工作区 AGENTS.md。</Text>
      {toggleablePlugins().map(item =>
        <Button id={`create-plugin-${item.id}`} label={`${item.label}${item.enabled ? '' : ' · 已关闭'}`}
          selected={item.enabled}
          onPress={() => toggleCreationPlugin(item.id, !item.enabled)} />)}
    </View> : null}

    <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">默认模型</Text>
      {models().length
        ? <Select id="bot-model" label="选择模型" value={formModel()}
          placeholder="选择模型"
          options={models().map(item => ({
            value: modelKey(item),
            label: `${item.name}（${item.providerName}）`,
          }))}
          onChange={value => {
            formModel.set(value)
            const catalog = models().find(item => modelKey(item) === value)
            reasoningEffort.set(catalog?.reasoning?.defaultEffort)
          }} />
        : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模型目录'}</Text>}
    </View>

    {efforts().length ? <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">推理强度</Text>
      <Select id="bot-reasoning" label="选择推理强度" value={reasoningEffort() ?? ''}
        placeholder="选择强度"
        options={efforts().map(effort => ({ value: effort.id, label: effort.name }))}
        onChange={value => reasoningEffort.set(value)} />
    </View> : null}

    <View class="gap-2">
      <Text class="text-sm font-medium text-foreground">工作区</Text>
      <Input testID="bot-workspace" class={field} accessibilityLabel="工作区" value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
      <Text class="text-xs text-muted-foreground">默认是每 Bot 的稳定目录；初始化后工作区固定。工作区不是权限沙箱。</Text>
    </View>
    <Text class="text-xs text-muted-foreground">{note()}</Text>
    {catalogError() ? <Text class="text-xs text-muted-foreground">模板目录：{catalogError()}</Text> : null}
  </View></DialogFrame>
}
