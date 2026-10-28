import { open, test } from 'nsh/test'

test('旧入口通过 NSH 标准 API 写安装产物、检查 CLI 和保护日志，不登记系统服务', async () => {
  const app = await open('./legacy-installation-probe.tsx', { width: 900, height: 600, platform: 'macos' })
  try {
    await app.waitUntil(() => app.texts().some(text => text === 'legacy-installation-ready' || text.startsWith('fixture-error:')), { timeout: 30000 })
    if (!app.texts().includes('legacy-installation-ready')) throw new Error(app.texts().join('\n'))
  } finally { app.dispose() }
})
