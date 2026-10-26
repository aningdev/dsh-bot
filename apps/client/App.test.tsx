import { expect, open, test } from 'nsh/test'
import { TextHistory } from './history'

test('shows the three product areas while backend is unavailable', async () => {
  const app = await open('./App.tsx', { width: 1200, height: 800, platform: 'macos', network: {} })
  expect(app.texts()).toContain('选择或新建 Bot')
  expect(app.texts()).toContain('当前会话实际配置')
  expect(app.texts()).toContain('DeepSeek API 密钥')
  expect(app.texts()).toContain('新建 Bot')
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
