import { HostControl } from 'dsh-client/native'

export type Device = { key: number[]; revoked: boolean }
export type PairingStatus = { attemptId: string; phase: string; candidate: number[] | null; fingerprint: string | null }
export type PairingOffer = { version: number; attemptId: string; relay: string; room: string; hostKey: string; nonce: string; expiresAt: number }

// The native adapter uses the shared Host protocol decoder before returning JSON.
async function request<T>(operation: string, args: object = {}): Promise<T> {
  return JSON.parse(await HostControl.deviceRequest(operation, JSON.stringify(args))) as T
}
export const deviceControl = {
  start: (relay: string) => request<PairingOffer>('startPairing', { relay }),
  status: () => request<{ current: PairingStatus | null }>('pairingStatus'),
  decide: (status: PairingStatus, approve: boolean) => request<PairingStatus>('decidePairing', { attemptId: status.attemptId, deviceKey: status.candidate, approve }),
  cancel: (attemptId: string) => request<PairingStatus>('cancelPairing', { attemptId }),
  revoke: (deviceKey: number[]) => request<Record<string, never>>('revokeDevice', { deviceKey }),
  list: async () => {
    const devices: Device[] = []
    let cursor: number | null = 0
    while (cursor !== null) {
      const page: { devices: Device[]; nextCursor: number | null } = await request('listDevices', { cursor })
      devices.push(...page.devices)
      cursor = page.nextCursor
    }
    return devices
  },
}
