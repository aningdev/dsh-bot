import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@dsh-bot/ui/components/ui/sidebar'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Activity } from 'react'
const inDevelopment = import.meta.env.DEV
import BotList from '@/renderer/components/bot-list'
import BaseLayout from '@/renderer/layouts/base-layout'

function Root() {
  return (
    <BaseLayout
      leftPanel={<BotList />}
      rightPanel={
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Details</SidebarGroupLabel>
            <SidebarGroupContent className="text-muted-foreground px-2 text-xs">
              Add details or an inspector here.
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      }
    >
      <Outlet />
      <Activity mode={inDevelopment ? 'visible' : 'hidden'}>
        <TanStackRouterDevtools />
      </Activity>
    </BaseLayout>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Root,
})
