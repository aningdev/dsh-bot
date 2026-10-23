export const APP_CONFIG = {
  name: 'dsh-bot',
  appId: 'com.dsh-bot.app',
  repository: { owner: 'zhuxining', name: 'dsh-bot' },
} as const
export const updateRepository = APP_CONFIG.repository.owner + '/' + APP_CONFIG.repository.name
