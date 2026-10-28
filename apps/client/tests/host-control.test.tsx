import { expect, open, test } from 'nsh/test'
import { HostControl } from 'dsh-client/native'

test('宿主经 NSH 提供连接；两个窗口共享进程，窗口关闭不停止，重启切换 generation', async () => {
  expect(await HostControl.reachable()).toBe(true)
  const initial = JSON.parse(await HostControl.request('ensureDsh', 'attach'))
  expect(initial.phase).toBe('stopped')
  const watch = await HostControl.watch()
  expect(JSON.parse(await watch.read()).phase).toBe('stopped')
  const options = { width: 1400, height: 950, platform: 'macos' as const, network: 'live' as const }
  const windows: Awaited<ReturnType<typeof open>>[] = []
  try {
    await HostControl.request('ensureDsh', 'userStart')
    const before = JSON.parse(await HostControl.request('status', ''))
    expect(before.phase).toBe('ready')
    expect(before.url).toBe(undefined)
    // Verify the standard Cookie-header restriction and official authentication
    // in the same real network-enabled NSH app, before exercising host restarts.
    let probe = await open('./host-probe.tsx', options)
    windows.push(probe)
    await probe.waitFor('text:official-ready', { timeout: 30000 })
    expect(probe.texts().includes('standard-cookie-header-blocked')).toBe(true)
    probe.dispose()
    const first = await open('../App.tsx', options)
    windows.push(first)
    const second = await open('../App.tsx', options)
    windows.push(second)
    for (const app of [first, second]) {
      await app.waitUntil(() => app.texts().some(text => text.includes('后台已连接')), { timeout: 30000 })
    }
    expect(JSON.parse(await HostControl.request('status', '')).pid).toBe(before.pid)
    first.dispose()
    expect(JSON.parse(await HostControl.request('status', '')).phase).toBe('ready')
    // Keep the second window alive: it must invalidate its old connection and
    // attach again when the host publishes a new generation and port.
    const restarting = HostControl.request('restartDsh', '')
    await second.waitUntil(() => second.texts().some(text => text.includes('后台未连接')), { timeout: 10000 })
    const next = JSON.parse(await restarting)
    await second.waitUntil(() => second.texts().some(text => text.includes('后台已连接')), { timeout: 30000 })
    expect(next.phase).toBe('ready')
    expect(next.generation === before.generation).toBe(false)
    let observed = JSON.parse(await watch.read())
    while (observed.phase !== 'ready' || observed.generation !== next.generation) observed = JSON.parse(await watch.read())
    second.dispose()
    expect(JSON.parse(await HostControl.request('status', '')).phase).toBe('ready')
    probe = await open('./host-probe.tsx', options)
    windows.push(probe)
    await probe.waitFor('text:official-ready', { timeout: 30000 }); probe.dispose()
    await HostControl.request('stopDsh', '')
    expect(JSON.parse(await HostControl.request('ensureDsh', 'attach')).phase).toBe('stopped')
  } finally {
    watch.close()
    for (const window of windows) window.dispose()
    await HostControl.request('stopDsh', '')
  }
})
