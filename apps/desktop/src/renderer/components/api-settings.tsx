import { Button } from '@dsh-bot/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@dsh-bot/ui/components/ui/dialog'
import { Input } from '@dsh-bot/ui/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'

import {
  botConfigurationOptionsQueryOptions,
  credentialStatusQueryOptions,
  removeCredentialMutationOptions,
  saveCredentialMutationOptions,
} from '@/renderer/actions/bot'

export default function ApiSettingsButton() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>API 设置</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DeepSeek API</DialogTitle>
          <DialogDescription>
            密钥保存在本机后台。保存后供后续请求使用，不会回填到页面。
          </DialogDescription>
        </DialogHeader>
        {open && <CredentialForm />}
      </DialogContent>
    </Dialog>
  )
}

function CredentialForm() {
  const id = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const status = useQuery({ ...credentialStatusQueryOptions(), refetchOnMount: 'always' })
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: credentialStatusQueryOptions().queryKey }),
      queryClient.invalidateQueries({ queryKey: botConfigurationOptionsQueryOptions().queryKey }),
    ])
  const save = useMutation({
    ...saveCredentialMutationOptions(),
    // Submitted secrets must not linger in the mutation cache after settlement.
    gcTime: 0,
    onSuccess: refresh,
    onError: (failure) => setError(failure.message),
    onSettled: (): void => save.reset(),
  })
  const remove = useMutation({
    ...removeCredentialMutationOptions(),
    onSuccess: refresh,
    onError: (failure) => setError(failure.message),
  })
  const pending = save.isPending || remove.isPending
  return (
    <form
      className="space-y-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        setError('')
        save.mutate({ value })
        setValue('')
      }}
    >
      <p role="status">
        {status.isPending
          ? '正在读取密钥状态…'
          : status.isError
            ? '无法读取密钥状态'
            : status.data.configured
              ? '已配置 API Key'
              : '尚未配置 API Key'}
      </p>
      {status.isError && (
        <Button type="button" variant="outline" onClick={() => void status.refetch()}>
          重试
        </Button>
      )}
      <label htmlFor={id} className="block space-y-1">
        <span>API Key</span>
        <Input
          id={id}
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={4096}
          disabled={pending || !status.data?.writable}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending || !status.data?.writable || !value.trim()}>
          {save.isPending ? '正在保存…' : '保存密钥'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending || !status.data?.writable || !status.data.configured}
          onClick={() => {
            setError('')
            remove.mutate(undefined)
          }}
        >
          {remove.isPending ? '正在删除…' : '删除已存密钥'}
        </Button>
      </div>
      <p className="text-muted-foreground">删除只移除已存密钥；启动环境提供的密钥仍可能生效。</p>
    </form>
  )
}
