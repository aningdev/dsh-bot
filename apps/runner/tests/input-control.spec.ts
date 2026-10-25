import { expect, test } from 'vite-plus/test'

import { runnerHarness } from './fixtures/runner.ts'

const { home, start, stop, connect } = runnerHarness()

test('queued input survives stop and restart and can be withdrawn without execution', async () => {
  const directory = await home()
  const running = await start(directory)
  const client = await connect(running.ready)
  const created = await client.remote.bot.create({ name: 'input control', cwd: directory })
  if (!created.ok) throw created.error
  const id = created.value.botId
  expect(await client.remote.bot.submit(id, 'hold')).toMatchObject({
    ok: true,
    value: { mode: 'queue' },
  })
  await expect
    .poll(async () => client.remote.bot.history(id))
    .toMatchObject({
      ok: true,
      value: expect.arrayContaining([{ role: 'user', text: 'hold' }]),
    })
  const queued = await client.remote.bot.submit(id, 'keep this')
  if (!queued.ok) throw queued.error
  const withdrawn = await client.remote.bot.submit(id, 'withdraw this')
  if (!withdrawn.ok) throw withdrawn.error
  expect(await client.remote.bot.withdraw(id, withdrawn.value.id)).toEqual({
    ok: true,
    value: { removed: true },
  })
  expect(await client.remote.bot.withdraw(id, withdrawn.value.id)).toEqual({
    ok: true,
    value: { removed: false },
  })
  expect(await client.remote.bot.inputState(id)).toMatchObject({
    ok: true,
    value: {
      status: 'running',
      pending: [{ id: queued.value.id, text: 'keep this', mode: 'queue' }],
    },
  })
  expect(await client.remote.bot.stop(id)).toEqual({ ok: true, value: undefined })
  expect(await client.remote.bot.inputState(id)).toMatchObject({
    ok: true,
    value: { status: 'idle', pending: [{ id: queued.value.id, text: 'keep this', mode: 'queue' }] },
  })
  await client.fiber.dispose()
  expect(await stop(running.child)).toEqual({ code: 0, acknowledged: true })
  const restarted = await start(directory)
  const reconnected = await connect(restarted.ready)
  expect(await reconnected.remote.bot.inputState(id)).toMatchObject({
    ok: true,
    value: { status: 'idle', pending: [{ id: queued.value.id, text: 'keep this', mode: 'queue' }] },
  })
  expect(await reconnected.remote.bot.withdraw(id, queued.value.id)).toEqual({
    ok: true,
    value: { removed: true },
  })
  expect(await reconnected.remote.bot.inputState(id)).toMatchObject({
    ok: true,
    value: { status: 'idle', pending: [] },
  })
  const history = await reconnected.remote.bot.history(id)
  if (!history.ok) throw history.error
  expect(history.value.filter((message) => message.role === 'user')).toEqual([
    { role: 'user', text: 'hold' },
  ])
})
