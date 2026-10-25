import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

import { startTestRunner } from './bot-runner'
import { launchTestApp } from './fixtures'

test('a packaged desktop lists Bots, streams a reply, and reopens the same conversation', async () => {
  const runner = await startTestRunner()
  try {
    const firstBot = await runner.client.remote.bot.create({ name: '本机助手', cwd: runner.home })
    const controlBot = await runner.client.remote.bot.create({
      name: '流式测试控制',
      cwd: runner.home,
    })
    if (!firstBot.ok) throw firstBot.error
    if (!controlBot.ok) throw controlBot.error
    const botId = firstBot.value.botId
    const first = await launchTestApp({ runnerHome: runner.home })
    let opened = first
    try {
      const page = await first.app.firstWindow()
      await page.getByRole('button', { name: '本机助手', exact: true }).click()
      const oversized = '长'.repeat(32_769)
      await page.getByRole('textbox', { name: '消息', exact: true }).fill(oversized)
      await expect(page.getByRole('alert')).toHaveText('消息过长，请缩短到 32768 个字符以内。')
      await expect(page.getByRole('button', { name: '发送', exact: true })).toBeDisabled()
      await expect(page.getByRole('textbox', { name: '消息', exact: true })).toHaveValue(oversized)
      await page.getByRole('textbox', { name: '消息', exact: true }).fill('hold')
      await page.getByRole('button', { name: '发送', exact: true }).click()
      // The model pauses after its first character. A visible partial response
      // before release proves the packaged UI consumes a stream incrementally.
      await expect(page.getByText('e', { exact: true })).toBeVisible()
      await expect(page.getByText('echo: hold', { exact: true })).toHaveCount(0)
      await first.dispose({ keepProfile: true })
      expect(runner.child.exitCode).toBe(null)
      for await (const _frame of runner.client.remote.bot.send(controlBot.value.botId, 'release')) {
        /* The accepted execution must still complete after Main has exited. */
      }
      opened = await launchTestApp({ profile: first.profile, runnerHome: runner.home })
      const reopened = await opened.app.firstWindow()
      await expect(reopened.getByText('echo: hold', { exact: true })).toBeVisible()
      await reopened.getByRole('textbox', { name: '消息', exact: true }).fill('after reopen')
      await reopened.getByRole('button', { name: '发送', exact: true }).click()
      await expect(reopened.getByText('echo: after reopen', { exact: true })).toBeVisible()
      const record = await runner.client.remote.bot.get(botId)
      expect(record).toMatchObject({
        ok: true,
        value: { botId, sessionId: firstBot.value.sessionId },
      })
      const history = await runner.client.remote.bot.history(botId)
      expect(history).toEqual({
        ok: true,
        value: [
          { role: 'user', text: 'hold' },
          { role: 'assistant', text: 'echo: hold' },
          { role: 'user', text: 'after reopen' },
          { role: 'assistant', text: 'echo: after reopen' },
        ],
      })
    } finally {
      await opened.dispose()
    }
  } finally {
    await runner.dispose()
  }
})

test('a desktop opened during execution queues input without resending it', async () => {
  const runner = await startTestRunner()
  try {
    const bot = await runner.client.remote.bot.create({ name: '忙碌的助手', cwd: runner.home })
    const control = await runner.client.remote.bot.create({ name: '解锁助手', cwd: runner.home })
    if (!bot.ok) throw bot.error
    if (!control.ok) throw control.error
    const held = runner.client.remote.bot.send(bot.value.botId, 'hold')
    const iterator = held[Symbol.asyncIterator]()
    try {
      expect((await iterator.next()).done).toBe(false)
      const opened = await launchTestApp({ runnerHome: runner.home })
      try {
        const page = await opened.app.firstWindow()
        const list = page.getByRole('list', { name: 'Bot 列表', exact: true })
        await expect(list.getByRole('status').filter({ hasText: '忙碌的助手' })).toHaveText(
          '忙碌的助手：运行中',
        )
        await expect(list.getByRole('status').filter({ hasText: '解锁助手' })).toHaveText(
          '解锁助手：空闲',
        )
        await page.getByRole('button', { name: '忙碌的助手', exact: true }).click()
        await page.getByRole('textbox', { name: '消息', exact: true }).fill('retry this draft')
        await page.getByRole('button', { name: '发送', exact: true }).click()
        await expect(page.getByRole('region', { name: '待处理消息', exact: true })).toContainText(
          'retry this draft',
        )
        await expect(page.getByRole('textbox', { name: '消息', exact: true })).toHaveValue('')
        for await (const _frame of runner.client.remote.bot.send(control.value.botId, 'release')) {
          /* Release the independently accepted turn; the queued message runs once. */
        }
        while (!(await iterator.next()).done) {
          /* Drain the held observation. */
        }
        await expect(page.getByText('echo: retry this draft', { exact: true })).toBeVisible()
        await expect(list.getByRole('status').filter({ hasText: '忙碌的助手' })).toHaveText(
          '忙碌的助手：空闲',
        )
        const history = await runner.client.remote.bot.history(bot.value.botId)
        expect(history).toEqual({
          ok: true,
          value: [
            { role: 'user', text: 'hold' },
            { role: 'assistant', text: 'echo: hold' },
            { role: 'user', text: 'retry this draft' },
            { role: 'assistant', text: 'echo: retry this draft' },
          ],
        })
      } finally {
        await opened.dispose()
      }
    } finally {
      held.dispose()
    }
  } finally {
    await runner.dispose()
  }
})

test('an unavailable backend can be retried after it starts without reopening the desktop', async () => {
  const home = await mkdtemp(join(tmpdir(), 'desktop-runner-retry-'))
  try {
    const opened = await launchTestApp({ runnerHome: home })
    try {
      const page = await opened.app.firstWindow()
      await expect(page.getByRole('alert').filter({ hasText: '无法连接' })).toBeVisible()
      const runner = await startTestRunner(home)
      try {
        const created = await runner.client.remote.bot.create({ name: '恢复连接的助手', cwd: home })
        if (!created.ok) throw created.error
        await page.getByRole('button', { name: '重试连接', exact: true }).click()
        await expect(
          page.getByRole('button', { name: '恢复连接的助手', exact: true }),
        ).toBeVisible()
        await page.getByRole('textbox', { name: '消息', exact: true }).fill('connected')
        await page.getByRole('button', { name: '发送', exact: true }).click()
        await expect(page.getByText('echo: connected', { exact: true })).toBeVisible()
        await expect(page.locator('body')).not.toContainText(home)
      } finally {
        await runner.dispose()
      }
    } finally {
      await opened.dispose()
    }
  } finally {
    await rm(home, { recursive: true, force: true })
  }
})
