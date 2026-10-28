import { View, Text, signal, cleanup, mount } from 'nsh'
import { Connection } from '../frontend/infrastructure/dsh/connection'
import { launchUrl } from '../frontend/application/backend/host'

export default function HostProbe() {
  const state = signal('connecting')
  const connection = new Connection()
  let disposed = false
  cleanup(() => { disposed = true; void connection.dispose() })
  void (async () => {
    try {
      await connection.connect(await launchUrl())
      const catalog = await connection.modelCatalog()
      if (!Array.isArray(catalog.models)) throw new Error('Invalid catalog')
      if (!disposed) state.set('official-ready')
    } catch { if (!disposed) state.set('official-failed') }
  })()
  return <View style={{ flex: 1 }}><Text>{state()}</Text></View>
}
mount(HostProbe)
