import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, mkdtemp, rename, rm } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { startModelFixture } from './model-fixture'

/**
 * e2e driver: one isolated official `dsh web` plus an external deterministic
 * Messages fixture; the real NSH client runs under `nsh test`.
 *
 *   bun tests/e2e.ts
 */

const clientDir = join(import.meta.dir, '..')
// Keep every run within the manifest's dedicated test write root.
const fixtureParent = join(homedir(), '.dsh-bot-e2e')
await mkdir(fixtureParent, { recursive: true })
const fixtureRoot = await mkdtemp(join(fixtureParent, 'run-'))
const botsRoot = join(fixtureRoot, 'bots')
const testWorkspace = `${botsRoot}-workspace`

function waitForExit(child: ChildProcess): Promise<number> {
  return new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', code => resolve(code ?? 1))
  })
}

function readyUrl(child: ChildProcess): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('后台启动超时')), 90000)
    let output = ''
    const onChunk = (chunk: Buffer) => {
      output += chunk.toString()
      const match = /dsh web: (http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+)/.exec(output)
      if (!match) return
      clearTimeout(timer)
      resolve(match[1]!)
    }
    child.stdout?.on('data', onChunk)
    child.stderr?.on('data', onChunk)
    void waitForExit(child).then(code => {
      clearTimeout(timer)
      reject(new Error(`后台提前退出（${code}）：${output.slice(-2000)}`))
    })
  })
}

const root = await mkdtemp(join(tmpdir(), 'dsh-bot-e2e-'))
const home = join(root, 'dsh-home')
const workspace = join(root, 'workspace')
await mkdir(home, { recursive: true })
await mkdir(workspace, { recursive: true })
await rm(botsRoot, { recursive: true, force: true })
await mkdir(testWorkspace, { recursive: true })

const onboarding = process.argv.includes('--onboarding')
const model = await startModelFixture()
const backend = spawn('dsh', ['web', '--host', '127.0.0.1', '--port', '0', '--no-open'], {
  cwd: workspace,
  env: {
    ...process.env,
    DSH_HOME: home,
    DSH_AGENTS_HOME: join(home, 'agents'),
    DEEPSEEK_BASE_URL: model.baseUrl,
    DEEPSEEK_API_KEY: onboarding ? '' : 'nsh-fixture-key',
    DSH_PERMISSION_MODE: 'workspace-write',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

const results: { label: string; code: number }[] = []
let failure: unknown
try {
  const url = await readyUrl(backend)
  console.log('isolated dsh web ready; authentication URL kept in memory')

  // A cookie-less bootstrap must not authenticate.
  const rejected = await fetch(new URL('/connect?token=nsh-invalid-token', url), { redirect: 'manual' })
  if (rejected.status === 302 && rejected.headers.get('set-cookie')) throw new Error('非法的认证请求被接受')
  console.log(`invalid token rejected: ${rejected.status}`)

  const runs = onboarding ? [
    { label: '首次配置、原 Bot 模型修复与草稿发送', file: 'tests/onboarding.test.tsx', fault: '' },
  ] : [
    { label: 'a/b/c/e 注册表、初始化、重开恢复、模板缺失与恢复失败', file: 'tests/bot.test.tsx', fault: '' },
    { label: '初始化期间草稿与重开恢复', file: 'tests/initialization-draft.test.tsx', fault: 'delay-init-commit' },
    { label: '未就绪工作区修复', file: 'tests/bot-repair.test.tsx', fault: '' },
    { label: 'd 后台已创建但结果丢失', file: 'tests/lost-create.test.tsx', fault: 'drop-create-result' },
    { label: '正式指针保存失败', file: 'tests/lost-pointer.test.tsx', fault: 'drop-pointer' },
    { label: '队列、停止、审批取消和归档', file: 'tests/lifecycle.test.tsx', fault: '' },
    { label: '审批跨客户端重开恢复', file: 'tests/reconnect-approval.test.tsx', fault: '' },
    { label: '发送结果未知的后台核对', file: 'tests/unknown-send.test.tsx', fault: 'drop-prompt-result' },
    { label: '当前模型切换与恢复', file: 'tests/models.test.tsx', fault: '' },
    { label: '供应商设置和凭据', file: 'tests/settings.test.tsx', fault: '' },
    { label: '配置成功但凭据存储失败', file: 'tests/credentials-failure.test.tsx', fault: '' },
  ]

  for (const run of runs.filter(item => !process.env.DSH_E2E_CASE || item.file.includes(process.env.DSH_E2E_CASE))) {
    if (run.file.includes('credentials-failure')) {
      // Exercise the actual Host's file-backed provider, without a test plugin.
      const file = join(home, '.credentials.yaml')
      try { await rename(file, `${file}.previous`) }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
      await mkdir(file, { mode: 0o700 })
    }
    await rm(botsRoot, { recursive: true, force: true })
    await mkdir(botsRoot, { recursive: true })
    console.log(`\n=== ${run.label} ===`)
    const child = spawn('nsh', ['test', run.file, '--verbose'], {
      cwd: clientDir,
      env: {
        ...process.env,
        DSH_SPIKE_URL: url,
        DSH_BOTS_HOME: botsRoot,
        ...(run.fault ? { DSH_E2E_FAULT: run.fault } : {}),
      },
      stdio: 'inherit',
    })
    const code = await waitForExit(child)
    results.push({ label: run.label, code })
  }
  if (results.every(item => item.code === 0) && !process.env.DSH_E2E_CASE && !onboarding) model.verify()
} catch (error) {
  failure = error
} finally {
  if (backend.exitCode === null && backend.signalCode === null) {
    const exited = waitForExit(backend)
    backend.kill('SIGTERM')
    const timer = setTimeout(() => backend.kill('SIGKILL'), 5000)
    try { await exited } finally { clearTimeout(timer) }
  }
  await model.close().catch(() => undefined)
  await rm(root, { recursive: true, force: true })
  await rm(fixtureRoot, { recursive: true, force: true })
}

if (failure) {
  console.error('e2e 失败：', failure)
  process.exit(1)
}
console.log('\n=== e2e 结果 ===')
for (const result of results) console.log(`${result.code === 0 ? 'PASS' : `FAIL(${result.code})`} ${result.label}`)
process.exit(results.every(result => result.code === 0) ? 0 : 1)
