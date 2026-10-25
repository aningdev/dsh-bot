import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('a crashed tool turn reopens as interrupted and retained input does not run automatically', async () => {
  let runner = await startTestRunner()
  let opened: Awaited<ReturnType<typeof launchTestApp>> | undefined
  try {
    const created = await runner.client.remote.bot.create({ name: '恢复助手', cwd: runner.home })
    if (!created.ok) throw created.error
    const saved = await runner.client.remote.bot.saveConfiguration(created.value.botId, {
      expectedRevision: created.value.revision,
      configuration: { ...created.value, capabilities: ['activity'] },
    })
    if (!saved.ok) throw saved.error
    opened = await launchTestApp({ runnerHome: runner.home })
    let page = await opened.app.firstWindow()
    await page.getByRole('button', { name: '恢复助手', exact: true }).click()
    await page.getByRole('textbox', { name: '消息', exact: true }).fill('tool success')
    await page.getByRole('button', { name: '发送', exact: true }).click()
    await expect(page.getByRole('region', { name: '工具活动', exact: true })).toContainText(
      '等待结果',
    )
    await page.getByRole('textbox', { name: '消息', exact: true }).fill('retained after crash')
    await page.getByRole('button', { name: '发送', exact: true }).click()
    await expect(page.getByRole('region', { name: '待处理消息', exact: true })).toContainText(
      'retained after crash',
    )
    await runner.crash()
    const profile = opened.profile
    await opened.dispose({ keepProfile: true })
    opened = undefined
    const home = runner.home
    await runner.dispose({ keepHome: true })
    runner = await startTestRunner(home)
    opened = await launchTestApp({ profile, runnerHome: home })
    page = await opened.app.firstWindow()
    await expect(
      page.getByText(
        '上次执行已中断。不会自动重发消息或重跑工具；待处理消息仍保留，请先查看记录。',
        { exact: true },
      ),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: '停止执行', exact: true })).toHaveCount(0)
    const pending = page.getByRole('region', { name: '待处理消息', exact: true })
    await expect(pending).toContainText('retained after crash')
    await page.getByRole('button', { name: '刷新记录', exact: true }).click()
    await expect(page.getByText('echo: retained after crash', { exact: true })).toHaveCount(0)
    await expect(page.getByText('tool completed', { exact: true })).toHaveCount(0)
    await expect(
      page
        .getByRole('log', { name: '对话消息', exact: true })
        .getByText('tool success', { exact: true }),
    ).toHaveCount(1)
    await pending.getByRole('button', { name: '撤回', exact: true }).click()
    await expect(pending).toHaveCount(0)
    await page.getByRole('textbox', { name: '消息', exact: true }).fill('explicit after recovery')
    await page.getByRole('button', { name: '发送', exact: true }).click()
    await expect(page.getByText('echo: explicit after recovery', { exact: true })).toBeVisible()
    await expect(
      page.getByText(
        '上次执行已中断。不会自动重发消息或重跑工具；待处理消息仍保留，请先查看记录。',
        { exact: true },
      ),
    ).toHaveCount(0)
  } finally {
    try {
      await opened?.dispose()
    } finally {
      await runner.dispose()
    }
  }
})
