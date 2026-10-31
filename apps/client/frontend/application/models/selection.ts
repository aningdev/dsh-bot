export function modelKey(value: { provider: string; model: string }): string {
  return value.provider && value.model ? `${value.provider}/${value.model}` : ''
}
export function projectedModel(projections: any): string {
  const value = projections?.modelSelection?.next ?? projections?.modelSelection?.lastUsed
  return value ? modelKey(value) : '后台未记录模型选择'
}

export function projectedReasoningEffort(projections: any): string | undefined {
  const value = projections?.modelSelection?.next ?? projections?.modelSelection?.lastUsed
  return typeof value?.reasoningEffort === 'string' ? value.reasoningEffort : undefined
}

export function splitModel(value: string): { provider: string; model: string } {
  const index = value.indexOf('/')
  if (index <= 0) return { provider: '', model: value }
  return { provider: value.slice(0, index), model: value.slice(index + 1) }
}
