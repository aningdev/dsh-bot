import { expect, open, test } from 'nsh/test'
import { botsRoot, listRecords, readRecord } from './registry'

const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))

test('同基模板两 Bot 不同子插件组合；初始化后锁定', async () => {
  const app = await open('./bot-app-probe.tsx', { width: 1400, height: 950, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    const workspace = `${await botsRoot()}-workspace`

    await app.press('id:bot-new')
    await app.type('id:bot-name', '组合 Bot A')
    await app.clear('id:bot-workspace')
    await app.type('id:bot-workspace', `${workspace}-a`)
    await app.waitUntil(() =>
      app.shows('id:create-plugin-tool-web')
      || app.shows('id:create-plugin-tool-bash')
      || app.shows('id:create-plugin-tool-fs'), { timeout: 10000 })
    const firstToggle = ['create-plugin-tool-web', 'create-plugin-tool-bash', 'create-plugin-tool-fs']
      .find(id => app.shows(`id:${id}`))
    if (!firstToggle) throw new Error('未展示可关闭子插件')
    await app.press(`id:${firstToggle}`)
    await app.press('id:bot-save')
    await app.waitUntil(() => visible(app, '组合 Bot A'), { timeout: 20000 })

    await app.press('id:bot-new')
    await app.type('id:bot-name', '组合 Bot B')
    await app.clear('id:bot-workspace')
    await app.type('id:bot-workspace', `${workspace}-b`)
    await app.waitUntil(() =>
      app.shows('id:create-plugin-tool-web')
      || app.shows('id:create-plugin-tool-bash')
      || app.shows('id:create-plugin-tool-fs')
      || app.shows('id:create-plugin-tool-fs-search'), { timeout: 10000 })
    const secondToggle = ['create-plugin-tool-fs-search', 'create-plugin-tool-web', 'create-plugin-tool-bash', 'create-plugin-tool-fs']
      .find(id => app.shows(`id:${id}`) && id !== firstToggle)
      ?? firstToggle
    await app.press(`id:${secondToggle}`)
    await app.press('id:bot-save')
    await app.waitUntil(() => visible(app, '组合 Bot B'), { timeout: 20000 })

    const files = await listRecords()
    expect(files.length).toBeGreaterThanOrEqual(2)
    const records = await Promise.all(files.map(async name => JSON.parse(await readRecord(name))))
    const derived = records.filter((item: { preset?: string }) => typeof item.preset === 'string' && item.preset.startsWith('dshbot_'))
    expect(derived.length).toBeGreaterThanOrEqual(1)
    if (derived.length >= 2) {
      expect(derived[0]!.preset).not.toBe(derived[1]!.preset)
      expect(derived.every((item: { basePreset?: string }) => item.basePreset)).toBe(true)
    }
    expect(app.shows('id:inspector-plugins-save')).toBe(false)
  } finally { app.dispose() }
})
