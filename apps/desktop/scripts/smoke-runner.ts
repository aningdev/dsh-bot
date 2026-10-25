import { fork } from 'node:child_process'
import { constants } from 'node:fs'
import { cp, mkdtemp, opendir, readFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { z } from 'zod'

async function verifyLinks(directory: string, root: string): Promise<void> {
  for await (const entry of await opendir(directory)) {
    const filename = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) {
      const target = await realpath(filename)
      if (!target.startsWith(root + path.sep))
        throw new Error(`Packaged Runner link escapes its resource: ${filename}`)
    } else if (entry.isDirectory()) await verifyLinks(filename, root)
  }
}

/** Boot a relocated shipped Node/profile without developer PATH, credentials or package managers. */
export async function smokeRunner(resource: string): Promise<void> {
  const metadata = z
    .object({ platform: z.string(), arch: z.string(), node: z.string() })
    .parse(JSON.parse(await readFile(path.join(resource, 'runtime.json'), 'utf8')))
  if (metadata.platform !== process.platform || metadata.arch !== process.arch)
    throw new Error('Packaged Runner target does not match the smoke host')
  const home = await mkdtemp(path.join(tmpdir(), 'runner-package-smoke-'))
  try {
    const root = await realpath(resource)
    await verifyLinks(root, root)
    const relocated = path.join(home, 'relocated runner')
    await cp(resource, relocated, {
      recursive: true,
      verbatimSymlinks: true,
      mode: constants.COPYFILE_FICLONE,
    })
    await new Promise<void>((resolve, reject) => {
      const child = fork(path.join(relocated, 'apps/runner/lib/index.js'), ['--home', home], {
        execPath: path.join(relocated, 'bin/node'),
        execArgv: [],
        cwd: home,
        env: { HOME: home, TMPDIR: tmpdir(), PATH: path.join(relocated, 'bin') + ':/usr/bin:/bin' },
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      })
      let ready = false
      let failure: Error | undefined
      let diagnostics = ''
      const timeout = setTimeout(() => {
        failure = new Error('Packaged Runner readiness or shutdown timed out')
        child.kill('SIGKILL')
      }, 30_000)
      child.stdout?.on('data', (chunk: Buffer) => {
        diagnostics += chunk.toString()
      })
      child.stderr?.on('data', (chunk: Buffer) => {
        diagnostics += chunk.toString()
      })
      child.on('message', (message: unknown) => {
        const parsed = z
          .object({ type: z.string(), message: z.string().optional() })
          .safeParse(message)
        if (!parsed.success) return
        if (parsed.data.type === 'ready') {
          ready = true
          child.send({ type: 'shutdown' }, (error) => {
            if (error) {
              failure = error
              child.kill('SIGKILL')
            }
          })
        } else if (parsed.data.type === 'fatal') {
          failure = new Error(parsed.data.message ?? 'Packaged Runner boot failed')
        }
      })
      child.once('error', (error) => {
        failure = error
      })
      child.once('close', (code) => {
        clearTimeout(timeout)
        if (!failure && ready && code === 0) resolve()
        else
          reject(
            new Error(
              `Packaged Runner failed (${String(code)}): ${failure?.message ?? 'not ready'}\n${diagnostics.slice(-6000)}`,
              { cause: failure },
            ),
          )
      })
    })
    console.log(
      `Relocated packaged Runner Node ${metadata.node} and profile are ready without system Node/Bun/pnpm`,
    )
  } finally {
    await rm(home, { recursive: true, force: true, maxRetries: 5 })
  }
}
