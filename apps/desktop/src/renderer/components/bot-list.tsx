import { Button } from '@dsh-bot/ui/components/ui/button'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@dsh-bot/ui/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { botListQueryOptions } from '@/renderer/actions/bot'
import { useWindowLayoutStore } from '@/renderer/stores/window-layout-store'

export default function BotList() {
  const bots = useQuery(botListQueryOptions())
  const selectedBotId = useWindowLayoutStore((state) => state.selectedBotId)
  const setSelectedBotId = useWindowLayoutStore((state) => state.setSelectedBotId)
  const navigate = useNavigate()

  useEffect(() => {
    const first = bots.data?.[0]
    if (first && !bots.data?.some((bot) => bot.botId === selectedBotId)) {
      setSelectedBotId(first.botId)
    }
  }, [bots.data, selectedBotId, setSelectedBotId])

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Bot 列表</SidebarGroupLabel>
        <SidebarGroupContent className="space-y-2 text-sm">
          {bots.isPending ? (
            <p role="status" className="text-muted-foreground px-2">
              正在连接并加载 Bot…
            </p>
          ) : bots.isError ? (
            <div className="space-y-2 px-2">
              <p role="alert">无法连接或加载 Bot 列表。</p>
              <Button
                variant="outline"
                size="sm"
                disabled={bots.isFetching}
                onClick={() => void bots.refetch()}
              >
                重试连接
              </Button>
            </div>
          ) : bots.data.length === 0 ? (
            <div className="space-y-2 px-2">
              <p className="text-muted-foreground">暂无 Bot。配置 Bot 后，刷新列表即可开始对话。</p>
              <Button
                variant="outline"
                size="sm"
                disabled={bots.isFetching}
                onClick={() => void bots.refetch()}
              >
                刷新列表
              </Button>
            </div>
          ) : (
            <ul className="space-y-1" aria-label="Bot 列表">
              {bots.data.map((bot) => (
                <li key={bot.botId}>
                  <Button
                    className="w-full justify-start text-left whitespace-normal"
                    variant={selectedBotId === bot.botId ? 'secondary' : 'ghost'}
                    aria-pressed={selectedBotId === bot.botId}
                    onClick={() => {
                      setSelectedBotId(bot.botId)
                      void navigate({ to: '/' })
                    }}
                  >
                    <span className="truncate">{bot.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
