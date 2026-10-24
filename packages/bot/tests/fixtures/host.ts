import { Context } from '@deepseek-ai/cordis'
import Group from '@deepseek-ai/cordis-plugin-group'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Agents from '@deepseek-ai/dsh-agent'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import AgentPresets from '@deepseek-ai/dsh-agent-preset-registry'
import FileSystem from '@deepseek-ai/dsh-fs-local'
import LlmRuntime, { type LlmAdapter } from '@deepseek-ai/dsh-llm'
import SessionStore from '@deepseek-ai/dsh-session'
import * as Jsonl from '@deepseek-ai/dsh-session-persistence-jsonl'
import SessionProjections from '@deepseek-ai/dsh-session-projection'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageJson from '@deepseek-ai/dsh-storage-json'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import WorkingDirectory from '@deepseek-ai/dsh-working-directory'
import { apply, inject, type Config } from '@dsh-bot/bot'
import type { BotRecord } from '@dsh-bot/bot/types'
import { z } from 'zod'

import { FakeModelAdapter } from './fake-model.ts'

/** Write an original version-1 record, before configuration fields and the intent table existed. */
export async function storeLegacyBot(
  home: string,
  record: Pick<BotRecord, 'botId' | 'sessionId' | 'name' | 'cwd' | 'provider' | 'model'>,
): Promise<void> {
  const ctx = new Context()
  try {
    await ctx.plugin(Storage)
    await ctx.plugin(StorageJson, { root: home + '/storages' })
    await ctx.plugin(StorageDomain, { backend: 'json' })
    const original = StorageDomain.defineDomain({
      name: 'dsh_bot',
      version: 1,
      tables: {
        bots: StorageDomain.domainTable(
          z.object({
            botId: z.uuid(),
            sessionId: z.uuid(),
            name: z.string(),
            cwd: z.string(),
            provider: z.string(),
            model: z.string(),
          }),
        ),
      },
    })
    const domain = await ctx.storageDomain.open(original)
    ctx.effect(() => () => domain.close())
    await domain.table('bots').put(record.botId, record)
  } finally {
    await ctx.fiber.dispose()
  }
}

/** Real execution services with the external model replaced at its adapter interface. */
export async function createBotHost(
  home: string,
  adapter: LlmAdapter = new FakeModelAdapter(),
): Promise<Context> {
  const ctx = new Context()
  ctx.baseUrl = new URL('./', import.meta.url).href
  try {
    await ctx.plugin(Loader)
    ctx.loader.builtins.group = Group
    await ctx.plugin(LlmRuntime)
    ctx.effect(() => ctx.llm.registerAdapter(['fake'], adapter))
    await ctx.plugin(SessionStore)
    await ctx.plugin(SessionProjections)
    await ctx.plugin(SystemPrompt, { personaPrefix: '' })
    await ctx.plugin(FileSystem)
    await ctx.plugin(WorkingDirectory)
    await ctx.plugin(Tools)
    await ctx.plugin(Agents)
    await ctx.plugin(Jsonl, { root: home + '/sessions', compression: 'none' })
    await ctx.plugin(AgentLoop, { agents: [] })
    await ctx.plugin(AgentPresets, { default: 'standard' })
    await ctx.plugin(Storage)
    await ctx.plugin(StorageJson, { root: home + '/storages' })
    await ctx.plugin(StorageDomain, { backend: 'json' })
    const config: Config = {
      provider: 'fake',
      model: 'fake-1',
      capabilities: {
        probe: [{ name: new URL('./capability.mjs', import.meta.url).href, config: {} }],
      },
    }
    await ctx.plugin({ name: 'bot', inject, apply }, config)
    return ctx
  } catch (error) {
    await ctx.fiber.dispose()
    throw error
  }
}
