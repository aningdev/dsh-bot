/**
 * The Typert builder plugin emits the Bot Remote artifacts during `vp build`.
 * A silent skip (missing manifest export, unexpected contributor set) would
 * only surface at runtime as an unresolved `@dsh-bot/bot/remote` import, so the
 * build chain fails here instead.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = fileURLToPath(new URL('..', import.meta.url))
const required = [
  'lib/typert.host.js',
  'lib/typert.host.d.ts',
  'lib/typert.remote-client.js',
  'lib/typert.remote-client.d.ts',
]
const missing = required.filter((relative) => !existsSync(join(packageDir, relative)))
if (missing.length > 0) {
  throw new Error(
    `typert(host): @dsh-bot/bot is missing Remote artifacts: ${missing.join(', ')}.` +
      ' Check that the Bot manifest still exports ./typert and ./remote and that the builder plugin runs.',
  )
}
