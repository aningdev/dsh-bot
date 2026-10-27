import { spawn } from 'node:child_process'
import { cp, mkdir, readdir, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'

if (process.platform !== 'darwin') throw new Error('macOS 安装包须在 macOS 上构建')
async function run(program: string, args: string[]) {
  const child = spawn(program, args, { stdio: 'inherit' })
  const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  if (code !== 0) throw new Error(`${program} 退出：${code}`)
}
await run('bun', ['scripts/prepare-client.ts'])
const out = resolve('dist/macos')
await mkdir(out, { recursive: true })
await run('nsh', ['package', 'apps/client/App.tsx', '--target', 'macos', '--out', out])
const app = join(out, 'DSH Bot.app')
// NSH bundles only the client and native transport. Never copy Host/npm runtime.
const resources = join(app, 'Contents/Resources')
await cp('scripts/backend/pinned-version.json', join(resources, 'supported-dsh.json'))
await run('/usr/bin/codesign', ['--force', '--deep', '--sign', '-', app])
await run('/usr/bin/codesign', ['--verify', '--deep', '--strict', app])
console.info(`已生成 ${app}。客户端使用用户安装的官方 dsh；已作本机 ad-hoc 签名，未作正式签名或公证。`)
