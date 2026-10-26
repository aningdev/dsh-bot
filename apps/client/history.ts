export interface Message { id: string; role: 'user' | 'assistant'; text: string }
interface Event { seq: number; type: string; data: Record<string, unknown>; surfaceOp?: unknown }
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}
function content(value: unknown): string {
  return Array.isArray(value) ? value.map(item => { const block = object(item); return block.type === 'text' && typeof block.text === 'string' ? block.text : '' }).join('') : ''
}
function streamText(value: unknown): string {
  return Array.isArray(value) ? value.map(item => {
    const record = object(item)
    if (record.type === 'text-chunks' && Array.isArray(record.texts)) return record.texts.join('')
    const chunk = object(record.chunk)
    return chunk.type === 'text-delta' && typeof chunk.text === 'string' ? chunk.text : ''
  }).join('') : ''
}
/** A disposable view of Harness history; no separate message persistence. */
export class TextHistory {
  private events: Event[] = []
  private live = ''
  private attempt: string | undefined
  running = false
  status = ''
  receive(value: unknown): Message[] {
    const frame = object(value)
    if (frame.type === 'error') throw new Error(String(frame.error))
    if (frame.type === 'snapshot') {
      this.events = []
      this.running = false
      this.status = ''
      for (const record of Array.isArray(frame.records) ? frame.records : []) this.event(object(record).event)
      const attempt = object(object(frame.assistantStream).activeAttempt)
      this.attempt = typeof attempt.attemptId === 'string' ? attempt.attemptId : undefined
      this.live = streamText(attempt.stream)
      this.running = this.running || !!this.attempt
    } else if (frame.type === 'event') this.event(frame.event)
    else if (frame.type === 'assistant-stream') {
      const next = object(frame.frame)
      if (next.type === 'start') { this.attempt = String(next.attemptId); this.live = ''; this.running = true }
      if (next.type === 'chunk' && next.attemptId === this.attempt) {
        const chunk = object(next.chunk)
        if (chunk.type === 'text-delta' && typeof chunk.text === 'string') this.live += chunk.text
      }
      if (next.type === 'end' && next.attemptId === this.attempt) { this.live = ''; this.attempt = undefined }
    }
    const messages: Message[] = []
    for (const event of this.events) {
      if (event.type === 'user/message') messages.push({ id: String(event.seq), role: 'user', text: content(event.data.content) })
      if (event.type === 'assistant/message') messages.push({ id: String(event.seq), role: 'assistant', text: content(object(event.data.message).content) })
    }
    if (this.live) messages.push({ id: 'live', role: 'assistant', text: this.live })
    return messages.filter(message => message.text.length > 0)
  }
  private event(value: unknown): void {
    const e = object(value)
    if (typeof e.seq !== 'number' || typeof e.type !== 'string') return
    const event: Event = { seq: e.seq, type: e.type, data: object(e.data), surfaceOp: e.surfaceOp }
    const op = object(event.surfaceOp)
    if (op.op === 'replace' && typeof op.startSeq === 'number' && typeof op.endSeq === 'number') {
      const start = op.startSeq, end = op.endSeq
      this.events = this.events.filter(item => item.seq < start || item.seq > end)
    }
    if (!this.events.some(item => item.seq === event.seq)) this.events.push(event)
    if (event.type === 'turn/start') { this.running = true; this.status = '' }
    if (event.type === 'turn/end') {
      this.running = false
      const reason = object(event.data.reason)
      this.status = reason.kind === 'interrupted' ? '上次执行已中断'
        : reason.kind === 'aborted' ? '执行已停止'
        : reason.kind === 'error' ? `执行失败：${String(object(reason.error).message ?? '未知错误')}` : ''
    }
    if (event.type === 'assistant/message') this.live = ''
    if (event.data.interrupted === true) this.status = '执行已中断'
    if (event.type.includes('error') || event.type === 'llm/failure') { this.status = '执行失败，请检查模型配置与凭据'; this.running = false }
  }
}
