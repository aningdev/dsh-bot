import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('切换当前模型写入后台，不改 Bot 默认模型；重开仍显示后台选择', async () => {
  const options = { width: 1400, height: 950, platform: 'macos' as const, network: 'live' as const }
  let app = await open('../App.tsx', options)
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '模型选择 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', '测试当前模型'); await app.press('id:send')
    await app.waitFor('text:Fixture session', { timeout: 15000 })
    const before = JSON.parse(readRecord(listRecords()[0]!))
    await app.press('label:DeepSeek-V4-Pro')
    await app.waitUntil(() => visible(app, '模型已保存'), { timeout: 15000 })
    expect(visible(app, '模型：DeepSeek-V4-Pro')).toBe(true)
    expect(JSON.parse(readRecord(listRecords()[0]!)).model.model).toBe(before.model.model)
    app.dispose()
    app = await open('../App.tsx', options)
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.waitUntil(() => visible(app, '模型：DeepSeek-V4-Pro'), { timeout: 15000 })
  } finally { app.dispose() }
})
