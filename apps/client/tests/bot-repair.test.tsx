import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('错误工作区保留未就绪 Bot，可修复并初始化，草稿不丢失', async () => {
  const app = await open('../App.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '工作区修复 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${botsRoot()}-missing-directory`)
    await app.press('id:bot-save')
    await app.type('id:message-input', '修复后再发送'); await app.press('id:send')
    await app.waitUntil(() => visible(app, '工作区不是可用的绝对目录'), { timeout: 10000 })
    const invalid = JSON.parse(readRecord(listRecords()[0]!))
    expect(invalid.initializing).toBe(undefined)
    expect(invalid.sessionId).toBe(undefined)
    const preset = app.value('id:repair-preset')!
    await app.clear('id:repair-workspace'); await app.type('id:repair-workspace', `${botsRoot()}-workspace`)
    await app.clear('id:repair-preset'); await app.type('id:repair-preset', 'missing-repair-preset')
    await app.press('id:repair-save')
    await app.waitUntil(() => visible(app, '后台模板目录中没有'), { timeout: 10000 })
    expect(JSON.parse(readRecord(listRecords()[0]!)).initializing).toBe(undefined)
    expect(app.shows('id:repair-preset')).toBe(true)
    await app.clear('id:repair-preset'); await app.type('id:repair-preset', preset)
    await app.press('id:repair-save')
    await app.waitUntil(() => visible(app, '对话标识：sess_'), { timeout: 15000 })
    expect(app.value('id:message-input')).toBe('修复后再发送')
    await app.press('id:send')
    await app.waitFor('text:Fixture session', { timeout: 10000 })
  } finally { app.dispose() }
})
