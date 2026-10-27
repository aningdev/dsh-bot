import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import {
  WRAPPER_PATH, DATA_ROOT, LOG_PATH, PLIST_PATH, SUPPORTED_VERSION, assertVersion, cliVersion, currentReady,
  isLoaded, launchTarget, markLaunch, pidOf, redact, renderPlist, resolveCli, rotateLog, run,
  secureLogs, validateToken, waitForReady, waitStopped,
} from './launchd'

const command = process.argv[2]

function say(message: string) {
  console.log(message)
}

async function install(): Promise<string> {
  const cli = resolveCli()
  const version = assertVersion(await cliVersion(cli))
  const plist = renderPlist(cli)
  await mkdir(`${DATA_ROOT}/bin`, { recursive: true, mode: 0o700 })
  await writeFile(WRAPPER_PATH, await readFile(new URL('./launch.sh', import.meta.url)), { mode: 0o700 })
  await writeFile(PLIST_PATH, plist, { mode: 0o600 })
  await secureLogs()
  say(`已安装 LaunchAgent：${PLIST_PATH}`)
  say(`官方后台：${cli}（${version}）`)
  say(`数据根：${DATA_ROOT}；日志：${LOG_PATH}`)
  return cli
}

async function start() {
  const cli = resolveCli()
  assertVersion(await cliVersion(cli))
  if (await rotateLog()) say('日志已轮转，旧日志保留为 backend.log.1')
  await markLaunch('cli start')
  await secureLogs()
  if (await isLoaded()) {
    await run(['launchctl', 'kickstart', '-k', await launchTarget()])
    say('后台已在 launchd 中，已重新启动当前进程')
  } else {
    await run(['launchctl', 'bootstrap', `gui/${process.getuid?.()}`, PLIST_PATH])
    say('已通过 launchd 启动后台')
  }
  const ready = await waitForReady(90000)
  say(`后台就绪：端口 ${ready.port}，认证已验证（${redact(ready.url)}）`)
}

async function status() {
  const loaded = await isLoaded()
  const pid = loaded ? await pidOf() : undefined
  const ready = await currentReady()
  const live = ready ? await validateToken(ready.url) : false
  const cli = resolveCli()
  const version = await cliVersion(cli)
  say(`LaunchAgent 已加载：${loaded ? '是' : '否'}`)
  say(`进程 PID：${pid ?? '无'}`)
  say(`当前 ready 行：${ready ? `端口 ${ready.port}（${live ? '认证有效' : '认证已失效，属于旧进程'}）` : '无'}`)
  say(`官方 dsh：${cli}（${version}${version === SUPPORTED_VERSION ? '' : `，不受支持，仅支持 ${SUPPORTED_VERSION}`}）`)
  if (!loaded || pid === undefined || !ready || !live) process.exitCode = 1
}

async function stop() {
  if (!(await isLoaded())) {
    say('后台未在 launchd 中运行；保持停止')
    return
  }
  await run(['launchctl', 'bootout', await launchTarget()])
  if (!(await waitStopped())) throw new Error('launchd 未在 15 秒内停止后台，请查看 launchctl print 与日志')
  say('已停止后台；plist 与数据保留，重新加载前保持停止')
}

async function uninstall() {
  if (await isLoaded()) {
    await run(['launchctl', 'bootout', await launchTarget()]).catch(() => undefined)
    if (!(await waitStopped())) throw new Error('launchd 未在 15 秒内停止后台，未移除 plist')
  }
  await rm(PLIST_PATH, { force: true })
  say(`已移除 LaunchAgent：${PLIST_PATH}`)
  say(`保留数据根 ${DATA_ROOT} 与日志 ${LOG_PATH}；产品不删除用户数据`)
}

try {
  if (command === 'install') await install()
  else if (command === 'start') await start()
  else if (command === 'status') await status()
  else if (command === 'stop') await stop()
  else if (command === 'uninstall') await uninstall()
  else {
    say('用法：bun scripts/backend/cli.ts <install|start|status|stop|uninstall>')
    process.exitCode = 2
  }
} catch (error) {
  console.error(redact(String(error instanceof Error ? error.message : error)))
  process.exitCode = 1
}
