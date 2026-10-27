import { expect, open, test } from 'nsh/test'
const visible = (app: { texts(): string[] }, text: string) => app.texts().some(item => item.includes(text))
test('供应商目录与凭据状态可读取，密钥保存后不回显并可移除', async () => {
  const app = await open('../App.tsx', { width: 1600, height: 1100, platform: 'macos', network: 'live' })
  try {
    await app.waitUntil(() => visible(app, '后台已连接'), { timeout: 30000 })
    await app.press('id:model-settings')
    await app.waitFor('id:provider-deepseek-official', { timeout: 15000 })
    await app.press('id:provider-deepseek-official')
    await app.type('id:credential-value', 'fixture-managed-secret-never-display')
    await app.press('id:settings-save')
    await app.waitUntil(() => visible(app, '已保存并重新读取'), { timeout: 15000 })
    expect(visible(app, 'fixture-managed-secret-never-display')).toBe(false)
    expect(visible(app, '已配置')).toBe(true)
    await app.press('id:credential-remove')
    await app.waitUntil(() => visible(app, '已移除存储值'), { timeout: 15000 })
    expect(visible(app, 'fixture-managed-secret-never-display')).toBe(false)
    // A second UI owns another live Connection and commits a newer revision.
    const peer = await open('../App.tsx', { width: 1600, height: 1100, platform: 'macos', network: 'live' })
    let original = ''
    try {
      await peer.waitUntil(() => visible(peer, '后台已连接'), { timeout: 15000 })
      await peer.press('id:model-settings')
      await peer.waitFor('id:provider-deepseek-official', { timeout: 15000 })
      await peer.press('id:provider-deepseek-official')
      original = peer.value('id:provider-endpoint') ?? ''
      await peer.clear('id:provider-endpoint'); await peer.type('id:provider-endpoint', 'http://127.0.0.1:1/peer')
      await peer.press('id:settings-save')
      await peer.waitUntil(() => visible(peer, '已保存并重新读取'), { timeout: 15000 })
      await app.clear('id:provider-endpoint'); await app.type('id:provider-endpoint', 'http://127.0.0.1:1/ui')
      await app.press('id:settings-save')
      await app.waitUntil(() => visible(app, '保存未确认'), { timeout: 15000 })
      await app.press('id:settings-refresh')
      await app.waitUntil(() => visible(app, '已重新读取当前后台配置'), { timeout: 10000 })
      expect(app.value('id:provider-endpoint')).toBe('http://127.0.0.1:1/ui')
      await peer.press('id:settings-refresh')
      await peer.waitUntil(() => visible(peer, '已重新读取当前后台配置'), { timeout: 10000 })
      expect(peer.value('id:provider-endpoint')).toBe('http://127.0.0.1:1/peer')
    } finally {
      await peer.clear('id:provider-endpoint')
      if (original) await peer.type('id:provider-endpoint', original)
      await peer.press('id:settings-save')
      await peer.waitUntil(() => visible(peer, '已保存并重新读取'), { timeout: 10000 })
      peer.dispose()
    }
  } finally { app.dispose() }
})
