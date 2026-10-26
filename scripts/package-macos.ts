import { spawn } from 'node:child_process'
import { cp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'

if (process.platform !== 'darwin') throw new Error('macOS 安装包须在 macOS 上构建')
const root = process.cwd(), out = resolve('dist/macos')
async function command(program: string, args: string[]) {
  const child = spawn(program, args, { stdio: 'inherit' })
  const code = await new Promise<number | null>((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  if (code !== 0) throw new Error(`${program} 退出：${code}`)
}
const template = await readFile('apps/client/nsh.config.json', 'utf8')
await writeFile('apps/client/nsh.json', template)
const launcher = await readFile('scripts/node-launcher.sh', 'utf8')
await writeFile('apps/client/launch.json', JSON.stringify({ packaged: true, home: '', launcher, service: '' }))
try {
  await command('bun', ['run', '--cwd', 'apps/runner', 'build'])
  await command('nsh', ['package', 'apps/client/App.tsx', '--target', 'macos', '--out', out])
  const app = join(out, 'DSH Bot.app')
  const helper = join(app, 'Contents/Resources/nsh/Runner.app')
  const contents = join(helper, 'Contents'), runtime = join(contents, 'Resources/runtime')
  await rm(helper, { recursive: true, force: true })
  await mkdir(join(contents, 'MacOS'), { recursive: true })
  await mkdir(runtime, { recursive: true })
  await cp('scripts/node-launcher.sh', join(runtime, 'node-launcher.sh'))
  await writeFile(join(runtime, 'package.json'), '{"private":true,"type":"module"}\n')
  // Copy the installed dependency closure, preserving lockfile-selected versions.
  const seen = new Set<string>()
  async function copyPackage(source: string): Promise<void> {
    source = await realpath(source)
    if (seen.has(source)) return
    seen.add(source)
    const location = relative(root, source)
    if (location.startsWith('..')) throw new Error(`依赖位于仓库外：${source}`)
    const target = join(runtime, location)
    const manifest = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'))
    if (location.startsWith('apps/') || location.startsWith('packages/')) {
      await mkdir(target, { recursive: true })
      await cp(join(source, 'package.json'), join(target, 'package.json'))
      await cp(join(source, 'cordis.patch.yml'), join(target, 'cordis.patch.yml'))
      if (location.startsWith('apps/')) await cp(join(source, 'dist'), join(target, 'dist'), { recursive: true })
      const alias = join(runtime, 'node_modules', manifest.name)
      await mkdir(dirname(alias), { recursive: true })
      await symlink(relative(dirname(alias), target), alias, 'dir')
    } else {
      await cp(source, target, { recursive: true, filter: path => path === source || !relative(source, path).split('/').includes('node_modules') })
    }
    const dependencies = { ...manifest.dependencies, ...manifest.optionalDependencies, ...manifest.peerDependencies }
    for (const name of Object.keys(dependencies)) {
      let found: string | undefined
      for (let directory = source; ; directory = dirname(directory)) {
        try { found = dirname(await realpath(join(directory, 'node_modules', name, 'package.json'))); break } catch {}
        if (directory === root || dirname(directory) === directory) break
      }
      if (!found) {
        if (name in (manifest.optionalDependencies ?? {}) || manifest.peerDependenciesMeta?.[name]?.optional) continue
        throw new Error(`缺少依赖：${manifest.name} -> ${name}`)
      }
      await copyPackage(found)
    }
  }
  await copyPackage(resolve('apps/runner'))
  await writeFile(join(contents, 'Info.plist'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>CFBundleExecutable</key><string>Runner</string><key>CFBundleIdentifier</key><string>dev.dshbot.runner</string><key>CFBundleName</key><string>DSH Bot Runner</string><key>CFBundlePackageType</key><string>APPL</string><key>CFBundleVersion</key><string>1</string><key>LSUIElement</key><true/></dict></plist>`)
  await writeFile(join(contents, 'MacOS/Runner'), '#!/bin/sh\nrunner_contents=$(CDPATH= cd -- "$(/usr/bin/dirname -- "$0")/.." && pwd)\nexec /bin/sh "$runner_contents/Resources/runtime/node-launcher.sh" start "$runner_contents/Resources/runtime/apps/runner/dist/service.js"\n', { mode: 0o755 })
  await command('/usr/bin/codesign', ['--force', '--deep', '--sign', '-', helper])
  await command('/usr/bin/codesign', ['--force', '--deep', '--sign', '-', app])
  await command('/usr/bin/codesign', ['--verify', '--deep', '--strict', app])
  console.info(`已组装 ${app}；使用用户本机 Node，${seen.size} 个运行时包。`)
} finally {
  await command('bun', ['scripts/prepare-client.ts'])
}
