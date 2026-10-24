/** Publish a private, process-owned connection hint for local desktop clients. */
import { randomUUID } from 'node:crypto'
import { chmod, mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Authentication material stays in the Runner and desktop Main processes. */
export interface RunnerConnectionDescriptor {
  readonly version: 1
  readonly instanceId: string
  readonly origin: string
  readonly connectUrl: string
}

/** Atomically publish readiness; removal only withdraws this process's own hint. */
export async function publishConnection(
  home: string,
  connection: { readonly origin: string; readonly connectUrl: string },
): Promise<() => Promise<void>> {
  const directory = join(home, 'run')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  await chmod(directory, 0o700)
  const descriptor: RunnerConnectionDescriptor = {
    version: 1,
    instanceId: randomUUID(),
    ...connection,
  }
  const filename = join(directory, 'connection.json')
  const owned = join(directory, descriptor.instanceId + '.json')
  const temporary = join(directory, descriptor.instanceId + '.tmp')
  try {
    await writeFile(owned, JSON.stringify(descriptor), { flag: 'wx', mode: 0o600 })
    await symlink(descriptor.instanceId + '.json', temporary)
    await rename(temporary, filename)
  } catch (error) {
    await rm(owned, { force: true })
    throw error
  } finally {
    await rm(temporary, { force: true })
  }
  // Only delete this immutable instance file. A newer process can replace the
  // discovery link while the old process is stopping without losing its hint.
  return () => rm(owned, { force: true })
}
