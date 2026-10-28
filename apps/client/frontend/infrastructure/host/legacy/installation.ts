import { exists, lstat, mkdir, readlink, writeFile } from 'fs/promises'
import { homedir } from 'os'
import { dirname, isAbsolute, join, resolve } from 'path'
import { run } from 'process'
import { expectedVersion, launchScript } from './assets'

async function installedCli(): Promise<string> {
  for (let path of ['/usr/local/bin/dsh', '/opt/homebrew/bin/dsh', join(homedir(), '.local/bin/dsh')]) {
    try {
      for (let links = 0; links < 40; links++) {
        const info = await lstat(path)
        if (!info.isSymbolicLink()) {
          if (info.isFile()) return path
          break
        }
        const link = await readlink(path)
        path = isAbsolute(link) ? link : resolve(dirname(path), link)
      }
    } catch (error) {
      if ((error as { code?: string }).code !== 'ENOENT') throw error
    }
  }
  throw new Error('未安装官方 dsh CLI')
}

function xml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

/** Writes the accepted old service artifacts; registration/activation is a separate operation. */
export async function installLegacyBackend(paths: { root: string; logs: string; agents: string }): Promise<void> {
  const cli = await installedCli()
  const bin = join(paths.root, 'bin')
  await mkdir(bin, { recursive: true })
  // NSH grants exact command paths; a fixed argv bridge also supports per-user CLI locations.
  const version = await run('/bin/sh', ['-c', 'exec "$1" --version', 'dsh-version', cli], { cwd: bin, timeoutMs: 10000 })
  if (version.code !== 0 || version.stdout.trim() !== expectedVersion) {
    throw new Error(`官方 dsh 版本不兼容；需要 ${expectedVersion}，不会自动安装或降级`)
  }
  const { root, logs, agents } = paths
  for (const directory of [logs, agents]) await mkdir(directory, { recursive: true })
  if ((await run('/bin/chmod', ['700', logs], { cwd: bin, timeoutMs: 10000 })).code !== 0) throw new Error('不能保护日志目录')
  const log = join(logs, 'backend.log')
  if (!await exists(log)) await writeFile(log, '')
  if ((await run('/bin/chmod', ['600', log], { cwd: bin, timeoutMs: 10000 })).code !== 0) throw new Error('不能保护后台日志')
  const wrapper = join(root, 'bin/launch-backend.sh')
  await writeFile(wrapper, launchScript)
  await writeFile(join(agents, 'dev.dshbot.backend.plist'), `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict>
<key>Label</key><string>dev.dshbot.backend</string><key>ProgramArguments</key><array><string>/bin/sh</string><string>${xml(wrapper)}</string><string>${xml(cli)}</string><string>${xml(expectedVersion)}</string></array>
<key>EnvironmentVariables</key><dict><key>DSH_HOME</key><string>${xml(root)}</string><key>DSH_AGENTS_HOME</key><string>${xml(join(root, 'agents'))}</string></dict>
<key>RunAtLoad</key><false/><key>KeepAlive</key><dict><key>SuccessfulExit</key><false/></dict><key>ThrottleInterval</key><integer>10</integer>
<key>StandardOutPath</key><string>${xml(log)}</string><key>StandardErrorPath</key><string>${xml(log)}</string></dict></plist>`)
}
