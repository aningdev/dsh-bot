import { afterEach, beforeEach, expect, test } from 'bun:test'
import { mkdtemp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { BackendService, type ServiceAccess } from '../frontend/application/backend/service'
import { loadBot, loadBots, saveBot, updateBot } from '../frontend/application/bots/registry'
import { listRecords, readRecord, writeRecord } from '../frontend/infrastructure/storage/records'

let root: string
let previous: string | undefined
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'dsh-registry-'))
  previous = process.env.DSH_BOTS_HOME
  process.env.DSH_BOTS_HOME = root
})
afterEach(async () => {
  if (previous === undefined) delete process.env.DSH_BOTS_HOME
  else process.env.DSH_BOTS_HOME = previous
  await rm(root, { recursive: true, force: true })
})

test('registry preserves concurrent write order, atomically replaces records and leaves no temporary files', async () => {
  await Promise.all(Array.from({ length: 12 }, (_, index) => writeRecord('bot_a.json', JSON.stringify({ index }))))
  expect(JSON.parse(await readRecord('bot_a.json'))).toEqual({ index: 11 })
  expect(await readdir(root)).toEqual(['bot_a.json'])
  await expect(writeRecord('../escape.json', '{}')).rejects.toThrow('文件名不合法')
})

test('overlapping draft, rename, archive and Session updates preserve each other', async () => {
  await saveBot({
    id: 'bot_a', name: 'original', preset: 'default', model: { provider: '', model: '' },
    workspace: root, archived: false, createdAt: '2026-01-01T00:00:00Z',
  })
  await Promise.all([
    updateBot('bot_a', latest => ({ ...latest, draft: { text: 'new draft', state: 'typing' } })),
    updateBot('bot_a', latest => ({ ...latest, name: 'renamed' })),
    updateBot('bot_a', latest => ({ ...latest, archived: true })),
    updateBot('bot_a', latest => ({ ...latest, sessionId: 'sess_created' })),
  ])
  expect(await loadBot('bot_a')).toMatchObject({
    name: 'renamed', archived: true, sessionId: 'sess_created', draft: { text: 'new draft', state: 'typing' },
  })
  await expect(updateBot('bot_a', latest => ({ ...latest, id: 'different' }))).rejects.toThrow('不能更换标识')
  await updateBot('bot_a', latest => ({ ...latest, archived: false }))
  expect((await loadBot('bot_a'))?.draft?.text).toBe('new draft')
  await expect(updateBot('missing', latest => latest)).rejects.toThrow('不存在或已损坏')
  expect(await readdir(root)).toEqual(['bot_a.json'])
})

test('registry distinguishes missing records, corrupt JSON and filesystem failures', async () => {
  expect(await readRecord('missing.json')).toBe('')
  await writeRecord('broken.json', '{')
  expect(await loadBot('broken')).toBeUndefined()
  expect((await loadBots()).damaged).toEqual(['broken.json'])
  await mkdir(join(root, 'unreadable.json'))
  await expect(loadBot('unreadable')).rejects.toThrow()
  await expect(loadBots()).rejects.toThrow()
  await rm(root, { recursive: true })
  await writeFile(root, 'not a directory')
  await expect(listRecords()).rejects.toThrow()
})

function access(state: string, reachable = false) {
  const calls: string[] = []
  const adapter: ServiceAccess = {
    development: false,
    service: async operation => { calls.push(operation); return JSON.stringify({ status: state }) },
    legacyInstalled: async () => false,
    reachable: async () => reachable,
    activate: async () => { calls.push('activate'); reachable = true },
    stop: async () => { calls.push('stop') },
  }
  return { adapter, calls, service: new BackendService(adapter) }
}

test('read-only discovery neither registers nor reactivates a service', async () => {
  const absent = access('notRegistered')
  await expect(absent.service.prepare(false)).rejects.toThrow('请明确启动后台')
  expect(absent.calls).toEqual(['status'])
  const stopped = access('enabled')
  await expect(stopped.service.prepare(false)).rejects.toThrow('当前未运行')
  expect(stopped.calls).toEqual(['status'])
})

test('explicit startup checks registration and OS approval before activation', async () => {
  const pending = access('requiresApproval')
  await expect(pending.service.prepare(true)).rejects.toThrow('允许 DSH Bot 后台项目')
  expect(pending.calls).toEqual(['status'])
  const unregistered = access('notRegistered')
  unregistered.adapter.service = async operation => {
    unregistered.calls.push(operation)
    return JSON.stringify({ status: operation === 'register' ? 'requiresApproval' : 'notRegistered' })
  }
  await expect(unregistered.service.prepare(true)).rejects.toThrow('允许 DSH Bot 后台项目')
  expect(unregistered.calls).toEqual(['status', 'register'])
  const ready = access('enabled')
  await ready.service.prepare(true)
  expect(ready.calls).toEqual(['status', 'activate'])
})

test('unregister requires a confirmed stop, and old registration blocks new ownership', async () => {
  const running = access('notRegistered', true)
  running.adapter.stop = async () => { throw new Error('stop unconfirmed') }
  await expect(running.service.unregister()).rejects.toThrow('stop unconfirmed')
  expect(running.calls).toEqual([])
  const legacy = access('notRegistered')
  legacy.adapter.legacyInstalled = async () => true
  await expect(legacy.service.prepare(true)).rejects.toThrow('检测到旧后台服务')
  expect(legacy.calls).toEqual([])
})

test('development uses only its host socket and cannot unregister an App service', async () => {
  const development = access('notRegistered')
  development.adapter.development = true
  await development.service.prepare(false)
  await development.service.prepare(true)
  await expect(development.service.unregister()).rejects.toThrow('开发宿主未登记 App 后台服务')
  expect(development.calls).toEqual([])
  development.adapter.legacyInstalled = async () => true
  await expect(development.service.prepare(true)).rejects.toThrow('检测到旧后台服务')
  expect(development.calls).toEqual([])
})

test('unknown migration state and missing App components fail without activation', async () => {
  const unknown = access('enabled')
  unknown.adapter.legacyInstalled = async () => { throw new Error('无法确认旧后台的系统登记状态') }
  await expect(unknown.service.prepare(true)).rejects.toThrow('无法确认旧后台的系统登记状态')
  expect(unknown.calls).toEqual([])
  const missing = access('notRegistered')
  missing.adapter.service = async () => { throw new Error('当前构建没有系统服务组件') }
  await expect(missing.service.prepare(true)).rejects.toThrow('当前构建没有系统服务组件')
  expect(missing.calls).toEqual([])
})
