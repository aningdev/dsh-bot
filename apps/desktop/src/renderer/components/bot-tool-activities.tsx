import { Button } from '@dsh-bot/ui/components/ui/button'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { observeBotTools } from '@/renderer/actions/bot'
import type { ToolActivity } from '@/shared/bot'

const statusLabels = {
  waiting: '等待结果',
  succeeded: '已完成',
  failed: '失败',
}

function formatContent(text: string): string {
  try {
    const value: unknown = JSON.parse(text)
    return JSON.stringify(value, null, 2) ?? text
  } catch {
    return text
  }
}

export default function BotToolActivities({
  botId,
  onUpdate,
  historyUpdatedAt,
}: {
  botId: string
  onUpdate: () => void
  historyUpdatedAt: number
}) {
  const [activities, setActivities] = useState<readonly ToolActivity[]>([])
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const retryAfterRecovery = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    let canRetry = false
    let stopCurrent = () => {}
    const stop = () => {
      controller.abort()
      stopCurrent()
    }
    async function observe() {
      let iterator: AsyncIterator<readonly ToolActivity[]> | undefined
      let closing: Promise<void> | undefined
      const close = () => {
        const current = iterator
        if (!current) return Promise.resolve()
        closing ??= (async () => {
          await current.return?.()
        })()
        return closing
      }
      stopCurrent = () => {
        void close().catch(() => {})
      }
      canRetry = false
      try {
        setFailed(false)
        const frames = observeBotTools(botId, signal)
        iterator = frames[Symbol.asyncIterator]()
        while (!signal.aborted) {
          const next = await iterator.next()
          if (signal.aborted) return
          if (next.done) throw new Error('Tool activity observation ended unexpectedly')
          // Every frame replaces the current window, including updates to existing calls.
          setActivities(next.value)
        }
      } catch {
        if (!signal.aborted) setFailed(true)
      } finally {
        await close().catch(() => {})
        canRetry = !signal.aborted
      }
    }
    const retry = () => {
      if (canRetry && !signal.aborted) void observe()
    }
    retryAfterRecovery.current = retry
    window.addEventListener('pagehide', stop)
    void observe()
    return () => {
      if (retryAfterRecovery.current === retry) retryAfterRecovery.current = undefined
      window.removeEventListener('pagehide', stop)
      stop()
    }
  }, [botId, attempt])

  useEffect(() => {
    retryAfterRecovery.current?.()
  }, [historyUpdatedAt])

  useLayoutEffect(() => {
    onUpdate()
  }, [activities, failed, onUpdate])

  if (activities.length === 0 && !failed) return null

  return (
    <section aria-label="工具活动" className="mt-4 min-w-0 space-y-3">
      <h3 className="text-sm font-medium">最近的工具活动</h3>
      <ol className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="font-medium break-all">{activity.name}</span>
              <span
                className={
                  activity.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'
                }
              >
                {statusLabels[activity.status]}
              </span>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">参数</dt>
                <dd className="bg-muted rounded-md p-2">
                  <pre className="font-mono break-words whitespace-pre-wrap">
                    {formatContent(activity.arguments)}
                  </pre>
                </dd>
              </div>
              {activity.status !== 'waiting' && (
                <div>
                  <dt className="text-muted-foreground text-xs">结果</dt>
                  <dd className="bg-muted rounded-md p-2">
                    <pre className="font-mono break-words whitespace-pre-wrap">
                      {formatContent(activity.result)}
                    </pre>
                  </dd>
                </div>
              )}
              {activity.reason && (
                <div>
                  <dt className="text-muted-foreground text-xs">原因</dt>
                  <dd className="break-words whitespace-pre-wrap">
                    {formatContent(activity.reason)}
                  </dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ol>
      {failed && (
        <div className="space-y-2 text-sm">
          <p role="alert">无法加载工具活动，请检查连接后重试。</p>
          <Button variant="outline" size="sm" onClick={() => setAttempt((value) => value + 1)}>
            重新加载工具活动
          </Button>
        </div>
      )}
    </section>
  )
}
