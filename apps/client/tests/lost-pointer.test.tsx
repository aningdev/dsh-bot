import { expect, open, test } from 'nsh/test'

/**
 * 结果已收到但正式指针保存失败：指针落盘前不允许输入，修复后不重复创建。
 * Runs with DSH_E2E_FAULT=drop-pointer.
 */

import { botsRoot, listRecords, readRecord } from '../registry'

const workspace = `${botsRoot()}-workspace`

interface Record_ {
  name: string
  sessionId?: string
  initializing?: { startedAt: string; candidateSessionId: string; createdSessionId?: string }
  draft?: { text: string; state: string }
}

async function records(): Promise<Record_[]> {
  const result: Record_[] = []
  for (const name of listRecords()) result.push(JSON.parse(readRecord(name)) as Record_)
  return result
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

test('正式指针保存失败时阻止输入，修复后写入指针并可发送', async () => {
  const app = await open('../App.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('id:bot-new', { timeout: 30000 })
  await app.waitUntil(() => some(app.texts(), '后台已连接'), { timeout: 30000 })
  await app.press('id:bot-new')
  await app.type('id:bot-name', '指针失败 Bot')
  await enterWorkspace(app, workspace)
  await app.press('id:bot-save')
  await app.waitFor('label:指针失败 Bot', { timeout: 15000 })
  await app.waitFor('id:message-input', { timeout: 15000 })

  await app.type('id:message-input', '指针失败后的第一条')
  await app.waitUntil(() => some(app.texts(), '正式指针保存失败'), { timeout: 30000 })

  const pending = (await records()).find(item => item.name === '指针失败 Bot')!
  expect(pending.sessionId).toBe(undefined)
  expect(typeof pending.initializing?.createdSessionId).toBe('string')
  // 正式指针未落盘：输入被阻止
  expect(app.enabled('id:send')).toBe(false)
  expect(app.value('id:message-input')).toBe('指针失败后的第一条')

  await app.press('id:recheck')
  await eventually(app, async () => {
    const now = (await records()).find(item => item.name === '指针失败 Bot')!
    return now.sessionId !== undefined
  })
  const repaired = (await records()).find(item => item.name === '指针失败 Bot')!
  expect(repaired.sessionId).toBe(pending.initializing!.createdSessionId)
  expect(repaired.initializing).toBe(undefined)

  // 修复后可以发送，且没有再次创建对话
  await app.waitUntil(() => app.enabled('id:send'), { timeout: 15000 })
  await app.press('id:send')
  await app.waitUntil(() => some(app.texts(), 'Fixture session'), { timeout: 30000 })
  expect(some(app.texts(), '指针失败后的第一条')).toBe(true)
  app.dispose()
})
