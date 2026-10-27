import { writeFileSync } from 'node:fs'
import { resolveCli, run } from './launchd'

// The only writer of the pinned release: it records what the installed CLI prints,
// so no version string is ever transcribed by hand.
const cli = resolveCli()
const release = (await run([cli, '--version'])).trim()
const path = new URL('./pinned-version.json', import.meta.url)
writeFileSync(path, JSON.stringify({
  release,
  recorded: 'written by dsh --version on this machine; the only release this product may run',
}, null, 2) + '\n')
console.log(`已记录受支持版本（${release.length} 字符）到 ${path.pathname}`)
