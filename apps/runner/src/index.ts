/** Launch the Runner profile using the installed Harness launcher. */
import { mkdir } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import type {} from '@deepseek-ai/dsh-agent-preset-registry'
import {
  initProfile,
  loadLayeredEnv,
  loadProfileDirectory,
  reportSkippedBundles,
} from '@deepseek-ai/dsh-app-boot'
import type {} from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { runProfile } from '@deepseek-ai/dsh/profile-boot'
import type {} from '@dsh-bot/bot'
import type {} from '@dsh-bot/bot/session-controller'

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: { home: { type: 'string' }, patch: { type: 'string', multiple: true, default: [] } },
  })
  if (values.home === undefined || !isAbsolute(values.home))
    throw new Error('Provide --home with an absolute Runner data directory')
  process.env.DSH_HOME = values.home
  await mkdir(values.home, { recursive: true, mode: 0o700 })
  const profileDir = join(values.home, 'profiles', 'runner')
  initProfile(profileDir, ['@deepseek-ai/dsh-base', '@dsh-bot/harness-runtime', '@dsh-bot/bot'])
  const installAnchor = fileURLToPath(new URL('../package.json', import.meta.url))
  const profile = loadProfileDirectory('dsh', profileDir, installAnchor)
  reportSkippedBundles('dsh', profile)
  if (profile.skippedBundles.length > 0)
    throw new Error('Runner profile contains unavailable bundles')
  const application = runProfile({
    environment: loadLayeredEnv('dsh'),
    profile: 'runner',
    resolvedProfile: { profile, installAnchor },
    patchFiles: values.patch,
    args: [],
    beforeDispose: async (ctx) => {
      const bot = ctx.get('botController')
      bot?.stopAdmission()
      const failures: unknown[] = []
      for (const close of [() => ctx.get('botSessionController')?.close(), () => bot?.quiesce()]) {
        try {
          await close()
        } catch (error) {
          failures.push(error)
        }
      }
      if (failures.length > 0) throw new AggregateError(failures, 'Runner quiescence failed')
    },
  })
  let stopping: Promise<void> | undefined
  const stop = (): Promise<void> =>
    (stopping ??= (async () => {
      const running = await application
      await running.shutdown.shutdown(0)
      if (process.connected)
        process.send?.({ type: 'shutdown-complete' }, () => {
          process.disconnect?.()
        })
    })())
  // Private supervisor/test IPC only. Client disconnection does not stop accepted work.
  process.on('message', (message: unknown) => {
    if (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      message.type === 'shutdown'
    ) {
      void stop().catch((error: unknown) => {
        console.error(error)
        process.exitCode = 1
      })
    }
  })
  const { ctx, shutdown } = await application
  try {
    for (const service of [
      'webServer',
      'connection',
      'typertGateway',
      'agentLoop',
      'agentPresets',
      'botController',
      'sessionController',
      'fileUploads',
      'sessionFileReferences',
      'botSessionController',
    ]) {
      if (ctx.get(service) === undefined)
        throw new Error(`Runner required service is unavailable: ${service}`)
    }
    await ctx.agentPresets.resolve()
    const origin = ctx.webServer.getOrigin()
    const connectUrl = ctx.connection.authenticatedUrl(origin + '/connect')
    if (process.connected) process.send?.({ type: 'ready', origin, connectUrl })
    else console.log(JSON.stringify({ type: 'ready', origin }))
  } catch (error) {
    await shutdown.shutdown(1)
    throw error
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  if (process.connected)
    process.send?.({ type: 'fatal', message }, () => {
      process.disconnect?.()
    })
  console.error(error)
  process.exitCode = 1
})
