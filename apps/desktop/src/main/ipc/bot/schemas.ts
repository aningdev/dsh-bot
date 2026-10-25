import path from 'node:path'

import { z } from 'zod'

import { MAX_MESSAGE_LENGTH } from '@/shared/bot'

export const saveCredentialInputSchema = z.strictObject({
  value: z
    .string()
    .trim()
    .min(1, '请输入 API Key。')
    .max(4096)
    .refine(
      (value) => !value.includes('\r') && !value.includes('\n') && !value.includes('\0'),
      'API Key 不能包含换行或空字符。',
    ),
})

export const historyInputSchema = z.strictObject({
  botId: z.uuid({ error: 'Bot 标识无效，请刷新列表。' }),
})

export const botConfigurationSchema = z.object({
  cwd: z.string().max(4096).refine(path.isAbsolute, '请选择绝对路径。'),
  provider: z.string().trim().min(1).max(200),
  model: z.string().trim().min(1).max(200),
  baseInstructions: z.string().max(131072).default(''),
  instructions: z.string().max(131072),
  capabilities: z.array(z.string().min(1).max(200)).max(128),
  maxTokens: z.number().int().positive().nullable(),
  reasoningEffort: z.string().min(1).max(100).nullable(),
  inputMode: z.enum(['queue', 'steer']).default('queue'),
})

export const createBotInputSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  cwd: botConfigurationSchema.shape.cwd,
  templateId: z.string().min(1).max(200),
})

export const saveBotConfigurationInputSchema = historyInputSchema.extend({
  expectedRevision: z.number().int().nonnegative(),
  configuration: botConfigurationSchema.strict(),
})

export const decideApprovalInputSchema = historyInputSchema.extend({
  id: z.uuid(),
  decision: z.enum(['allowed-once', 'rejected']),
})

export const acknowledgeToolsInputSchema = z.strictObject({
  observationId: z.uuid(),
  revision: z.number().int().positive(),
})

export const withdrawInputSchema = historyInputSchema.extend({ messageId: z.uuid() })

export const sendInputSchema = historyInputSchema.extend({
  text: z
    .string({ error: '请输入消息内容。' })
    .min(1, '请输入消息内容。')
    .max(MAX_MESSAGE_LENGTH, '消息过长，请缩短到 32768 个字符以内。')
    .refine((text) => text.trim().length > 0, '请输入消息内容。'),
})
