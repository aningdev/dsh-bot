import { expect, open, test } from 'nsh/test'
import { botsRoot } from './registry'

const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))

test('审批取消会消失，停止保留尚未领取队列且可撤回', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '队列审批 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${await botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', 'NSH_APPROVAL_PROBE')
    await app.press('id:send')
    await app.waitFor('id:approval-open', { timeout: 30000 })
    await app.press('id:approval-open')
    await app.waitFor('id:reject', { timeout: 30000 })
    await app.press('id:approval-details')
    expect(visible(app, 'danger-full-access')).toBe(true)
    await app.press('id:dialog-close')
    await app.type('id:message-input', '等待中的第二条输入')
    await app.press('id:send')
    await app.waitFor('label:撤回', { timeout: 10000 })
    expect(visible(app, '等待中的第二条输入')).toBe(true)
    await app.press('id:stop')
    await app.waitUntil(() => !app.shows('id:approval-open'), { timeout: 15000 })
    // Stop only cancels current work, leaving the next-turn entry observable.
    expect(app.shows('label:撤回')).toBe(true)
    await app.press('label:撤回')
    await app.waitUntil(() => !app.shows('label:撤回'), { timeout: 10000 })
  } finally { app.dispose() }
})

test('归档不丢失既有审批，拒绝后仍接收最终文本且不能新增输入', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:bot-new'); await app.type('id:bot-name', '归档审批 Bot')
    await app.clear('id:bot-workspace'); await app.type('id:bot-workspace', `${await botsRoot()}-workspace`)
    await app.press('id:bot-save')
    await app.type('id:message-input', 'NSH_APPROVAL_PROBE'); await app.press('id:send')
    await app.waitFor('id:approval-open', { timeout: 30000 })
    await app.press('id:approval-open')
    await app.waitFor('id:reject', { timeout: 30000 })
    await app.press('id:dialog-close')
    await app.press('id:bot-settings')
    await app.press('id:bot-archive')
    await app.press('id:dialog-close')
    expect(app.shows('id:approval-open')).toBe(true)
    expect(app.enabled('id:send')).toBe(false)
    await app.press('id:approval-open')
    await app.press('id:reject')
    await app.waitFor('text:NSH_APPROVAL_REJECTED', { timeout: 30000 })
  } finally { app.dispose() }
})
