import { expect, test } from 'bun:test'
import { BackendConnection, type BackendHost, type BackendInfo, type BackendState, type HostStatus, type ProtocolConnection } from '../frontend/application/backend/connection'
import { checkServiceResult, decodeBackendInfo, decodeHostStatus } from '../frontend/infrastructure/host/protocol'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const info = (generation: string): BackendInfo => ({ url: `http://127.0.0.1:32100/?token=${generation}`, generation })
const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve() }

function harness() {
  let listener: (status: HostStatus) => void = () => {}
  let discoveries = 0, stops = 0, disposals = 0, connections = 0, starts = 0
  const states: BackendState[] = []
  const authenticated: string[] = []
  const host: BackendHost = {
    discover: async () => info(String(++discoveries)),
    watch: async callback => { listener = callback; return () => { stops++ } },
    start: async () => { starts++ },
    unregister: async () => {},
  }
  const client: ProtocolConnection = {
    connect: async url => { authenticated.push(url) },
    dispose: async () => { disposals++ },
  }
  const backend = new BackendConnection(host, client, state => states.push(state), () => { connections++ })
  return { host, client, backend, states, authenticated, event: (status: HostStatus) => listener(status),
    counts: () => ({ discoveries, stops, disposals, connections, starts }) }
}

test('generation changes during authentication retire the old attempt before connecting the latest host', async () => {
  const h = harness()
  const pending = deferred<void>()
  let first = true
  h.client.connect = async url => {
    h.authenticated.push(url)
    if (first) { first = false; await pending.promise }
  }
  const connecting = h.backend.connect()
  await flush()
  h.event({ phase: 'starting', blocked: false, generation: '2' })
  h.event({ phase: 'ready', blocked: false, generation: '2' })
  pending.resolve()
  await connecting
  await flush()
  expect(h.authenticated).toHaveLength(2)
  expect(h.counts().connections).toBe(1)
  expect(h.states.at(-1)).toMatchObject({ phase: 'connected', ready: true })
  await h.backend.dispose()
})

test('ready replaces an authenticating generation directly, and old failure cannot overwrite success', async () => {
  const h = harness()
  const pending = deferred<void>()
  let first = true
  h.client.connect = async () => { if (first) { first = false; await pending.promise } }
  const connecting = h.backend.connect()
  await flush()
  h.event({ phase: 'ready', blocked: false, generation: '2' })
  pending.reject(new Error('old authentication failed'))
  await connecting
  await flush()
  expect(h.counts().connections).toBe(1)
  expect(h.states.at(-1)?.phase).toBe('connected')
  expect(h.states.some(state => state.message === 'old authentication failed')).toBe(false)
  await h.backend.dispose()
})

test('late catalog and queue results cannot reach the next generation', async () => {
  const h = harness()
  await h.backend.connect()
  const catalog = deferred<string>(), queue = deferred<string>()
  const received: string[] = []
  const reads = [h.backend.read(() => catalog.promise, value => received.push(value)), h.backend.read(() => queue.promise, value => received.push(value))]
  h.event({ phase: 'ready', blocked: false, generation: '2' })
  catalog.resolve('old models'); queue.resolve('old queue')
  await Promise.all(reads)
  await flush()
  expect(received).toEqual([])
  await h.backend.dispose()
})

test('closing during discovery prevents authentication and waits for pending work', async () => {
  const h = harness()
  const discovery = deferred<BackendInfo>()
  h.host.discover = () => discovery.promise
  const connecting = h.backend.connect()
  await flush()
  const close = h.backend.dispose()
  const before = h.states.length
  discovery.resolve(info('1'))
  await Promise.all([connecting, close])
  expect(h.authenticated).toEqual([])
  expect(h.states).toHaveLength(before)
  expect(h.counts().connections).toBe(0)
})

test('closing during watch setup closes the late subscription exactly once', async () => {
  const h = harness()
  const watch = deferred<() => void>()
  let closed = 0
  h.host.watch = () => watch.promise
  const connecting = h.backend.connect()
  await flush()
  const close = h.backend.dispose()
  watch.resolve(() => { closed++ })
  await Promise.all([connecting, close])
  expect(closed).toBe(1)
  expect(h.authenticated).toEqual([])
})

test('a failed watch closes once; explicit discovery reconnects without granting startup permission', async () => {
  const h = harness()
  await h.backend.connect()
  h.event({ phase: 'unavailable', blocked: true, reason: 'subscription failed' })
  await flush()
  expect(h.states.at(-1)?.phase).toBe('unavailable')
  expect(h.counts().stops).toBe(1)
  expect(h.counts().discoveries).toBe(1)
  await h.backend.connect()
  expect(h.counts().starts).toBe(0)
  expect(h.counts().discoveries).toBe(2)
  await h.backend.dispose()
  expect(h.counts().stops).toBe(2)
})

test('official stream readiness changes stay inside the coordinator', async () => {
  const h = harness()
  await h.backend.connect()
  h.client.onGenerationChange?.(false)
  expect(h.states.at(-1)).toMatchObject({ phase: 'connected', ready: false })
  h.client.onGenerationChange?.(true)
  expect(h.states.at(-1)).toMatchObject({ phase: 'connected', ready: true })
  await h.backend.dispose()
  expect(h.client.onGenerationChange).toBeUndefined()
})

test('a stream lost before connect settles cannot publish a ready connection', async () => {
  const h = harness()
  h.client.connect = async () => {
    h.client.onGenerationChange?.(true)
    h.client.onGenerationChange?.(false)
  }
  await h.backend.connect()
  expect(h.states.at(-1)).toMatchObject({ phase: 'connected', ready: false })
  expect(h.states.some(state => state.ready)).toBe(false)
  h.client.onGenerationChange?.(true)
  expect(h.states.at(-1)).toMatchObject({ phase: 'connected', ready: true })
  await h.backend.dispose()
})

test('only an explicit start sends the lifecycle command, once even on unknown result', async () => {
  const h = harness()
  h.host.start = async () => { throw new Error('result unknown') }
  await h.backend.start()
  expect(h.states.at(-1)?.message).toBe('result unknown')
  expect(h.counts().discoveries).toBe(0)
  await h.backend.dispose()
})

test('native host replies are decoded at the adapter boundary', () => {
  const ready = { phase: 'ready', blocked: false, generation: 'g1' }
  expect(decodeBackendInfo(JSON.stringify({ ...ready, url: info('g1').url }))).toEqual(info('g1'))
  for (const value of [null, {}, { ...ready, blocked: 'false' }, { ...ready, phase: 'future' }, { ...ready, generation: '' }, { ...ready, blocked: true }]) {
    expect(() => decodeHostStatus(JSON.stringify(value))).toThrow()
  }
  expect(() => decodeHostStatus(JSON.stringify({ ...ready, url: info('g1').url }))).toThrow('认证信息')
  for (const url of ['http://example.org:32100/?token=secret', 'http://127.0.0.1:32100/', 'http://user@127.0.0.1:32100/?token=secret']) {
    expect(() => decodeBackendInfo(JSON.stringify({ ...ready, url }))).toThrow()
  }
  expect(() => checkServiceResult('{"status":"notRegistered"}')).not.toThrow()
  expect(() => checkServiceResult('{"status":"error","error":"unknown result"}')).toThrow('unknown result')
  expect(() => checkServiceResult('{"status":"enabled"}')).toThrow()
})
