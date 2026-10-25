import { ORPCError, os } from '@orpc/server'

import { getRunnerService } from '../../runner'
import { RunnerError } from '../../runner-connection'
import { runnerServiceActionSchema } from './schemas'

export const runnerHandlers = {
  status: os.handler(async () => {
    try {
      return await getRunnerService().status()
    } catch (error) {
      if (error instanceof RunnerError) throw new ORPCError(error.code, { message: error.message })
      throw new ORPCError('SERVICE_UNAVAILABLE', {
        message: '无法查询后台服务，请确认已登录 macOS 桌面后重试。',
      })
    }
  }),
  control: os.input(runnerServiceActionSchema).handler(async ({ input }) => {
    try {
      const runner = getRunnerService()
      switch (input.action) {
        case 'install':
          await runner.install()
          break
        case 'start':
          await runner.start()
          break
        case 'stop':
          await runner.stop()
          break
        case 'upgrade':
          await runner.upgrade()
          break
        case 'uninstall':
          await runner.uninstall()
          break
        case 'enable-login':
          await runner.setLoginAtStartup(true)
          break
        case 'disable-login':
          await runner.setLoginAtStartup(false)
          break
      }
      return await runner.status()
    } catch (error) {
      if (error instanceof RunnerError) throw new ORPCError(error.code, { message: error.message })
      const message =
        input.action === 'upgrade'
          ? '后台更新未完成，请刷新状态后重试。不会自动重发消息或重跑工具。'
          : input.action === 'stop' || input.action === 'uninstall'
            ? '无法确认后台已停止，请刷新状态后重试。运行时尚未替换。'
            : '后台服务操作失败，请确认随包运行时已安装，且已登录 macOS 桌面后重试。'
      throw new ORPCError('SERVICE_UNAVAILABLE', { message })
    }
  }),
}
