import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, expect, test } from 'vite-plus/test'

import { RunnerService } from '../../../src/main/runner-service'

const directories: string[] = []
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

test('installing without login startup stays stopped; concurrent starts share one job and explicit stop stays unloaded', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-service-'))
  directories.push(directory)
  const entry = path.join(directory, 'runner entry.mjs')
  await writeFile(entry, '')
  let loaded = false
  const service = new RunnerService({
    home: path.join(directory, 'runner'),
    loginDirectory: path.join(directory, 'LaunchAgents'),
    label: 'com.dshbot.test.runner',
    uid: 501,
    runtime: { node: process.execPath, entry },
    isAlive: () => false,
    launchctl: async (args) => {
      if (args[0] === 'print')
        return loaded
          ? { code: 0, stdout: 'state = running\n\tpid = 4321\n' }
          : { code: 113, stdout: '' }
      if (args[0] === 'bootstrap') {
        if (loaded) throw new Error('duplicate bootstrap')
        loaded = true
      } else if (args[0] === 'bootout') loaded = false
      else throw new Error('unexpected launchctl action')
      return { code: 0, stdout: '' }
    },
  })
  await service.install()
  expect(await service.status()).toEqual({
    installed: true,
    loginAtStartup: false,
    loaded: false,
    pid: null,
  })
  await Promise.all([service.start(), service.start()])
  expect(await service.status()).toEqual({
    installed: true,
    loginAtStartup: false,
    loaded: true,
    pid: 4321,
  })
  await service.stop()
  expect((await service.status()).loaded).toBe(false)
  await service.setLoginAtStartup(true)
  expect((await service.status()).loginAtStartup).toBe(true)
  // Enabling login startup does not silently undo an explicit stop.
  expect((await service.status()).loaded).toBe(false)
  const plist = await readFile(
    path.join(directory, 'LaunchAgents/com.dshbot.test.runner.plist'),
    'utf8',
  )
  expect(plist).toContain('<key>KeepAlive</key><true/>')
  expect(plist).toContain('<key>RunAtLoad</key><true/>')
  // Retrying installation repairs the login copy after an interrupted two-file update.
  const loginPlist = path.join(directory, 'LaunchAgents/com.dshbot.test.runner.plist')
  await writeFile(loginPlist, '<outdated/>')
  await service.install()
  expect(await readFile(loginPlist, 'utf8')).toBe(plist)
  await service.setLoginAtStartup(false)
  expect((await service.status()).loginAtStartup).toBe(false)
  await service.uninstall()
  expect((await service.status()).installed).toBe(false)
})

test('upgrade waits for the old process, retains login preference, and leaves failures stopped', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-upgrade-'))
  directories.push(directory)
  const entry = path.join(directory, 'runner.mjs')
  const nextEntry = path.join(directory, 'next.mjs')
  await Promise.all([writeFile(entry, ''), writeFile(nextEntry, '')])
  let loaded = false
  let oldAlive = false
  let preparationFails = false
  let preparationCount = 0
  let replacement = false
  let readyCount = 0
  let bootout: () => void = () => undefined
  const stopped = new Promise<void>((resolve) => {
    bootout = resolve
  })
  const service = new RunnerService({
    home: path.join(directory, 'runner'),
    loginDirectory: path.join(directory, 'LaunchAgents'),
    label: 'com.dshbot.test.upgrade',
    uid: 501,
    runtime: { node: process.execPath, entry },
    isAlive: () => oldAlive,
    prepareRuntime: async () => {
      preparationCount++
      if (preparationFails) throw new Error('copy failed')
      return { node: process.execPath, entry: replacement ? nextEntry : entry }
    },
    waitReady: async () => {
      readyCount++
    },
    launchctl: async (args) => {
      if (args[0] === 'print')
        return loaded
          ? { code: 0, stdout: 'state = running\n\tpid = 4321\n' }
          : { code: 113, stdout: '' }
      if (args[0] === 'bootstrap') loaded = true
      else if (args[0] === 'bootout') {
        loaded = false
        bootout()
      } else throw new Error('unexpected launchctl action')
      return { code: 0, stdout: '' }
    },
  })
  await service.start()
  await service.setLoginAtStartup(true)
  const beforePreparation = preparationCount
  replacement = true
  oldAlive = true
  const upgrading = service.upgrade()
  await stopped
  expect(preparationCount).toBe(beforePreparation)
  oldAlive = false
  await upgrading
  expect(preparationCount).toBe(beforePreparation + 1)
  expect(readyCount).toBe(1)
  expect(await service.status()).toMatchObject({ loaded: true, loginAtStartup: true })
  const loginPlist = path.join(directory, 'LaunchAgents/com.dshbot.test.upgrade.plist')
  expect(await readFile(loginPlist, 'utf8')).toContain(nextEntry)
  await service.stop()
  await service.upgrade()
  expect((await service.status()).loaded).toBe(false)
  expect(readyCount).toBe(1)
  await service.start()
  const before = await readFile(loginPlist, 'utf8')
  preparationFails = true
  await expect(service.upgrade()).rejects.toThrow('copy failed')
  expect(await readFile(loginPlist, 'utf8')).toBe(before)
  expect(await service.status()).toMatchObject({
    installed: true,
    loaded: false,
    loginAtStartup: true,
  })
})
