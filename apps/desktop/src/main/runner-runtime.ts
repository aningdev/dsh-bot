import { createHash, randomUUID } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { cp, lstat, mkdir, readFile, readdir, readlink, rename, rm } from 'node:fs/promises'
import path from 'node:path'

import { z } from 'zod'

const runtimeSchema = z.object({
  schemaVersion: z.literal(1),
  platform: z.literal('darwin'),
  arch: z.string(),
})

/** Includes executable modes, relative links and product code, not just the dependency lock. */
async function fingerprint(root: string): Promise<string> {
  const hash = createHash('sha256')
  async function visit(directory: string): Promise<void> {
    for (const name of (await readdir(directory)).sort()) {
      const filename = path.join(directory, name)
      const relative = path.relative(root, filename)
      const info = await lstat(filename)
      if (info.isSymbolicLink()) {
        const target = await readlink(filename)
        const resolved = path.relative(root, path.resolve(directory, target))
        if (path.isAbsolute(target) || resolved === '..' || resolved.startsWith('../'))
          throw new Error('随包运行时包含外部链接，不能安装。')
        hash.update('link\0' + relative + '\0' + target + '\0')
      } else if (info.isDirectory()) {
        hash.update('directory\0' + relative + '\0')
        await visit(filename)
      } else if (info.isFile()) {
        hash.update(
          'file\0' + relative + '\0' + String(info.mode & 0o777) + '\0' + String(info.size) + '\0',
        )
        for await (const chunk of createReadStream(filename)) hash.update(chunk)
        hash.update('\0')
      } else throw new Error('随包运行时包含不支持的文件。')
    }
  }
  await visit(root)
  return hash.digest('hex')
}

/** Running versions never read mutable .app resources; failed copies never replace a version. */
export async function installPackagedRuntime(root: string, home: string) {
  const metadata = runtimeSchema.parse(
    JSON.parse(await readFile(path.join(root, 'runtime.json'), 'utf8')),
  )
  if (metadata.arch !== process.arch) throw new Error('随包运行时架构与本机不符。')
  const identity = await fingerprint(root)
  const directory = path.join(home, 'service/runtimes')
  const installed = path.join(directory, identity)
  await mkdir(directory, { recursive: true, mode: 0o700 })
  let present = false
  try {
    present = (await lstat(installed)).isDirectory()
    if (!present) throw new Error('已安装运行时内容无效，请保持后台停止并修复安装。')
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error
  }
  if (present && (await fingerprint(installed)) !== identity)
    throw new Error('已安装运行时内容无效，请保持后台停止并修复安装。')
  if (!present) {
    const staging = path.join(directory, 'staging-' + randomUUID())
    try {
      await cp(root, staging, { recursive: true, verbatimSymlinks: true })
      if ((await fingerprint(staging)) !== identity)
        throw new Error('复制期间运行时发生变化，未应用更新，请重试。')
      try {
        await rename(staging, installed)
      } catch (error) {
        // Another desktop can publish the same immutable payload first.
        if (
          !(
            error instanceof Error &&
            'code' in error &&
            ['EEXIST', 'ENOTEMPTY'].includes(String(error.code))
          )
        )
          throw error
        if ((await fingerprint(installed)) !== identity) throw error
      }
    } finally {
      await rm(staging, { recursive: true, force: true })
    }
  }
  return {
    node: path.join(installed, 'bin/node'),
    entry: path.join(installed, 'apps/runner/lib/index.js'),
  }
}
