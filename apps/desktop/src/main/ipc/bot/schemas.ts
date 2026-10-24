import { z } from 'zod'

import { MAX_MESSAGE_LENGTH } from '@/shared/bot'

export const historyInputSchema = z.strictObject({
  botId: z.uuid({ error: 'Bot 标识无效，请刷新列表。' }),
})

export const sendInputSchema = historyInputSchema.extend({
  text: z
    .string({ error: '请输入消息内容。' })
    .min(1, '请输入消息内容。')
    .max(MAX_MESSAGE_LENGTH, '消息过长，请缩短到 32768 个字符以内。')
    .refine((text) => text.trim().length > 0, '请输入消息内容。'),
})
