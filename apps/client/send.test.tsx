import { expect, open, test } from 'nsh/test'
import type { ProductState, Conversation } from './connection'

const origin = 'http://127.0.0.1:12345'
const bot = { id: 'bot-one', name: '1', model: 'deepseek-flash', instructions: '1', cwd: '/tmp' }
const conversation: Conversation = { id: 'session-one', botId: bot.id, name: '新会话', config: bot }

async function connected(options: { existing?: boolean; failCreation?: boolean } = {}) {
  const state: ProductState = { bots: [bot], conversations: options.existing ? [conversation] : [] }
  return open('./tests/connected.tsx', {
    width: 1200, height: 800, platform: 'macos',
    network: {
      [`GET ${origin}/login`]: { status: 303, headers: { 'set-cookie': 'owner=test-only; Path=/' } },
      [`GET ${origin}/api/bot/state`]: () => ({ body: state }),
      [`GET ${origin}/api/bot/credentials`]: { body: { configured: true, source: 'env' } },
      [`POST ${origin}/api/bot/conversation`]: () => {
        if (options.failCreation) return { status: 400, body: { error: '工作目录不存在' } }
        state.conversations.push(conversation)
        return { body: conversation }
      },
      [`POST ${origin}/api/bot/prompt`]: { body: { accepted: true } },
      // Leave the follow connection open while exercising submission, as the live backend does.
      [`GET ${origin}/api/bot/follow*`]: { body: '', delay: 60_000 },
    },
  })
}

test('first message creates and selects a session, then submits once; later messages reuse it', async () => {
  const app = await connected()
  expect(app.texts()).toContain('尚未选择会话')
  await app.type('label:消息', '你好')
  expect(app.enabled('label:发送')).toBe(true)
  await app.press('label:发送')
  await app.waitFor('后台已接纳')
  const posts = app.requests().filter(request => request.method === 'POST')
  expect(posts.map(request => request.url)).toEqual([`${origin}/api/bot/conversation`, `${origin}/api/bot/prompt`])
  expect(JSON.parse(posts[0]!.body!)).toEqual({ botId: bot.id, cwd: bot.cwd })
  const submitted = JSON.parse(posts[1]!.body!)
  expect(submitted.id).toBe(conversation.id)
  expect(submitted.text).toBe('你好')
  expect(submitted.mode).toBe('queue')
  expect(app.value('label:消息')).toBe('')
  expect(app.texts()).toContain('● 新会话 1')
  await app.type('label:消息', '第二条')
  await app.press('label:发送')
  await app.waitFor('后台已接纳')
  expect(app.requests().filter(request => request.url.endsWith('/conversation')).length).toBe(1)
  expect(app.requests().filter(request => request.url.endsWith('/prompt')).length).toBe(2)
})

test('failed session creation preserves the draft and never submits a prompt', async () => {
  const app = await connected({ failCreation: true })
  await app.type('label:消息', '保留这条消息')
  await app.press('label:发送')
  await app.waitFor('创建会话失败：Error: 工作目录不存在')
  expect(app.value('label:消息')).toBe('保留这条消息')
  expect(app.requests().some(request => request.url.endsWith('/prompt'))).toBe(false)
  expect(app.enabled('label:发送')).toBe(true)
})

test('sending in an existing session does not create another one', async () => {
  const app = await connected({ existing: true })
  await app.type('label:消息', '继续')
  await app.press('label:发送')
  await app.waitFor('后台已接纳')
  expect(app.requests().some(request => request.url.endsWith('/conversation'))).toBe(false)
  const request = app.requests().find(request => request.url.endsWith('/prompt'))!
  expect(JSON.parse(request.body!).id).toBe(conversation.id)
})
