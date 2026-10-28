import { expect, open, test } from 'nsh/test'

/**
 * d) 后台已创建但结果丢失：重试必须先核对后台，绝不重复创建。
 * Runs with DSH_E2E_FAULT=drop-create-result.
 */

import { botsRoot, listRecords, readRecord } from './registry'

const workspace = async () => `${await botsRoot()}-workspace`

interface Record_ {
  name: string
  workspace: string
  sessionId?: string
  initializing?: { startedAt: string; candidateSessionId: string; createdSessionId?: string }
  draft?: { text: string; state: string }
}

async function records(): Promise<Record_[]> {
  const result: Record_[] = []
  for (const name of await listRecords()) result.push(JSON.parse(await readRecord(name)) as Record_)
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

test('d) 创建结果丢失后，重试核对后台并复用同一个对话', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 900, platform: 'macos', network: 'live' })
  await app.waitFor('id:bot-new', { timeout: 30000 })
  await app.waitUntil(() => some(app.texts(), '后台已连接'), { timeout: 30000 })
  await app.press('id:bot-new')
  await app.type('id:bot-name', '结果丢失 Bot')
  await enterWorkspace(app, await workspace())
  await app.press('id:bot-save')
  await app.waitFor('label:结果丢失 Bot', { timeout: 15000 })
  await app.waitFor('id:message-input', { timeout: 15000 })

  // 失败前先写意图：候选标识可用于复用，绝不会重复创建
  await app.type('id:message-input', '首次发送')
  await app.waitUntil(() => some(app.texts(), '初始化结果未知'), { timeout: 30000 })

  const lost = (await records()).find(item => item.name === '结果丢失 Bot')!
  expect(lost.sessionId).toBe(undefined)
  expect(typeof lost.initializing?.candidateSessionId).toBe('string')
  const candidate = lost.initializing!.candidateSessionId

  // 结果未知时不能直接发送
  expect(app.enabled('id:send')).toBe(false)
  expect(app.value('id:message-input')).toBe('首次发送')

  // 修复：先核对后台，再写入正式指针
  await app.press('id:recheck')
  await eventually(app, async () => {
    const now = (await records()).find(item => item.name === '结果丢失 Bot')!
    return now.sessionId !== undefined
  })
  const repaired = (await records()).find(item => item.name === '结果丢失 Bot')!
  expect(repaired.sessionId).toBe(candidate)
  expect(repaired.initializing).toBe(undefined)
  await app.waitUntil(() => some(app.texts(), '已复用后台已创建的对话'), { timeout: 15000 })
  app.dispose()
})
