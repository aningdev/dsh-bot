import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('tool activity updates during execution and survives reopening the packaged desktop', async () => {
  let runner = await startTestRunner()
  try {
    const created = await runner.client.remote.bot.create({ name: '工具助手', cwd: runner.home })
    if (!created.ok) throw created.error
    const configured = await runner.client.remote.bot.saveConfiguration(created.value.botId, {
      expectedRevision: created.value.revision,
      configuration: {
        cwd: runner.home,
        provider: 'fake',
        model: 'fake-1',
        instructions: '',
        capabilities: ['activity'],
        maxTokens: null,
        reasoningEffort: null,
      },
    })
    if (!configured.ok) throw configured.error
    const first = await launchTestApp({ runnerHome: runner.home })
    let opened = first
    try {
      const page = await first.app.firstWindow()
      await page.getByRole('button', { name: '工具助手', exact: true }).click()
      await page.getByRole('textbox', { name: '消息', exact: true }).fill('tool success')
      await page.getByRole('button', { name: '发送', exact: true }).click()
      const tools = page.getByRole('region', { name: '工具活动', exact: true })
      await expect(tools.getByText('activity_probe', { exact: true })).toBeVisible()
      await expect(tools.getByText('等待结果', { exact: true })).toBeVisible()
      await expect(tools).toContainText('alpha')
      await expect(tools).not.toContainText('probe result: alpha')
      await runner.releaseTool()
      await expect(tools.getByText('已完成', { exact: true })).toBeVisible()
      await expect(tools).toContainText('probe result: alpha')
      await expect(page.getByText('tool completed', { exact: true })).toBeVisible()
      await page.getByRole('textbox', { name: '消息', exact: true }).fill('tool failure')
      await expect(page.getByRole('button', { name: '发送', exact: true })).toBeEnabled()
      await page.getByRole('button', { name: '发送', exact: true }).click()
      const failedTool = tools.getByRole('listitem').filter({ hasText: '"mode": "failure"' })
      await expect(failedTool.getByText('等待结果', { exact: true })).toBeVisible()
      await expect(failedTool.getByText('失败', { exact: true })).toHaveCount(0)
      await runner.releaseTool()
      await expect(failedTool.getByText('失败', { exact: true })).toBeVisible()
      await expect(failedTool).toContainText('probe failure: alpha')
      await expect(page.getByText('tool failed', { exact: true })).toBeVisible()
      await first.dispose({ keepProfile: true })
      expect(runner.child.exitCode).toBe(null)
      opened = await launchTestApp({ profile: first.profile, runnerHome: runner.home })
      const reopened = await opened.app.firstWindow()
      const restored = reopened.getByRole('region', { name: '工具活动', exact: true })
      await expect(restored).toContainText('activity_probe')
      await expect(restored).toContainText('probe result: alpha')
      await expect(restored.getByText('已完成', { exact: true })).toBeVisible()
      await expect(restored.getByText('失败', { exact: true })).toBeVisible()
      await expect(restored).toContainText('probe failure: alpha')
      await expect(restored.getByRole('listitem')).toHaveCount(2)

      // A real Runner restart severs Main's authenticated carrier. The component
      // must recover its subscription after history reconnects, without a reload.
      await runner.dispose({ keepHome: true })
      await expect(restored.getByRole('alert')).toBeVisible()
      runner = await startTestRunner(runner.home)
      await expect(restored.getByRole('alert')).toHaveCount(0, { timeout: 15_000 })
      await reopened.getByRole('textbox', { name: '消息', exact: true }).fill('tool success')
      await expect(reopened.getByRole('button', { name: '发送', exact: true })).toBeEnabled()
      await reopened.getByRole('button', { name: '发送', exact: true }).click()
      await expect(restored.getByText('等待结果', { exact: true })).toBeVisible()
      await runner.releaseTool()
      await expect(restored.getByText('已完成', { exact: true })).toHaveCount(2)
      await expect(restored.getByRole('listitem')).toHaveCount(3)
    } finally {
      await runner.releaseTool()
      await opened.dispose()
    }
  } finally {
    await runner.dispose()
  }
})
