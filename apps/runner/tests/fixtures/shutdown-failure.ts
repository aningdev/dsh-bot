import { join } from 'node:path'
/** Exercise a real launcher teardown failure in an isolated child process. */
import { fileURLToPath } from 'node:url'

import { initProfile, loadLayeredEnv, loadProfileDirectory } from '@deepseek-ai/dsh-app-boot'

import { runRunnerProfile } from '../../src/runner-profile.ts'

const directory = process.argv[2]
if (directory === undefined) throw new Error('Missing test home')
process.env.DSH_HOME = directory
const profileDir = join(directory, 'profiles', 'shutdown-test')
initProfile(profileDir, ['@deepseek-ai/dsh-base'])
const installAnchor = fileURLToPath(new URL('../package.json', import.meta.url))
const profile = loadProfileDirectory('dsh', profileDir, installAnchor)
const application = runRunnerProfile({
  environment: loadLayeredEnv('dsh'),
  profile,
  installAnchor,
  patchFiles: [],
  ready: async () => {},
  withdrawConnection: async () => {
    throw new Error('Expected teardown failure')
  },
})
await application.startup
await application.shutdown(0)
