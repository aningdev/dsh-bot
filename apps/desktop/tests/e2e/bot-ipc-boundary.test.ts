import { execFileSync } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, type Page, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

type Runner = Awaited<ReturnType<typeof startTestRunner>>

async function withBotIPC(
  run: (context: { page: Page; runner: Runner; botId: string; name: string }) => Promise<void>,
) {
  const cleanup: (() => Promise<unknown>)[] = []
  const failures: unknown[] = []
  try {
    const directory = await mkdtemp(join(tmpdir(), 'desktop-bot-ipc-'))
    cleanup.push(() => rm(directory, { recursive: true, force: true }))
    const bundle = join(directory, 'bot-ipc-browser.js')
    execFileSync(
      'bun',
      [
        'build',
        join(__dirname, 'bot-ipc-browser.ts'),
        '--target=browser',
        '--format=iife',
        '--outfile',
        bundle,
      ],
      { stdio: 'pipe' },
    )
    const runner = await startTestRunner()
    cleanup.push(() => runner.dispose())
    const name = 'IPC 边界测试助手'
    const created = await runner.client.remote.bot.create({ name, cwd: runner.home })
    if (!created.ok) throw created.error
    const opened = await launchTestApp({ runnerHome: runner.home })
    cleanup.push(() => opened.dispose())
    const page = await opened.app.firstWindow()
    await expect(page.getByRole('button', { name, exact: true })).toBeVisible()
    // Preload accepts one handshake per document. Keep the real packaged page
    // and preload, but reserve this reload's port for the injected SDK.
    await page.route('**/assets/*.js', (route) => route.abort())
    await page.reload()
    await expect(page.locator('#app')).toBeEmpty()
    // Evaluate the test-only bundle through the debugger, without changing the
    // packaged page's CSP or injecting an inline script element.
    await page.evaluate(await readFile(bundle, 'utf8'))
    await run({ page, runner, botId: created.value.botId, name })
  } catch (error) {
    failures.push(error)
  } finally {
    // Close Electron before Runner, and attempt every cleanup even if one fails.
    for (const dispose of cleanup.reverse()) {
      try {
        await dispose()
      } catch (error) {
        failures.push(error)
      }
    }
  }
  if (failures.length > 0) throw new AggregateError(failures, 'Packaged Bot IPC test failed')
}

async function readCredentials(home: string) {
  // These exact values remain in Node; never pass them as evaluate arguments.
  const descriptor: unknown = JSON.parse(await readFile(join(home, 'run/connection.json'), 'utf8'))
  if (
    typeof descriptor !== 'object' ||
    descriptor === null ||
    !('origin' in descriptor) ||
    typeof descriptor.origin !== 'string' ||
    !('connectUrl' in descriptor) ||
    typeof descriptor.connectUrl !== 'string'
  )
    throw new Error('Runner connection descriptor is missing authentication fields')
  const token = new URL(descriptor.connectUrl).searchParams.get('token')
  if (!token) throw new Error('Runner connection descriptor is missing its token')
  return [descriptor.origin, descriptor.connectUrl, token]
}

function expectCredentialFree(value: unknown, secrets: readonly string[]) {
  const snapshot = JSON.stringify(value)
  // Boolean assertions avoid printing credential values on failure.
  for (const secret of secrets)
    expect(snapshot.includes(secret), 'Runner credential appeared in Renderer data').toBe(false)
  const visit = (item: unknown): void => {
    if (typeof item === 'string') {
      expect(/\b(?:https?|wss?):\/\//i.test(item), 'Runner URL appeared in Renderer data').toBe(
        false,
      )
      // oRPC's default MessagePort carrier sends JSON strings, so inspect the
      // envelope's actual keys too, rather than only the SDK's projected DTOs.
      if (item.startsWith('{') || item.startsWith('[')) visit(JSON.parse(item))
    } else if (Array.isArray(item)) {
      for (const child of item) visit(child)
    } else if (typeof item === 'object' && item !== null) {
      for (const [key, child] of Object.entries(item)) {
        expect(
          // Zod's issue.origin is a type label, not a connection origin. The
          // exact Runner origin is checked above across the whole payload.
          /^(?:connecturl|token|cookie|authorization|credentials?)$/i.test(key),
          'Credential-like property appeared in Renderer data',
        ).toBe(false)
        visit(child)
      }
    }
  }
  visit(value)
}

test('packaged Electron IPC returns only Bot DTOs for successful list, history and send streams, without Runner credentials', async () => {
  await withBotIPC(async ({ page, runner, botId, name }) => {
    const secrets = await readCredentials(runner.home)
    const seed = 'credential boundary seed'
    for await (const _frame of runner.client.remote.bot.send(botId, seed)) {
      // Seed real durable history through the public Remote, outside Renderer.
    }
    const text = 'credential boundary IPC turn'
    const received = await page.evaluate(
      async ({ botId, text }) => {
        let offset = 0
        const list = await window.testBotIPC.bot.list()
        const listMessages = window.testBotIPCMessages.slice(offset)
        offset = window.testBotIPCMessages.length
        const history = await window.testBotIPC.bot.history({ botId })
        const historyMessages = window.testBotIPCMessages.slice(offset)
        offset = window.testBotIPCMessages.length
        const frames = []
        for await (const frame of await window.testBotIPC.bot.send({ botId, text }))
          frames.push(frame)
        const sendMessages = window.testBotIPCMessages.slice(offset)
        offset = window.testBotIPCMessages.length
        const after = await window.testBotIPC.bot.history({ botId })
        return {
          list,
          history,
          frames,
          after,
          messages: {
            list: listMessages,
            history: historyMessages,
            send: sendMessages,
            after: window.testBotIPCMessages.slice(offset),
          },
        }
      },
      { botId, text },
    )
    expectCredentialFree(received, secrets)
    expect(received.list).toEqual([{ botId, name }])
    const before = [
      { role: 'user', text: seed },
      { role: 'assistant', text: 'echo: ' + seed },
    ]
    expect(received.history).toEqual(before)
    expect(received.frames.length).toBeGreaterThan(1)
    expect(received.frames.at(-1)).toEqual({ type: 'done' })
    const chunks = received.frames.slice(0, -1)
    for (const frame of chunks) {
      expect(frame.type).toBe('text')
      expect(Object.keys(frame).sort()).toEqual(['text', 'type'])
    }
    expect(chunks.map((frame) => (frame.type === 'text' ? frame.text : '')).join('')).toBe(
      'echo: ' + text,
    )
    expect(received.after).toEqual([
      ...before,
      { role: 'user', text },
      { role: 'assistant', text: 'echo: ' + text },
    ])
    expect(await runner.client.remote.bot.history(botId)).toEqual({
      ok: true,
      value: received.after,
    })
    // Nonempty successful payloads prove the raw-port inspection is not vacuous.
    expect(JSON.stringify(received.messages.list)).toContain(name)
    expect(JSON.stringify(received.messages.history)).toContain(seed)
    expect(received.messages.send.length).toBeGreaterThan(1)
    expect(JSON.stringify(received.messages.send)).toContain('done')
    expect(JSON.stringify(received.messages.after)).toContain(text)
  })
})

test('a slow IPC tool observer receives one frame until acknowledgement and then the latest state', async () => {
  await withBotIPC(async ({ page, runner, botId }) => {
    const before = await runner.client.remote.bot.get(botId)
    if (!before.ok) throw before.error
    const configured = await runner.client.remote.bot.saveConfiguration(botId, {
      expectedRevision: before.value.revision,
      configuration: {
        cwd: before.value.cwd,
        provider: before.value.provider,
        model: before.value.model,
        instructions: before.value.instructions,
        maxTokens: before.value.maxTokens,
        reasoningEffort: before.value.reasoningEffort,
        capabilities: ['activity'],
      },
    })
    if (!configured.ok) throw configured.error
    const secrets = await readCredentials(runner.home)
    await page.evaluate((id) => window.testToolObservation.start(id), botId)
    try {
      await expect.poll(() => page.evaluate(() => window.testToolFrames.length)).toBe(1)
      for (const text of ['tool success', 'tool failure']) {
        const started = once(runner.child, 'message', { signal: AbortSignal.timeout(10_000) })
        const sent = (async () => {
          for await (const _frame of runner.client.remote.bot.send(botId, text)) {
            // Complete execution independently while the IPC observer has no credit.
          }
        })()
        // Keep a failed transport observed until cleanup has released the gate.
        void sent.catch(() => {})
        try {
          expect((await started)[0]).toEqual({ type: 'tool-activity:started' })
          await runner.releaseTool()
          await sent
        } finally {
          await runner.releaseTool()
          await sent
        }
      }
      expect(await page.evaluate(() => window.testToolFrames.length)).toBe(1)
      await page.evaluate(() => window.testToolObservation.acknowledge())
      await expect
        .poll(() =>
          page.evaluate(() => window.testToolFrames.at(-1)?.activities.map((item) => item.status)),
        )
        .toEqual(['succeeded', 'failed'])
      const received = await page.evaluate(() => ({
        frames: window.testToolFrames,
        messages: window.testBotIPCMessages,
      }))
      expect(received.frames).toHaveLength(2)
      expect(received.frames[0]?.activities).toEqual([])
      expectCredentialFree(received, secrets)
    } finally {
      await page.evaluate(() => window.testToolObservation.stop())
    }
  })
})

test('packaged Electron IPC rejects invalid Bot IDs and oversized messages without changing Runner history', async () => {
  await withBotIPC(async ({ page, runner, botId }) => {
    const secrets = await readCredentials(runner.home)
    for await (const _frame of runner.client.remote.bot.send(botId, 'unchanged history')) {
      // A nonempty baseline makes accidental history replacement visible too.
    }
    const before = await runner.client.remote.bot.history(botId)
    expect(before).toEqual({
      ok: true,
      value: [
        { role: 'user', text: 'unchanged history' },
        { role: 'assistant', text: 'echo: unchanged history' },
      ],
    })
    for (const input of [
      { method: 'history', botId: 'not-a-bot-id', text: 'invalid history', field: 'botId' },
      { method: 'send', botId: 'not-a-bot-id', text: 'invalid send', field: 'botId' },
      { method: 'send', botId, text: 'x'.repeat(32_769), field: 'text' },
    ]) {
      const received = await page.evaluate(async ({ method, botId, text }) => {
        const offset = window.testBotIPCMessages.length
        const frames = []
        let failure: unknown
        try {
          if (method === 'history') await window.testBotIPC.bot.history({ botId })
          else
            for await (const frame of await window.testBotIPC.bot.send({ botId, text }))
              frames.push(frame)
        } catch (error) {
          // Keep all enumerable error data so credential checks include details.
          failure = error instanceof Error ? { ...error, message: error.message } : error
        }
        return { failure, frames, messages: window.testBotIPCMessages.slice(offset) }
      }, input)
      expectCredentialFree(received, secrets)
      expect(received.frames).toEqual([])
      expect(received.failure).toMatchObject({
        code: 'BAD_REQUEST',
        data: {
          issues: expect.arrayContaining([expect.objectContaining({ path: [input.field] })]),
        },
      })
      expect(received.messages.length).toBeGreaterThan(0)
      expect(await runner.client.remote.bot.history(botId)).toEqual(before)
    }
  })
})
