import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import {
  access,
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

interface LaunchctlResult {
  readonly code: number
  readonly stdout: string
}

interface RunnerServiceOptions {
  readonly home: string
  readonly loginDirectory: string
  readonly label: string
  readonly uid: number
  readonly runtime: { readonly node: string; readonly entry: string }
  readonly prepareRuntime?: () => Promise<RunnerServiceOptions['runtime']>
  readonly waitReady?: () => Promise<void>
  readonly isAlive?: (pid: number) => boolean
  /** Process boundary only; deterministic tests do not claim real launchd coverage. */
  readonly launchctl?: (args: readonly string[]) => Promise<LaunchctlResult>
}

export interface RunnerServiceStatus {
  readonly installed: boolean
  readonly loginAtStartup: boolean
  readonly loaded: boolean
  readonly pid: number | null
}

function launchctl(args: readonly string[]): Promise<LaunchctlResult> {
  return new Promise((resolve, reject) => {
    execFile(
      '/bin/launchctl',
      [...args],
      { timeout: 40_000, maxBuffer: 1024 * 1024 },
      (error, stdout) => {
        if (!error) resolve({ code: 0, stdout })
        else if ('code' in error && typeof error.code === 'number')
          resolve({ code: error.code, stdout })
        else reject(error)
      },
    )
  })
}

async function exists(filename: string): Promise<boolean> {
  try {
    const info = await lstat(filename)
    if (!info.isFile()) throw new Error('后台服务配置必须是普通文件。')
    return true
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return false
    throw error
  }
}

function xml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Owns one user LaunchAgent. Desktop disconnect/quit never calls stop(). */
export class RunnerService {
  private readonly run: (args: readonly string[]) => Promise<LaunchctlResult>
  private readonly directory: string
  private readonly plist: string
  private readonly loginPlist: string
  private readonly stoppedFile: string
  private readonly domain: string
  private readonly target: string
  private pending: Promise<unknown> = Promise.resolve()
  private readonly options: RunnerServiceOptions

  constructor(options: RunnerServiceOptions) {
    this.options = options
    for (const filename of [
      options.home,
      options.loginDirectory,
      options.runtime.node,
      options.runtime.entry,
    ]) {
      if (
        !path.isAbsolute(filename) ||
        [...filename].some((character) => character.charCodeAt(0) < 32)
      )
        throw new Error('后台服务路径必须是绝对路径且不含控制字符。')
    }
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9.-]+$/u.test(options.label) ||
      !Number.isSafeInteger(options.uid) ||
      options.uid <= 0
    )
      throw new Error('后台服务身份无效；请以当前桌面用户运行。')
    this.directory = path.join(options.home, 'service')
    this.plist = path.join(this.directory, 'runner.plist')
    this.stoppedFile = path.join(this.directory, 'stopped')
    this.loginPlist = path.join(options.loginDirectory, options.label + '.plist')
    this.domain = 'gui/' + String(options.uid)
    this.target = this.domain + '/' + options.label
    this.run = options.launchctl ?? launchctl
  }

  private serialize<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.pending.then(operation)
    this.pending = result.catch(() => undefined)
    return result
  }

  private async execute(args: readonly string[]): Promise<void> {
    const result = await this.run(args)
    if (result.code !== 0)
      throw new Error(`后台服务操作失败（launchctl ${String(result.code)}），请重试。`)
  }

  private async inspect(): Promise<RunnerServiceStatus> {
    const installed = await exists(this.plist)
    const loginAtStartup = await exists(this.loginPlist)
    const result = await this.run(['print', this.target])
    // ESRCH (3) and launchctl's "service not found" (113) are absence, not failure.
    if (result.code === 3 || result.code === 113)
      return { installed, loginAtStartup, loaded: false, pid: null }
    if (result.code !== 0)
      throw new Error('无法查询后台服务状态，请确认当前用户已登录 macOS 桌面。')
    const matched = /^\s*pid = (\d+)\s*$/mu.exec(result.stdout)
    return { installed, loginAtStartup, loaded: true, pid: matched ? Number(matched[1]) : null }
  }

  status(): Promise<RunnerServiceStatus> {
    return this.serialize(() => this.inspect())
  }

  private async atomicWrite(filename: string, content: string): Promise<void> {
    const temporary = filename + '.' + randomUUID() + '.tmp'
    try {
      await writeFile(temporary, content, { mode: 0o600, flag: 'wx' })
      await rename(temporary, filename)
    } finally {
      await rm(temporary, { force: true })
    }
  }

  private async installFiles(): Promise<void> {
    const runtime = (await this.options.prepareRuntime?.()) ?? this.options.runtime
    await access(runtime.node, constants.X_OK)
    await access(runtime.entry, constants.R_OK)
    await mkdir(this.directory, { recursive: true, mode: 0o700 })
    const args = [runtime.node, runtime.entry, '--home', this.options.home]
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>${xml(this.options.label)}</string>
<key>ProgramArguments</key><array>${args.map((arg) => '<string>' + xml(arg) + '</string>').join('')}</array>
<key>WorkingDirectory</key><string>${xml(this.options.home)}</string>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>
<key>ThrottleInterval</key><integer>10</integer>
<key>ExitTimeOut</key><integer>30</integer>
<key>ProcessType</key><string>Background</string>
<key>EnvironmentVariables</key><dict><key>PATH</key><string>${xml(path.dirname(runtime.node) + ':/usr/bin:/bin:/usr/sbin:/sbin')}</string></dict>
<key>StandardOutPath</key><string>${xml(path.join(this.directory, 'stdout.log'))}</string>
<key>StandardErrorPath</key><string>${xml(path.join(this.directory, 'stderr.log'))}</string>
</dict></plist>
`
    const state = await this.inspect()
    if (!state.installed || (await readFile(this.plist, 'utf8')) !== content) {
      if (state.loaded) throw new Error('请先停止后台，再替换运行时。')
      await this.atomicWrite(this.plist, content)
    }
    // A failed second write must be recoverable even if the master already changed.
    if (state.loginAtStartup && (await readFile(this.loginPlist, 'utf8')) !== content)
      await this.atomicWrite(this.loginPlist, content)
  }

  /** Installation does not start execution or enable login startup. */
  install(): Promise<void> {
    return this.serialize(() => this.installFiles())
  }

  private async bootstrap(): Promise<void> {
    if ((await this.inspect()).loaded) return
    const result = await this.run(['bootstrap', this.domain, this.plist])
    // A second desktop may have won bootstrap; the shared launchd label is authoritative.
    if (result.code !== 0 && !(await this.inspect()).loaded)
      throw new Error('后台服务启动失败，请检查运行时安装后重试。')
  }

  /** First desktop launch starts the service unless the user explicitly stopped it. */
  autoStart(): Promise<void> {
    return this.serialize(async () => {
      if ((await this.inspect()).loaded || (await exists(this.stoppedFile))) return
      await this.installFiles()
      await this.bootstrap()
      await this.options.waitReady?.()
    })
  }

  start(): Promise<void> {
    return this.serialize(async () => {
      if (!(await this.inspect()).loaded) {
        await this.installFiles()
        await this.bootstrap()
      }
      await rm(this.stoppedFile, { force: true })
    })
  }

  private async markStopped(): Promise<void> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 })
    await this.atomicWrite(this.stoppedFile, 'stopped\n')
  }

  /** Back up quiescent application data, excluding runtime payloads and live connection files. */
  private async backupData(): Promise<void> {
    const root = path.join(this.directory, 'backups')
    const id = new Date().toISOString().replaceAll(':', '-') + '-' + randomUUID()
    const temporary = path.join(root, '.' + id + '.tmp')
    const data = path.join(temporary, 'data')
    let staged = false
    try {
      await mkdir(root, { recursive: true, mode: 0o700 })
      await mkdir(temporary, { mode: 0o700 })
      staged = true
      await mkdir(data, { mode: 0o700 })
      for (const entry of await readdir(this.options.home)) {
        if (entry === 'service' || entry === 'run') continue
        await cp(path.join(this.options.home, entry), path.join(data, entry), {
          recursive: true,
          verbatimSymlinks: true,
          preserveTimestamps: true,
        })
      }
      await this.atomicWrite(
        path.join(temporary, 'backup.json'),
        JSON.stringify({ createdAt: new Date().toISOString(), format: 1 }) + '\n',
      )
      await rename(temporary, path.join(root, id))
    } catch (error) {
      if (staged) await rm(temporary, { recursive: true, force: true })
      throw new Error('应用数据备份失败，后台保持停止，未更新运行时。', { cause: error })
    }
  }

  private alive(pid: number): boolean {
    if (this.options.isAlive) return this.options.isAlive(pid)
    try {
      process.kill(pid, 0)
      return true
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ESRCH') return false
      throw error
    }
  }

  private async stopJob(): Promise<void> {
    const state = await this.inspect()
    if (!state.loaded) return
    await this.execute(['bootout', this.target])
    const deadline = Date.now() + 35_000
    while ((await this.inspect()).loaded || (state.pid !== null && this.alive(state.pid))) {
      if (Date.now() >= deadline) throw new Error('后台尚未退出，不能继续替换或卸载运行时。')
      await delay(100)
    }
  }

  /** Stop before publishing a replacement; an explicitly stopped service stays stopped. */
  upgrade(): Promise<void> {
    return this.serialize(async () => {
      const previous = await this.inspect()
      if (!previous.installed) throw new Error('请先安装后台。')
      await this.markStopped()
      await this.stopJob()
      await this.backupData()
      await this.installFiles()
      if (previous.loaded) {
        await this.bootstrap()
        await this.options.waitReady?.()
        await rm(this.stoppedFile, { force: true })
      }
    })
  }

  /** Removing the job suppresses KeepAlive until an explicit start or enabled next login. */
  stop(): Promise<void> {
    return this.serialize(async () => {
      await this.markStopped()
      await this.stopJob()
    })
  }

  setLoginAtStartup(enabled: boolean): Promise<void> {
    return this.serialize(async () => {
      if (enabled) {
        await this.installFiles()
        await mkdir(this.options.loginDirectory, { recursive: true, mode: 0o700 })
        await this.atomicWrite(this.loginPlist, await readFile(this.plist, 'utf8'))
      } else await rm(this.loginPlist, { force: true })
    })
  }

  uninstall(): Promise<void> {
    return this.serialize(async () => {
      await this.markStopped()
      await this.stopJob()
      await rm(this.loginPlist, { force: true })
      await rm(this.plist, { force: true })
    })
  }
}
