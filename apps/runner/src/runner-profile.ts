/** Product-owned profile lifetime: drain Bot consumers before disposing their providers. */
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import {
  auditStartupEntries,
  createRuntimeResolution,
  installFailLoud,
  loadOverlayPatches,
  mountRootInclude,
  PluginPackages,
  readProfilePatches,
  type Profile,
  type ProfileContext,
} from '@deepseek-ai/dsh-app-boot'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { dshHomePath, resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { installProxyFromEnvironment } from '@deepseek-ai/dsh-http-proxy'
import {
  DSH_LAUNCH_ENVIRONMENT_KEY,
  type LaunchEnvironmentSnapshot,
} from '@deepseek-ai/dsh-launch-environment'
import type {} from '@dsh-bot/bot'
import type {} from '@dsh-bot/bot/admission'
import type {} from '@dsh-bot/bot/session-controller'

interface RunnerProfileOptions {
  environment: LaunchEnvironmentSnapshot
  profile: Profile
  installAnchor: string
  patchFiles: readonly string[]
  ready(ctx: Context, signal: AbortSignal): Promise<void>
  withdrawConnection(): Promise<void>
}

/** Install shutdown ownership synchronously, before any asynchronous startup work. */
export function runRunnerProfile(options: RunnerProfileOptions): {
  startup: Promise<void>
  shutdown(code: number): Promise<void>
} {
  const ctx = new Context()
  const cancellation = new AbortController()
  const failures: unknown[] = []
  let disposeProxy: (() => Promise<void>) | undefined
  let stopping: Promise<void> | undefined
  let exitCode = 0
  let forceAfterDispose = false
  let startupSettled: Promise<void>

  const attempt = async (release: () => unknown): Promise<void> => {
    try {
      await release()
    } catch (error) {
      failures.push(error)
    }
  }
  const stopAdmission = (): void => {
    try {
      ctx.get('botController')?.stopAdmission()
    } catch (error) {
      failures.push(error)
    }
  }
  const dispose = async (): Promise<void> => {
    // Startup includes readiness publication. Cancellation is visible immediately;
    // settlement also catches a provider that finishes mounting after the stop request.
    await startupSettled
    stopAdmission()
    await attempt(options.withdrawConnection)
    await attempt(() => ctx.get('botAdmission')?.close())
    await attempt(() => ctx.get('botController')?.quiesce())
    // Cordis effect disposers run concurrently, so none of the above can be an effect.
    await attempt(() => ctx.fiber.dispose())
    await attempt(() => disposeProxy?.())
    if (failures.length > 0) throw new AggregateError(failures, 'Runner cleanup failed')
  }
  const shutdown = (code: number, force = false): Promise<void> => {
    if (code !== 0 || stopping === undefined) exitCode = code
    forceAfterDispose ||= force
    if (stopping !== undefined) return stopping
    cancellation.abort()
    stopAdmission()
    // Keep the timer referenced, including while waiting for startup to settle.
    const timeout = setTimeout(() => {
      console.error('Runner shutdown timed out after 5000 ms')
      process.exit(exitCode)
    }, 5_000)
    stopping = Promise.resolve()
      .then(dispose)
      .then(
        () => {
          clearTimeout(timeout)
          removeHandlers()
          process.exitCode = exitCode
          if (forceAfterDispose) process.exit(exitCode)
        },
        (error: unknown) => {
          console.error(error)
          clearTimeout(timeout)
          removeHandlers()
          process.exit(1)
        },
      )
    return stopping
  }
  const interrupt = (code: number): void => {
    if (stopping !== undefined) process.exit(code)
    void shutdown(code, true)
  }
  const onTerm = (): void => interrupt(0)
  const onInt = (): void => interrupt(130)
  process.on('SIGTERM', onTerm)
  process.on('SIGINT', onInt)
  // Retain the public guard's startup-audit rejection coalescing and diagnostics.
  // Its exit adapter joins our single 5s deadline; no separate 2s release timer runs.
  const uninstallFailLoud = installFailLoud('dsh', {
    on: (event, handler) => process.on(event, handler),
    off: (event, handler) => process.off(event, handler),
    stderr: process.stderr,
    exit: (code) => {
      void shutdown(code, true)
    },
  })
  const removeHandlers = (): void => {
    process.off('SIGTERM', onTerm)
    process.off('SIGINT', onInt)
    uninstallFailLoud()
  }

  const startup = (async () => {
    disposeProxy = await installProxyFromEnvironment(options.environment, (message) => {
      process.stderr.write(`dsh: ${message}\n`)
    })
    if (cancellation.signal.aborted) return
    const { profile, installAnchor } = options
    const rootConfig = join(profile.dir, 'cordis.yml')
    // Loader write-back can contain composed entries; never reuse it on restart.
    writeFileSync(rootConfig, '# Runner profile root; edit cordis.patch.yml instead.\n[]\n')
    const resolution = await createRuntimeResolution({ profile, installAnchor })
    if (cancellation.signal.aborted) return
    const profileContext: ProfileContext = {
      name: 'runner',
      dir: profile.dir,
      patchPath: profile.patchPath,
      installAnchor,
      startedBundles: profile.layers.map((layer) => layer.packageName),
      cwd: process.cwd(),
      home: resolveDshHome(),
      overlays: options.patchFiles.flatMap((file) => loadOverlayPatches('dsh', resolve(file))),
      telemetryDisabledEnv: process.env.DSH_TELEMETRY_DISABLED,
    }
    const patches = readProfilePatches('dsh', profileContext, profile)
    ctx.baseUrl = pathToFileURL(dirname(rootConfig)).href + '/'
    ctx.provide('dshHomePath', dshHomePath)
    ctx.on(
      'internal/update',
      (_config, _noSave, next: () => unknown) => {
        void Promise.resolve(next()).catch((error: unknown) => {
          ctx.logger.error(error)
        })
      },
      { global: true, prepend: true },
    )
    await ctx.plugin(Loader)
    if (cancellation.signal.aborted) return
    ctx.provide('profileContext', profileContext)
    ctx.provide(DSH_LAUNCH_ENVIRONMENT_KEY, options.environment)
    await ctx.plugin(PluginPackages, { resolution })
    if (cancellation.signal.aborted) return
    let ready = false
    const listeners = new Set<() => void>()
    provideCmdline(ctx, {
      args: [],
      exit: (code) => {
        void shutdown(code, true)
      },
      ready: {
        onReady(listener) {
          if (ready && !cancellation.signal.aborted) listener()
          else if (!cancellation.signal.aborted) listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
      },
    })
    // Do not call boot(): its catch would dispose providers before Bot quiescence.
    await mountRootInclude(ctx, rootConfig, patches, undefined, 'dsh')
    await ctx.get('loader')?.await()
    if (cancellation.signal.aborted) return
    // Cordis publishes `FiberState` as a const enum, so it has no runtime value to compare against.
    try {
      ctx.fiber.assertActive()
    } catch {
      throw new Error('Runner profile was disposed during startup')
    }
    if (ctx.get('loader') === undefined)
      throw new Error('Runner profile was disposed during startup')
    await auditStartupEntries(ctx, 'dsh')
    if (cancellation.signal.aborted) return
    await options.ready(ctx, cancellation.signal)
    if (cancellation.signal.aborted) return
    ready = true
    for (const listener of listeners) {
      if (cancellation.signal.aborted) break
      listener()
    }
    listeners.clear()
  })()
  // The disposer waits on the raw startup task, never on its shutdown catch.
  startupSettled = startup.then(
    () => {},
    () => {},
  )
  return {
    shutdown,
    startup: startup.catch(async (error: unknown) => {
      await shutdown(1)
      throw error
    }),
  }
}
