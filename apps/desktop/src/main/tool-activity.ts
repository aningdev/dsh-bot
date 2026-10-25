import { z } from 'zod'

import type { ToolActivity } from '@/shared/bot'

const eventSchema = z.object({
  type: z.string(),
  seq: z.number().int().nonnegative(),
  data: z.unknown(),
})
const recordSchema = z.object({ type: z.literal('event'), event: eventSchema })
const frameSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('snapshot'),
    cursor: z.number().int().min(-1),
    records: z.array(recordSchema),
  }),
  recordSchema,
])
const stepSchema = z.object({
  turn: z.number().int().nonnegative(),
  step: z.number().int().nonnegative(),
})
const callSchema = stepSchema.extend({
  callId: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  arguments: z.string(),
})
const assistantSchema = stepSchema.extend({
  message: z.object({ content: z.array(z.unknown()) }),
})
const blockSchema = z.object({
  id: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  arguments: z.string(),
})
const resultSchema = stepSchema.extend({
  message: z.object({
    role: z.literal('tool'),
    toolCallId: z.string().min(1).max(256),
    isError: z.boolean().optional(),
    content: z.array(z.object({ type: z.string(), text: z.string().optional() })),
  }),
  error: z.object({ reason: z.string().optional() }).optional(),
})

function bounded(value: string, limit: number): string {
  return value.length <= limit ? value : value.slice(0, limit) + '\n…（内容过长，已截断）'
}

function callKey(turn: number, step: number, callId: string): string {
  return `${turn}:${step}:${callId}`
}

/** Display state only: Harness owns dispatch, results, and durable history. */
export class ToolActivityProjection {
  private readonly activities = new Map<string, ToolActivity>()
  private cursor: number | undefined

  accept(input: unknown): readonly ToolActivity[] | undefined {
    const frame = frameSchema.parse(input)
    if (frame.type === 'snapshot') {
      this.activities.clear()
      let previous = -1
      for (const { event } of frame.records) {
        if (event.seq <= previous || event.seq > frame.cursor)
          throw new Error('Invalid tool history ordering')
        previous = event.seq
        this.apply(event)
      }
      this.cursor = frame.cursor
      return [...this.activities.values()]
    }
    if (this.cursor === undefined || frame.event.seq !== this.cursor + 1)
      throw new Error('Tool history continuity lost')
    this.cursor = frame.event.seq
    if (this.apply(frame.event)) return [...this.activities.values()]
    return undefined
  }

  private addCall(call: z.infer<typeof callSchema>, id: string): void {
    const key = callKey(call.turn, call.step, call.callId)
    const previous = this.activities.get(key)
    this.activities.set(key, {
      id: previous?.id ?? id,
      callId: call.callId,
      name: call.name,
      arguments: bounded(call.arguments, 4096),
      status: previous?.status ?? 'waiting',
      result: previous?.result ?? '',
      reason: previous?.reason ?? '',
    })
    this.trim()
  }

  private apply(event: z.infer<typeof eventSchema>): boolean {
    if (event.type === 'assistant/message') {
      // A crash can occur between this committed request and tool/call. Recovery
      // emits TOOL_NOT_STARTED results, so the request is also an identity source.
      const data = assistantSchema.parse(event.data)
      let changed = false
      for (const [index, value] of data.message.content.entries()) {
        if (typeof value !== 'object' || value === null || !('type' in value)) continue
        if (value.type !== 'tool-call') continue
        const block = blockSchema.parse(value)
        this.addCall({ ...data, ...block, callId: block.id }, `${event.seq}:${index}`)
        changed = true
      }
      return changed
    }
    if (event.type === 'tool/call') {
      this.addCall(callSchema.parse(event.data), String(event.seq))
      return true
    }
    if (event.type !== 'tool/result') return false
    const { turn, step, message, error } = resultSchema.parse(event.data)
    if (error && !message.isError) throw new Error('Inconsistent tool result')
    const key = callKey(turn, step, message.toolCallId)
    const call = this.activities.get(key) ?? {
      id: String(event.seq),
      callId: message.toolCallId,
      name: '工具（名称不在当前历史窗口中）',
      arguments: '调用参数不在当前历史窗口中。',
    }
    const result = bounded(
      message.content
        .map((block) => (block.type === 'text' ? (block.text ?? '') : '[非文本结果]'))
        .join('\n'),
      8192,
    )
    this.activities.set(key, {
      ...call,
      status: message.isError ? 'failed' : 'succeeded',
      result,
      reason: message.isError ? bounded(error?.reason ?? (result || '工具执行失败。'), 8192) : '',
    })
    this.trim()
    return true
  }

  private trim(): void {
    while (this.activities.size > 100) {
      const oldest = this.activities.keys().next()
      if (!oldest.done) this.activities.delete(oldest.value)
    }
  }
}
