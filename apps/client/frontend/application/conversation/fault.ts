import { hostEnv } from '../../infrastructure/storage/records'

const consumed = new Set<string>()
/** A one-shot failure injected by the e2e driver; never active otherwise. */
export function fault(name: string): boolean {
  const value = hostEnv('DSH_E2E_FAULT') ?? ''
  if (!value.split(',').includes(name) || consumed.has(name)) return false
  consumed.add(name)
  return true
}

export function consumedFault(name: string): boolean { return consumed.has(name) }
