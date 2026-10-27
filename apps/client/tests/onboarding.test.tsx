import { expect, open, test } from 'nsh/test'
import { listRecords, readRecord } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))

test('无凭据时明确引导配置，保存后可在原 Bot 选模型并发送原草稿', async () => {
  const app = await open('../App.tsx', { width: 1600, height: 1100, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '首次配置 Bot')
    await app.press('id:bot-save')
    await app.type('id:message-input', '你好')
    const file = listRecords()[0]!
    const before = JSON.parse(readRecord(file))
    expect(before.sessionId).toBe(undefined)
    expect(visible(app, '模型：/')).toBe(false)
    expect(app.shows('id:configure-model')).toBe(true)
    await app.press('id:configure-model')
    await app.waitFor('id:provider-deepseek-official', { timeout: 15000 })
    await app.press('id:provider-deepseek-official')
    await app.type('id:credential-value', 'nsh-fixture-key')
    await app.press('id:settings-save')
    await app.waitUntil(() => visible(app, '已保存并重新读取'), { timeout: 15000 })
    await app.press('id:settings-close')
    expect(app.value('id:message-input')).toBe('你好')
    await app.waitFor('id:select-model-deepseek-official-deepseek-flash', { timeout: 15000 })
    await app.press('id:select-model-deepseek-official-deepseek-flash')
    await app.waitUntil(() => visible(app, '对话标识：sess_'), { timeout: 15000 })
    expect(app.value('id:repair-model')).toBe(undefined)
    expect(app.value('id:message-input')).toBe('你好')
    expect(JSON.parse(readRecord(file)).id).toBe(before.id)
    await app.press('id:send')
    await app.waitFor('text:Fixture session', { timeout: 15000 })
    expect(visible(app, '后台没有可用的模型')).toBe(false)
  } finally { app.dispose() }
})
