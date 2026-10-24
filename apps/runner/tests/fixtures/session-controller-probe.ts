/** Observes the published Controller in a test-only profile composition. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import type {} from '@deepseek-ai/dsh-api-session-controller'
import schema from '@deepseek-ai/schemastery'
import type {} from '@dsh-bot/bot'

export const name = 'session-controller-compatibility-probe'
export const inject = ['botController', 'agentPresets', 'sessionController']

/** Explicit experimental setup, never loaded by the production bundle. */
export interface Config {
  readonly standingPresets: boolean
  readonly holdModel: string
}
export const Config: schema<Config> = schema.object({
  standingPresets: schema.boolean().default(false),
  holdModel: schema.string().default(''),
})

/** Report only compatibility observations over the private test channel. */
function report(event: string, sessionId: string, detail = ''): void {
  if (process.send === undefined)
    throw new Error('Compatibility tests require a private IPC channel')
  process.send({ type: 'compatibility', event, sessionId, detail }, (error) => {
    if (error !== null) throw error
  })
}

/**
 * Install observations and optional preset/bootstrap and initialization barriers.
 * @param ctx - Real profile services, including the published Session Controller.
 * @param config - Test mode controlling only the experiment's barriers.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  if (config.standingPresets) {
    const bots = await ctx.botController.listBots(new AbortController().signal)
    for (const bot of bots) {
      const dispose = await ctx.agentPresets.register({ id: `dsh-bot:${bot.botId}`, plugins: [] })
      ctx.effect(() => dispose)
    }
  }
  let release: (() => void) | undefined
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  ctx.on(
    'api-session/error',
    (id, error) => {
      report('activation-error', id, error)
    },
    { global: true },
  )
  ctx.on(
    'agent/created',
    async ({ agent }) => {
      report('agent-announced', agent.id, agent.options.model ?? '')
      if (config.holdModel.length > 0 && agent.options.model === config.holdModel) {
        report('initialization-blocked', agent.id)
        await gate
      }
    },
    { global: true },
  )
  const control = (message: unknown): void => {
    if (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      message.type === 'compatibility:release'
    )
      release?.()
  }
  ctx.effect(() => {
    process.on('message', control)
    return () => {
      process.off('message', control)
      release?.()
    }
  })
  report('ready', '')
}
