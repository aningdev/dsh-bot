import { expect, test } from 'bun:test'
import { LegacyBackend, type LegacyAccess } from '../frontend/application/backend/legacy-policy'

const version = 'verified-release'
const ready = 'http://127.0.0.1:12345/?token=test_only'
function fixture(log = `[launch now] pid=42 version=${version}\ndsh web: ${ready}\n`) {
  const calls: string[] = []
  const access: LegacyAccess = {
    readLog: async () => { calls.push('log'); return log },
    inspectJob: async () => { calls.push('inspect'); return 'state = running\n\tpid = 42\n' },
    install: async () => { calls.push('install') },
    activate: async () => { calls.push('activate') },
  }
  return { calls, access, backend: new LegacyBackend(access, version) }
}

test('legacy discovery only accepts the running PID, supported version and latest launch marker', async () => {
  const current = fixture()
  expect(await current.backend.discover()).toBe(ready)
  expect(current.calls).toEqual(['log', 'inspect'])
  for (const marker of ['pid=41 version=verified-release', 'pid=42 version=other', 'pid=42 version=verified-release-extra']) {
    await expect(fixture(`[launch old] ${marker}\ndsh web: ${ready}`).backend.discover()).rejects.toThrow('未确认')
  }
  await expect(fixture(`[launch old] pid=42 version=${version}\ndsh web: ${ready}\n[launch new] pid=42 version=${version}`).backend.discover()).rejects.toThrow('未确认')
})

test('legacy discovery preserves filesystem errors and never installs or starts a job', async () => {
  const missing = fixture()
  missing.access.inspectJob = async () => undefined
  await expect(missing.backend.discover()).rejects.toThrow('尚未启动')
  const unreadable = fixture()
  unreadable.access.readLog = async () => { throw new Error('EACCES: unreadable log') }
  await expect(unreadable.backend.discover()).rejects.toThrow('EACCES')
  expect([...missing.calls, ...unreadable.calls].some(call => ['install', 'activate'].includes(call))).toBe(false)
})

test('explicit legacy startup is shared by concurrent callers and can retry a failed installation', async () => {
  const run = fixture()
  let running = false
  let attempts = 0
  run.access.inspectJob = async () => running ? 'pid = 42' : undefined
  run.access.install = async () => {
    run.calls.push('install')
    if (++attempts === 1) throw new Error('version incompatible')
  }
  run.access.activate = async () => { run.calls.push('activate'); running = true }
  const first = run.backend.start()
  expect(run.backend.start()).toBe(first)
  await expect(first).rejects.toThrow('version incompatible')
  await Promise.all([run.backend.start(), run.backend.start()])
  expect(run.calls.filter(call => call === 'install')).toHaveLength(2)
  expect(run.calls.filter(call => call === 'activate')).toHaveLength(1)
})

test('starting an already discovered current backend does not install or activate a job', async () => {
  const run = fixture()
  await run.backend.start()
  expect(run.calls).toEqual(['log', 'inspect'])
})
