import { spawn } from 'node:child_process'
import { mkdir, readFile, readlink, rename, symlink, unlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export async function prepareRunner(): Promise<{ cli: string; home: string }> {
// Keep this product's profiles and credentials separate from the user's dsh home.
const home = resolve(process.env.DSH_BOT_HOME ?? join(homedir(), '.dsh-bot-nsh'))
const profile = join(home, 'profiles', 'dsh-bot')
const runtimeManifest = createRequire(import.meta.url).resolve('@dsh-bot/harness-runtime/package.json')
const runtimeRequire = createRequire(runtimeManifest)
const cli = runtimeRequire.resolve('@deepseek-ai/dsh/lib/bin.js')
await mkdir(join(profile, 'node_modules', '@dsh-bot'), { recursive: true, mode: 0o700 })
for (const [name, target] of [
  ['harness-runtime', dirname(runtimeManifest)],
  ['runner', fileURLToPath(new URL('../', import.meta.url))],
] as const) {
  try {
    await symlink(target, join(profile, 'node_modules', '@dsh-bot', name), 'dir')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    if (await readlink(join(profile, 'node_modules', '@dsh-bot', name)) !== target) {
      const temporary = join(profile, 'node_modules', '@dsh-bot', `${name}.${process.pid}`)
      await symlink(target, temporary, 'dir')
      try { await rename(temporary, join(profile, 'node_modules', '@dsh-bot', name)) }
      finally { await unlink(temporary).catch(error => { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }) }
    }
  }
}
const manifest = { private: true, dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@dsh-bot/harness-runtime', '@dsh-bot/runner'] } } }
const manifestPath = join(profile, 'package.json')
try { await readFile(manifestPath) } catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
}
return { cli, home }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
const { cli, home } = await prepareRunner()
const child = spawn(process.execPath, [cli, '--profile', 'dsh-bot'], {
  stdio: 'inherit', env: { ...process.env, DSH_HOME: home, DSH_BOT_HOME: home },
})
child.on('error', error => { console.error(error); process.exitCode = 1 })
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { child.kill(signal) })
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1) })
}
