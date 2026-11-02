import { signal, View, Text, Scroll } from 'nsh'
import type { ModelSettings } from '../../application/models/settings'
import type { BackendState, BackendConnection } from '../../application/backend/connection'
import type { BotRecord } from '../../application/bots/registry'
import { Button } from '../shared/Button'
import { DialogFrame } from '../shared/DialogFrame'
import { ProviderEditor } from './ProviderEditor'
import { BackendSettings } from './BackendSettings'
import { DeviceSettingsPage } from './DeviceSettingsPage'
import type { DeviceSettings } from '../../application/devices'

export function SettingsPage(props: {
  model: ModelSettings
  devices: DeviceSettings
  backend: BackendConnection
  canUnregister: boolean
  status(): BackendState
  close(): void
  archived(): BotRecord[]
  openArchived(id: string): void
  unarchive(id: string): void
}) {
  const model = props.model
  const section = signal<'models' | 'backend' | 'devices' | 'archived'>('models')
  const editing = signal(false)
  return <View class="flex-1 flex-row bg-background">
    <View class="w-56 border-r border-border p-4 gap-3">
      <Text class="text-xl font-semibold text-foreground">设置</Text>
      <Button id="settings-models" label="模型与供应商" onPress={() => section.set('models')} />
      <Button id="settings-backend" label="后台" onPress={() => section.set('backend')} />
      <Button id="settings-devices" label="设备" onPress={() => section.set('devices')} />
      <Button id="settings-archived" label="已归档 Bot" onPress={() => section.set('archived')} />
      {!editing() ? <Button id="settings-close" label="返回 Bot" disabled={model.busy()} onPress={props.close} /> : null}
    </View>
    <Scroll class="flex-1"><View class="p-5 gap-3">
      {section() === 'models' ? <>
        <Text class="text-lg font-semibold text-foreground">模型与供应商</Text>
        {model.routes().map(item => <Button id={`provider-${item.provider}`} label={`${item.displayName}${item.error ? ' · 配置待修复' : ''}`} disabled={model.busy()} onPress={() => { void model.choose(item.provider); editing.set(true) }} />)}
        <Text class="text-xs text-muted-foreground">{model.status()}</Text>
      </> : section() === 'backend' ? <BackendSettings backend={props.backend} canUnregister={props.canUnregister} status={props.status} />
        : section() === 'devices' ? <DeviceSettingsPage model={props.devices} />
        : <View class="gap-3">
          <Text class="text-lg font-semibold text-foreground">已归档 Bot</Text>
          <Text class="text-xs text-muted-foreground">归档 Bot 不接收新输入；可打开查看历史，或取消归档后回到列表。</Text>
          {props.archived().length ? props.archived().map(bot =>
            <View class="gap-2 rounded-lg border border-border p-3">
              <Text class="text-sm font-medium text-foreground">{bot.name}</Text>
              <Text class="text-xs text-muted-foreground">{bot.sessionId ? `对话：${bot.sessionId}` : '尚未初始化'}</Text>
              <View class="flex-row gap-2">
                <Button id={`archived-open-${bot.id}`} label="打开" onPress={() => props.openArchived(bot.id)} />
                <Button id={`archived-restore-${bot.id}`} label="取消归档" onPress={() => props.unarchive(bot.id)} />
              </View>
            </View>) : <Text class="text-sm text-muted-foreground">没有已归档的 Bot</Text>}
        </View>}
    </View></Scroll>
    {editing() ? <DialogFrame title="供应商与凭据" busy={model.busy()} close={() => { model.secret.set(''); editing.set(false) }}>
      <ProviderEditor model={model} />
      <Button id="provider-close" label="完成" disabled={model.busy()} onPress={() => { model.secret.set(''); editing.set(false) }} />
    </DialogFrame> : null}
  </View>
}
