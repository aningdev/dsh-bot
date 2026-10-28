// The test-file VM has no desktop filesystem. A small NSH fixture app runs
// the production registry through its declared standard filesystem capability.
import { open } from 'nsh/test'

async function request<T>(operation: string, name?: string, contents?: string): Promise<T> {
  const app = await open('./registry-probe.tsx', {
    platform: 'macos', host: { params: { operation, name, contents } },
  })
  try {
    await app.waitUntil(() => app.texts().some(text => text.startsWith('fixture:')), { timeout: 10000 })
    const result = JSON.parse(app.texts().find(text => text.startsWith('fixture:'))!.slice('fixture:'.length))
    if (result.error) throw new Error(result.error)
    return result.value as T
  } finally { app.dispose() }
}

export function botsRoot(): Promise<string> { return request('root') }
export function listRecords(): Promise<string[]> { return request('list') }
export function readRecord(name: string): Promise<string> { return request('read', name) }
export function writeRecord(name: string, contents: string): Promise<void> { return request('write', name, contents) }
