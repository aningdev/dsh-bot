import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('approval allows one operation and rejects the next without stalling execution', async () => {
  const runner = await startTestRunner()
  try {
    const created = await runner.client.remote.bot.create({ name: '审批助手', cwd: runner.home })
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
    const opened = await launchTestApp({ runnerHome: runner.home })
    let diagnostic = ''
    opened.app.process().stderr?.on('data', (chunk: unknown) => {
      diagnostic = (diagnostic + String(chunk)).slice(-16000)
    })
    try {
      const page = await opened.app.firstWindow()
      await page.getByRole('button', { name: '审批助手', exact: true }).click()
      const send = async () => {
        await page.getByRole('textbox', { name: '消息', exact: true }).fill('tool approval')
        await expect(page.getByRole('button', { name: '发送', exact: true })).toBeEnabled()
        await page.getByRole('button', { name: '发送', exact: true }).click()
      }
      await send()
      const approval = page.getByRole('region', { name: '待审批操作', exact: true })
      await expect(approval).toContainText('activity_probe')
      await expect(approval).toContainText('将执行测试操作并返回 alpha')
      await expect(
        page.getByText('approved operation executed: alpha', { exact: true }),
      ).toHaveCount(0)
      await approval.getByRole('button', { name: '允许一次', exact: true }).click()
      const tools = page.getByRole('region', { name: '工具活动', exact: true })
      await expect(tools).toContainText('approved operation executed: alpha')
      await expect(approval).toHaveCount(0)
      await send()
      await expect(approval).toBeVisible()
      await approval.getByRole('button', { name: '拒绝', exact: true }).click()
      await expect(tools).toContainText('operation not executed: rejected')
      await expect(approval).toHaveCount(0)
      await expect(page.getByRole('button', { name: '刷新记录', exact: true })).toBeEnabled()
      await expect(tools.getByRole('listitem')).toHaveCount(2)
      // The earlier one-shot grant never suppresses a later approval request.
      await expect(page.getByText('tool completed', { exact: true })).toHaveCount(2)
    } finally {
      await test.info().attach('approval-diagnostics', {
        body: diagnostic + '\nRunner:\n' + runner.diagnostics(),
        contentType: 'text/plain',
      })
      await opened.dispose()
    }
  } finally {
    await runner.dispose()
  }
})
