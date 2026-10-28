import { cleanup, View } from 'nsh'
import { createNavStack, NavStack, NavPage } from 'nsh/base'
import { Connection } from './infrastructure/dsh/connection'
import { backendHost, usesHostControl } from './application/backend/host'
import { createModelSettings } from './application/models/settings'
import { BackendConnection, type BackendState } from './application/backend/connection'
import { createConversation, type Workbench } from './application/conversation/controller'
import { WorkbenchPage } from './ui/workbench/WorkbenchPage'
import { SettingsPage } from './ui/settings/SettingsPage'

type Route = { name: 'workbench' } | { name: 'settings' }

function SettingsRoute(props: { connection: Connection; backend: BackendConnection; status(): BackendState; changed(): Promise<void>; close(): void }) {
  const model = createModelSettings(props.connection, props.changed)
  cleanup(model.dispose)
  return <SettingsPage model={model} backend={props.backend} canUnregister={usesHostControl()} status={props.status} close={props.close} />
}

export function ClientApp() {
  const connection = new Connection()
  let model!: Workbench
  const backend = new BackendConnection(backendHost, connection, state => model.backendChanged(state), () => model.connected())
  model = createConversation(connection, backend)
  cleanup(() => { void model.dispose().catch(error => console.error('客户端清理失败', error instanceof Error ? error.message : String(error))) })
  void model.start()
  const nav = createNavStack<Route>([{ name: 'workbench' }])
  return <View class="flex-1 bg-background"><NavStack state={nav} class="flex-1">
    {route => <NavPage title={route.name === 'workbench' ? 'DSH Bot' : '设置'}>
      {route.name === 'workbench'
        ? <WorkbenchPage model={model} openSettings={() => nav.push({ name: 'settings' })} />
        : <SettingsRoute connection={connection} backend={backend} status={model.backendStatus} changed={model.refreshModels} close={() => nav.pop()} />}
    </NavPage>}
  </NavStack></View>
}
