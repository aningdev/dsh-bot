import { constants } from 'node:fs'
import { lstat, open, readlink, realpath } from 'node:fs/promises'
import path from 'node:path'

import { z } from 'zod'

const descriptorSchema = z.strictObject({
  version: z.literal(1),
  instanceId: z.uuid(),
  origin: z.string(),
  connectUrl: z.string(),
})

export type RunnerDescriptor = z.infer<typeof descriptorSchema>

/** These messages are the only connection diagnostics allowed across IPC. */
export class RunnerError extends Error {
  readonly code: 'BAD_REQUEST' | 'SERVICE_UNAVAILABLE' | 'CONFLICT'

  constructor(
    message: string,
    code: 'BAD_REQUEST' | 'SERVICE_UNAVAILABLE' | 'CONFLICT' = 'SERVICE_UNAVAILABLE',
  ) {
    super(message)
    this.name = 'RunnerError'
    this.code = code
  }
}

export function runnerUnavailable(): RunnerError {
  return new RunnerError('无法连接后台，请确认 Runner 已启动后重试。')
}

function invalidDescriptor(): RunnerError {
  return new RunnerError('后台连接文件无效或权限不安全，请重新启动 Runner 后重试。')
}

/** Resolve an explicit development home without silently accepting a relative path. */
export function runnerHome(userData: string, override = process.env.DSH_BOT_RUNNER_HOME): string {
  if (override === undefined) return path.join(userData, 'runner')
  if (!path.isAbsolute(override))
    throw new RunnerError('DSH_BOT_RUNNER_HOME 必须是绝对路径，请修正后重试。')
  return override
}

function privateOwner(info: { mode: number; uid: number }, mode: number): boolean {
  return (
    process.platform === 'win32' ||
    (info.uid === process.getuid?.() && (info.mode & 0o7777) === mode)
  )
}

/** Follow only the private discovery link to an immutable file directly inside run/. */
export async function readRunnerDescriptor(home: string): Promise<RunnerDescriptor> {
  try {
    const canonicalHome = await realpath(home)
    const directory = path.join(canonicalHome, 'run')
    const directoryInfo = await lstat(directory)
    if (!directoryInfo.isDirectory() || !privateOwner(directoryInfo, 0o700))
      throw invalidDescriptor()
    const filename = path.join(directory, 'connection.json')
    const link = await lstat(filename)
    if (!link.isSymbolicLink() || (process.getuid && link.uid !== process.getuid()))
      throw invalidDescriptor()
    const target = path.resolve(directory, await readlink(filename))
    if (path.dirname(target) !== directory || (await realpath(target)) !== target)
      throw invalidDescriptor()
    const file = await open(target, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0))
    try {
      const info = await file.stat()
      if (!info.isFile() || !privateOwner(info, 0o600) || info.size > 16_384)
        throw invalidDescriptor()
      const descriptor = descriptorSchema.parse(JSON.parse(await file.readFile('utf8')))
      if (path.basename(target) !== descriptor.instanceId + '.json') throw invalidDescriptor()
      const origin = new URL(descriptor.origin)
      const connect = new URL(descriptor.connectUrl)
      // IP literals avoid DNS and proxy authority changes. URL normalizes IPv4 forms.
      const loopback = origin.hostname === '[::1]' || /^127(?:\.\d{1,3}){3}$/.test(origin.hostname)
      if (
        !loopback ||
        origin.protocol !== 'http:' ||
        !origin.port ||
        descriptor.origin !== origin.origin ||
        connect.href !== descriptor.connectUrl ||
        connect.origin !== origin.origin ||
        connect.username ||
        connect.password ||
        connect.hash ||
        connect.pathname !== '/connect' ||
        [...connect.searchParams.keys()].length !== 1 ||
        connect.searchParams.getAll('token').length !== 1 ||
        !connect.searchParams.get('token')
      )
        throw invalidDescriptor()
      return descriptor
    } finally {
      await file.close()
    }
  } catch (error) {
    if (error instanceof RunnerError) throw error
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      throw runnerUnavailable()
    throw invalidDescriptor()
  }
}
