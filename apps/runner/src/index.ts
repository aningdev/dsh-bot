/** Launch the named Runner profile with product-owned shutdown ordering. */
import { mkdir } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
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
import type {} from '@dsh-bot/bot'
import type {} from '@dsh-bot/bot/session-controller'

import { publishConnection } from './connection-file.ts'
import { runRunnerProfile } from './runner-profile.ts'

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: { home: { type: 'string' }, patch: { type: 'string', multiple: true, default: [] } },
  })
  if (values.home === undefined || !isAbsolute(values.home))
    throw new Error('Provide --home with an absolute Runner data directory')
  const home = values.home
  process.env.DSH_HOME = home
  await mkdir(home, { recursive: true, mode: 0o700 })
  const profileDir = join(home, 'profiles', 'runner')
  initProfile(profileDir, ['@deepseek-ai/dsh-base', '@dsh-bot/harness-runtime', '@dsh-bot/bot'])
  // Resolve from the bundle location: a `new URL(..., import.meta.url)` form is an asset
  // reference that the bundler rewrites into an inlined data URL.
  const installAnchor = resolve(import.meta.dirname, '..', 'package.json')
  const profile = loadProfileDirectory('dsh', profileDir, installAnchor)
  reportSkippedBundles('dsh', profile)
  if (profile.skippedBundles.length > 0)
    throw new Error('Runner profile contains unavailable bundles')
  let connectionPublication: Promise<() => Promise<void>> | undefined
  const application = runRunnerProfile({
    environment: loadLayeredEnv('dsh'),
    profile,
    installAnchor,
    patchFiles: values.patch,
    withdrawConnection: async () => {
      const withdraw = await connectionPublication
      await withdraw?.()
    },
    ready: async (ctx, signal) => {
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
        'botAdmission',
      ]) {
        if (ctx.get(service) === undefined)
          throw new Error(`Runner required service is unavailable: ${service}`)
      }
      await ctx.agentPresets.resolve()
      if (signal.aborted) return
      const origin = ctx.webServer.getOrigin()
      const connectUrl = ctx.connection.authenticatedUrl(origin + '/connect')
      connectionPublication = publishConnection(home, { origin, connectUrl })
      await connectionPublication
      if (signal.aborted) return
      if (process.connected) process.send?.({ type: 'ready', origin, connectUrl })
      else console.log(JSON.stringify({ type: 'ready', origin }))
    },
  })
  let stopping: Promise<void> | undefined
  const stop = (): Promise<void> =>
    (stopping ??= (async () => {
      await application.shutdown(0)
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
  await application.startup
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
