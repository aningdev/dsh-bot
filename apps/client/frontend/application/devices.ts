import { signal } from 'nsh'
import { deviceControl, type Device, type PairingOffer, type PairingStatus } from '../infrastructure/host/devices'

export function createDeviceSettings(control: typeof deviceControl = deviceControl) {
  const relay = signal('')
  const offer = signal<PairingOffer | null>(null)
  const current = signal<PairingStatus | null>(null)
  const devices = signal<Device[]>([])
  const busy = signal(false)
  const message = signal('')
  const statusError = signal('')
  const devicesError = signal('')
  let disposed = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let refreshing = false
  let revision = 0
  const active = (phase: string) => ['waiting', 'approval', 'saving', 'rejecting', 'cancelling'].includes(phase)
  async function refresh() {
    if (disposed || refreshing) return
    refreshing = true
    const observed = revision
    try {
      const [status, list] = await Promise.allSettled([control.status(), control.list()])
      if (disposed || observed !== revision || busy()) return
      if (status.status === 'fulfilled') {
        statusError.set('')
        current.set(status.value.current)
        if (!status.value.current || !active(status.value.current.phase) || status.value.current.attemptId !== offer()?.attemptId) offer.set(null)
      } else statusError.set('无法读取配对状态，请等待重新连接。')
      if (list.status === 'fulfilled') { devices.set(list.value); devicesError.set('') }
      else devicesError.set('无法读取设备列表，请等待重新连接。')
    } finally {
      refreshing = false
      if (!disposed) timer = setTimeout(() => { void refresh() }, 2000)
    }
  }
  async function perform(action: () => Promise<void>) {
    if (busy() || disposed) return
    busy.set(true)
    revision++
    message.set('')
    try { await action() } catch (error) {
      if (!disposed) message.set(`操作未确认：${error instanceof Error ? error.message : String(error)}。请重新检查状态。`)
    } finally {
      revision++
      if (!disposed) { busy.set(false); if (timer) clearTimeout(timer); void refresh() }
    }
  }
  void refresh()
  return {
    relay, offer, current, devices, busy, message, statusError, devicesError,
    start: () => perform(async () => {
      const result = await control.start(relay())
      if (disposed) return
      offer.set(result)
    }),
    decide: (approve: boolean) => perform(async () => { const status = current(); if (status?.candidate) await control.decide(status, approve) }),
    cancel: () => perform(async () => { const status = current(); if (status) await control.cancel(status.attemptId); offer.set(null) }),
    revoke: (key: number[]) => perform(async () => { await control.revoke(key) }),
    refresh,
    dispose: () => { disposed = true; if (timer) clearTimeout(timer); offer.set(null) },
  }
}
export type DeviceSettings = ReturnType<typeof createDeviceSettings>
