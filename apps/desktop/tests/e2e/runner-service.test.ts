import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { expect, test } from '@playwright/test'

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
