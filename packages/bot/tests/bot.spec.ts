import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, test } from 'vitest'

import { createBotHost } from '../src/host.ts'

const homes: string[] = []

async function home(): Promise<string> {
  const created = await mkdtemp(path.join(tmpdir(), 'dsh-bot-'))
  homes.push(created)
  return created
}

afterEach(async () => {
  for (const directory of homes.splice(0)) await rm(directory, { recursive: true, force: true })
})

describe('Bot service contract', () => {
  test('a Bot keeps one Session across a restart and streams the turn', async () => {
    const homeDirectory = await home()
    const first = await createBotHost({ home: homeDirectory })
    const created = await first.botService.createBot({ name: 'echo', cwd: homeDirectory })

    const frames: string[] = []
    for await (const frame of first.botService.send(created.botId, 'hello')) {
      if (frame.type === 'text') frames.push(frame.text)
    }
    expect(frames.join('')).toBe('echo: hello')
    const before = await first.botService.history(created.botId)
    await first.dispose()

    const second = await createBotHost({ home: homeDirectory })
    const after = await second.botService.history(created.botId)
    await second.dispose()

    expect(after).toEqual(before)
    expect(after.map(message => message.role)).toEqual(['user', 'assistant'])
    expect(after.at(-1)?.text).toBe('echo: hello')
  })
})
