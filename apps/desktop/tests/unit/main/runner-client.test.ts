import { randomUUID } from 'node:crypto'
import { chmod, mkdir, mkdtemp, rm, symlink, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, expect, test, vi } from 'vite-plus/test'
import { WebSocket, WebSocketServer } from 'ws'

import { RunnerClient } from '../../../src/main/runner-client'
import { readRunnerDescriptor, RunnerError } from '../../../src/main/runner-connection'

const homes: string[] = []
const clients: RunnerClient[] = []
afterEach(async () => {
  const closed = await Promise.allSettled(clients.splice(0).map((client) => client.close()))
  const removed = await Promise.allSettled(
    homes.splice(0).map((home) => rm(home, { recursive: true, force: true })),
  )
  const failures = [...closed, ...removed].flatMap((result) =>
    result.status === 'rejected' ? [result.reason] : [],
  )
  if (failures.length > 0) throw new AggregateError(failures, 'Runner client test cleanup failed')
})

async function descriptor(origin = 'http://127.0.0.1:43210') {
  const home = await mkdtemp(join(tmpdir(), 'desktop-runner-boundary-'))
  homes.push(home)
  const directory = join(home, 'run')
  await mkdir(directory, { mode: 0o700 })
  const instanceId = randomUUID()
  const value = {
    version: 1,
    instanceId,
    origin,
    connectUrl: origin + '/connect?token=test-private-token',
  }
  const owned = join(directory, instanceId + '.json')
  await writeFile(owned, JSON.stringify(value), { mode: 0o600 })
  const link = join(directory, 'connection.json')
  await symlink(instanceId + '.json', link)
  return { home, directory, owned, link, value }
}

function clientFor(home: string, doFetch: typeof fetch) {
  const client = new RunnerClient({ home: () => home, fetch: doFetch })
  clients.push(client)
  return client
}

test('only the private owned instance file supplies connection credentials', async () => {
  const fixture = await descriptor()
  expect(await readRunnerDescriptor(fixture.home)).toEqual(fixture.value)
  await unlink(fixture.link)
  const outside = join(fixture.home, 'outside.json')
  await writeFile(outside, JSON.stringify(fixture.value), { mode: 0o600 })
  await symlink('../outside.json', fixture.link)
  const doFetch = vi.fn<typeof fetch>()
  await expect(clientFor(fixture.home, doFetch).list()).rejects.toBeInstanceOf(RunnerError)
  expect(doFetch).not.toHaveBeenCalled()
})

test.skipIf(process.platform === 'win32')(
  'a readable-by-others credential file is rejected before any network request',
  async () => {
    const fixture = await descriptor()
    await chmod(fixture.owned, 0o644)
    const doFetch = vi.fn<typeof fetch>()
    await expect(clientFor(fixture.home, doFetch).list()).rejects.toBeInstanceOf(RunnerError)
    expect(doFetch).not.toHaveBeenCalled()
  },
)

test('a discovered non-local origin cannot send authentication outside the local Runner', async () => {
  const fixture = await descriptor('https://example.invalid:443')
  const doFetch = vi.fn<typeof fetch>()
  await expect(clientFor(fixture.home, doFetch).list()).rejects.toThrow('连接文件无效')
  expect(doFetch).not.toHaveBeenCalled()
})

test('an authentication redirect to another origin is rejected without disclosing connection material', async () => {
  const fixture = await descriptor()
  const doFetch = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(null, {
      status: 302,
      headers: {
        location: 'https://example.invalid/api/remote.mux',
        'set-cookie': 'api=test-cookie-secret; HttpOnly',
      },
    }),
  )
  const failure: unknown = await clientFor(fixture.home, doFetch)
    .list()
    .catch((error: unknown) => error)
  expect(failure).toBeInstanceOf(RunnerError)
  expect(String(failure)).not.toMatch(
    /test-private-token|test-cookie-secret|example\.invalid|43210/,
  )
  expect(doFetch).toHaveBeenCalledTimes(1)
})

test('a request cancellation preserves the authenticated lifecycle socket', async () => {
  const server = new WebSocketServer({ host: '127.0.0.1', port: 0 })
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  const address = server.address()
  if (typeof address === 'string' || address === null) throw new Error('Missing server address')
  const fixture = await descriptor(`http://127.0.0.1:${address.port}`)
  const doFetch: typeof fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input)
    if (url.pathname === '/connect') {
      return new Response(null, {
        status: 302,
        headers: { location: '/api/remote.mux', 'set-cookie': 'api=test-cookie; HttpOnly' },
      })
    }
    if (typeof init?.body !== 'string') throw new Error('Missing RPC envelope')
    const { rpcId } = JSON.parse(init.body)
    return Response.json({
      type: 'server-response',
      rpcId,
      result: url.pathname.endsWith('/history')
        ? {
            ok: false,
            error: { code: 'gateway/cancelled', message: 'Request cancelled', details: {} },
          }
        : { ok: true, value: [] },
    })
  }
  const client = clientFor(fixture.home, doFetch)
  try {
    expect(await client.list()).toEqual([])
    const socket = [...server.clients][0]
    expect(socket?.readyState).toBe(WebSocket.OPEN)
    await expect(client.history(randomUUID())).rejects.toBeInstanceOf(RunnerError)
    expect(await client.list()).toEqual([])
    // A cancelled read does not retire streams carried by this same socket.
    expect(socket?.readyState).toBe(WebSocket.OPEN)
  } finally {
    await client.close()
    for (const socket of server.clients) socket.terminate()
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
})
