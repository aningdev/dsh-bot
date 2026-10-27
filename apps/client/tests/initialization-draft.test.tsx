import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from '../registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
const record = () => { const file = listRecords()[0]; return file ? JSON.parse(readRecord(file)) : undefined }
test('首次打开自动初始化，期间输入的新草稿在提交指针和重开后保留', async () => {
  const app = await open('../App.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '初始化草稿 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.waitUntil(() => !!record()?.initializing, { timeout: 10000 })
    await app.type('id:message-input', '初始化期间编辑的新草稿')
    await app.waitUntil(() => !!record()?.sessionId, { timeout: 15000 })
    expect(record().draft?.text).toBe('初始化期间编辑的新草稿')
  } finally { app.dispose() }
  const reopened = await open('../App.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await reopened.waitUntil(() => reopened.value('id:message-input') === '初始化期间编辑的新草稿', { timeout: 15000 })
    expect(record().draft?.state).toBe('typing')
  } finally { reopened.dispose() }
})
