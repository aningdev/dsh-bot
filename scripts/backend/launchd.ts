import { chmod, mkdir, open, readFile, rename, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { readFileSync, realpathSync } from 'node:fs'

/** Only the version this product was verified against; never upgraded or downgraded automatically. */
/**
 * The release this product may run. It is recorded by `scripts/backend/pin-version.ts`
 * from the installed CLI, never typed by hand, so the guard compares real bytes.
 */
export const SUPPORTED_VERSION = (JSON.parse(readFileSync(new URL('./pinned-version.json', import.meta.url), 'utf8')) as { release: string }).release.trim()
export const LABEL = 'dev.dshbot.backend'
export const DATA_ROOT = join(homedir(), '.dsh-bot')
export const WRAPPER_PATH = join(DATA_ROOT, 'bin/launch-backend.sh')
export const LOG_DIRECTORY = join(homedir(), 'Library/Logs/dsh-bot')
export const LOG_PATH = join(LOG_DIRECTORY, 'backend.log')
export const PLIST_PATH = join(homedir(), `Library/LaunchAgents/${LABEL}.plist`)
export const ROTATED_PATH = `${LOG_PATH}.1`
const MAX_LOG_BYTES = 8 * 1024 * 1024

/** Candidate executables; the installed CLI is a symlink into an application bundle. */
const CLI_CANDIDATES = ['/usr/local/bin/dsh', '/opt/homebrew/bin/dsh', join(homedir(), '.local/bin/dsh')]

export type ReadyLine = { url: string; token: string; port: number }

/** Resolves the absolute installed CLI, so a moved installation is reported instead of silently loading another copy. */
export function resolveCli(candidates = CLI_CANDIDATES): string {
  for (const candidate of candidates) {
    try {
      const resolved = realpathSync(candidate)
      return resolved
    } catch {}
  }
  throw new Error(`未找到已安装的官方 dsh（查找：${candidates.join('、')}）；本产品不自带运行时`)
}

/** Rejects a build this product was not verified against. */
export function assertVersion(actual: string, expected = SUPPORTED_VERSION): string {
  const found = actual.trim()
  if (found !== expected) {
    throw new Error(`检出的官方 dsh 版本为 ${found}，本产品仅支持 ${expected}；不会自动升级或降级，请安装受支持版本或更新客户端`)
  }
  return found
}

/**
 * Reads the ready line belonging to the current launch. Every launch appends a
 * `[launch <iso>]` marker; a ready line without a marker of its own, or under an
 * older marker, is a previous process and is never treated as the current backend.
 */
export async function currentReady(path = LOG_PATH): Promise<ReadyLine | undefined> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch {
    return undefined
  }
  let marker: string | undefined
  let found: { marker?: string; ready: ReadyLine } | undefined
  for (const line of text.split('\n')) {
    const launch = /^\[launch ([^\]]+)\]/.exec(line)
    if (launch) {
      marker = launch[1]!
      continue
    }
    const match = /dsh web: http:\/\/127\.0\.0\.1:(\d+)\/\?token=([A-Za-z0-9_-]+)/.exec(line)
    if (!match) continue
    found = { marker, ready: { url: `http://127.0.0.1:${match[1]}/?token=${match[2]}`, token: match[2]!, port: Number(match[1]) } }
  }
  if (!found || found.marker === undefined || found.marker !== marker) return undefined
  return found.ready
}

export function redact(value: string): string {
  return value.replace(/token=[A-Za-z0-9_-]+/g, 'token=<redacted>')
}

/** API authentication: 302 plus a Cookie proves the token belongs to the running process. */
export async function validateToken(url: string, timeoutMs = 5000): Promise<boolean> {
  try {
    const response = await fetch(url.replace('/?token=', '/connect?token=') + '&interactions=answer', {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    })
    return response.status === 302 && !!response.headers.get('set-cookie')
  } catch {
    return false
  }
}

export type Backend = { running: boolean; pid?: number; ready?: ReadyLine; detail: string }

export function renderPlist(cli: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string><string>${WRAPPER_PATH}</string>
    <string>${cli}</string><string>${SUPPORTED_VERSION}</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>DSH_HOME</key><string>${DATA_ROOT}</string>
    <key>DSH_AGENTS_HOME</key><string>${join(DATA_ROOT, 'agents')}</string>
  </dict>
  <key>RunAtLoad</key><false/>
  <key>KeepAlive</key>
  <dict><key>SuccessfulExit</key><false/></dict>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>StandardOutPath</key><string>${LOG_PATH}</string>
  <key>StandardErrorPath</key><string>${LOG_PATH}</string>
</dict>
</plist>
`
}

export function hasModelKey(text: string): boolean {
  return /DEEPSEEK_API_KEY|<key>[A-Z_]*KEY<\/key>/.test(text)
}

/** Restricts token-bearing logs to the current user. */
export async function secureLogs(): Promise<void> {
  await mkdir(LOG_DIRECTORY, { recursive: true, mode: 0o700 })
  await chmod(LOG_DIRECTORY, 0o700)
  try {
    await chmod(LOG_PATH, 0o600)
  } catch {}
}

export async function rotateLog(path = LOG_PATH, maxBytes = MAX_LOG_BYTES): Promise<boolean> {
  try {
    const info = await stat(path)
    if (info.size < maxBytes) return false
    await rename(path, `${path}.1`)
    await chmod(`${path}.1`, 0o600).catch(() => undefined)
    return true
  } catch {
    return false
  }
}

export async function logSize(): Promise<number> {
  try {
    return (await stat(LOG_PATH)).size
  } catch {
    return 0
  }
}

/** Appends a launch marker so a ready line can be tied to the process that just started. */
export async function markLaunch(reason: string): Promise<void> {
  await mkdir(dirname(LOG_PATH), { recursive: true, mode: 0o700 })
  const file = await open(LOG_PATH, 'a', 0o600)
  try {
    await file.write(`[launch ${new Date().toISOString()}] ${reason}\n`)
  } finally {
    await file.close()
  }
}

export async function cliVersion(cli: string): Promise<string> {
  const output = await run([cli, '--version'])
  return output.trim()
}

export async function run(argv: string[], timeoutMs = 30000): Promise<string> {
  const process = Bun.spawn(argv, { stdout: 'pipe', stderr: 'pipe' })
  const timer = setTimeout(() => process.kill('SIGKILL'), timeoutMs)
  try {
    const [out, err, code] = await Promise.all([
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
      process.exited,
    ])
    if (code !== 0) throw new Error(`${argv.join(' ')} 失败（${code}）：${redact(err.trim() || out.trim())}`)
    return out
  } finally {
    clearTimeout(timer)
  }
}

export async function userId(): Promise<string> {
  return String(process.getuid?.() ?? 501)
}

export async function launchTarget(): Promise<string> {
  return `gui/${await userId()}/${LABEL}`
}

export async function isLoaded(): Promise<boolean> {
  try {
    await run(['launchctl', 'print', await launchTarget()], 10000)
    return true
  } catch {
    return false
  }
}

export async function pidOf(): Promise<number | undefined> {
  try {
    const text = await run(['launchctl', 'print', await launchTarget()], 10000)
    const match = /^\s*pid = (\d+)$/m.exec(text)
    return match ? Number(match[1]) : undefined
  } catch {
    return undefined
  }
}

/** Confirms launchd actually dropped the job, so a stop or uninstall is not reported early. */
export async function waitStopped(timeoutMs = 15000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (!(await isLoaded())) return true
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  return false
}

/** Waits for a ready line, validating each candidate so a stale token never counts as a connection. */
export async function waitForReady(timeoutMs: number): Promise<ReadyLine> {
  const deadline = Date.now() + timeoutMs
  const rejected = new Set<string>()
  while (Date.now() < deadline) {
    const candidate = await currentReady()
    if (candidate && !rejected.has(candidate.url)) {
      if (await validateToken(candidate.url)) return candidate
      rejected.add(candidate.url)
    }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error(`后台在 ${Math.round(timeoutMs / 1000)} 秒内没有出现可用的 ready 行；查看 ${LOG_PATH}`)
}
