import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from './registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('切换当前模型写入后台，不改 Bot 默认模型；重开仍显示后台选择', async () => {
  const options = { width: 1400, height: 950, platform: 'macos' as const, network: 'live' as const }
  let app = await open('./bot-app-probe.tsx', options)
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '模型选择 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${await botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', '测试当前模型'); await app.press('id:send')
    await app.waitFor('text:Fixture session', { timeout: 15000 })
    const before = JSON.parse(await readRecord((await listRecords())[0]!))
    expect(visible(app, '当前对话模型')).toBe(true)
    expect(visible(app, '从下一个执行步骤生效')).toBe(true)
    await app.press('label:DeepSeek-V4-Pro（DeepSeek）')
    await app.waitUntil(() => visible(app, '模型已保存'), { timeout: 15000 })
    expect(visible(app, '模型：DeepSeek-V4-Pro')).toBe(true)
    expect(JSON.parse(await readRecord((await listRecords())[0]!)).model.model).toBe(before.model.model)
    app.dispose()
    app = await open('./bot-app-probe.tsx', options)
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.waitUntil(() => visible(app, '模型：DeepSeek-V4-Pro'), { timeout: 15000 })
  } finally { app.dispose() }
})
