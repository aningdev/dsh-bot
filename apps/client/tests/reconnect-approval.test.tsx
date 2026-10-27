import { expect, open, test } from 'nsh/test'
import { botsRoot } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('关闭客户端后后台保留审批，重开恢复后可拒绝', async () => {
  const options = { width: 1400, height: 950, platform: 'macos' as const, network: 'live' as const }
  let app = await open('../App.tsx', options)
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '审批恢复 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', 'NSH_APPROVAL_PROBE'); await app.press('id:send')
    await app.waitFor('id:reject', { timeout: 15000 })
    app.dispose()
    app = await open('../App.tsx', options)
    await app.waitFor('id:reject', { timeout: 15000 })
    await app.press('id:reject')
    await app.waitFor('text:NSH_APPROVAL_REJECTED', { timeout: 10000 })
    expect(visible(app, 'NSH_APPROVAL_REJECTED')).toBe(true)
  } finally { app.dispose() }
})
