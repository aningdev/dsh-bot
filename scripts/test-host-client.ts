import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm, access, realpath, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { homedir } from 'node:os'

async function run(program: string, args: string[], env = process.env): Promise<number> {
  const child = spawn(program, args, { stdio: 'inherit', env, cwd: resolve('apps/client') })
  return new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)) })
}
const build = Bun.spawn(['cargo', 'build', '--manifest-path', 'apps/host/Cargo.toml'], { stdout: 'inherit', stderr: 'inherit' })
if (await build.exited !== 0) throw new Error('Host build failed')
const cliPath = Bun.which('dsh')
if (!cliPath) throw new Error('未安装官方 dsh')
const version = JSON.parse(await readFile('apps/host/supported-dsh.json', 'utf8')).release
const root = await mkdtemp('/tmp/dsh-native-')
const fixtureParent = join(homedir(), '.dsh-bot-e2e')
await mkdir(fixtureParent, { recursive: true })
const fixtureRoot = await mkdtemp(join(fixtureParent, 'host-client-'))
const bots = join(fixtureRoot, 'bots')
await mkdir(join(root, 'logs'), { recursive: true })
const child = spawn(resolve('target/debug/dsh-host'), ['serve', '--data-root', root, '--dsh', await realpath(cliPath), '--logs', join(root, 'logs'), '--version', version, '--startup-ms', '30000'], { stdio: ['ignore', 'ignore', 'inherit'] })
const exited = new Promise<void>(resolve => child.once('exit', () => resolve()))
try {
  const socket = join(root, 'host/control.sock')
  const deadline = Date.now() + 5000
  while (true) {
    try { await access(socket); break } catch { if (Date.now() > deadline || child.exitCode !== null) throw new Error('宿主未启动'); await Bun.sleep(25) }
  }
  const code = await run('nsh', ['test', 'tests/host-control.test.tsx', '--verbose'], { ...process.env, DSH_HOST_SOCKET: socket, DSH_BOTS_HOME: bots })
  if (code !== 0) throw new Error(`NSH host integration failed (${code})`)
} finally {
  child.kill('SIGTERM')
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([exited, new Promise<never>((_, reject) => { timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error('Host cleanup timeout')) }, 15000) })])
  } finally { clearTimeout(timer) }
  await rm(root, { recursive: true, force: true })
  await rm(fixtureRoot, { recursive: true, force: true })
}
