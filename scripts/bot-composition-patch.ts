/** Write a dsh `--patch` overlay that loads the local bot-composition plugin by absolute entry. */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const entry = resolve(root, 'packages/dsh-plugin-bot-composition/lib/index.js')
const out = process.argv[2] ? resolve(process.argv[2]) : join(root, '.scratch/bot-composition.patch.yml')
await mkdir(dirname(out), { recursive: true })
await writeFile(
  out,
  `- insert:
    - id: bot-composition
      name: ${JSON.stringify(entry)}
      inject: [agentPresets]
`,
)
console.log(out)
