import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
const node = spawnSync('node', ['-p', 'process.execPath'], { encoding: 'utf8' })
if (node.status !== 0) throw new Error(node.stderr || '找不到 Node')
const home = process.env.DSH_BOT_HOME ? resolve(process.env.DSH_BOT_HOME) : ''
const config = JSON.parse(await readFile('apps/client/nsh.config.json', 'utf8'))
if (home) config.capabilities.fs.read.push(home)
if (!config.capabilities.process.execute.includes(node.stdout.trim())) config.capabilities.process.execute.push(node.stdout.trim())
await writeFile('apps/client/nsh.json', JSON.stringify(config, null, 2) + '\n')
await writeFile('apps/client/launch.json', JSON.stringify({ packaged: false, home, node: node.stdout.trim(), service: resolve('apps/runner/dist/service.js') }) + '\n')
