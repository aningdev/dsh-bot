import { View, Text } from 'nsh'
import type { BackendState, BackendConnection } from '../../application/backend/connection'
import { Button } from '../shared/Button'
export function BackendSettings(props: { backend: BackendConnection; canUnregister: boolean; status(): BackendState }) {
  return <View class="gap-3">
    <Text class="text-lg font-semibold text-foreground">后台</Text>
    <Text class="text-sm text-muted-foreground">首次启动会申请后台运行。退出界面后已接纳的工作继续执行。</Text>
    <Text class="text-sm text-foreground">{props.status().message}</Text>
    <Button id="backend-start" disabled={props.status().phase === 'connecting'} label="启动官方后台" onPress={() => { void props.backend.start() }} />
    <Button id="backend-reconnect" disabled={props.status().phase === 'connecting'} label="重新发现并连接后台" onPress={() => { void props.backend.connect() }} />
    {props.canUnregister ? <Button id="backend-unregister" disabled={props.status().phase === 'connecting'} label="停止全部 Bot 并卸载后台服务" onPress={() => { void props.backend.unregister() }} /> : null}
  </View>
}
