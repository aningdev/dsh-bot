import { createHash, randomUUID } from 'node:crypto'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { readPackagedApp } from '../../scripts/packaged-app'
import { readRunnerDescriptor } from '../../src/main/runner-connection'
import { RunnerService } from '../../src/main/runner-service'
import { APP_CONFIG } from '../../src/shared/app-config'
import { launchTestApp } from './fixtures'

test('background controls show service state without starting or enabling login startup', async () => {
  test.skip(process.platform !== 'darwin', 'LaunchAgent management is macOS only')
  const opened = await launchTestApp({ runtimeRoot: path.join(tmpdir(), randomUUID()) })
  try {
    const page = await opened.app.firstWindow()
    await page.getByRole('button', { name: '后台服务', exact: true }).click({ timeout: 3000 })
    const dialog = page.getByRole('dialog', { name: '后台服务', exact: true })
    await expect(dialog.getByRole('status')).toHaveText('尚未安装')
    await expect(
      dialog.getByRole('checkbox', { name: '登录时启动后台', exact: true }),
    ).not.toBeChecked()
    await expect(dialog.getByRole('button', { name: '停止后台', exact: true })).toBeDisabled()
    await dialog.getByRole('button', { name: '安装后台', exact: true }).click()
    await expect(dialog.getByRole('alert')).toHaveText(
      '后台服务操作失败，请确认随包运行时已安装，且已登录 macOS 桌面后重试。',
    )
    await expect(dialog.getByRole('status')).toHaveText('尚未安装')
    await expect(dialog.getByRole('button', { name: '启动后台', exact: true })).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  } finally {
    await opened.dispose()
  }
})

test('shipped runtime installs and starts without developer tools and survives desktop reopening', async () => {
  test.setTimeout(120_000)
  test.skip(process.platform !== 'darwin', 'LaunchAgent management is macOS only')
  const home = await mkdtemp(path.join(tmpdir(), 'runner-delivery-'))
  const packagedRoot = path.resolve(
    path.dirname(readPackagedApp().executable),
    '../Resources/runner',
  )
  const runtimeRoot = path.join(home, 'application-runtime')
  await cp(packagedRoot, runtimeRoot, { recursive: true, verbatimSymlinks: true })
  const uid = process.getuid?.()
  if (!uid) throw new Error('Run this acceptance test as a logged-in desktop user')
  const service = new RunnerService({
    home,
    loginDirectory: path.join(homedir(), 'Library/LaunchAgents'),
    label:
      APP_CONFIG.appId + '.runner.' + createHash('sha256').update(home).digest('hex').slice(0, 12),
    uid,
    runtime: {
      node: path.join(runtimeRoot, 'bin/node'),
      entry: path.join(runtimeRoot, 'apps/runner/lib/index.js'),
    },
  })
  let opened = await launchTestApp({ runnerHome: home, runtimeRoot, withoutDevelopmentTools: true })
  try {
    let page = await opened.app.firstWindow()
    await page.getByRole('button', { name: '后台服务', exact: true }).click()
    let dialog = page.getByRole('dialog', { name: '后台服务', exact: true })
    await dialog.getByRole('button', { name: '安装后台', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('后台已停止', { timeout: 30_000 })
    await dialog.getByRole('button', { name: '启动后台', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('后台正在运行')
    await expect.poll(async () => (await service.status()).pid).not.toBeNull()
    await expect
      .poll(async () => {
        try {
          await readRunnerDescriptor(home)
          return true
        } catch {
          return false
        }
      })
      .toBe(true)
    const pid = (await service.status()).pid
    await opened.dispose()
    expect((await service.status()).pid).toBe(pid)
    const previousPlist = await readFile(path.join(home, 'service/runner.plist'), 'utf8')
    // Replacing application resources cannot change the running version's dependencies.
    await writeFile(path.join(runtimeRoot, 'upgrade-probe.txt'), 'replacement bundle')
    opened = await launchTestApp({ runnerHome: home, runtimeRoot, withoutDevelopmentTools: true })
    page = await opened.app.firstWindow()
    await page.getByRole('button', { name: '后台服务', exact: true }).click()
    dialog = page.getByRole('dialog', { name: '后台服务', exact: true })
    await expect(dialog.getByRole('status')).toHaveText('后台正在运行')
    expect((await service.status()).pid).toBe(pid)
    await page.keyboard.press('Escape')
    await expect(
      page.getByText('暂无 Bot。新建 Bot 后即可开始对话。', { exact: true }),
    ).toBeVisible()
    // A dead instance's endpoint must not be reused after launchd restarts it.
    const previous = await readRunnerDescriptor(home)
    if (pid === null) throw new Error('Runner must be running before the crash probe')
    process.kill(pid, 'SIGKILL')
    await expect.poll(async () => (await service.status()).pid, { timeout: 25_000 }).not.toBe(pid)
    await expect
      .poll(
        async () => {
          try {
            return (await readRunnerDescriptor(home)).instanceId !== previous.instanceId
          } catch {
            return false
          }
        },
        { timeout: 25_000 },
      )
      .toBe(true)
    // This first catalog request must authenticate against the replacement instance.
    await page.getByRole('button', { name: '新建 Bot', exact: true }).click()
    const create = page.getByRole('dialog', { name: '新建 Bot', exact: true })
    await expect(create.getByLabel('模板', { exact: true })).toContainText('空白助手')
    await page.keyboard.press('Escape')
    await expect(create).toHaveCount(0)
    const beforeUpgrade = await readRunnerDescriptor(home)
    await page.getByRole('button', { name: '后台服务', exact: true }).click()
    await dialog.getByRole('button', { name: '更新后台', exact: true }).click()
    await expect(dialog.getByText('后台运行时已更新。', { exact: true })).toBeVisible({
      timeout: 30_000,
    })
    expect((await readRunnerDescriptor(home)).instanceId).not.toBe(beforeUpgrade.instanceId)
    await expect(dialog.getByRole('status')).toHaveText('后台正在运行')
    const plist = await readFile(path.join(home, 'service/runner.plist'), 'utf8')
    expect(plist).toContain(path.join(home, 'service/runtimes'))
    expect(plist).not.toContain(runtimeRoot)
    expect(plist).not.toBe(previousPlist)
    await dialog.getByRole('button', { name: '停止后台', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('后台已停止')
    await dialog.getByRole('button', { name: '卸载服务', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('尚未安装')
  } finally {
    try {
      await service.uninstall()
    } finally {
      await opened.dispose()
    }
    await rm(home, { recursive: true, force: true, maxRetries: 5 })
  }
})
