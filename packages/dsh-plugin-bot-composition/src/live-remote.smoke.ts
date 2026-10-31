/**
 * Live smoke: boot isolated `dsh web` with the composition overlay and exercise
 * preview / compose / ensure remotes (two derived presets + ensure + DSH_HOME).
 *
 * Uses Bun WebSocket + Cookie (Node/Bun path); does not need NSH native sockets.
 *
 *   bun packages/dsh-plugin-bot-composition/src/live-remote.smoke.ts
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import { installConnection } from '@deepseek-ai/dsh-client-connection/client'
import TypertRegistry from '@deepseek-ai/dsh-typert-registry'
import * as Gateway from '@deepseek-ai/dsh-api-gateway/client'
import botCompositionRemote from './remote.ts'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function waitForExit(child: ChildProcess): Promise<number> {
  return new Promise((resolveExit, reject) => {
    child.once('error', reject)
    child.once('exit', code => resolveExit(code ?? 1))
  })
}

function readyUrl(child: ChildProcess): Promise<string> {
  return new Promise((resolveUrl, reject) => {
    const timer = setTimeout(() => reject(new Error('后台启动超时')), 90000)
    let output = ''
    const onChunk = (chunk: Buffer) => {
      output += chunk.toString()
      const match = /dsh web: (http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+)/.exec(output)
      if (!match) return
      clearTimeout(timer)
      resolveUrl(match[1]!)
    }
    child.stdout?.on('data', onChunk)
    child.stderr?.on('data', onChunk)
    void waitForExit(child).then(code => {
      clearTimeout(timer)
      reject(new Error(`后台提前退出（${code}）：${output.slice(-2000)}`))
    })
  })
}

/** Cookie-bearing WebSocket for Bun/Node (mirrors NSH AuthenticatedSocket). */
class CookieSocket extends EventTarget {
  readyState = 0
  private socket?: WebSocket
  constructor(url: string, cookie: string) {
    super()
    const socket = new WebSocket(url, { headers: { Cookie: cookie } } as WebSocketOptions)
    this.socket = socket
    socket.addEventListener('open', () => {
      this.readyState = 1
      this.dispatchEvent(new Event('open'))
    })
    socket.addEventListener('message', event => {
      this.dispatchEvent(Object.assign(new Event('message'), { data: event.data }))
    })
    socket.addEventListener('error', () => {
      this.readyState = 3
      this.dispatchEvent(new Event('error'))
    })
    socket.addEventListener('close', () => {
      this.readyState = 3
      this.dispatchEvent(new Event('close'))
    })
  }
  send(data: string) {
    if (this.readyState !== 1 || !this.socket) throw new Error('Socket is not open')
    this.socket.send(data)
  }
  close() {
    this.readyState = 2
    this.socket?.close()
  }
}

function unwrap<T>(result: any): T {
  if (!result || result.ok !== true) {
    const error = result?.error ?? { code: 'unknown/error', message: String(result) }
    throw new Error(`${error.code}: ${error.message}`)
  }
  return result.value as T
}

async function connect(loginUrl: string): Promise<{ ctx: any; dispose(): Promise<void> }> {
  const login = new URL(loginUrl)
  const token = login.searchParams.get('token')
  if (!token) throw new Error('missing token')
  const url = new URL('/connect', login)
  url.searchParams.set('token', token)
  url.searchParams.set('interactions', 'answer')
  const response = await fetch(url.toString(), { redirect: 'manual' })
  const cookie = response.headers.getSetCookie().map(value => value.split(';', 1)[0]).filter(Boolean).join('; ')
  if (response.status !== 302 || !cookie) throw new Error(`auth failed: ${response.status}`)

  const ctx: any = new Context()
  installConnection(ctx, {
    interactions: 'answer',
    transport: {
      streamBaseUrl: login.origin + '/',
      fetch: (input: string | URL, init: RequestInit) => {
        const headers = new Headers(init.headers)
        headers.set('cookie', cookie)
        return fetch(new URL(String(input), login.origin).toString(), { ...init, headers })
      },
      createWebSocket: (target: string) => new CookieSocket(target, cookie) as any,
    },
  })
  await ctx.plugin(TypertRegistry)
  await ctx.plugin(Gateway)
  await ctx.remote.$mount(botCompositionRemote)
  await new Promise<void>((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error('generation timeout')), 15000)
    const check = () => {
      if (ctx.connection.generation.getSnapshot()) {
        clearTimeout(timer)
        unsubscribe()
        resolveReady()
      }
    }
    const unsubscribe = ctx.connection.generation.subscribe(check)
    check()
  })
  return { ctx, dispose: () => ctx.fiber.dispose() }
}

const root = await mkdtemp(join(tmpdir(), 'bot-comp-live-'))
const home = join(root, 'dsh-home')
const workspace = join(root, 'workspace')
await mkdir(home, { recursive: true })
await mkdir(workspace, { recursive: true })
const patch = join(root, 'bot-composition.patch.yml')
const entry = join(packageRoot, 'lib', 'index.js')
await writeFile(patch, `- insert:\n    - id: bot-composition\n      name: ${JSON.stringify(entry)}\n      inject: [agentPresets]\n`)

const backend = spawn('dsh', ['--profile', 'web', '--patch', patch, '--host', '127.0.0.1', '--port', '0', '--no-open'], {
  cwd: workspace,
  env: {
    ...process.env,
    DSH_HOME: home,
    DSH_AGENTS_HOME: join(home, 'agents'),
    DEEPSEEK_API_KEY: 'smoke-unused',
    DSH_PERMISSION_MODE: 'workspace-write',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let failure: unknown
try {
  const url = await readyUrl(backend)
  const { ctx, dispose } = await connect(url)
  try {
    const preview = unwrap<{ basePreset: string; plugins: { id: string }[] }>(
      await ctx.remote.botComposition.preview('standard'),
    )
    if (!preview.plugins.some(item => item.id === 'tool-web' || item.id === 'tool-bash')) {
      throw new Error(`preview 未返回可关闭工具插件：${JSON.stringify(preview.plugins.map(item => item.id))}`)
    }
    const disableA = preview.plugins[0]!.id
    const disableB = preview.plugins.find(item => item.id !== disableA)?.id ?? disableA

    const a = unwrap<{ agentPreset: string; basePreset: string; disabledEntryIds: string[] }>(
      await ctx.remote.botComposition.compose({ basePreset: 'standard', disabledEntryIds: [disableA], name: 'Bot A' }),
    )
    const b = unwrap<{ agentPreset: string; basePreset: string; disabledEntryIds: string[] }>(
      await ctx.remote.botComposition.compose({
        basePreset: 'standard',
        disabledEntryIds: disableA === disableB ? [disableA] : [disableB],
        name: 'Bot B',
      }),
    )
    if (!a.agentPreset.startsWith('dshbot_')) throw new Error(`期望派生 ID，得到 ${a.agentPreset}`)
    if (disableA !== disableB && a.agentPreset === b.agentPreset) {
      throw new Error('两套不同关闭列表应得到不同派生 preset')
    }

    const ensured = unwrap<{ agentPreset: string; basePreset: string }>(
      await ctx.remote.botComposition.ensure(a.agentPreset),
    )
    if (ensured.agentPreset !== a.agentPreset || ensured.basePreset !== 'standard') {
      throw new Error(`ensure 结果不符：${JSON.stringify(ensured)}`)
    }

    const storePath = join(home, 'bot-composition', 'compositions.json')
    const stored = JSON.parse(await readFile(storePath, 'utf8')) as { compositions: { id: string }[] }
    if (!stored.compositions.some(item => item.id === a.agentPreset)) {
      throw new Error('派生组合未写入 DSH_HOME')
    }

    console.log('live remote smoke OK:', {
      disableA,
      disableB,
      presetA: a.agentPreset,
      presetB: b.agentPreset,
      toggleable: preview.plugins.map(item => item.id),
    })
  } finally {
    await dispose().catch(() => undefined)
  }
} catch (error) {
  failure = error
} finally {
  if (backend.exitCode === null && backend.signalCode === null) {
    const exited = waitForExit(backend)
    backend.kill('SIGTERM')
    const timer = setTimeout(() => backend.kill('SIGKILL'), 5000)
    try { await exited } finally { clearTimeout(timer) }
  }
  await rm(root, { recursive: true, force: true })
}

if (failure) {
  console.error('live remote smoke failed:', failure)
  process.exit(1)
}
