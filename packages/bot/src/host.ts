/** Host composition shared by the Runner entry point and its tests. */
import path from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import SessionStore from '@deepseek-ai/dsh-session'
import SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import * as SessionPersistenceJsonl from '@deepseek-ai/dsh-session-persistence-jsonl'
import { apply as applyBot } from './index.ts'
import { FAKE_PROVIDER, FakeModelAdapter } from './testing/fake-model.ts'

/** Inputs for one Bot host instance. */
export interface BotHostOptions {
  /** Harness home the host owns: sessions, Bot records, and credential-free state. */
  readonly home: string
}

/**
 * Compose a Bot host over one home directory.
 *
 * The same function backs the Runner entry point and the process-internal
 * contract tests, so a test exercises the composition the shipped Runner uses.
 * @param options - home directory for all durable state.
 * @returns the running context; the caller owns disposal.
 */
export async function createBotHost(options: BotHostOptions): Promise<Context> {
  const ctx = new Context()
  await ctx.plugin(LlmRuntime)
  const adapter = new FakeModelAdapter()
  ctx.llm.registerAdapter([FAKE_PROVIDER], adapter)
  await ctx.plugin(SessionStore)
  await ctx.plugin(SessionProjectionRegistry)
  await ctx.plugin(SystemPrompt, { personaPrefix: '' })
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(AgentRegistry)
  await ctx.plugin(AgentLoop, { agents: [] })
  await ctx.plugin(
    { name: SessionPersistenceJsonl.name, apply: SessionPersistenceJsonl.apply },
    { root: path.join(options.home, 'sessions'), compression: 'none' },
  )
  await ctx.plugin(
    { name: 'bot', apply: applyBot },
    { root: path.join(options.home, 'bots'), presetId: 'dsh-bot:default' },
  )
  return ctx
}
