import { z } from 'zod'

export const runnerServiceActionSchema = z.strictObject({
  action: z.enum([
    'install',
    'start',
    'stop',
    'upgrade',
    'uninstall',
    'enable-login',
    'disable-login',
  ]),
})
