import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const launcher = fileURLToPath(new URL('../../../scripts/node-launcher.sh', import.meta.url))
test('Node discovery uses the login shell, reports failures, and starts with the selected interpreter', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh node discovery '))
  const bin = join(root, 'bin'), shell = join(root, 'user shell')
  await mkdir(bin)
  // Model a version manager setting PATH after a GUI app starts with a system-only PATH.
  await writeFile(shell, '#!/bin/sh\nprintf "shell startup banner\\n"\nexport PATH="$DSH_TEST_NODE_PATH"\nexport DEEPSEEK_API_KEY="shell-test-only"\nexec /bin/sh -c "$2"\n', { mode: 0o755 })
  const env = { ...process.env, SHELL: shell, PATH: '/usr/bin:/bin', DSH_TEST_NODE_PATH: bin }
  const run = (...args: string[]) => spawnSync('/bin/sh', [launcher, ...args], { env, encoding: 'utf8', timeout: 10000 })
  try {
    const missing = run('check')
    assert.notEqual(missing.status, 0)
    assert.match(missing.stderr, /24\.9\.0/)
    await symlink(process.execPath, join(bin, 'node'))
    const found = run('check')
    assert.equal(found.status, 0, found.stderr)
    const line = found.stdout.split('\n').find(value => value.startsWith('DSH_BOT_NODE:'))!
    assert.deepEqual(JSON.parse(line.slice('DSH_BOT_NODE:'.length)), { path: process.execPath, version: process.versions.node })
    const result = join(root, 'selected node.json'), service = join(root, 'service with spaces.cjs')
    await writeFile(service, 'require("node:fs").writeFileSync(process.argv[3], JSON.stringify({node:process.execPath,command:process.argv[2],credentialInherited:process.env.DEEPSEEK_API_KEY==="shell-test-only"}))')
    const started = run('start', service, result)
    assert.equal(started.status, 0, started.stderr)
    assert.deepEqual(JSON.parse(await readFile(result, 'utf8')), { node: process.execPath, command: 'start', credentialInherited: true })
    await rm(join(bin, 'node'))
    const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'"
    await writeFile(join(bin, 'node'), `#!/bin/sh\nexec ${quote(process.execPath)} -e 'const probe=process.argv.splice(1,1)[0];Object.defineProperty(process.versions,"node",{value:"22.0.0"});eval(probe)' "$2" "$3" "$4" "$5"\n`, { mode: 0o755 })
    const old = run('start', service, result)
    assert.notEqual(old.status, 0)
    assert.match(old.stderr, /22\.0\.0/)
    assert.match(old.stderr, /版本不符合要求/)
  } finally { await rm(root, { recursive: true, force: true }) }
})
