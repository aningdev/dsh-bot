import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import type { Context } from '@deepseek-ai/cordis'
import { afterEach, describe, expect, test } from 'vite-plus/test'

import { createBotHost } from './fixtures/host.ts'

const homes: string[] = []
const hosts: Context[] = []
const signal = new AbortController().signal
async function home(): Promise<string> {
  const created = await mkdtemp(path.join(tmpdir(), 'dsh-bot-'))
  homes.push(created)
  return created
}
async function host(directory: string): Promise<Context> {
  const ctx = await createBotHost(directory)
  hosts.push(ctx)
  return ctx
}
afterEach(async () => {
  for (const ctx of hosts.splice(0)) await ctx.fiber.dispose()
  for (const directory of homes.splice(0)) await rm(directory, { recursive: true, force: true })
})

describe('Bot Controller public contract', () => {
  test('a Bot keeps one Session across a restart and streams each turn', async () => {
    const directory = await home()
    const first = await host(directory)
    const created = await first.botController.createBot({ name: 'echo', cwd: directory }, signal)
    expect(await first.botController.history(created.botId, signal)).toEqual([])
    const frames = []
    for await (const frame of first.botController.send(created.botId, 'hello', signal))
      frames.push(frame)
    expect(
      frames
        .filter((frame) => frame.type === 'text')
        .map((frame) => frame.text)
        .join(''),
    ).toBe('echo: hello')
    expect(frames.filter((frame) => frame.type === 'text').length).toBeGreaterThan(1)
    expect(frames.at(-1)).toEqual({ type: 'done' })
    const before = await first.botController.history(created.botId, signal)
    await first.fiber.dispose()
    const second = await host(directory)
    expect(await second.botController.getBot(created.botId, signal)).toEqual(created)
    expect(await second.botController.history(created.botId, signal)).toEqual(before)
    for await (const _frame of second.botController.send(created.botId, 'again', signal)) {
      /* Drain through the durability acknowledgement. */
    }
    expect(await second.botController.history(created.botId, signal)).toEqual([
      { role: 'user', text: 'hello' },
      { role: 'assistant', text: 'echo: hello' },
      { role: 'user', text: 'again' },
      { role: 'assistant', text: 'echo: again' },
    ])
  })
})
