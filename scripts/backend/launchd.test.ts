import { expect, test } from 'bun:test'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { SUPPORTED_VERSION, assertVersion, currentReady, hasModelKey, redact, renderPlist, resolveCli, rotateLog } from './launchd'

test('the pinned release is the one actually installed, compared literally', async () => {
  const installed = (await new Response(Bun.spawn(['dsh', '--version'], { stdout: 'pipe' }).stdout).text()).trim()
  expect(SUPPORTED_VERSION).toBe(installed)
})
test('accepts only the verified release and never upgrades or downgrades', () => {
  expect(assertVersion(` ${SUPPORTED_VERSION}\n`)).toBe(SUPPORTED_VERSION)
  const escaped = SUPPORTED_VERSION.replaceAll('.', '\\.')
  expect(() => assertVersion('9.5.4')).toThrow(new RegExp(`仅支持 ${escaped}`))
  expect(() => assertVersion('9.6.0')).toThrow(/不会自动升级或降级/)
})

test('plist runs the installed CLI with an isolated data root and no model key', async () => {
  const plist = renderPlist('/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh')
  expect(plist).toContain('<string>/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh</string>')
  expect(plist).toContain('launch-backend.sh</string>')
  expect(await readFile(new URL('./launch.sh', import.meta.url), 'utf8')).toContain('web --host 127.0.0.1 --port 0 --no-open')
  expect(plist).toContain('<key>DSH_HOME</key><string>/')
  expect(plist).toContain('<key>RunAtLoad</key><false/>')
  expect(plist).toContain('<key>SuccessfulExit</key><false/>')
  expect(hasModelKey(plist)).toBe(false)
  expect(hasModelKey(plist.replace('<key>RunAtLoad</key>', '<key>DEEPSEEK_API_KEY</key>'))).toBe(true)
})

test('launchd wrapper reads login-shell credentials without storing or logging them and preserves the data root', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-login-env-'))
  try {
    const cli = join(directory, 'fake-dsh')
    await writeFile(join(directory, '.zprofile'), [
      'export DEEPSEEK_API_KEY=fixture-login-key',
      'export DSH_HOME=/incorrect-home DSH_AGENTS_HOME=/incorrect-agents',
      'echo LOGIN_PROFILE_OUTPUT',
      'echo LOGIN_PROFILE_ERROR >&2',
    ].join('\n'))
    await writeFile(cli, `#!/bin/sh
if [ "$1" = --version ]; then printf '%s\\n' '${SUPPORTED_VERSION}'; exit 0; fi
if [ "\${DEEPSEEK_API_KEY:-}" = fixture-login-key ]; then echo credential-inherited; else echo credential-missing; fi
printf '%s\\n' "$DSH_HOME" "$DSH_AGENTS_HOME"
echo backend-stderr >&2
`, { mode: 0o700 })
    const child = Bun.spawn(['/bin/sh', new URL('./launch.sh', import.meta.url).pathname, cli, SUPPORTED_VERSION], {
      env: { HOME: directory, ZDOTDIR: directory, PATH: '/usr/bin:/bin', DSH_HOME: `${directory}/data`, DSH_AGENTS_HOME: `${directory}/agents` },
      stdout: 'pipe', stderr: 'pipe',
    })
    const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited])
    expect(code).toBe(0)
    expect(stdout).toContain('credential-inherited')
    expect(stdout).toContain(`${directory}/data\n${directory}/agents`)
    expect(stdout + stderr).not.toContain('fixture-login-key')
    expect(stdout + stderr).not.toContain('LOGIN_PROFILE_')
    expect(stderr).toContain('backend-stderr')
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test('a ready line counts only under the newest launch marker, so a stale token is never current', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-ready-'))
  const log = join(directory, 'backend.log')
  await writeFile(log, [
    '[launch 2026-02-01T00:00:00.000Z] cli start',
    'dsh web: http://127.0.0.1:50001/?token=first-token',
  ].join('\n'))
  expect((await currentReady(log))?.token).toBe('first-token')

  // A second launch whose own ready line has not appeared yet must not resurrect the old one.
  await writeFile(log, [
    '[launch 2026-02-01T00:00:00.000Z] cli start',
    'dsh web: http://127.0.0.1:50001/?token=first-token',
    '[launch 2026-02-01T00:05:00.000Z] cli start',
  ].join('\n'))
  expect(await currentReady(log)).toBeUndefined()

  await writeFile(log, [
    '[launch 2026-02-01T00:00:00.000Z] cli start',
    'dsh web: http://127.0.0.1:50001/?token=first-token',
    '[launch 2026-02-01T00:05:00.000Z] cli start',
    'dsh web: http://127.0.0.1:50002/?token=second-token',
  ].join('\n'))
  expect(await currentReady(log)).toEqual({ url: 'http://127.0.0.1:50002/?token=second-token', token: 'second-token', port: 50002 })

  // A ready line the launcher never marked is untrusted.
  await writeFile(log, 'dsh web: http://127.0.0.1:50003/?token=unmarked\n')
  expect(await currentReady(log)).toBeUndefined()
})

test('redacts the bootstrap token from anything printed', () => {
  expect(redact('ready http://127.0.0.1:1234/?token=abcDEF_123')).toBe('ready http://127.0.0.1:1234/?token=<redacted>')
})

test('a moved or missing installation is reported, never replaced by another copy', () => {
  expect(() => resolveCli(['/nonexistent/bin/dsh'])).toThrow(/未找到已安装的官方 dsh/)
})

test('log rotation keeps the previous log and preserves the launch marker', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-rotate-'))
  const log = join(directory, 'backend.log')
  await writeFile(log, '[launch 2026-02-01T00:00:00.000Z] cli start\ndsh web: http://127.0.0.1:50001/?token=old\n')
  expect(await rotateLog(log, 1)).toBe(true)
  expect((await currentReady(log))).toBeUndefined()
  const kept = await readFile(join(directory, 'backend.log.1'), 'utf8')
  expect(kept).toContain('token=old')
  await writeFile(log, '[launch 2026-02-01T01:00:00.000Z] cli start\ndsh web: http://127.0.0.1:50002/?token=new\n')
  expect((await currentReady(log))?.token).toBe('new')
  expect(await rotateLog(log, 1024 * 1024)).toBe(false)
})
