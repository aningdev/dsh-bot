import { expect, open, test } from 'nsh/test'
import { TextHistory } from './frontend/infrastructure/dsh/history'

test('shows the three product areas while the backend is unavailable', async () => {
  const app = await open('./App.tsx', { width: 1200, height: 800, platform: 'macos', network: {} })
  expect(app.texts()).toContain('新建 Bot')
  expect(app.texts()).toContain('归档区')
  expect(app.texts()).toContain('选择或新建 Bot')
  expect(app.texts()).toContain('后台未连接')
  app.dispose()
})

test('navigation keeps the workbench and presents secondary actions as dialogs', async () => {
  const app = await open('./App.tsx', { width: 1400, height: 950, platform: 'macos', network: {} })
  try {
    await app.press('id:bot-new')
    await app.type('id:bot-name', '尚未保存')
    expect(app.value('id:bot-name')).toBe('尚未保存')
    await app.press('id:dialog-close')
    expect(app.shows('id:bot-save')).toBe(false)
    await app.press('id:model-settings')
    await app.press('id:settings-backend')
    expect(app.shows('id:backend-start')).toBe(true)
    await app.press('id:settings-close')
    expect(app.shows('id:bot-new')).toBe(true)
    expect(app.shows('id:backend-start')).toBe(false)
  } finally { app.dispose() }
})

test('text view removes replaced history, ignores reasoning and reports interrupted turns', () => {
  const history = new TextHistory()
  const event = (seq: number, type: string, data: unknown, surfaceOp: unknown = 'append') => ({ seq, type, data, surfaceOp })
  const rows = history.receive({ type: 'snapshot', records: [
    { event: event(0, 'user/message', { content: [{ type: 'text', text: '你好' }] }) },
    { event: event(1, 'assistant/message', { message: { content: [{ type: 'reasoning', text: 'private' }, { type: 'text', text: '旧答复' }] } }) },
    { event: event(2, 'assistant/message', { message: { content: [{ type: 'text', text: '新答复' }] } }, { op: 'replace', startSeq: 1, endSeq: 1 }) },
    { event: event(3, 'turn/end', { reason: { kind: 'interrupted' } }) },
  ] })
  expect(rows.map(row => row.text)).toEqual(['你好', '新答复'])
  expect(history.status).toBe('上次执行已中断')
  expect(history.running).toBe(false)
  history.receive({ type: 'assistant-stream', frame: { type: 'start', attemptId: 'one' } })
  const live = history.receive({ type: 'assistant-stream', frame: { type: 'chunk', attemptId: 'one', chunk: { type: 'text-delta', text: '实时' } } })
  expect(live.at(-1)?.text).toBe('实时')
})
