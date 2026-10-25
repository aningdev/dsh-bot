import { Button } from '@dsh-bot/ui/components/ui/button'
import { Checkbox } from '@dsh-bot/ui/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@dsh-bot/ui/components/ui/dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'

import { botListQueryOptions } from '@/renderer/actions/bot'
import { controlRunnerMutationOptions, runnerStatusQueryOptions } from '@/renderer/actions/runner'

export default function RunnerServiceButton() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>后台服务</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>后台服务</DialogTitle>
          <DialogDescription>
            关闭窗口后后台继续运行。停止后台会中断正在执行的任务。
          </DialogDescription>
        </DialogHeader>
        {open && <ServiceControls />}
      </DialogContent>
    </Dialog>
  )
}

function ServiceControls() {
  const id = useId()
  const queryClient = useQueryClient()
  const status = useQuery({ ...runnerStatusQueryOptions(), refetchInterval: 2000 })
  const control = useMutation({
    ...controlRunnerMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: runnerStatusQueryOptions().queryKey }),
        queryClient.invalidateQueries({ queryKey: botListQueryOptions().queryKey }),
      ])
    },
  })
  const state = status.data
  return (
    <div className="space-y-3 text-sm">
      {status.isError ? (
        <p role="alert">{status.error.message}</p>
      ) : (
        <p role="status">
          {status.isPending
            ? '正在查询后台状态…'
            : !state?.installed
              ? '尚未安装'
              : state.loaded
                ? state.pid
                  ? '后台正在运行'
                  : '后台正在启动或等待恢复'
                : '后台已停止'}
        </p>
      )}
      {control.isError && <p role="alert">{control.error.message}</p>}
      <label className="flex items-center gap-2" htmlFor={id}>
        <Checkbox
          id={id}
          checked={state?.loginAtStartup ?? false}
          disabled={!state?.installed || control.isPending}
          onCheckedChange={(enabled) =>
            control.mutate({ action: enabled ? 'enable-login' : 'disable-login' })
          }
        />
        登录时启动后台
      </label>
      <div className="flex flex-wrap gap-2">
        {!state?.installed && (
          <Button
            disabled={status.isPending || status.isError || control.isPending}
            onClick={() => control.mutate({ action: 'install' })}
          >
            安装后台
          </Button>
        )}
        <Button
          disabled={!state?.installed || state.loaded || control.isPending}
          onClick={() => control.mutate({ action: 'start' })}
        >
          启动后台
        </Button>
        <Button
          variant="outline"
          disabled={!state?.loaded || control.isPending}
          onClick={() => control.mutate({ action: 'stop' })}
        >
          停止后台
        </Button>
        <Button
          variant="outline"
          disabled={control.isPending || status.isFetching}
          onClick={() => void status.refetch()}
        >
          刷新状态
        </Button>
        <Button
          variant="ghost"
          disabled={!state?.installed || state.loaded || control.isPending}
          onClick={() => control.mutate({ action: 'uninstall' })}
        >
          卸载服务
        </Button>
      </div>
      <p className="text-muted-foreground">卸载服务会保留 Bot 配置和对话记录。</p>
    </div>
  )
}
