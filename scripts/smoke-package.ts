import { readdir, access, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
const app = resolve('dist/macos/DSH Bot.app')
const resources = join(app, 'Contents/Resources')
await access(join(app, 'Contents/MacOS'))
const host = join(app, 'Contents/Library/LaunchServices/dsh-host')
const service = join(app, 'Contents/Frameworks/libdshservice.dylib')
const agent = join(app, 'Contents/Library/LaunchAgents/dev.dsh-bot.host.plist')
for (const path of [host, service, agent, join(resources, 'supported-dsh.json')]) await access(path)
const plist = Bun.spawnSync(['/usr/bin/plutil', '-convert', 'json', '-o', '-', agent])
if (plist.exitCode !== 0) throw new Error('Host 服务配置无效')
const configuration = JSON.parse(plist.stdout.toString())
if (configuration.Label !== 'dev.dsh-bot.host' || configuration.BundleProgram !== 'Contents/Library/LaunchServices/dsh-host'
  || JSON.stringify(configuration.ProgramArguments) !== JSON.stringify(['dsh-host', 'serve-app'])) throw new Error('Host 服务入口不正确')
const version = JSON.parse(await readFile(join(resources, 'supported-dsh.json'), 'utf8')).release
if (version !== JSON.parse(await readFile('apps/host/supported-dsh.json', 'utf8')).release) throw new Error('成品与 Host 的支持版本不一致')
async function inspect(path: string): Promise<void> {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (['Runner.app', 'node_modules', 'harness-runtime', 'service.js', 'node-launcher.sh', 'launch.sh', 'dev.dshbot.backend.plist', 'dsh-service'].includes(entry.name)) throw new Error(`成品含旧运行时：${join(path, entry.name)}`)
    if (entry.isDirectory()) await inspect(join(path, entry.name))
  }
}
await inspect(app)
const result = Bun.spawn(['/usr/bin/codesign', '--verify', '--deep', '--strict', app], { stdout: 'inherit', stderr: 'inherit' })
if (await result.exited !== 0) throw new Error('成品签名验证失败')
console.log(`PASS：客户端、Rust Host 与系统服务组件齐全，服务入口和版本一致，签名有效，无旧运行时或 shell 后台入口。官方后台版本 ${version}；实际系统服务启动仍须单独验收。`)
