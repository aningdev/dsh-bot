import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

for (const mode of ['queue', 'steer'] as const) {
  test(`${mode} input can be withdrawn while running and survives stop and reopening`, async () => {
    const runner = await startTestRunner()
    try {
      const created = await runner.client.remote.bot.create({
        name: '输入控制助手',
        cwd: runner.home,
      })
      if (!created.ok) throw created.error
      const saved = await runner.client.remote.bot.saveConfiguration(created.value.botId, {
        expectedRevision: created.value.revision,
        configuration: { ...created.value, capabilities: ['activity'], inputMode: mode },
      })
      if (!saved.ok) throw saved.error
      let opened = await launchTestApp({ runnerHome: runner.home })
      try {
        let page = await opened.app.firstWindow()
        await page.getByRole('button', { name: '输入控制助手', exact: true }).click()
        const submit = async (text: string) => {
          await page.getByRole('textbox', { name: '消息', exact: true }).fill(text)
          await page.getByRole('button', { name: '发送', exact: true }).click()
          await expect(page.getByRole('textbox', { name: '消息', exact: true })).toHaveValue('')
        }
        await submit('tool success')
        await expect(page.getByRole('region', { name: '工具活动', exact: true })).toContainText(
          '等待结果',
        )
        await submit('withdraw this')
        let pending = page.getByRole('region', { name: '待处理消息', exact: true })
        await expect(pending).toContainText('withdraw this')
        await expect(pending).toContainText(mode === 'queue' ? '排队' : '追加到下一步')
        await pending.getByRole('button', { name: '撤回', exact: true }).click()
        await expect(pending).toHaveCount(0)
        await expect(page.getByRole('button', { name: '停止执行', exact: true })).toBeEnabled()
        await submit('keep this')
        await expect(pending).toContainText('keep this')
        await page.getByRole('button', { name: '停止执行', exact: true }).click()
        await expect(page.getByRole('button', { name: '停止执行', exact: true })).toHaveCount(0)
        await expect(pending).toContainText('keep this')
        const profile = opened.profile
        await opened.dispose({ keepProfile: true })
        opened = await launchTestApp({ profile, runnerHome: runner.home })
        page = await opened.app.firstWindow()
        pending = page.getByRole('region', { name: '待处理消息', exact: true })
        await expect(pending).toContainText('keep this')
        await pending.getByRole('button', { name: '撤回', exact: true }).click()
        await expect(pending).toHaveCount(0)
        await submit('ordinary input')
        await expect(page.getByText('echo: ordinary input', { exact: true })).toBeVisible()
        await expect(page.getByText('echo: keep this', { exact: true })).toHaveCount(0)
        await expect(page.getByText('echo: withdraw this', { exact: true })).toHaveCount(0)
        await submit('tool success')
        await expect(page.getByRole('region', { name: '工具活动', exact: true })).toContainText(
          '等待结果',
        )
        await submit('delivered input')
        await expect(pending).toContainText('delivered input')
        await runner.releaseTool()
        await expect(page.getByText('echo: delivered input', { exact: true })).toBeVisible()
        await expect(page.getByText('tool completed', { exact: true })).toHaveCount(
          mode === 'queue' ? 1 : 0,
        )
        await expect(pending).toHaveCount(0)
      } finally {
        await opened.dispose()
      }
    } finally {
      await runner.dispose()
    }
  })
}
