import { ipc } from '@/renderer/lib/ipc-client'

export function botListQueryOptions() {
  return ipc.utils.bot.list.queryOptions()
}

export function botHistoryQueryOptions(botId: string) {
  return ipc.utils.bot.history.queryOptions({ input: { botId } })
}

export async function* observeBotTools(botId: string, signal: AbortSignal) {
  const stream = await ipc.client.bot.tools({ botId }, { signal })
  for await (const frame of stream) {
    yield frame.activities
    if (signal.aborted) return
    await ipc.client.bot.acknowledgeTools(
      { observationId: frame.observationId, revision: frame.revision },
      { signal },
    )
  }
}

export function sendBotMessage(botId: string, text: string, signal: AbortSignal) {
  return ipc.client.bot.send({ botId, text }, { signal })
}
