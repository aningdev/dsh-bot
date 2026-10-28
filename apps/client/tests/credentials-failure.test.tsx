import { expect, open, test } from 'nsh/test'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
/** The driver makes the isolated credentials document unwritable as a file. */
test('配置成功、凭据写入失败时分别报告状态并清空密钥，不补偿删除配置', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1600, height: 1100, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.press('id:model-settings')
    await app.waitFor('id:provider-deepseek-official', { timeout: 15000 })
    await app.press('id:provider-deepseek-official')
    await app.clear('id:provider-endpoint'); await app.type('id:provider-endpoint', 'http://127.0.0.1:1/partial-save')
    await app.type('id:credential-value', 'fixture-secret-that-must-not-appear')
    await app.press('id:settings-save')
    await app.waitUntil(() => visible(app, '配置已保存，密钥提交未确认'), { timeout: 15000 })
    expect(app.value('id:credential-value')).toBe('')
    expect(app.texts().join('\n').includes('fixture-secret-that-must-not-appear')).toBe(false)
    await app.press('id:settings-refresh')
    await app.waitUntil(() => visible(app, '已重新读取当前后台配置'), { timeout: 10000 })
    expect(app.value('id:provider-endpoint')).toBe('http://127.0.0.1:1/partial-save')
  } finally { app.dispose() }
})
