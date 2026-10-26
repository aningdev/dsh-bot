import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'
import { configFrom } from './store.ts'

export const name = 'bot-conversation'
export const inject = ['systemPrompt']
export function apply(ctx: Context, config: unknown): void {
  const snapshot = configFrom(config)
  ctx.systemPrompt.section({ name: 'bot:instructions', order: 100, text: snapshot.instructions, interpolate: false })
}
