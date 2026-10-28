import { View, Text } from 'nsh'
import { Input } from 'nsh/base'
import { Button } from '../shared/Button'
import type { ModelSettings } from '../../application/models/settings'
const field = 'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
function Action(props: { id: string; label: string; disabled?: boolean; run: () => void }) { return <Button id={props.id} label={props.label} disabled={props.disabled} onPress={props.run} /> }
export function ProviderEditor(props: { model: ModelSettings }) {
  const { routes, selected, endpoint, protocol, models, reference, secret, credentialStatus, status, busy, writable, route, fields, supports, unsupported, choose, save, removeCredential, reload } = props.model
  return <View class="gap-3">
    <Text class="text-xs text-muted-foreground">{route()?.error ?? ''}</Text>
    <Text class="text-xs text-muted-foreground">{unsupported().length ? `其他字段尚未适配，请在官方设置中维护：${unsupported().join('、')}` : ''}{!fields().length ? '该供应商没有可编辑的配置描述；只展示凭据状态。' : ''}</Text>
    <Text class="text-sm text-foreground">服务地址</Text>
    <Input testID="provider-endpoint" disabled={busy() || !supports('baseURL')} accessibilityLabel="服务地址" class={field} value={endpoint()} placeholder={route()?.defaultBaseURL ?? '使用默认地址'} onChange={value => endpoint.set(value)} />
    <Text class="text-sm text-foreground">协议（供应商支持的协议名）</Text>
    <Input testID="provider-protocol" disabled={busy() || !supports('api')} accessibilityLabel="协议" class={field} value={protocol()} onChange={value => protocol.set(value)} />
    <Text class="text-sm text-foreground">自定义模型目录（JSON，可留空使用默认目录）</Text>
    <Input testID="provider-models" disabled={busy() || !supports('models')} accessibilityLabel="模型目录" multiline class={field} value={models()} onChange={value => models.set(value)} />
    <Text class="text-sm text-foreground">凭据名称</Text>
    <Input testID="credential-ref" disabled={busy() || !!route()?.nativeAuth?.env?.length || !supports('apiKeyEnv')} accessibilityLabel="凭据名称" class={field} value={reference()} onChange={value => reference.set(value)} />
    <Text testID="credential-status" class="text-xs text-muted-foreground">{credentialStatus()}</Text>
    <Input testID="credential-value" disabled={busy()} accessibilityLabel="新密钥" class={field} masked autoComplete="off" value={secret()} placeholder="留空保留现有密钥" onChange={value => secret.set(value)} />
    <Action id="settings-save" label="保存配置与密钥" disabled={busy() || !writable()} run={() => { void save() }} />
    <Action id="credential-remove" label="移除存储密钥" disabled={busy() || !reference()} run={() => { void removeCredential() }} />
    <Action id="settings-refresh" label="重新读取" disabled={busy()} run={() => { void reload() }} />
    <Text testID="settings-status" class="text-xs text-muted-foreground">{status()}</Text>
  </View>
}
