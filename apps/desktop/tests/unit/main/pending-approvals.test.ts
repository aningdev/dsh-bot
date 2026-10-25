import { expect, test } from 'vite-plus/test'

import { PendingApprovals } from '../../../src/main/pending-approvals'

const value = { botId: 'bot-a', toolName: 'write_file', reason: 'write example.txt' }

test('only the matching Bot can decide, and racing or repeated replies cannot grant twice', async () => {
  const approvals = new PendingApprovals()
  const pending = approvals.request(value, new AbortController().signal)
  const [request] = approvals.list('bot-a')
  if (!request) throw new Error('Missing question')
  expect(approvals.list('bot-b')).toEqual([])
  expect(approvals.decide('bot-b', request.id, 'allowed-once')).toBe(false)
  expect(approvals.decide('bot-a', request.id, 'rejected')).toBe(true)
  expect(approvals.decide('bot-a', request.id, 'allowed-once')).toBe(false)
  expect(await pending).toBe('rejected')
  expect(approvals.list('bot-a')).toEqual([])
})

test('withdrawal removes the question and discards a late grant', async () => {
  const approvals = new PendingApprovals()
  const controller = new AbortController()
  const pending = approvals.request(value, controller.signal)
  const [request] = approvals.list('bot-a')
  if (!request) throw new Error('Missing question')
  controller.abort()
  expect(approvals.list('bot-a')).toEqual([])
  expect(approvals.decide('bot-a', request.id, 'allowed-once')).toBe(false)
  expect(await pending).toBe('cancelled')
  expect(await approvals.request(value, controller.signal)).toBe('cancelled')
  expect(approvals.list('bot-a')).toEqual([])
})
