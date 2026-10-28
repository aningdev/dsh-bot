import { spawn } from 'node:child_process'
import { cp, mkdir, rm, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'

if (process.platform !== 'darwin') throw new Error('macOS 安装包须在 macOS 上构建')
async function run(program: string, args: string[], env = process.env) {
  const child = spawn(program, args, { stdio: 'inherit', env })
  const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  if (code !== 0) throw new Error(`${program} 退出：${code}`)
}
await run('bun', ['scripts/prepare-client.ts'])
const signingIdentity = process.env.DSH_CODESIGN_IDENTITY?.trim() || '-'
const out = resolve('dist/macos')
await mkdir(out, { recursive: true })
await run('nsh', ['package', 'apps/client/App.tsx', '--target', 'macos', '--out', out])
const app = join(out, 'DSH Bot.app')
const resources = join(app, 'Contents/Resources')
const info = await readFile(join(app, 'Contents/Info.plist'), 'utf8')
const minimum = /<key>LSMinimumSystemVersion<\/key>\s*<string>([0-9.]+)<\/string>/.exec(info)?.[1]
if (!minimum) throw new Error('App 未声明最低 macOS 版本')
await run('cargo', ['build', '--release', '--manifest-path', 'apps/host/Cargo.toml'], { ...process.env, MACOSX_DEPLOYMENT_TARGET: minimum })
const launchServices = join(app, 'Contents/Library/LaunchServices')
const launchAgents = join(app, 'Contents/Library/LaunchAgents')
await mkdir(launchServices, { recursive: true })
await mkdir(launchAgents, { recursive: true })
await cp('target/release/dsh-host', join(launchServices, 'dsh-host'))
await cp('apps/host/macos/dev.dsh-bot.host.plist', join(launchAgents, 'dev.dsh-bot.host.plist'))
const frameworks = join(app, 'Contents/Frameworks')
await mkdir(frameworks, { recursive: true })
await rm(join(app, 'Contents/MacOS/dsh-service'), { force: true })
const service = join(frameworks, 'libdshservice.dylib')
const architecture = process.arch === 'arm64' ? 'arm64' : process.arch === 'x64' ? 'x86_64' : null
if (!architecture) throw new Error(`不支持的 macOS 架构：${process.arch}`)
await run('/usr/bin/swiftc', ['-emit-library', '-O', '-target', `${architecture}-apple-macos${minimum}`, 'apps/host/macos/service.swift', '-framework', 'ServiceManagement', '-o', service])
for (const path of [join(launchServices, 'dsh-host'), service]) {
  await run('/usr/bin/codesign', ['--force', '--sign', signingIdentity, path])
}
await cp('apps/host/supported-dsh.json', join(resources, 'supported-dsh.json'))
await run('/usr/bin/codesign', ['--force', '--deep', '--sign', signingIdentity, app])
await run('/usr/bin/codesign', ['--verify', '--deep', '--strict', app])
console.info(`已生成 ${app}。客户端使用用户安装的官方 dsh；${signingIdentity === '-' ? '仅作本机 ad-hoc 签名，不能据此确认应用关联服务可启动' : '已使用指定身份签名，仍需系统服务及签名验收'}，未公证。`)
