import { ipc } from '@/renderer/lib/ipc-client'

export function botListQueryOptions() {
  return ipc.utils.bot.list.queryOptions()
}

export function botHistoryQueryOptions(botId: string) {
  return ipc.utils.bot.history.queryOptions({ input: { botId } })
}

export function sendBotMessage(botId: string, text: string, signal: AbortSignal) {
  return ipc.client.bot.send({ botId, text }, { signal })
}
