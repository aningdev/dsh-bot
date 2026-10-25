import { Button } from '@dsh-bot/ui/components/ui/button'
import { Textarea } from '@dsh-bot/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  botHistoryQueryOptions,
  botInputQueryOptions,
  sendBotMessage,
  submitBotInput,
  stopBotMutationOptions,
  withdrawBotInputMutationOptions,
} from '@/renderer/actions/bot'
import BotApprovals from '@/renderer/components/bot-approvals'
import BotToolActivities from '@/renderer/components/bot-tool-activities'
import { MAX_MESSAGE_LENGTH } from '@/shared/bot'
import type { BotFrame, BotSummary } from '@/shared/bot'

interface PendingMessage {
  text: string
  reply: string
  historyLength: number
  phase: 'sending' | 'syncing' | 'error'
  completed: boolean
}

interface Observation {
  controller: AbortController
  close?: () => Promise<void>
  busy: boolean
}

export default function BotConversation({ bot }: { bot: BotSummary }) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState<PendingMessage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [inputError, setInputError] = useState('')
  const inputState = useQuery({ ...botInputQueryOptions(bot.botId), refetchInterval: 500 })
  const refreshInput = () =>
    queryClient.invalidateQueries({ queryKey: botInputQueryOptions(bot.botId).queryKey })
  const stop = useMutation({
    ...stopBotMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        refreshInput(),
        queryClient.invalidateQueries({ queryKey: botHistoryQueryOptions(bot.botId).queryKey }),
      ])
    },
  })
  const withdraw = useMutation({ ...withdrawBotInputMutationOptions(), onSuccess: refreshInput })
  const history = useQuery({
    ...botHistoryQueryOptions(bot.botId),
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: !pending,
    refetchOnReconnect: !pending,
    // Execution can outlive this page's stream observation.
    refetchInterval: pending ? false : inputState.data?.status === 'running' ? 500 : 5_000,
  })
  const observation = useRef<Observation | null>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const followsTail = useRef(true)
  const followTools = useCallback(() => {
    const element = transcript.current
    if (element && followsTail.current) element.scrollTop = element.scrollHeight
  }, [])

  useEffect(() => {
    const current: Observation = { controller: new AbortController(), busy: false }
    observation.current = current
    const stop = () => {
      current.controller.abort()
      // Only observation ends here; Main owns accepted execution.
      void current.close?.().catch(() => {})
    }
    window.addEventListener('pagehide', stop)
    return () => {
      window.removeEventListener('pagehide', stop)
      stop()
      observation.current = null
    }
  }, [])

  useEffect(() => {
    const element = transcript.current
    if (element && followsTail.current) element.scrollTop = element.scrollHeight
  }, [history.data, pending])

  async function refreshHistory() {
    const current = observation.current
    if (!current || current.controller.signal.aborted || current.busy) return
    current.busy = true
    try {
      const messages = await queryClient.fetchQuery({
        ...botHistoryQueryOptions(bot.botId),
        staleTime: 0,
      })
      if (!current.controller.signal.aborted) {
        if (
          pending?.phase === 'error' &&
          !pending.completed &&
          !messages
            .slice(pending.historyLength)
            .some((message) => message.role === 'user' && message.text === pending.text)
        ) {
          setDraft((draft) => draft || pending.text)
        }
        setPending(null)
      }
    } catch {
      // Query owns the visible history error; preserve any unconfirmed stream.
    } finally {
      current.busy = false
    }
  }

  async function send() {
    const current = observation.current
    const text = draft.trim()
    if (
      !current ||
      current.controller.signal.aborted ||
      submitting ||
      !text ||
      text.length > MAX_MESSAGE_LENGTH ||
      !history.isSuccess ||
      !inputState.isSuccess ||
      stop.isPending ||
      pending?.phase === 'error'
    )
      return
    if (
      pending?.phase === 'sending' ||
      inputState.data.status === 'running' ||
      inputState.data.pending.length > 0
    ) {
      setSubmitting(true)
      setInputError('')
      try {
        await submitBotInput(bot.botId, text, current.controller.signal)
        if (!current.controller.signal.aborted) {
          setDraft((value) => (value.trim() === text ? '' : value))
          await refreshInput()
        }
      } catch {
        if (!current.controller.signal.aborted)
          setInputError('发送结果尚未确认，请查看待处理消息和对话记录；不会自动重发。')
      } finally {
        setSubmitting(false)
      }
      return
    }
    if (current.busy || pending || history.isFetching) return
    current.busy = true
    followsTail.current = true
    setDraft('')
    setPending({
      text,
      reply: '',
      historyLength: history.data.length,
      phase: 'sending',
      completed: false,
    })
    const { signal } = current.controller
    let iterator: AsyncIterator<BotFrame> | undefined
    let closed = false
    const close = async () => {
      if (closed || !iterator) return
      closed = true
      await iterator.return?.()
    }
    current.close = close
    try {
      // Exclude an older read before admitting a new local echo.
      await queryClient.cancelQueries({ queryKey: botHistoryQueryOptions(bot.botId).queryKey })
      if (signal.aborted) return
      const frames = await sendBotMessage(bot.botId, text, signal)
      iterator = frames[Symbol.asyncIterator]()
      if (signal.aborted) return
      let completed = false
      while (!signal.aborted) {
        const next = await iterator.next()
        if (signal.aborted) return
        if (next.done) break
        if (next.value.type === 'done') {
          completed = true
          break
        }
        const chunk = next.value.text
        setPending((value) => value && { ...value, reply: value.reply + chunk })
      }
      if (!completed) throw new Error('Conversation observation ended before completion')
      setPending((value) => value && { ...value, phase: 'syncing', completed: true })
      await queryClient.fetchQuery({ ...botHistoryQueryOptions(bot.botId), staleTime: 0 })
      if (!signal.aborted) setPending(null)
    } catch {
      if (!signal.aborted) setPending((value) => value && { ...value, phase: 'error' })
    } finally {
      await close().catch(() => {})
      current.close = undefined
      current.busy = false
      void refreshInput()
    }
  }

  // A history refresh can settle before the local echo retires. Keep only the
  // pre-submission prefix until the authoritative history replaces both echoes.
  const messages = pending ? history.data?.slice(0, pending.historyLength) : history.data
  const sending = pending?.phase === 'sending' || pending?.phase === 'syncing'
  const tooLong = draft.trim().length > MAX_MESSAGE_LENGTH

  return (
    <section aria-label={`${bot.name} 对话`} className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{bot.name}</h2>
        <div className="flex gap-2">
          {inputState.data?.status === 'running' && (
            <Button
              variant="outline"
              size="sm"
              disabled={stop.isPending}
              onClick={() => stop.mutate({ botId: bot.botId })}
            >
              {stop.isPending ? '正在停止…' : '停止执行'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={history.isFetching || sending}
            onClick={() => void refreshHistory()}
          >
            {history.isError || pending?.phase === 'error' ? '重新加载记录' : '刷新记录'}
          </Button>
        </div>
      </div>
      <div
        ref={transcript}
        role="log"
        aria-label="对话消息"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-auto"
        onScroll={(event) => {
          const element = event.currentTarget
          followsTail.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48
        }}
      >
        {history.isPending ? (
          <p role="status" className="text-muted-foreground text-sm">
            正在加载对话…
          </p>
        ) : (
          <>
            {messages?.length === 0 && !pending && (
              <p className="text-muted-foreground text-sm">暂无消息，发送消息开始对话。</p>
            )}
            <ol className="space-y-4">
              {messages?.map((message, index) => (
                <li key={index} className="space-y-1">
                  <p className="text-muted-foreground text-xs">
                    {message.role === 'user' ? '你' : '助手'}
                  </p>
                  <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                </li>
              ))}
              {pending && (
                <>
                  <li className="space-y-1">
                    <p className="text-muted-foreground text-xs">你</p>
                    <p className="text-sm break-words whitespace-pre-wrap">{pending.text}</p>
                  </li>
                  {pending.reply && (
                    <li className="space-y-1">
                      <p className="text-muted-foreground text-xs">助手</p>
                      <p className="text-sm break-words whitespace-pre-wrap">{pending.reply}</p>
                    </li>
                  )}
                </>
              )}
            </ol>
          </>
        )}
        <BotToolActivities
          key={bot.botId}
          botId={bot.botId}
          onUpdate={followTools}
          historyUpdatedAt={history.dataUpdatedAt}
        />
      </div>
      {!!inputState.data?.pending.length && (
        <section aria-label="待处理消息" className="space-y-2">
          <h3 className="text-sm font-semibold">待处理消息</h3>
          <ul className="max-h-40 space-y-2 overflow-auto">
            {inputState.data.pending.map((input) => (
              <li key={input.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs">
                    {input.mode === 'queue' ? '排队' : '追加到下一步'}
                  </p>
                  <p className="text-sm break-words whitespace-pre-wrap">{input.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={withdraw.isPending}
                  onClick={() => withdraw.mutate({ botId: bot.botId, messageId: input.id })}
                >
                  撤回
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(inputError || inputState.isError || stop.isError || withdraw.isError) && (
        <p role="alert" className="text-sm">
          {inputError ||
            stop.error?.message ||
            withdraw.error?.message ||
            '无法更新执行状态，请稍后重试。'}
        </p>
      )}
      <BotApprovals key={bot.botId} botId={bot.botId} />
      {(history.isError || pending?.phase === 'error') && (
        <div className="space-y-2 text-sm">
          <p role="alert">
            {pending?.phase === 'error'
              ? pending.completed
                ? '回复已完成，但无法更新对话记录。请重新加载记录。'
                : '消息发送或回复接收失败。消息可能已被接收，请先重新加载记录确认；不会自动重发。'
              : '无法加载对话记录，请检查连接后重试。'}
          </p>
        </div>
      )}
      <p role="status" className="text-muted-foreground text-sm">
        {pending?.phase === 'sending'
          ? '正在发送并接收回复…'
          : pending?.phase === 'syncing'
            ? '正在更新对话记录…'
            : history.isFetching
              ? '正在更新对话记录…'
              : null}
      </p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
      >
        <label htmlFor="bot-message" className="text-sm">
          消息
        </label>
        <Textarea
          id="bot-message"
          value={draft}
          readOnly={submitting}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="输入消息"
          aria-invalid={tooLong || undefined}
          aria-describedby={tooLong ? 'bot-message-error' : undefined}
          className="max-h-40 min-h-20 resize-y"
        />
        {tooLong && (
          <p id="bot-message-error" role="alert" className="text-destructive text-sm">
            消息过长，请缩短到 32768 个字符以内。
          </p>
        )}
        {inputState.data && (
          <p className="text-muted-foreground text-xs">
            执行中发送：{inputState.data.mode === 'queue' ? '排队' : '追加到下一步'}
          </p>
        )}
        <Button
          className="self-end"
          type="submit"
          disabled={
            !draft.trim() ||
            tooLong ||
            submitting ||
            stop.isPending ||
            pending?.phase === 'error' ||
            pending?.phase === 'syncing' ||
            !inputState.isSuccess ||
            !history.isSuccess ||
            (!pending && history.isFetching)
          }
        >
          发送
        </Button>
      </form>
    </section>
  )
}
