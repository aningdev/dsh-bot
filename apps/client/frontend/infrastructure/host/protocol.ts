export type HostPhase = 'stopped' | 'preparing' | 'starting' | 'ready' | 'stopping' | 'failed' | 'recovering'
export interface HostStatus {
  phase: HostPhase | 'unavailable'
  generation?: string
  reason?: string
  blocked: boolean
}
export interface BackendInfo { url: string; generation?: string }


const phases = new Set<HostPhase>(['stopped', 'preparing', 'starting', 'ready', 'stopping', 'failed', 'recovering'])

/** NSH's native interface carries strings. Interpret them only in this adapter. */
export function decodeHostStatus(text: string, connection = false): HostStatus & { url?: string } {
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== 'object') throw new Error('无效宿主状态')
  const status = value as Record<string, unknown>
  if (!phases.has(status.phase as HostPhase) || typeof status.blocked !== 'boolean'
    || (status.generation != null && (typeof status.generation !== 'string' || !status.generation))
    || (status.reason != null && typeof status.reason !== 'string')
    || (status.phase === 'ready' && (typeof status.generation !== 'string' || !status.generation || status.blocked))) {
    throw new Error('宿主状态协议不兼容')
  }
  if (!connection && status.url != null) throw new Error('公开宿主状态包含认证信息')
  if (connection && (status.phase !== 'ready' || typeof status.url !== 'string')) throw new Error('后台未就绪')
  return {
    phase: status.phase as HostPhase, blocked: status.blocked,
    ...(typeof status.generation === 'string' ? { generation: status.generation } : {}),
    ...(typeof status.reason === 'string' ? { reason: status.reason } : {}),
    ...(connection ? { url: status.url as string } : {}),
  }
}

export function decodeBackendInfo(text: string): BackendInfo {
  const status = decodeHostStatus(text, true)
  const url = new URL(status.url!)
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.port
    || url.username || url.password || url.hash || !url.searchParams.get('token')) {
    throw new Error('后台地址不符合本机认证契约')
  }
  return { url: url.toString(), generation: status.generation! }
}

export interface ServiceStatus {
  status: 'notRegistered' | 'enabled' | 'requiresApproval' | 'unsupported' | 'notFound' | 'unknown' | 'error'
  error?: string
}

export function decodeServiceStatus(text: string): ServiceStatus {
  const result: unknown = JSON.parse(text)
  if (!result || typeof result !== 'object') throw new Error('无效系统服务响应')
  const value = result as Record<string, unknown>
  if (!['notRegistered', 'enabled', 'requiresApproval', 'unsupported', 'notFound', 'unknown', 'error'].includes(value.status as string)
    || (value.error != null && typeof value.error !== 'string')) throw new Error('系统服务协议不兼容')
  return value as unknown as ServiceStatus
}

export function checkServiceResult(text: string): void {
  const value = decodeServiceStatus(text)
  if (value.status !== 'notRegistered') throw new Error(value.error ?? '后台服务卸载未确认，请重新检查')
}
