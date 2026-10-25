import { ORPCError, os } from '@orpc/server'

import type { BotFrame, ToolActivityFrame } from '@/shared/bot'

import type { RunnerClient } from '../../runner-client'
import { RunnerError } from '../../runner-connection'
import {
  createBotInputSchema,
  saveCredentialInputSchema,
  saveBotConfigurationInputSchema,
  acknowledgeToolsInputSchema,
  decideApprovalInputSchema,
  historyInputSchema,
  sendInputSchema,
  withdrawInputSchema,
} from './schemas'

function ipcError(error: unknown): ORPCError<string, unknown> {
  return error instanceof RunnerError
    ? new ORPCError(error.code, { message: error.message })
    : new ORPCError('SERVICE_UNAVAILABLE', { message: '后台暂时不可用，请稍后重试。' })
}

export function createBotHandlers(client: RunnerClient) {
  return {
    credentialStatus: os.handler(async () => {
      try {
        return await client.credentialStatus()
      } catch (error) {
        throw ipcError(error)
      }
    }),
    saveCredential: os.input(saveCredentialInputSchema).handler(async ({ input }) => {
      try {
        await client.saveCredential(input.value)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    removeCredential: os.handler(async () => {
      try {
        await client.removeCredential()
      } catch (error) {
        throw ipcError(error)
      }
    }),
    configurationOptions: os.handler(async () => {
      try {
        return await client.configurationOptions()
      } catch (error) {
        throw ipcError(error)
      }
    }),
    configuration: os.input(historyInputSchema).handler(async ({ input }) => {
      try {
        return await client.configuration(input.botId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    create: os.input(createBotInputSchema).handler(async ({ input }) => {
      try {
        return await client.create(input)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    saveConfiguration: os.input(saveBotConfigurationInputSchema).handler(async ({ input }) => {
      try {
        return await client.saveConfiguration(input.botId, input)
      } catch (error) {
        throw ipcError(error)
      }
    }),
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
    inputState: os.input(historyInputSchema).handler(async ({ input }) => {
      try {
        return await client.inputState(input.botId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    submit: os.input(sendInputSchema).handler(async ({ input }) => {
      try {
        return await client.submit(input.botId, input.text)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    stop: os.input(historyInputSchema).handler(async ({ input }) => {
      try {
        await client.stop(input.botId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    withdraw: os.input(withdrawInputSchema).handler(async ({ input }) => {
      try {
        return await client.withdraw(input.botId, input.messageId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    pendingApprovals: os.input(historyInputSchema).handler(async ({ input }) => {
      try {
        return await client.pendingApprovals(input.botId)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    decideApproval: os.input(decideApprovalInputSchema).handler(({ input }) => {
      try {
        client.decideApproval(input.botId, input.id, input.decision)
      } catch (error) {
        throw ipcError(error)
      }
    }),
    tools: os.input(historyInputSchema).handler(({ input, signal }) => {
      return (async function* (): AsyncGenerator<ToolActivityFrame> {
        try {
          yield* client.tools(input.botId, signal)
        } catch (error) {
          throw ipcError(error)
        }
      })()
    }),
    acknowledgeTools: os.input(acknowledgeToolsInputSchema).handler(({ input }) => {
      client.acknowledgeTools(input.observationId, input.revision)
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
