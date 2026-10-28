import { legacyAccess, expectedVersion } from '../../infrastructure/host/legacy/index'

import { LegacyBackend } from './legacy-policy'

const backend = new LegacyBackend(legacyAccess, expectedVersion)
export const discoverLegacyBackend = () => backend.discover()
export const startLegacyBackend = () => backend.start()
