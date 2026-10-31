import { View, Text, Scroll } from 'nsh'
import { Input, Radio, RadioGroup } from 'nsh/base'
import { Button } from '../shared/Button'
import type { Workbench } from '../../application/conversation/controller'
import { modelKey } from '../../application/models/selection'

const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'

export function BotInspector(props: { model: Workbench; edit(): void }) {
  const {
    damaged, online, problem, running, pendingApproval, currentModel, currentReasoningEffort,
    selected, models, presets, rename, formWorkspace, formToggleablePlugins, formDisabledPlugins,
    modelLabel, presetLabel, saveRename, changeModel, changePreset, changeWorkspace, changeDisabledPlugins,
    toggleFormPlugin, recheck,
  } = props.model
  const basePresetId = () => selected()?.basePreset || selected()?.preset || ''

  const activeKey = () => {
    const bot = selected()
    if (!bot) return ''
    return bot.sessionId ? currentModel() : modelKey(bot.model)
  }
  const activeCatalog = () => models().find(item => modelKey(item) === activeKey())
  const efforts = () => activeCatalog()?.reasoning?.efforts ?? []
  const effortValue = () => {
    const bot = selected()
    if (!bot) return undefined
    return bot.sessionId ? currentReasoningEffort() : bot.model.reasoningEffort
  }
  const modelLocked = () => running() || !!pendingApproval() || !!selected()?.archived || !!selected()?.initializing || !online()
  const presetLocked = () => !!selected()?.sessionId || !!selected()?.initializing || !!selected()?.archived || !online()
  const workspaceLocked = () => !!selected()?.sessionId || !!selected()?.initializing || !!selected()?.archived
  const modelSectionTitle = () => selected()?.sessionId ? '当前对话模型' : '默认模型'

  return <Scroll class="w-80 border-l border-border bg-background">
    <View class="p-4 gap-4">
      {selected() ? <View class="gap-4">
        <View class="gap-2">
          <View class="flex-row items-center gap-2">
            <Text class="flex-1 text-lg font-semibold text-foreground">{selected()!.name}</Text>
            <Button id="bot-settings" label="Bot 设置" onPress={props.edit} />
          </View>
        </View>

        <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">名称</Text>
          <Input testID="bot-rename" class={field} accessibilityLabel="Bot 名称" value={rename()} onChange={value => rename.set(value)} />
          <Button id="bot-rename-save" label="保存名称"
            disabled={!rename().trim() || rename().trim() === selected()!.name}
            onPress={() => { void saveRename() }} />
        </View>

        <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">工作区</Text>
          {workspaceLocked()
            ? <View class="gap-1 rounded-md bg-muted p-3">
              <Text class="text-sm text-foreground">{selected()!.workspace}</Text>
              <Text class="text-xs text-muted-foreground">初始化后工作区固定；需要不同目录请新建 Bot。工作区不是权限沙箱。</Text>
            </View>
            : <View class="gap-2">
              <Input testID="inspector-workspace" class={field} accessibilityLabel="工作区" value={formWorkspace()} onChange={value => formWorkspace.set(value)} />
              <Text class="text-xs text-muted-foreground">初始化前可指向外部项目目录；默认是每 Bot 的稳定目录。</Text>
              <Button id="inspector-workspace-save" label="保存工作区"
                disabled={!formWorkspace().trim() || formWorkspace().trim() === selected()!.workspace || !online()}
                onPress={() => { void changeWorkspace(formWorkspace()) }} />
            </View>}
        </View>

        <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">指令（模板）</Text>
          {presetLocked()
            ? <View class="gap-1 rounded-md bg-muted p-3">
              <Text class="text-sm text-foreground">{presetLabel(basePresetId())}</Text>
              {selected()!.disabledPlugins?.length
                ? <Text class="text-xs text-muted-foreground">已关闭：{selected()!.disabledPlugins!.join('、')}</Text>
                : null}
              <Text class="text-xs text-muted-foreground">初始化后模板固定；需要不同指令请新建 Bot。</Text>
            </View>
            : <View class="gap-1">
              {presets().map(item => <Button id={`preset-${item.id}`} label={`${item.name}${item.isDefault ? '（默认）' : ''}${item.broken ? ` · 不可用` : ''}`}
                disabled={!!item.broken || presetLocked()}
                selected={basePresetId() === item.id}
                onPress={() => { void changePreset(item.id) }} />)}
              {!presets().length ? <Text class="text-xs text-muted-foreground">尚未读取后台模板目录</Text> : null}
            </View>}
        </View>

        {!presetLocked() && formToggleablePlugins().length ? <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">子插件（可关闭）</Text>
          <Text class="text-xs text-muted-foreground">组合写入后台派生模板；不是共享 profile 全局开关。</Text>
          {formToggleablePlugins().map(item =>
            <Button id={`inspector-plugin-${item.id}`} label={`${item.label}${item.enabled ? '' : ' · 已关闭'}`}
              selected={item.enabled}
              disabled={!online()}
              onPress={() => toggleFormPlugin(item.id, !item.enabled)} />)}
          <Button id="inspector-plugins-save" label="保存插件组合"
            disabled={!online()}
            onPress={() => { void changeDisabledPlugins(formDisabledPlugins()) }} />
        </View> : null}

        <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">{modelSectionTitle()}</Text>
          <Text class="text-xs text-muted-foreground">模型：{modelLabel(activeKey())}</Text>
          <Text class="text-xs text-muted-foreground">切换从下一个执行步骤生效；已准备的步骤继续使用原模型。</Text>
          {models().length ? <View class="gap-1">
            {models().map(item => <Button id={`select-model-${item.provider}-${item.model}`}
              label={`${item.name}（${item.providerName}）`}
              disabled={modelLocked()}
              selected={activeKey() === modelKey(item)}
              onPress={() => { void changeModel(modelKey(item)) }} />)}
          </View> : <Text class="text-xs text-muted-foreground">尚未读取后台模型目录</Text>}
        </View>

        {efforts().length ? <View class="gap-2">
          <Text class="text-sm font-semibold text-foreground">推理强度</Text>
          <Text class="text-xs text-muted-foreground">与模型选择一样，从下一个执行步骤生效。</Text>
          <RadioGroup class="gap-1">
            {efforts().map(effort => <Radio checked={effortValue() === effort.id} disabled={modelLocked()}
              testID={`reasoning-${effort.id}`} accessibilityLabel={effort.name}
              onChange={() => { void changeModel(activeKey(), effort.id) }}
              class="rounded-md px-3 py-2 hover:bg-muted checked:bg-accent">
              <Text class="text-sm text-foreground">{effort.name}</Text>
            </Radio>)}
          </RadioGroup>
        </View> : null}

        <Text testID="session-pointer" class="text-xs text-muted-foreground">
          {selected()!.sessionId
            ? `对话标识：${selected()!.sessionId}`
            : selected()!.initializing
              ? `候选对话标识：${selected()!.initializing!.candidateSessionId}`
              : '尚未初始化对话'}
        </Text>
        <Button id="recheck" label="重新检查对话"
          disabled={!online() || (!selected()!.sessionId && !selected()!.initializing)}
          onPress={() => { void recheck() }} />
        <Text testID="inspector-problem" class="text-xs text-muted-foreground">{problem()}</Text>
        {damaged().length ? <Text class="text-xs text-muted-foreground">无法读取的注册表文件：{damaged().join('、')}</Text> : null}
      </View> : <Text class="text-sm text-muted-foreground">选择或新建 Bot</Text>}
    </View>
  </Scroll>
}
