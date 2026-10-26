# Runner

Node 后台由 `src/index.ts` 准备隔离的命名 `dsh-bot` profile，再通过 Harness npm CLI 启动。`src/service.ts` 提供后台监督：单实例认领、独立进程组、失败退避重启和显式停止。客户端关闭不停止后台；工作进程重启恢复历史，不自动重放输入。

产品插件在 `src/plugin.ts` 中注册受官方 Cookie 认证保护的 HTTP/NDJSON 接口，Bot 与会话配置由 `src/store.ts` 持久化，实际执行、队列和历史交给官方 Session Controller。`src/conversation.ts` 将创建时固定的配置装配为会话 preset。当前仅启用 DeepSeek 官方文本模型，不加载工具。

在仓库根目录使用 `bun run dev:runner` 单独启动前台后台，或 `bun run dev` 启动完整客户端。默认数据目录为 `~/.dsh-bot-nsh`，开发和测试可设置 `DSH_BOT_HOME`。凭据通过 Harness 保存；连接 URL 含认证信息，不应输出到日志或提交到仓库。

检查与确定性行为验证通过根 `bun run check`、`bun run test` 执行。macOS 后台助手和成品验证见 [根 README](../../README.md)。
