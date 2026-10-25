import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@dsh-bot/ui/components/ui/alert-dialog'
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
  const [confirmation, setConfirmation] = useState<'stop' | 'upgrade' | null>(null)
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
      {control.isSuccess && control.variables.action === 'upgrade' && <p>后台运行时已更新。</p>}
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
          onClick={() => setConfirmation('stop')}
        >
          停止后台
        </Button>
        <Button
          variant="outline"
          disabled={!state?.installed || control.isPending}
          onClick={() => setConfirmation('upgrade')}
        >
          {control.isPending && control.variables?.action === 'upgrade' ? '正在更新…' : '更新后台'}
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
      <p className="text-muted-foreground">
        更新后台会先停止任务并备份应用数据，再应用新运行时并恢复原运行状态；不会自动重发消息或重跑工具。卸载服务会保留
        Bot 配置和对话记录。
      </p>
      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(opened) => {
          if (!opened) setConfirmation(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation === 'upgrade' ? '更新后台？' : '停止后台？'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation === 'upgrade'
                ? '正在执行的任务会被中断。停止后台后会先备份 Bot 配置和对话记录；备份失败时保持停止，不会继续更新。'
                : '正在执行的任务会被中断。Bot 配置和对话记录会保留，再次启动后不会自动重跑任务。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmation === null) return
                control.mutate({ action: confirmation })
                setConfirmation(null)
              }}
            >
              {confirmation === 'upgrade' ? '确认更新' : '确认停止'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
