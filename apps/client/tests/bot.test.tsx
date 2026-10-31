import { expect, open, test } from 'nsh/test'

/**
 * Drives the real client against an isolated official `dsh web` (started by
 * `tests/e2e.ts`) with an external deterministic Messages fixture.
 */

import { botsRoot, listRecords, readRecord, writeRecord } from './registry'

const workspace = async () => `${await botsRoot()}-workspace`

interface Record_ {
  id: string
  name: string
  preset: string
  model: { provider: string; model: string }
  workspace: string
  archived: boolean
  sessionId?: string
  initializing?: { startedAt: string; candidateSessionId: string; createdSessionId?: string }
  draft?: { text: string; requestId?: string; state: string }
}

async function records(): Promise<Record_[]> {
  const result: Record_[] = []
  for (const name of await listRecords()) result.push(JSON.parse(await readRecord(name)) as Record_)
  return result.sort((left, right) => left.name.localeCompare(right.name))
}

async function record(name: string): Promise<Record_> {
  const found = (await records()).find(item => item.name === name)
  if (!found) throw new Error(`没有找到 Bot 注册表记录：${name}`)
  return found
}

async function eventually(app: { wait(ms: number): Promise<void> }, check: () => Promise<boolean>, timeout = 30000): Promise<void> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await check()) return
    await app.wait(200)
  }
  throw new Error('等待条件超时')
}

async function enterWorkspace(app: { clear(selector: string): Promise<void>; type(selector: string, text: string): Promise<void> }, path: string): Promise<void> {
  await app.clear('id:bot-workspace')
  await app.type('id:bot-workspace', path)
}

function some(texts: string[], needle: string): boolean {
  return texts.some(text => text.includes(needle))
}

test('a) 保存 Bot 注册表并落盘，字段与表单一致', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('id:bot-new', { timeout: 30000 })
  await app.waitUntil(() => some(app.texts(), '后台已连接'), { timeout: 30000 })
  await app.press('id:bot-new')
  await app.type('id:bot-name', '测试 Bot')
  await enterWorkspace(app, await workspace())
  await app.press('id:bot-save')
  await app.waitFor('label:测试 Bot', { timeout: 15000 })

  const saved = await record('测试 Bot')
  expect(saved.name).toBe('测试 Bot')
  expect(saved.workspace).toBe(await workspace())
  expect(saved.archived).toBe(false)
  expect(saved.preset.length > 0).toBe(true)
  expect(saved.model.provider.length > 0).toBe(true)
  expect(saved.model.model.length > 0).toBe(true)
  await eventually(app, async () => (await record('测试 Bot')).sessionId !== undefined)

  // 保存后自动打开：就绪 Bot 不必发送第一条消息即可初始化
  expect(app.shows('id:recheck')).toBe(true)
  expect(app.shows('id:bot-new')).toBe(true)
  app.dispose()
})

test('b) 已初始化的唯一对话显示用户消息与 Agent 文本', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('label:测试 Bot', { timeout: 30000 })
  await app.press('label:测试 Bot')
  await app.waitFor('id:message-input', { timeout: 15000 })
  await app.type('id:message-input', '你好，测试初始化')
  await app.press('id:send')

  await eventually(app, async () => (await record('测试 Bot')).sessionId !== undefined)
  const saved = await record('测试 Bot')
  expect(saved.sessionId!.startsWith('sess_')).toBe(true)
  expect(saved.initializing).toBe(undefined)
  expect(saved.draft).toBe(undefined)

  await app.waitFor('text:Fixture session', { timeout: 30000 })
  expect(some(app.texts(), '你好，测试初始化')).toBe(true)
  expect(some(app.texts(), 'Fixture session')).toBe(true)
  // 注入的运行时上下文属于模型提示，不是对话内容
  expect(some(app.texts(), 'Current runtime context')).toBe(false)
  expect(some(app.texts(), 'Time sampled while preparing')).toBe(false)
  app.dispose()
})

test('c) 关闭重开恢复同一对话与未发送草稿，且不重放 prompt', async () => {
  const before = await record('测试 Bot')
  const first = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await first.waitFor('text:你好，测试初始化', { timeout: 30000 })
  await first.type('id:message-input', '未发送的草稿')
  await eventually(first, async () => (await record('测试 Bot')).draft?.text === '未发送的草稿')
  first.dispose()

  const second = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await second.waitFor('text:你好，测试初始化', { timeout: 30000 })
  await eventually(second, async () => second.value('id:message-input') === '未发送的草稿', 15000)
  expect(second.value('id:message-input')).toBe('未发送的草稿')

  const after = await record('测试 Bot')
  expect(after.sessionId).toBe(before.sessionId)
  expect(after.draft?.text).toBe('未发送的草稿')
  expect(after.draft?.state).toBe('typing')

  // 没有重放：用户消息只出现一次
  expect(second.texts().filter(text => text === '你好，测试初始化').length).toBe(1)

  // 初始化后模板与工作区固定，改名不影响对话指针
  await second.clear('id:bot-rename')
  await second.type('id:bot-rename', '改名后的 Bot')
  await second.press('id:bot-rename-save')
  await eventually(second, async () => (await record('改名后的 Bot')).sessionId === before.sessionId)
  const renamed = await record('改名后的 Bot')
  expect(renamed.preset).toBe(before.preset)
  expect(renamed.workspace).toBe(before.workspace)
  second.dispose()
})

test('e1) 模板缺失时显示明确原因并阻止发送', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('id:bot-new', { timeout: 30000 })
  await app.waitUntil(() => some(app.texts(), '后台已连接'), { timeout: 30000 })
  await app.press('id:bot-new')
  await app.type('id:bot-name', '模板缺失 Bot')
  await app.clear('id:bot-preset')
  await app.type('id:bot-preset', 'missing-preset-for-e2e')
  await app.press('id:bot-save')
  await app.waitFor('label:模板缺失 Bot', { timeout: 15000 })
  await app.waitFor('id:message-input', { timeout: 15000 })
  await app.type('id:message-input', '这条消息不应发出')
  await app.press('id:send')

  await app.waitUntil(() => some(app.texts(), '后台模板目录中没有'), { timeout: 20000 })
  const saved = await record('模板缺失 Bot')
  expect(saved.sessionId).toBe(undefined)
  expect(saved.initializing).toBe(undefined)
  expect(app.value('id:message-input')).toBe('这条消息不应发出')
  app.dispose()
})

test('e2) 恢复失败分类显示、保留原指针并阻止发送', async () => {
  const healthy = (await records()).find(item => typeof item.sessionId === 'string')!
  const broken = {
    id: 'bot_broken',
    name: '损坏指针 Bot',
    preset: healthy.preset,
    model: healthy.model,
    workspace: await workspace(),
    archived: false,
    createdAt: new Date().toISOString(),
    sessionId: 'sess_does_not_exist_in_backend',
  }
  await writeRecord('bot_broken.json', JSON.stringify(broken, null, 2) + '\n')

  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('label:损坏指针 Bot', { timeout: 30000 })
  await app.press('label:损坏指针 Bot')
  await app.waitUntil(() => some(app.texts(), '对话无法恢复'), { timeout: 20000 })
  expect(some(app.texts(), '登记指针已保留')).toBe(true)
  expect(some(app.texts(), 'sess_does_not_exist_in_backend')).toBe(true)

  await app.type('id:message-input', '恢复失败时不应发出')
  expect(app.enabled('id:send')).toBe(false)

  const still = JSON.parse(await readRecord('bot_broken.json')) as Record_
  expect(still.sessionId).toBe('sess_does_not_exist_in_backend')
  expect(still.initializing).toBe(undefined)
  app.dispose()
})
