/** Browser-only SDK injected by the packaged IPC boundary tests, never by the product. */
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/message-port'
import type { RouterClient } from '@orpc/server'

import type { router } from '../../src/main/ipc/router'

declare global {
  interface Window {
    testBotIPC: RouterClient<typeof router>
    testBotIPCMessages: unknown[]
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
window.postMessage(
  'start-orpc-server',
  window.location.protocol === 'file:' ? '*' : window.location.origin,
  [port2],
)
window.addEventListener('pagehide', () => port1.close(), { once: true })
