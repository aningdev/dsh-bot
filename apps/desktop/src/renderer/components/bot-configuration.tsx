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
import { Input } from '@dsh-bot/ui/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@dsh-bot/ui/components/ui/native-select'
import { Textarea } from '@dsh-bot/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'

import {
  botConfigurationOptionsQueryOptions,
  botConfigurationQueryOptions,
  botInputQueryOptions,
  botListQueryOptions,
  createBotMutationOptions,
  saveBotConfigurationMutationOptions,
} from '@/renderer/actions/bot'
import { useWindowLayoutStore } from '@/renderer/stores/window-layout-store'
import type { BotConfiguration, BotDetails } from '@/shared/bot'

export function CreateBotButton() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>新建 Bot</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建 Bot</DialogTitle>
          <DialogDescription>选择模板并设置名称与工作目录。</DialogDescription>
        </DialogHeader>
        {open && <CreateBotForm close={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function CreateBotForm({ close }: { close: () => void }) {
  const id = useId()
  const options = useQuery(botConfigurationOptionsQueryOptions())
  const [name, setName] = useState('')
  const [cwd, setCwd] = useState('')
  const [templateId, setTemplateId] = useState('blank')
  const queryClient = useQueryClient()
  const select = useWindowLayoutStore((state) => state.setSelectedBotId)
  const create = useMutation({
    ...createBotMutationOptions(),
    onSuccess: async (bot) => {
      await queryClient.invalidateQueries({ queryKey: botListQueryOptions().queryKey })
      select(bot.botId)
      close()
    },
  })
  return (
    <form
      className="space-y-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        create.mutate({ name, cwd, templateId })
      }}
    >
      {options.isError ? (
        <p role="alert">
          无法读取模板。
          <Button variant="link" onClick={() => void options.refetch()}>
            重试
          </Button>
        </p>
      ) : (
        <>
          <label className="block space-y-1" htmlFor={`${id}-template`}>
            <span id={`${id}-template-label`}>模板</span>
            <NativeSelect
              aria-labelledby={`${id}-template-label`}
              id={`${id}-template`}
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              disabled={options.isPending || create.isPending}
            >
              {options.data?.templates.map((template) => (
                <NativeSelectOption key={template.id} value={template.id}>
                  {template.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <label className="block space-y-1" htmlFor={`${id}-name`}>
            <span>Bot 名称</span>
            <Input
              id={`${id}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              disabled={create.isPending}
            />
          </label>
          <label className="block space-y-1" htmlFor={`${id}-cwd`}>
            <span>工作目录</span>
            <Input
              id={`${id}-cwd`}
              value={cwd}
              onChange={(event) => setCwd(event.target.value)}
              placeholder="/Users/…/project"
              required
              disabled={create.isPending}
            />
          </label>
        </>
      )}
      {create.error && <p role="alert">{create.error.message}</p>}
      <Button
        type="submit"
        disabled={!options.data || create.isPending || !name.trim() || !cwd.trim()}
      >
        {create.isPending ? '正在创建…' : '创建 Bot'}
      </Button>
    </form>
  )
}

export function ConfigureBotButton({ botId }: { botId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>配置 Bot</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>配置 Bot</DialogTitle>
          <DialogDescription>
            保存成功后立即生效；执行中或仍有待处理消息时无法保存。
          </DialogDescription>
        </DialogHeader>
        {open && <ConfigurationEditor botId={botId} close={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function ConfigurationEditor({ botId, close }: { botId: string; close: () => void }) {
  const configuration = useQuery({
    ...botConfigurationQueryOptions(botId),
    refetchOnMount: 'always',
  })
  const options = useQuery(botConfigurationOptionsQueryOptions())
  if (configuration.isPending || options.isPending) return <p role="status">正在加载配置…</p>
  if (configuration.isError || options.isError)
    return (
      <p role="alert">
        无法读取配置。
        <Button
          variant="link"
          onClick={() => {
            void configuration.refetch()
            void options.refetch()
          }}
        >
          重试
        </Button>
      </p>
    )
  return (
    <ConfigurationForm
      bot={configuration.data}
      capabilities={options.data.capabilities}
      close={close}
    />
  )
}

function ConfigurationForm({
  bot,
  capabilities,
  close,
}: {
  bot: BotDetails
  capabilities: readonly string[]
  close: () => void
}) {
  const id = useId()
  const [current, setCurrent] = useState(bot)
  const [draft, setDraft] = useState<BotConfiguration>(bot)
  const [notice, setNotice] = useState('')
  const [reloading, setReloading] = useState(false)
  const queryClient = useQueryClient()
  const save = useMutation({
    ...saveBotConfigurationMutationOptions(),
    onSuccess: async (updated) => {
      setCurrent(updated)
      setDraft(updated)
      setNotice('配置已生效')
      queryClient.setQueryData(botConfigurationQueryOptions(bot.botId).queryKey, updated)
      await queryClient.invalidateQueries({ queryKey: botInputQueryOptions(bot.botId).queryKey })
    },
  })
  const update = <K extends keyof BotConfiguration>(field: K, value: BotConfiguration[K]) => {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setNotice('')
    save.reset()
  }
  const reload = async () => {
    setNotice('')
    setReloading(true)
    try {
      const latest = await queryClient.fetchQuery({
        ...botConfigurationQueryOptions(bot.botId),
        staleTime: 0,
      })
      setCurrent(latest)
      setDraft(latest)
      save.reset()
    } catch {
      setNotice('重新加载失败，请重试。')
    } finally {
      setReloading(false)
    }
  }
  return (
    <form
      className="space-y-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        setNotice('')
        const {
          cwd,
          provider,
          model,
          baseInstructions,
          instructions,
          capabilities,
          maxTokens,
          reasoningEffort,
          inputMode,
        } = draft
        save.mutate({
          botId: bot.botId,
          expectedRevision: current.revision,
          configuration: {
            cwd,
            provider,
            model,
            baseInstructions,
            instructions,
            capabilities: [...capabilities],
            maxTokens,
            reasoningEffort,
            inputMode,
          },
        })
      }}
    >
      <fieldset className="space-y-3" disabled={save.isPending || reloading}>
        <legend className="mb-2 font-medium">{bot.name}</legend>
        <label className="block space-y-1" htmlFor={`${id}-cwd`}>
          <span>工作目录</span>
          <Input
            id={`${id}-cwd`}
            value={draft.cwd}
            onChange={(event) => update('cwd', event.target.value)}
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1" htmlFor={`${id}-provider`}>
            <span>模型服务</span>
            <Input
              id={`${id}-provider`}
              value={draft.provider}
              onChange={(event) => update('provider', event.target.value)}
              required
            />
          </label>
          <label className="block space-y-1" htmlFor={`${id}-model`}>
            <span>模型</span>
            <Input
              id={`${id}-model`}
              value={draft.model}
              onChange={(event) => update('model', event.target.value)}
              required
            />
          </label>
        </div>
        <label className="block space-y-1" htmlFor={`${id}-base`}>
          <span id={`${id}-base-label`}>基础指令</span>
          <Textarea
            aria-labelledby={`${id}-base-label`}
            id={`${id}-base`}
            value={draft.baseInstructions}
            onChange={(event) => update('baseInstructions', event.target.value)}
            maxLength={131072}
          />
        </label>
        <label className="block space-y-1" htmlFor={`${id}-extra`}>
          <span id={`${id}-extra-label`}>附加指令</span>
          <Textarea
            aria-labelledby={`${id}-extra-label`}
            id={`${id}-extra`}
            value={draft.instructions}
            onChange={(event) => update('instructions', event.target.value)}
            maxLength={131072}
          />
        </label>
        <fieldset className="space-y-2">
          <legend className="mb-1 font-medium">能力</legend>
          {capabilities.length === 0 && <p className="text-muted-foreground">未配置可用能力</p>}
          {[...new Set([...capabilities, ...draft.capabilities])].map((capability) => (
            <label key={capability} className="flex items-center gap-2">
              <Checkbox
                checked={draft.capabilities.includes(capability)}
                onCheckedChange={(checked) =>
                  update(
                    'capabilities',
                    checked === true
                      ? [...draft.capabilities, capability]
                      : draft.capabilities.filter((value) => value !== capability),
                  )
                }
              />
              <span>
                {capability}
                {!capabilities.includes(capability) ? '（已不可用）' : ''}
              </span>
            </label>
          ))}
          <p className="text-muted-foreground">当前选择：{draft.capabilities.join('、') || '无'}</p>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1" htmlFor={`${id}-tokens`}>
            <span>最大输出 Token</span>
            <Input
              id={`${id}-tokens`}
              type="number"
              min={1}
              step={1}
              value={draft.maxTokens ?? ''}
              onChange={(event) =>
                update('maxTokens', event.target.value === '' ? null : Number(event.target.value))
              }
            />
          </label>
          <label className="block space-y-1" htmlFor={`${id}-reasoning`}>
            <span>推理强度</span>
            <Input
              id={`${id}-reasoning`}
              value={draft.reasoningEffort ?? ''}
              onChange={(event) => update('reasoningEffort', event.target.value || null)}
              placeholder="使用模型默认值"
            />
          </label>
        </div>
        <label className="block space-y-1" htmlFor={`${id}-mode`}>
          <span id={`${id}-mode-label`}>输入模式</span>
          <NativeSelect
            aria-labelledby={`${id}-mode-label`}
            id={`${id}-mode`}
            value={draft.inputMode}
            onChange={(event) =>
              update('inputMode', event.target.value === 'steer' ? 'steer' : 'queue')
            }
          >
            <NativeSelectOption value="queue">排队</NativeSelectOption>
            <NativeSelectOption value="steer">追加到下一步</NativeSelectOption>
          </NativeSelect>
        </label>
      </fieldset>
      {save.error && <p role="alert">{save.error.message}</p>}
      {notice && <p role={notice === '配置已生效' ? 'status' : 'alert'}>{notice}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={save.isPending || reloading}>
          {save.isPending ? '正在应用…' : '保存配置'}
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={save.isPending || reloading}
          onClick={() => void reload()}
        >
          重新加载配置
        </Button>
        <Button variant="ghost" type="button" onClick={close}>
          关闭
        </Button>
      </div>
    </form>
  )
}
