import { expect, open, test } from 'nsh/test'

test('native user flow creates Bot and fixed conversation', async () => {
  const app = await open('./App.tsx', { width: 1200, height: 850, platform: 'macos', network: 'live' })
  await app.waitFor('text:后台已连接', { timeout: 15_000 })
  await app.type('label:Bot 名称', '验收 Bot')
  await app.press('text:保存 Bot')
  await app.waitFor('text:已保存；新的默认配置用于新会话')
  await app.press('text:新建会话')
  await app.waitFor('text:会话已创建')
  expect(app.texts()).toContain('● 新会话 1')
})
