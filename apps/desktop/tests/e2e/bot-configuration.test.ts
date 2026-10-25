import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('create from a template and apply configuration before the next turn', async () => {
  const runner = await startTestRunner()
  const opened = await launchTestApp({ runnerHome: runner.home })
  try {
    const page = await opened.app.firstWindow()
    await page.getByRole('button', { name: '新建 Bot', exact: true }).click()
    const create = page.getByRole('dialog', { name: '新建 Bot', exact: true })
    await create.getByLabel('Bot 名称', { exact: true }).fill('我的写作助手')
    await create.getByLabel('工作目录', { exact: true }).fill(runner.home)
    await create.getByRole('button', { name: '创建 Bot', exact: true }).click()
    await expect(create).toHaveCount(0)
    await page.getByRole('button', { name: '配置 Bot', exact: true }).click()
    const config = page.getByRole('dialog', { name: '配置 Bot', exact: true })
    await expect(config.getByLabel('工作目录', { exact: true })).toHaveValue(runner.home)
    await config.getByLabel('基础指令', { exact: true }).fill('Base {{literal}}')
    await config.getByLabel('附加指令', { exact: true }).fill('Additional directions')
    await config.getByLabel('模型', { exact: true }).fill('fake-2')
    await config.getByLabel('最大输出 Token', { exact: true }).fill('41')
    await config.getByLabel('输入模式', { exact: true }).selectOption('steer')
    await config.getByRole('button', { name: '保存配置', exact: true }).click()
    await expect(config.getByRole('status')).toHaveText('配置已生效')
    await config.getByRole('button', { name: '关闭', exact: true }).click()
    await page.getByRole('textbox', { name: '消息', exact: true }).fill('inspect configuration')
    await page.getByRole('button', { name: '发送', exact: true }).click()
    const transcript = page.getByRole('log')
    await expect(transcript).toContainText('Base {{literal}}')
    await expect(transcript).toContainText('Additional directions')
    await expect(transcript).toContainText('fake-2')
  } finally {
    await opened.dispose()
    await runner.dispose()
  }
})

test('configuration save explains running and pending input refusals', async () => {
  const runner = await startTestRunner()
  try {
    const created = await runner.client.remote.bot.create({
      name: '配置保护助手',
      cwd: runner.home,
    })
    if (!created.ok) throw created.error
    const saved = await runner.client.remote.bot.saveConfiguration(created.value.botId, {
      expectedRevision: 0,
      configuration: { ...created.value, capabilities: ['activity'] },
    })
    if (!saved.ok) throw saved.error
    const opened = await launchTestApp({ runnerHome: runner.home })
    try {
      const page = await opened.app.firstWindow()
      await page.getByRole('button', { name: '配置保护助手', exact: true }).click()
      const send = async (text: string) => {
        await page.getByRole('textbox', { name: '消息', exact: true }).fill(text)
        await page.getByRole('button', { name: '发送', exact: true }).click()
        await expect(page.getByRole('textbox', { name: '消息', exact: true })).toHaveValue('')
      }
      const openAndRefuse = async (reason: RegExp) => {
        await page.getByRole('button', { name: '配置 Bot', exact: true }).click()
        const config = page.getByRole('dialog', { name: '配置 Bot', exact: true })
        await config.getByLabel('附加指令', { exact: true }).fill('Keep my unsaved edit')
        await config.getByRole('button', { name: '保存配置', exact: true }).click()
        await expect(config.getByRole('alert')).toContainText(reason)
        await expect(config.getByLabel('附加指令', { exact: true })).toHaveValue(
          'Keep my unsaved edit',
        )
        await config.getByRole('button', { name: '关闭', exact: true }).click()
      }
      await send('tool success')
      await expect(page.getByRole('region', { name: '工具活动', exact: true })).toContainText(
        '等待结果',
      )
      await openAndRefuse(/正在执行/)
      await send('keep pending')
      await page.getByRole('button', { name: '停止执行', exact: true }).click()
      await expect(page.getByRole('button', { name: '停止执行', exact: true })).toHaveCount(0)
      await openAndRefuse(/1 条待处理消息/)
      const record = await runner.client.remote.bot.get(created.value.botId)
      if (!record.ok) throw record.error
      expect(record.value.revision).toBe(1)
      expect(record.value.instructions).toBe('')
    } finally {
      await opened.dispose()
    }
  } finally {
    await runner.dispose()
  }
})
