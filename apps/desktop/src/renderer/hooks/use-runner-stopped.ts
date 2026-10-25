import { useQuery } from '@tanstack/react-query'

import { runnerStatusQueryOptions } from '@/renderer/actions/runner'

export const runnerStoppedHint = '后台已停止。打开后台服务后可继续使用。'

/**
 * True only while Main reports the installed background service as not running,
 * so a stopped service explains an unreachable Bot instead of loading forever.
 */
export function useRunnerStopped(): boolean {
  const status = useQuery({ ...runnerStatusQueryOptions(), refetchInterval: 5_000 })
  return status.data?.installed === true && status.data.loaded === false
}
