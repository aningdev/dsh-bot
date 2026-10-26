import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import type { SessionFollowFrame, SessionPromptRequest } from '@deepseek-ai/dsh-api-session-controller'
import type { SessionId } from '@deepseek-ai/dsh-session'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { ProductStore, configFrom, type Conversation } from './store.ts'

export const name = 'bot-product'
export const inject = ['connection', 'webServer', 'sessionController', 'agentPresets', 'credentials']
function bodyFrom(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('无效请求')
  return value as Record<string, unknown>
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 100_000) throw new Error('无效文本字段')
  return value
}
export async function apply(ctx: Context): Promise<void> {
  const home = process.env.DSH_BOT_HOME
  if (!home) throw new Error('DSH_BOT_HOME 未设置')
  const store = new ProductStore(join(home, 'product.json'))
  await store.open()
  const presets = new Map<string, Promise<void>>()
  const preset = (conversation: Conversation): Promise<void> => {
    let task = presets.get(conversation.id)
    if (!task) {
      task = ctx.agentPresets.register({ id: `bot-${conversation.id}`, plugins: [
        { name: '@dsh-bot/runner/conversation', config: conversation.config },
      ] }).then(dispose => { ctx.effect(() => dispose) })
      presets.set(conversation.id, task)
    }
    return task
  }
  for (const conversation of store.snapshot().conversations) await preset(conversation)
  ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: '/', handler: (req, res) => {
    if (!ctx.connection.authorizeIndex(req, res)) return
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('dsh-bot ready')
  } }))
  const route = (path: string, methods: ('GET' | 'POST')[], fetch: (request: Request) => Promise<Response>) => {
    ctx.connection.fetch.register({ path: `/api/bot/${path}`, methods, requestBody: 'buffered', fetch: async request => {
      try { return await fetch(request) }
      catch (error) { return Response.json({ error: String(error) }, { status: 400 }) }
    } })
  }
  route('state', ['GET'], async () => Response.json(store.snapshot()))
  route('config', ['POST'], async request => {
    const body = bodyFrom(await request.json())
    if (body.id !== undefined && typeof body.id !== 'string') throw new Error('无效 Bot 标识')
    return Response.json(await store.saveBot(body.id as string | undefined, configFrom(body.config)))
  })
  route('conversation', ['POST'], async request => {
    const body = bodyFrom(await request.json())
    const conversation = store.prepareConversation(text(body.botId), body.cwd === undefined ? undefined : text(body.cwd))
    await preset(conversation)
    const created = await ctx.sessionController.create({ sessionId: conversation.id as SessionId, cwd: conversation.config.cwd, agentPreset: `bot-${conversation.id}` })
    if (created.sessionId !== conversation.id) throw new Error('后台会话标识不匹配')
    await ctx.sessionController.selectModel({ sessionId: conversation.id as SessionId, provider: 'deepseek-official', model: conversation.config.model })
    return Response.json(await store.commitConversation(conversation))
  })
  route('prompt', ['POST'], async request => {
    const body = bodyFrom(await request.json())
    const conversation = store.conversation(text(body.id))
    const requestId = text(body.requestId)
    if (!/^[a-zA-Z0-9-]{1,100}$/.test(requestId)) throw new Error('无效请求标识')
    if (body.mode !== 'queue' && body.mode !== 'steer') throw new Error('无效发送模式')
    const result = await ctx.sessionController.prompt({ sessionId: conversation.id as SessionId, requestId: requestId as SessionPromptRequest['requestId'],
      mode: body.mode, content: [{ type: 'text', text: text(body.text) }] }, request.signal)
    return Response.json(result)
  })
  route('cancel', ['POST'], async request => {
    const conversation = store.conversation(text(bodyFrom(await request.json()).id))
    return Response.json(ctx.sessionController.cancel({ sessionId: conversation.id as SessionId }))
  })
  route('follow', ['GET'], async request => {
    const conversation = store.conversation(text(new URL(request.url).searchParams.get('id')))
    const abort = new AbortController()
    const stop = () => abort.abort()
    request.signal.addEventListener('abort', stop, { once: true })
    const iterator = ctx.sessionController.follow({ address: { kind: 'session', sessionId: conversation.id as SessionId }, assistantStream: true, maxMessages: 1000 }, abort.signal)[Symbol.asyncIterator]()
    const encoder = new TextEncoder()
    const first = await iterator.next()
    let initial: IteratorResult<SessionFollowFrame> | undefined = first
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          const next = initial ?? await iterator.next()
          initial = undefined
          if (next.done) { controller.close(); stop(); return }
          controller.enqueue(encoder.encode(JSON.stringify(next.value) + '\n'))
        } catch (error) { controller.error(error); stop() }
      },
      async cancel() { stop(); await iterator.return?.() },
    })
    ctx.effect(() => () => { stop(); request.signal.removeEventListener('abort', stop) })
    return new Response(stream, { headers: { 'content-type': 'application/x-ndjson', 'cache-control': 'no-store' } })
  })
  const key = credentialRef('DEEPSEEK_API_KEY')
  route('credentials', ['GET'], async () => Response.json(await ctx.credentials.describe(key)))
  route('shutdown', ['POST'], async () => {
    setTimeout(() => process.kill(Number(process.env.DSH_BOT_SUPERVISOR_PID ?? process.pid), 'SIGTERM'), 100).unref()
    return Response.json({ stopping: true })
  })
  await mkdir(home, { recursive: true, mode: 0o700 })
  const discovery = join(home, 'connection.json')
  await writeFile(discovery, JSON.stringify({ pid: process.pid, url: ctx.connection.authenticatedUrl(`${ctx.webServer.getOrigin()}/`) }), { mode: 0o600 })
  ctx.effect(() => async () => { await unlink(discovery).catch(() => undefined) })
  console.info(`dsh-bot ready: ${ctx.webServer.getOrigin()}`)
}
