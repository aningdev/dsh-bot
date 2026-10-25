/** Compile the application, or the explicitly requested test-only profile fixtures. */
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'
const root = fileURLToPath(new URL('../', import.meta.url))
const fixture = process.argv.includes('--test-fixtures')
await build({
  entryPoints: fixture
    ? [
        root + 'tests/fixtures/model.ts',
        root + 'tests/fixtures/tool-activity.ts',
        root + 'tests/fixtures/session-controller-probe.ts',
        root + 'tests/fixtures/shutdown-failure.ts',
      ]
    : [root + 'src/index.ts'],
  outdir: root + (fixture ? '.test-output' : 'lib'),
  platform: 'node',
  format: 'esm',
  bundle: true,
  packages: 'external',
  target: 'node24',
})
