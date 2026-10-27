import { open, test } from 'nsh/test'

test('official authentication, streams, approval rejection and fresh reconnect', async () => {
  const app = await open('./App.tsx', { network: 'live' })
  await app.press('Connect')
  await app.waitUntil(() => {
    const text = app.texts().join(' ')
    if (text.startsWith('Failed:')) throw new Error(text)
    return text.includes('Approval and reconnect verified')
  }, { timeout: 45000 })
})
