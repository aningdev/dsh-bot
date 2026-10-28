import { mount, signal, Text } from 'nsh'
import { mkdir, readFile, stat, writeFile } from 'fs/promises'
import { join } from 'path'
import { run } from 'process'
import { installLegacyBackend } from '../frontend/infrastructure/host/legacy/installation'
import { expectedVersion, launchScript } from '../frontend/infrastructure/host/legacy/assets'
import { LegacyBackend } from '../frontend/application/backend/legacy-policy'
import { readLaunchLog } from '../frontend/infrastructure/host/legacy/discovery'

const result = signal('installing')
const setResult = (value: string) => result.set(value)
mount(() => <Text>{result()}</Text>)

void (async () => {
  const fixture = globalThis.process.env.DSH_BOTS_HOME
  if (!fixture) throw new Error('Missing isolated fixture root')
  const root = join(fixture, 'legacy & installation')
  const paths = { root: join(root, 'data'), logs: join(root, 'logs'), agents: join(root, 'agents') }
  await mkdir(paths.logs, { recursive: true })
  const log = join(paths.logs, 'backend.log')
  await writeFile(log, 'preserved existing log')
  const permissions = await run('/bin/chmod', ['777', paths.logs, log], { cwd: root, timeoutMs: 10000 })
  if (permissions.code !== 0) throw new Error('Fixture permission setup failed')
  await installLegacyBackend(paths)
  if (((await stat(paths.logs)).mode & 0o777) !== 0o700) throw new Error('Log directory permissions changed')
  if (((await stat(log)).mode & 0o777) !== 0o600) throw new Error('Log permissions changed')
  if (await readFile(log, 'utf8') !== 'preserved existing log') throw new Error('Existing log overwritten')
  if (await readFile(join(paths.root, 'bin/launch-backend.sh'), 'utf8') !== launchScript) throw new Error('Missing bundled startup script')
  const plist = await readFile(join(paths.agents, 'dev.dshbot.backend.plist'), 'utf8')
  if (!plist.includes('legacy &amp; installation') || !plist.includes('<key>RunAtLoad</key><false/>')) throw new Error('Invalid service artifacts')

  const largeLog = join(paths.logs, 'large.log')
  const endpoint = 'http://127.0.0.1:12345/?token=fixture_only'
  const seed = String.raw`/bin/dd if=/dev/zero bs=1048576 count=65 2>/dev/null > "$1" && printf '\n[launch current] pid=42 version=%s\ndsh web: %s\n' "$2" "$3" >> "$1"`
  const seeded = await run('/bin/sh', ['-c', seed, 'fixture', largeLog, expectedVersion, endpoint], { cwd: join(paths.root, 'bin'), timeoutMs: 10000 })
  if (seeded.code !== 0 || (await stat(largeLog)).size <= 64 * 1024 * 1024) throw new Error('Large log fixture setup failed')
  const backend = new LegacyBackend({
    readLog: () => readLaunchLog(largeLog),
    inspectJob: async () => 'pid = 42',
    install: async () => { throw new Error('Discovery must not install') },
    activate: async () => { throw new Error('Discovery must not activate') },
  }, expectedVersion)
  if (await backend.discover() !== endpoint) throw new Error('Large log discovery failed')
  setResult('legacy-installation-ready')
})().catch(error => setResult(`fixture-error: ${error instanceof Error ? error.message : String(error)}`))
