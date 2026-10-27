import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('发送响应丢失后保留未知输入，核对后台后消除重发风险', async () => {
  const app = await open('../App.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '未知发送 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', '这条输入已经由后台接纳'); await app.press('id:send')
    await app.waitUntil(() => visible(app, '提交结果未知'), { timeout: 30000 })
    expect(app.enabled('id:send')).toBe(false)
    const saved = JSON.parse(readRecord(listRecords()[0]!))
    expect(saved.draft.state).toBe('unknown')
    await app.press('id:recheck')
    await app.waitUntil(() => visible(app, '后台已接纳该输入'), { timeout: 15000 })
    expect(JSON.parse(readRecord(listRecords()[0]!)).draft).toBe(undefined)
    await app.waitFor('text:Fixture session', { timeout: 15000 })
    expect(app.texts().filter(text => text === '这条输入已经由后台接纳').length).toBe(1)
  } finally { app.dispose() }
})
