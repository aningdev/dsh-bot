import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const launcher = await readFile('scripts/node-launcher.sh', 'utf8')
const home = process.env.DSH_BOT_HOME ? resolve(process.env.DSH_BOT_HOME) : ''
const config = JSON.parse(await readFile('apps/client/nsh.config.json', 'utf8'))
if (home) config.capabilities.fs.read.push(home)
await writeFile('apps/client/nsh.json', JSON.stringify(config, null, 2) + '\n')
await writeFile('apps/client/launch.json', JSON.stringify({ packaged: false, home, launcher, service: resolve('apps/runner/dist/service.js') }) + '\n')
