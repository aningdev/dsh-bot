import { host, mount, signal, Text } from 'nsh'
import { botsRoot, listRecords, readRecord, writeRecord } from '../frontend/infrastructure/storage/records'

/** Test-only view: exercise the production registry in an actual desktop VM. */
function RegistryProbe() {
  const result = signal('pending')
  void (async () => {
    try {
      const { operation, name, contents } = host.params
      let value: unknown
      if (operation === 'root') value = botsRoot()
      else if (operation === 'list') value = await listRecords()
      else if (operation === 'read' && typeof name === 'string') value = await readRecord(name)
      else if (operation === 'write' && typeof name === 'string' && typeof contents === 'string') await writeRecord(name, contents)
      else throw new Error('Invalid registry fixture operation')
      result.set(`fixture:${JSON.stringify({ value })}`)
    } catch (error) { result.set(`fixture:${JSON.stringify({ error: String(error) })}`) }
  })()
  return <Text>{result()}</Text>
}
mount(RegistryProbe)
