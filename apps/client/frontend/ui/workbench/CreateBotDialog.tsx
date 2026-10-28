import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'
import { DialogFrame } from '../shared/DialogFrame'
export function CreateBotDialog(props: { model: Workbench }) {
  const { note, creating, creation, models, presets, catalogError, modelKey, saveNew } = props.model
  const { name: formName, preset: formPreset, model: formModel, workspace: formWorkspace } = creation
  return <DialogFrame title="新建 Bot" close={() => creating.set(false)}><View class="gap-3">
          <Text class="text-lg font-semibold text-foreground">新建 Bot</Text>
          <Text class="text-sm text-foreground">名称</Text>
          <Input testID="bot-name" class={field} accessibilityLabel="Bot 名称" value={formName()} onChange={value => formName.set(value)} />
          <Text class="text-sm text-foreground">模板</Text>
          {presets().length ? <View class="gap-1">{presets().map(item =>
            <View role="button" testID={`preset-${item.id}`} accessibilityLabel={item.name} disabled={!!item.broken}
              onPress={() => formPreset.set(item.id)} class={formPreset() === item.id ? 'rounded-md bg-muted p-2' : 'rounded-md p-2 hover:bg-muted'}>
              <Text class="text-sm text-foreground">{item.name}{item.isDefault ? '（默认）' : ''}</Text>
              {item.broken ? <Text class="text-xs text-muted-foreground">不可用：{item.broken}</Text> : null}
            </View>)}</View>
            : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模板目录，可手动填写模板标识'}</Text>}
          <Input testID="bot-preset" class={field} accessibilityLabel="模板标识" value={formPreset()} onChange={value => formPreset.set(value)} />
          <Text class="text-sm text-foreground">默认模型</Text>
          {models().length ? <View class="gap-1">{models().map(item =>
            <View role="button" testID={`model-${item.provider}-${item.model}`} accessibilityLabel={item.name}
              onPress={() => formModel.set(modelKey(item))} class={formModel() === modelKey(item) ? 'rounded-md bg-muted p-2' : 'rounded-md p-2 hover:bg-muted'}>
              <Text class="text-sm text-foreground">{item.name}</Text>
              <Text class="text-xs text-muted-foreground">{item.providerName}</Text>
            </View>)}</View>
            : <Text class="text-xs text-muted-foreground">{catalogError() || '尚未读取后台模型目录'}</Text>}
          <Text class="text-sm text-foreground">工作区</Text>
          <Input testID="bot-workspace" class={field} accessibilityLabel="工作区" value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
          <Text class="text-xs text-muted-foreground">默认是当前用户主目录；初始化后工作区固定。工作区不是权限沙箱。</Text>
          <Text class="text-xs text-muted-foreground">{note()}</Text>
          <Button id="bot-save" label="保存 Bot" onPress={() => { void saveNew() }} />
          {catalogError() ? <Text class="text-xs text-muted-foreground">模板目录：{catalogError()}</Text> : null}
  </View></DialogFrame>
}
