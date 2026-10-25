/** Scoped tool capability; built and approved only by the test profile. */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'test-tool-activity'
export const inject = ['tools']

/** @param ctx - The selected Bot preset's plugin context. */
export function apply(ctx: Context): void {
  const waiters = new Set<{ release: () => void; abort: () => void }>()
  let disposed = false
  ctx.effect(() => {
    const onMessage = (message: unknown): void => {
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message.type === 'tool-activity:release'
      )
        for (const waiter of [...waiters]) waiter.release()
    }
    process.on('message', onMessage)
    return () => {
      disposed = true
      process.off('message', onMessage)
      for (const waiter of [...waiters]) waiter.abort()
    }
  })
  const waitForRelease = (signal: AbortSignal): Promise<void> =>
    new Promise((resolve, reject) => {
      const cleanup = (): void => {
        waiters.delete(waiter)
        signal.removeEventListener('abort', waiter.abort)
      }
      const waiter = {
        release: (): void => {
          cleanup()
          resolve()
        },
        abort: (): void => {
          cleanup()
          reject(new Error('Activity tool aborted'))
        },
      }
      if (disposed || signal.aborted) {
        waiter.abort()
        return
      }
      waiters.add(waiter)
      process.send?.({ type: 'tool-activity:started' })
      signal.addEventListener('abort', waiter.abort, { once: true })
    })
  ctx.effect(() =>
    ctx.tools.register(
      defineTool({
        name: 'activity_probe',
        description: 'Deterministic gated tool activity for tests.',
        parameters: {
          mode: { type: 'string', enum: ['success', 'failure'], required: true },
          value: { type: 'string', required: true },
        },
        output: {
          schema: { type: 'string' },
          render: (_args, value) => [{ type: 'text', text: value }],
        },
        async execute(args, exec) {
          await waitForRelease(exec.signal)
          exec.signal.throwIfAborted()
          if (args.mode === 'failure') throw new Error(`probe failure: ${args.value}`)
          return `probe result: ${args.value}`
        },
      }),
    ),
  )
}
