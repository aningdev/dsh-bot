import { z } from 'zod'

export const runnerServiceActionSchema = z.strictObject({
  action: z.enum(['install', 'start', 'stop', 'uninstall', 'enable-login', 'disable-login']),
})
