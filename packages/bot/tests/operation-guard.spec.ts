/** Retirement must preserve operation ownership through asynchronous cleanup. */
import { OperationGuardRegistry } from '@deepseek-ai/dsh-typert-protocol'
import { expect, test } from 'vite-plus/test'

test('opening releases replacement access while retirement still drains the consumer', async () => {
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(
    () => new Error('withdrawn'),
  )
  let released = false
  const withdraw = registry.register(() => ({
    lifetime: 'opening',
    release() {
      released = true
    },
  }))
  const lease = await registry.acquire({})
  await lease?.releaseOpening?.()
  expect(released).toBe(true)
  let retired = false
  const retiring = withdraw().then(() => {
    retired = true
  })
  await Promise.resolve()
  expect(lease?.signal?.aborted).toBe(true)
  expect(retired).toBe(false)
  await lease?.release()
  await retiring
})

test('retirement reports an accepted consumer cleanup failure', async () => {
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(
    () => new Error('withdrawn'),
  )
  const failure = new Error('consumer cleanup failed')
  const withdraw = registry.register(() => ({
    release() {
      throw failure
    },
  }))
  const lease = await registry.acquire({})
  const retiring = withdraw()
  await expect(lease?.release()).rejects.toBe(failure)
  await expect(retiring).rejects.toThrow('Operation cleanup failed')
})

test('retirement includes stream cleanup failures after opening access was released', async () => {
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(
    () => new Error('withdrawn'),
  )
  const withdraw = registry.register(() => ({ lifetime: 'opening', release() {} }))
  const lease = await registry.acquire({})
  await lease?.releaseOpening?.()
  const retiring = withdraw()
  await lease?.release(new Error('stream cleanup failed'))
  await expect(retiring).rejects.toThrow('Operation cleanup failed')
})

test('unmanaged operations preserve the caller signal and result', async () => {
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(
    () => new Error('withdrawn'),
  )
  const caller = new AbortController()
  expect(registry.enabled).toBe(false)
  expect(
    await registry.run({ signal: caller.signal }, async (signal) => {
      expect(signal).toBe(caller.signal)
      return 'standalone'
    }),
  ).toBe('standalone')
})

test('withdrawal cancels admission and waits for one complete release before another owner registers', async () => {
  const unavailable = new Error('withdrawn')
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(() => unavailable)
  const entered = Promise.withResolvers<void>()
  const finish = Promise.withResolvers<void>()
  let releases = 0
  const withdraw = registry.register(() => ({
    release: async () => {
      entered.resolve()
      await finish.promise
      releases++
    },
  }))
  expect(() => registry.register(() => undefined)).toThrow('already registered')
  const lease = await registry.acquire({})
  if (lease === undefined) throw new Error('Missing managed lease')
  let retired = false
  const retiring = withdraw().then(() => {
    retired = true
  })
  expect(lease.signal?.aborted).toBe(true)
  await expect(registry.acquire({})).rejects.toBe(unavailable)
  const first = lease.release()
  const second = lease.release()
  await entered.promise
  expect(retired).toBe(false)
  finish.resolve()
  await Promise.all([first, second, retiring])
  expect(releases).toBe(1)
  await expect(registry.acquire({})).rejects.toBe(unavailable)
  const closeReplacement = registry.register(() => ({ release() {} }))
  const replacement = await registry.acquire({})
  await replacement?.release()
  await closeReplacement()
})

test('a lease delivered after withdrawal is cleaned before withdrawal completes', async () => {
  const unavailable = new Error('withdrawn')
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(() => unavailable)
  const entered = Promise.withResolvers<void>()
  const grant = Promise.withResolvers<void>()
  let released = false
  const withdraw = registry.register(async () => {
    entered.resolve()
    await grant.promise
    return {
      release() {
        released = true
      },
    }
  })
  const acquisition = registry.acquire({})
  await entered.promise
  const retirement = withdraw()
  grant.resolve()
  await expect(acquisition).rejects.toBe(unavailable)
  await retirement
  expect(released).toBe(true)
})

test('failed acquisition does not execute the operation or strand withdrawal', async () => {
  const failure = new Error('lookup failed')
  const registry = new OperationGuardRegistry<{ signal?: AbortSignal }>(
    () => new Error('withdrawn'),
  )
  const withdraw = registry.register(() => {
    throw failure
  })
  let invoked = false
  await expect(
    registry.run({}, async () => {
      invoked = true
    }),
  ).rejects.toBe(failure)
  await withdraw()
  expect(invoked).toBe(false)
})
