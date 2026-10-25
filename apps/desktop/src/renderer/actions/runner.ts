import { ipc } from '@/renderer/lib/ipc-client'

export function runnerStatusQueryOptions() {
  return ipc.utils.runner.status.queryOptions()
}

export function controlRunnerMutationOptions() {
  return ipc.utils.runner.control.mutationOptions()
}
