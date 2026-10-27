import { readdir, access, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
const app = resolve('dist/macos/DSH Bot.app')
const resources = join(app, 'Contents/Resources')
await access(join(app, 'Contents/MacOS'))
await access(join(resources, 'supported-dsh.json'))
async function inspect(path: string): Promise<void> {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (['Runner.app', 'node_modules', 'harness-runtime', 'service.js', 'node-launcher.sh'].includes(entry.name)) throw new Error(`成品含旧运行时：${join(path, entry.name)}`)
    if (entry.isDirectory()) await inspect(join(path, entry.name))
  }
}
await inspect(app)
const result = Bun.spawn(['/usr/bin/codesign', '--verify', '--deep', '--strict', app], { stdout: 'inherit', stderr: 'inherit' })
if (await result.exited !== 0) throw new Error('成品签名验证失败')
console.log(`PASS：客户端成品存在、签名有效、无旧 Runner/Host npm 包。官方后台版本 ${JSON.parse(await readFile(join(resources, 'supported-dsh.json'), 'utf8')).release}`)
