/** Browser-only SDK injected by the packaged IPC boundary tests, never by the product. */
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/message-port'
import type { RouterClient } from '@orpc/server'

import type { router } from '../../src/main/ipc/router'
import type { ToolActivityFrame } from '../../src/shared/bot'

declare global {
  interface Window {
    testBotIPC: RouterClient<typeof router>
    testBotIPCMessages: unknown[]
    testToolFrames: ToolActivityFrame[]
    testToolObservation: {
      start(botId: string): void
      acknowledge(): Promise<void>
      stop(): Promise<void>
    }
  }
}

const { port1, port2 } = new MessageChannel()
const messages: unknown[] = []
// Observe before the SDK decodes responses, including envelopes and stream errors.
port1.addEventListener('message', (event: MessageEvent<unknown>) => {
  messages.push(structuredClone(event.data))
})
const client: RouterClient<typeof router> = createORPCClient(new RPCLink({ port: port1 }))
Reflect.set(window, 'testBotIPC', client)
Reflect.set(window, 'testBotIPCMessages', messages)
port1.start()
// Read IPC frames but deliberately withhold consumption credit until the test
// acknowledges one. This exercises the real packaged transport's slow observer.
window.testToolFrames = []
let observation: AbortController | undefined
let observationTask: Promise<void> | undefined
window.testToolObservation = {
  start(botId) {
    observation = new AbortController()
    const { signal } = observation
    observationTask = (async () => {
      try {
        for await (const frame of await client.bot.tools({ botId }, { signal }))
          window.testToolFrames.push(frame)
      } catch (error) {
        if (!signal.aborted) throw error
      }
    })()
  },
  async acknowledge() {
    const frame = window.testToolFrames.at(-1)
    if (!frame) throw new Error('No tool observation frame')
    await client.bot.acknowledgeTools({
      observationId: frame.observationId,
      revision: frame.revision,
    })
  },
  async stop() {
    observation?.abort()
    await observationTask
  },
}
window.postMessage(
  'start-orpc-server',
  window.location.protocol === 'file:' ? '*' : window.location.origin,
  [port2],
)
window.addEventListener('pagehide', () => port1.close(), { once: true })
