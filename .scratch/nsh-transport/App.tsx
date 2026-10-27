import { mount, signal, Text, View } from 'nsh'
import { Transport } from 'nsh-transport/native'
import { AuthenticatedSocket } from './socket'
import { Context, installConnection, TypertRegistry, Gateway, sessionRemote } from './sdk.js'

const status = signal('Idle')
function unwrap(result: any) {
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
  return result.value
}
async function connect(login: URL) {
  const ctx = new Context()
  try {
    const connect = new URL('/connect', login)
    connect.searchParams.set('token', login.searchParams.get('token')!)
    connect.searchParams.set('interactions', 'answer')
    const response = await fetch(connect.toString(), { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    if (response.status !== 302 || !cookie) throw new Error(`API authentication: ${response.status}`)
    console.log('API authentication 302; cookie=<redacted>')
    installConnection(ctx, {
      interactions: 'answer',
      transport: {
        streamBaseUrl: login.origin + '/',
        fetch: (input: string, init: RequestInit) => {
          const headers = new Headers(init.headers)
          headers.set('cookie', cookie)
          return fetch(new URL(input, login.origin).toString(), { ...init, headers })
        },
        createWebSocket: (url: string) => new AuthenticatedSocket(url, cookie),
      },
    })
    await ctx.plugin(TypertRegistry)
    await ctx.plugin(Gateway)
    await ctx.remote.$mount(sessionRemote)
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { unsubscribe(); reject(new Error('Event generation timeout')) }, 10000)
      const check = () => {
        if (!ctx.connection.generation.getSnapshot()) return
        clearTimeout(timer); unsubscribe(); resolve()
      }
      const unsubscribe = ctx.connection.generation.subscribe(check)
      check()
    })
    console.log('Events ready; authenticated WebSocket established')
    return ctx
  } catch (error) {
    await ctx.fiber.dispose()
    throw error
  }
}
async function run() {
  let ctx: any
  let follow: any
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    status.set('Authenticating')
    const login = new URL(Transport.probeUrl())
    ctx = await connect(login)
    unwrap(await ctx.remote.session.modelCatalog())
    console.log('Generated Remote session/modelCatalog: OK')
    const control = ctx.remote.session.control()
    try {
      const first = await control[Symbol.asyncIterator]().next()
      if (first.done) throw new Error('Control stream ended before its snapshot')
      console.log('Control stream first frame:', first.value?.type ?? 'value')
    } finally { control.dispose() }
    console.log('Control stream cancelled independently')

    const { sessionId } = unwrap(await ctx.remote.session.create({ cwd: login.searchParams.get('workspace'), agentPreset: 'standard' }))
    const catalog = unwrap(await ctx.remote.session.modelCatalog())
    console.log('Model catalog:', JSON.stringify(catalog))
    const selected = unwrap(await ctx.remote.session.selectModel({ sessionId, provider: 'deepseek-official', model: 'deepseek-flash' }))
    // Public Context adapter, limited to this probe's one Session; no client state layer.
    const agent = ctx.extend()
    ctx.typert.contexts.registerClient('agent', {
      identity: (candidate: unknown) => candidate === agent ? sessionId : undefined,
      resolve: (id: unknown) => id === sessionId ? agent : undefined,
    })
    let approvals = 0
    agent.remote.$on('approval/request', async (request: any) => {
      if (request.signal?.aborted) return 'cancelled'
      if (request.toolName !== 'bash' || request.callId !== 'nsh_fixture_bash') throw new Error('Unexpected approval')
      approvals++
      console.log('Scoped approval/request: bash; answer=rejected')
      return 'rejected'
    })
    follow = ctx.remote.session.follow({ address: { kind: 'session', sessionId }, assistantStream: true })
    const iterator = follow[Symbol.asyncIterator]()
    const baseline = await iterator.next()
    if (baseline.done || baseline.value.type !== 'snapshot') throw new Error('Session baseline missing')
    unwrap(await ctx.remote.session.prompt({ sessionId, requestId: 'nsh-approval-probe', mode: 'queue', content: [{ type: 'text', text: 'NSH_APPROVAL_PROBE' }] }))
    await Promise.race([
      (async () => {
        for (;;) {
          const frame = await iterator.next()
          if (frame.done) throw new Error('Session follow ended before completion')
          if (JSON.stringify(frame.value).includes('NSH_APPROVAL_REJECTED')) return
        }
      })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Approval completion timeout')), 20000) }),
    ])
    clearTimeout(timer)
    if (approvals !== 1) throw new Error(`Expected exactly one approval, received ${approvals}`)
    console.log('Session completion after approval rejection: OK')
    follow.dispose(); follow = undefined
    await ctx.fiber.dispose(); ctx = undefined
    console.log('First client disposed; reconnecting with fresh authentication')
    ctx = await connect(login)
    const restored = unwrap(await ctx.remote.session.projections({ sessionId }))
    if (!restored) throw new Error('Session missing after reconnect')
    console.log('Reauthenticated; original Session recovered without replaying prompt')
    status.set('Approval and reconnect verified')
  } catch (error) {
    const message = String(error).replace(/token=[^&\s)]+/g, 'token=<redacted>')
    status.set('Failed: ' + message)
    console.error(message)
  } finally {
    clearTimeout(timer)
    follow?.dispose()
    await ctx?.fiber.dispose()
  }
}
mount(() => <View><Text>{status()}</Text><View role="button" onPress={() => void run()}><Text>Connect</Text></View></View>)
