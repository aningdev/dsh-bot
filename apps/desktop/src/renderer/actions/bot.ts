import { ipc } from '@/renderer/lib/ipc-client'

export function credentialStatusQueryOptions() {
  return ipc.utils.bot.credentialStatus.queryOptions()
}

export function saveCredentialMutationOptions() {
  return ipc.utils.bot.saveCredential.mutationOptions()
}

export function removeCredentialMutationOptions() {
  return ipc.utils.bot.removeCredential.mutationOptions()
}

export function botConfigurationOptionsQueryOptions() {
  return ipc.utils.bot.configurationOptions.queryOptions()
}

export function botConfigurationQueryOptions(botId: string) {
  return ipc.utils.bot.configuration.queryOptions({ input: { botId } })
}

export function createBotMutationOptions() {
  return ipc.utils.bot.create.mutationOptions()
}

export function saveBotConfigurationMutationOptions() {
  return ipc.utils.bot.saveConfiguration.mutationOptions()
}

export function botListQueryOptions() {
  return ipc.utils.bot.list.queryOptions()
}

export function botHistoryQueryOptions(botId: string) {
  return ipc.utils.bot.history.queryOptions({ input: { botId } })
}

export function botInputQueryOptions(botId: string) {
  return ipc.utils.bot.inputState.queryOptions({ input: { botId } })
}

export function submitBotInput(botId: string, text: string, signal: AbortSignal) {
  return ipc.client.bot.submit({ botId, text }, { signal })
}

export function stopBotMutationOptions() {
  return ipc.utils.bot.stop.mutationOptions()
}

export function withdrawBotInputMutationOptions() {
  return ipc.utils.bot.withdraw.mutationOptions()
}

export function botApprovalsQueryOptions(botId: string) {
  return ipc.utils.bot.pendingApprovals.queryOptions({ input: { botId } })
}

export function decideBotApprovalMutationOptions() {
  return ipc.utils.bot.decideApproval.mutationOptions()
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
