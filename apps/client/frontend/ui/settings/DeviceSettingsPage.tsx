import { Canvas, Text, View, signal } from 'nsh'
import { Input } from 'nsh/base'
import qrcode from 'qrcode-generator'
import type { DeviceSettings } from '../../application/devices'
import type { Device } from '../../infrastructure/host/devices'
import { Button } from '../shared/Button'
import { DialogFrame } from '../shared/DialogFrame'

const labels: Record<string, string> = {
  waiting: '等待手机连接', approval: '等待桌面批准', saving: '正在保存设备授权', rejecting: '正在拒绝',
  cancelling: '正在取消', paired: '设备已配对', rejected: '已拒绝', expired: '邀请已过期', cancelled: '已取消',
  uncertain: '授权结果未确认，请检查设备列表', incomplete: '已授权，但配对确认未完成，请检查设备列表', failed: '配对失败，请重新检查 Relay 后重试',
}
function keyText(key: number[]) { return key.map(byte => byte.toString(16).padStart(2, '0')).join('') }
function InvitationCode(props: { value: string }) {
  const code = qrcode(0, 'M')
  code.addData(props.value, 'Byte')
  code.make()
  const n = code.getModuleCount()
  return <Canvas accessibilityLabel="手机配对二维码" style={{ width: 320, height: 320 }} draw={cx => {
    const scale = 320 / (n + 8)
    cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 320, 320)
    cx.fillStyle = '#000000'
    for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
      if (code.isDark(row, col)) cx.fillRect((col + 4) * scale, (row + 4) * scale, scale, scale)
    }
  }} />
}
export function DeviceSettingsPage(props: { model: DeviceSettings }) {
  const model = props.model
  const revoke = signal<Device | null>(null)
  return <View class="gap-3">
    <Text class="text-lg font-semibold text-foreground">设备配对</Text>
    <Text class="text-sm text-muted-foreground">设备配对正在开发中；配对成功暂不表示手机可以访问对话。离开设置不会取消进行中的邀请，但二维码无法恢复；返回后可取消并重新创建。</Text>
    <Text class="text-sm text-foreground">Relay 地址</Text>
    <Text class="text-sm text-muted-foreground">请输入手机可访问的 wss 地址。本机 ws 地址仅用于同机测试。</Text>
    <Input testID="device-relay" accessibilityLabel="Relay 地址" placeholder="wss://relay.example.com" value={model.relay()} onChange={value => model.relay.set(value)} disabled={model.busy()} class="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground" />
    <Button id="device-start" label="创建配对邀请" disabled={model.busy() || !model.relay().trim() || !!model.statusError() || !!model.current() && ['waiting', 'approval', 'saving', 'rejecting', 'cancelling'].includes(model.current()!.phase)} onPress={() => { void model.start() }} />
    {model.offer() ? <View class="gap-2">
      <Text class="text-sm text-foreground">请在可信环境中用手机扫描。邀请有效期为两分钟，不要分享二维码。</Text>
      <InvitationCode value={JSON.stringify(model.offer())} />
    </View> : null}
    {model.current() ? <View class="gap-2">
      <Text testID="pairing-status" class="text-sm text-foreground">{labels[model.current()!.phase] ?? '未知配对状态，请重新检查'}</Text>
      {model.current()!.phase === 'approval' ? <>
        <Text class="text-sm text-foreground">核对手机上的设备指纹：{model.current()!.fingerprint}</Text>
        <Button id="device-approve" label="指纹一致，允许配对" disabled={model.busy() || !!model.statusError()} onPress={() => { void model.decide(true) }} />
        <Button id="device-reject" label="拒绝配对" disabled={model.busy() || !!model.statusError()} onPress={() => { void model.decide(false) }} />
      </> : null}
      {['waiting', 'approval'].includes(model.current()!.phase) ? <Button id="device-cancel" label="取消配对" disabled={model.busy() || !!model.statusError()} onPress={() => { void model.cancel() }} /> : null}
    </View> : null}
    <Text class="text-sm text-foreground">已登记设备</Text>
    {model.devices().map(device => <View class="gap-2">
      <Text class="text-xs text-muted-foreground">{keyText(device.key)}{device.revoked ? ' · 已撤销' : ' · 已授权'}</Text>
      {!device.revoked ? <Button label="撤销此设备" disabled={model.busy() || !!model.devicesError()} onPress={() => revoke.set(device)} /> : null}
    </View>)}
    <Text class="text-xs text-muted-foreground">{model.statusError()}</Text>
    <Text class="text-xs text-muted-foreground">{model.devicesError()}</Text>
    <Text testID="device-message" class="text-xs text-muted-foreground">{model.message()}</Text>
    {revoke() ? <DialogFrame title="撤销设备" busy={model.busy()} close={() => revoke.set(null)}>
      <Text class="text-sm text-foreground">撤销后此设备将失去访问权限。确定撤销 {keyText(revoke()!.key)}？</Text>
      <Button id="device-confirm-revoke" label="确认撤销" disabled={model.busy() || !!model.devicesError()} onPress={() => { const device = revoke(); revoke.set(null); if (device) void model.revoke(device.key) }} />
    </DialogFrame> : null}
  </View>
}
