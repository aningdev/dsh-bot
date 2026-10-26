import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { TextHistory } from '../../client/history.ts'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function until<T>(read: () => Promise<T>, accept: (value: T) => boolean, timeout = 20_000): Promise<T> {
  const end = Date.now() + timeout
  let last: unknown
  while (Date.now() < end) {
    try { const value = await read(); if (accept(value)) return value } catch (error) { last = error }
    await delay(100)
  }
  throw new Error(`等待超时：${String(last ?? '')}`)
}

test('authenticated Harness sessions: isolation, text stream, fixed config, restart and cancellation', { timeout: 90_000 }, async () => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-bot-test-'))
  const requests: Record<string, unknown>[] = []
  let slow = false
  const mock = createServer((request, response) => {
    let body = ''
    request.on('data', chunk => { body += chunk })
    request.on('end', () => {
      requests.push(JSON.parse(body))
      response.writeHead(200, { 'content-type': 'text/event-stream' })
      const events = [
        { type: 'message_start', message: { id: 'msg_1', model: 'deepseek-flash', usage: { input_tokens: 3, output_tokens: 0 } } },
        { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hello ' } },
        { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: '世界' } },
        { type: 'content_block_stop', index: 0 },
        { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 2 } },
        { type: 'message_stop' },
      ]
      let index = 0
      const timer = setInterval(() => {
        if (index >= events.length) { clearInterval(timer); response.end(); return }
        const event = events[index++]!
        response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
      }, slow ? 500 : 20)
      response.on('close', () => clearInterval(timer))
    })
  })
  await new Promise<void>(resolve => mock.listen(0, '127.0.0.1', resolve))
  const port = (mock.address() as { port: number }).port
  let child: ReturnType<typeof spawn>
  let logs = ''
  let origin = '', cookie = ''
  async function start() {
    child = spawn(process.execPath, [resolve('dist/index.js')], { env: {
      ...process.env, DSH_BOT_HOME: home, DEEPSEEK_API_KEY: 'test-local-only', DEEPSEEK_BASE_URL: `http://127.0.0.1:${port}`,
    }, stdio: ['ignore', 'pipe', 'pipe'] })
    child.stdout!.on('data', chunk => { logs += String(chunk) }); child.stderr!.on('data', chunk => { logs += String(chunk) })
    const info = await until(async () => JSON.parse(await readFile(join(home, 'connection.json'), 'utf8')) as { url: string }, value => !!value.url)
    origin = new URL(info.url).origin
    const login = await fetch(info.url, { redirect: 'manual' })
    assert.equal(login.status, 303)
    cookie = login.headers.get('set-cookie')!.split(';')[0]!
  }
  async function stop() {
    if (child!.exitCode !== null) return
    const done = new Promise<void>(resolve => child.once('exit', () => resolve()))
    child!.kill('SIGTERM'); await done
  }
  async function api(path: string, body?: unknown) {
    const response = await fetch(origin + '/api/bot/' + path, { method: body === undefined ? 'GET' : 'POST',
      headers: { cookie, 'content-type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    const result = await response.json()
    assert.equal(response.status, 200, JSON.stringify(result)); return result
  }
  async function watch(id: string) {
    const abort = new AbortController(), history = new TextHistory()
    let snapshot = false, messages: ReturnType<TextHistory['receive']> = [], frames: unknown[] = []
    const task = (async () => {
      const response = await fetch(`${origin}/api/bot/follow?id=${id}`, { headers: { cookie }, signal: abort.signal })
      assert.equal(response.status, 200)
      const reader = response.body!.getReader(), decoder = new TextDecoder()
      let buffer = ''
      try {
        while (true) {
          const next = await reader.read(); if (next.done) return
          buffer += decoder.decode(next.value, { stream: true })
          let end: number
          while ((end = buffer.indexOf('\n')) >= 0) {
            const frame = JSON.parse(buffer.slice(0, end)); buffer = buffer.slice(end + 1)
            frames.push(frame); messages = history.receive(frame); snapshot ||= frame.type === 'snapshot'
          }
        }
      } finally { await reader.cancel().catch(() => undefined) }
    })().catch(error => { if (!abort.signal.aborted) throw error })
    await until(async () => snapshot, Boolean)
    return { history, frames, messages: () => messages, close: async () => { abort.abort(); await task } }
  }
  try {
    await start()
    const denied = await fetch(origin + '/api/bot/state'); assert.notEqual(denied.status, 200)
    const config = { name: 'One', model: 'deepseek-flash', instructions: 'literal {{bot_variable}}', cwd: home }
    const bot = await api('config', { config })
    const one = await api('conversation', { botId: bot.id })
    await api('config', { id: bot.id, config: { ...config, instructions: 'new defaults' } })
    const two = await api('conversation', { botId: bot.id })
    assert.equal(one.config.instructions, config.instructions); assert.equal(two.config.instructions, 'new defaults')
    const stream = await watch(one.id)
    await api('prompt', { id: one.id, requestId: randomUUID(), text: 'first message', mode: 'queue' })
    await until(async () => stream.messages(), value => value.some(item => item.text === 'Hello 世界') && !stream.history.running)
    assert.equal(requests.length, 1)
    assert.equal(requests[0]!.model, 'deepseek-flash')
    assert.ok(JSON.stringify(requests[0]!.system).includes(config.instructions), 'literal instruction must reach official adapter')
    assert.ok(stream.frames.some(value => (value as { type: string }).type === 'assistant-stream'), 'must receive incremental frames')
    const isolated = await watch(two.id); assert.equal(isolated.messages().length, 0); await isolated.close()
    await stream.close()
    await stop(); await start()
    const restored = await watch(one.id)
    assert.ok(restored.messages().some(item => item.text === 'Hello 世界'))
    assert.equal(requests.length, 1, 'reading after restart must not replay input')
    await restored.close()
    slow = true
    const active = await watch(two.id)
    await api('prompt', { id: two.id, requestId: randomUUID(), text: 'cancel me', mode: 'queue' })
    await until(async () => requests.length, count => count === 2)
    await api('cancel', { id: two.id })
    await until(async () => active.history.running, value => !value)
    await active.close()
    assert.ok(!logs.includes('entry did not activate'), logs)
  } catch (error) { throw new Error(`${String(error)}\n${logs}`, { cause: error }) }
  finally { await stop(); mock.closeAllConnections(); await new Promise<void>(resolve => mock.close(() => resolve())); await rm(home, { recursive: true, force: true }) }
})
