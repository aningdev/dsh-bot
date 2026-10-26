import { spawn } from 'node:child_process'
import { mkdtemp, readFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const home = await realpath(await mkdtemp(join(tmpdir(), 'dsh-bot-ui-')))
const env = { ...process.env, DSH_BOT_HOME: home }
let runner: ReturnType<typeof spawn> | undefined
async function command(program: string, args: string[], cwd = process.cwd()) {
  const child = spawn(program, args, { cwd, env, stdio: 'inherit' })
  const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  if (code !== 0) throw new Error(`${program} 退出：${code}`)
}
try {
  await command('bun', ['run', '--cwd', 'apps/runner', 'build'])
  await command('bun', ['scripts/prepare-client.ts'])
  runner = spawn('node', [resolve('apps/runner/dist/index.js')], { env, stdio: 'inherit' })
  const deadline = Date.now() + 20_000
  while (true) {
    try { await readFile(join(home, 'connection.json')); break } catch {
      if (Date.now() > deadline) throw new Error('后台启动超时')
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  await command('nsh', ['test', 'Smoke.test.tsx', ...process.argv.slice(2)], resolve('apps/client'))
} finally {
  if (runner && runner.exitCode === null) {
    const stopped = new Promise(resolve => runner!.once('exit', resolve)); runner.kill('SIGTERM'); await stopped
  }
  await rm(home, { recursive: true, force: true })
  delete env.DSH_BOT_HOME
  await command('bun', ['scripts/prepare-client.ts'])
}
