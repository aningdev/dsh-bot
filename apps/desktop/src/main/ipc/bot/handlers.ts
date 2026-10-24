import { ORPCError, os } from '@orpc/server'

import type { BotFrame } from '@/shared/bot'

import type { RunnerClient } from '../../runner-client'
import { RunnerError } from '../../runner-connection'
import { historyInputSchema, sendInputSchema } from './schemas'

function ipcError(error: unknown): ORPCError<string, unknown> {
  return error instanceof RunnerError
    ? new ORPCError(error.code, { message: error.message })
    : new ORPCError('SERVICE_UNAVAILABLE', { message: '后台暂时不可用，请稍后重试。' })
}

export function createBotHandlers(client: RunnerClient) {
  return {
    list: os.handler(async () => {
      try {
        return await client.list()
      } catch (error) {
        throw ipcError(error)
      }
    }),
    history: os.input(historyInputSchema).handler(async ({ input }) => {
      try {
        return await client.history(input.botId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    send: os.input(sendInputSchema).handler(({ input, signal }) => {
      const stream = client.send(input.botId, input.text, signal)
      return (async function* (): AsyncGenerator<BotFrame> {
        try {
          yield* stream
        } catch (error) {
          throw ipcError(error)
        }
      })()
    }),
  }
}
