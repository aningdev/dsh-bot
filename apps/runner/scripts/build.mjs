/** Compile the application, or the explicitly requested test-only model fixture. */
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'
const root = fileURLToPath(new URL('../', import.meta.url))
const fixture = process.argv.includes('--test-model')
await build({
  entryPoints: [root + (fixture ? 'tests/fixtures/model.ts' : 'src/index.ts')],
  outfile: root + (fixture ? '.test-output/model.js' : 'lib/index.js'),
  platform: 'node',
  format: 'esm',
  bundle: true,
  packages: 'external',
  target: 'node24',
})
