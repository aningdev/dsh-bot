import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from './registry'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
const record = async () => { const file = (await listRecords())[0]; return file ? JSON.parse(await readRecord(file)) : undefined }
async function waitRecord(app: { wait(ms: number): Promise<void> }, check: (value: any) => boolean, timeout: number): Promise<void> {
  const deadline = Date.now() + timeout
  while (!check(await record())) {
    if (Date.now() >= deadline) throw new Error('等待注册表写入超时')
    await app.wait(50)
  }
}
test('首次打开自动初始化，期间输入的新草稿在提交指针和重开后保留', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 15000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '初始化草稿 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${await botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await waitRecord(app, value => !!value?.initializing, 10000)
    await app.type('id:message-input', '初始化期间编辑的新草稿')
    await waitRecord(app, value => !!value?.sessionId, 15000)
    expect((await record()).draft?.text).toBe('初始化期间编辑的新草稿')
  } finally { app.dispose() }
  const reopened = await open('./bot-app-probe.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await reopened.waitUntil(() => reopened.value('id:message-input') === '初始化期间编辑的新草稿', { timeout: 15000 })
    expect((await record()).draft?.state).toBe('typing')
  } finally { reopened.dispose() }
})
