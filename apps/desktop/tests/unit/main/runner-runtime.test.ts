import { mkdir, mkdtemp, readFile, readlink, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, expect, test } from 'vite-plus/test'

import { installPackagedRuntime } from '../../../src/main/runner-runtime'

const directories: string[] = []
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

test('installed runtime survives replacement of application resources and preserves relative links', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-runtime-version-'))
  directories.push(directory)
  const source = path.join(directory, 'app-resources')
  const home = path.join(directory, 'home')
  await mkdir(path.join(source, 'bin'), { recursive: true })
  await mkdir(path.join(source, 'apps/runner/lib'), { recursive: true })
  await writeFile(
    path.join(source, 'runtime.json'),
    JSON.stringify({ schemaVersion: 1, platform: 'darwin', arch: process.arch }),
  )
  await writeFile(path.join(source, 'bin/node'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  const entry = path.join(source, 'apps/runner/lib/index.js')
  await writeFile(entry, 'version-one')
  await symlink('apps/runner/lib', path.join(source, 'relative-link'))
  const first = await installPackagedRuntime(source, home)
  expect(await readlink(path.join(path.dirname(path.dirname(first.node)), 'relative-link'))).toBe(
    'apps/runner/lib',
  )
  expect(await installPackagedRuntime(source, home)).toEqual(first)
  await writeFile(entry, 'version-two')
  const second = await installPackagedRuntime(source, home)
  expect(second.entry).not.toBe(first.entry)
  await rm(source, { recursive: true })
  expect(await readFile(first.entry, 'utf8')).toBe('version-one')
  expect(await readFile(second.entry, 'utf8')).toBe('version-two')
  expect((await stat(second.node)).mode & 0o111).toBe(0o111)
})
