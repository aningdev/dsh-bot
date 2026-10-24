import { Context } from '@deepseek-ai/cordis'
import Group from '@deepseek-ai/cordis-plugin-group'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Agents from '@deepseek-ai/dsh-agent'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import AgentPresets from '@deepseek-ai/dsh-agent-preset-registry'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import SessionStore from '@deepseek-ai/dsh-session'
import * as Jsonl from '@deepseek-ai/dsh-session-persistence-jsonl'
import SessionProjections from '@deepseek-ai/dsh-session-projection'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageJson from '@deepseek-ai/dsh-storage-json'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import { apply, inject, type Config } from '@dsh-bot/bot'

import { FakeModelAdapter } from './fake-model.ts'

/** Real execution services with the external model replaced at its adapter interface. */
export async function createBotHost(home: string): Promise<Context> {
  const ctx = new Context()
  ctx.baseUrl = new URL('./', import.meta.url).href
  try {
    await ctx.plugin(Loader)
    ctx.loader.builtins.group = Group
    await ctx.plugin(LlmRuntime)
    ctx.effect(() => ctx.llm.registerAdapter(['fake'], new FakeModelAdapter()))
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjections)
    await ctx.plugin(SystemPrompt, { personaPrefix: '' })
    await ctx.plugin(Tools)
    await ctx.plugin(Agents)
    await ctx.plugin(Jsonl, { root: home + '/sessions', compression: 'none' })
    await ctx.plugin(AgentLoop, { agents: [] })
    await ctx.plugin(AgentPresets, { default: 'standard' })
    await ctx.plugin(Storage)
    await ctx.plugin(StorageJson, { root: home + '/storages' })
    await ctx.plugin(StorageDomain, { backend: 'json' })
    const config: Config = { provider: 'fake', model: 'fake-1' }
    await ctx.plugin({ name: 'bot', inject, apply }, config)
    return ctx
  } catch (error) {
    await ctx.fiber.dispose()
    throw error
  }
}
