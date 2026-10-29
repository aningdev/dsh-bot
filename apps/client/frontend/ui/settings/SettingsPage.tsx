import { signal, View, Text, Scroll } from 'nsh'
import type { ModelSettings } from '../../application/models/settings'
import type { BackendState, BackendConnection } from '../../application/backend/connection'
import { Button } from '../shared/Button'
import { DialogFrame } from '../shared/DialogFrame'
import { ProviderEditor } from './ProviderEditor'
import { BackendSettings } from './BackendSettings'
import { DeviceSettingsPage } from './DeviceSettingsPage'
import type { DeviceSettings } from '../../application/devices'

export function SettingsPage(props: { model: ModelSettings; devices: DeviceSettings; backend: BackendConnection; canUnregister: boolean; status(): BackendState; close(): void }) {
  const model = props.model
  const section = signal<'models' | 'backend' | 'devices'>('models')
  const editing = signal(false)
  return <View class="flex-1 flex-row bg-background">
    <View class="w-56 border-r border-border p-4 gap-3">
      <Text class="text-xl font-semibold text-foreground">设置</Text>
      <Button id="settings-models" label="模型与供应商" onPress={() => section.set('models')} />
      <Button id="settings-backend" label="后台" onPress={() => section.set('backend')} />
      <Button id="settings-devices" label="设备" onPress={() => section.set('devices')} />
      {!editing() ? <Button id="settings-close" label="返回 Bot" disabled={model.busy()} onPress={props.close} /> : null}
    </View>
    <Scroll class="flex-1"><View class="p-5 gap-3">
      {section() === 'models' ? <>
        <Text class="text-lg font-semibold text-foreground">模型与供应商</Text>
        {model.routes().map(item => <Button id={`provider-${item.provider}`} label={`${item.displayName}${item.error ? ' · 配置待修复' : ''}`} disabled={model.busy()} onPress={() => { void model.choose(item.provider); editing.set(true) }} />)}
        <Text class="text-xs text-muted-foreground">{model.status()}</Text>
      </> : section() === 'backend' ? <BackendSettings backend={props.backend} canUnregister={props.canUnregister} status={props.status} /> : <DeviceSettingsPage model={props.devices} />}
    </View></Scroll>
    {editing() ? <DialogFrame title="供应商与凭据" busy={model.busy()} close={() => { model.secret.set(''); editing.set(false) }}>
      <ProviderEditor model={model} />
      <Button id="provider-close" label="完成" disabled={model.busy()} onPress={() => { model.secret.set(''); editing.set(false) }} />
    </DialogFrame> : null}
  </View>
}
