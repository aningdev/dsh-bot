import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('API key is write-only, persists across Runner restart and can be removed', async () => {
  let runner = await startTestRunner()
  let opened = await launchTestApp({ runnerHome: runner.home })
  const secret = 'sk-desktop-credential-fixture-only'
  try {
    let page = await opened.app.firstWindow()
    await page.getByRole('button', { name: 'API 设置', exact: true }).click()
    let dialog = page.getByRole('dialog', { name: 'DeepSeek API', exact: true })
    await expect(dialog.getByRole('status')).toHaveText('尚未配置 API Key')
    await dialog.getByLabel('API Key', { exact: true }).fill(secret)
    await dialog.getByRole('button', { name: '保存密钥', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('已配置 API Key')
    await expect(dialog.getByLabel('API Key', { exact: true })).toHaveValue('')
    await expect(dialog).not.toContainText(secret)
    await opened.dispose()
    await runner.dispose({ keepHome: true })
    runner = await startTestRunner(runner.home)
    opened = await launchTestApp({ runnerHome: runner.home })
    page = await opened.app.firstWindow()
    await page.getByRole('button', { name: 'API 设置', exact: true }).click()
    dialog = page.getByRole('dialog', { name: 'DeepSeek API', exact: true })
    await expect(dialog.getByRole('status')).toHaveText('已配置 API Key')
    await expect(dialog.getByLabel('API Key', { exact: true })).toHaveValue('')
    await dialog.getByRole('button', { name: '删除已存密钥', exact: true }).click()
    await expect(dialog.getByRole('status')).toHaveText('尚未配置 API Key')
    // A malformed store must refuse writes without quoting the secret source line.
    await writeFile(join(runner.home, '.credentials.yaml'), `version: 1\nrefs: [${secret}`, {
      mode: 0o600,
    })
    await dialog.getByLabel('API Key', { exact: true }).fill(secret)
    await dialog.getByRole('button', { name: '保存密钥', exact: true }).click()
    await expect(dialog.getByRole('alert')).toContainText('密钥未能保存')
    await expect(dialog.getByLabel('API Key', { exact: true })).toHaveValue('')
    await expect(dialog).not.toContainText(secret)
    expect(runner.diagnostics()).not.toContain(secret)
  } finally {
    await opened.dispose()
    await runner.dispose()
  }
})
