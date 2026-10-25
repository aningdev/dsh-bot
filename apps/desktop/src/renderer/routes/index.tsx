import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { appVersionQueryOptions } from '@/renderer/actions/app'
import { botListQueryOptions } from '@/renderer/actions/bot'
import ApiSettingsButton from '@/renderer/components/api-settings'
import BotConversation from '@/renderer/components/bot-conversation'
import LangToggle from '@/renderer/components/lang-toggle'
import NavigationMenu from '@/renderer/components/navigation-menu'
import RunnerServiceButton from '@/renderer/components/runner-service'
import ToggleTheme from '@/renderer/components/toggle-theme'
import { useWindowLayoutStore } from '@/renderer/stores/window-layout-store'

function HomePage() {
  const version = useQuery(appVersionQueryOptions())
  const bots = useQuery(botListQueryOptions())
  const selectedBotId = useWindowLayoutStore((state) => state.selectedBotId)
  const bot = bots.data?.find((item) => item.botId === selectedBotId)
  const { t } = useTranslation()

  return (
    <>
      <NavigationMenu />
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 pb-2">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold">{t('appName')}</h1>
          <div className="flex items-center gap-2">
            <ApiSettingsButton />
            <RunnerServiceButton />
            <LangToggle />
            <ToggleTheme />
          </div>
        </header>
        {bot ? (
          <BotConversation key={bot.botId} bot={bot} />
        ) : (
          <div
            className="text-muted-foreground flex flex-1 items-center justify-center text-sm"
            role="status"
          >
            {bots.isPending
              ? '正在加载 Bot…'
              : bots.isError
                ? '无法加载 Bot，请在左侧重试连接。'
                : bots.data.length === 0
                  ? '暂无 Bot。请在左侧新建 Bot。'
                  : '请在左侧选择 Bot。'}
          </div>
        )}
        <footer className="text-muted-foreground text-xs">
          {version.isPending ? (
            <span role="status">{t('loadingAppVersion')}</span>
          ) : version.isError ? (
            <button type="button" onClick={() => void version.refetch()}>
              {t('retryAppVersion')}
            </button>
          ) : (
            <span data-testid="app-version">v{version.data}</span>
          )}
        </footer>
      </div>
    </>
  )
}

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(appVersionQueryOptions())
    void context.queryClient.prefetchQuery(botListQueryOptions())
  },
  component: HomePage,
})
