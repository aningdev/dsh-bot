/** Drop stray TypeScript emit leftovers; keep only the Cordis entry surface. */
import { readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'

const lib = join(import.meta.dir, '..', 'lib')
for (const name of await readdir(lib)) {
  if (name.endsWith('.d.ts') || name.endsWith('.js.map')) await unlink(join(lib, name))
}
