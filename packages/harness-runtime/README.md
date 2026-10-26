# Harness 运行时

该工作区管理同发行版精确锁定的 DeepSeek Harness npm 依赖，版本以 `package.json` 为准。`cordis.patch.yml` 向命名 profile 装配会话控制器、预设与认证 WebServer；Bot 产品行为由 `apps/runner` 插件提供。

在根目录运行 `bun run harness --version` 或 `bun run harness --help` 检查已安装 CLI。产品通过 npm 公开入口运行，不从 `references/deepseek-harness` 导入源码，也不维护第二套执行循环、队列或会话日志。

macOS 打包收集实际已安装的依赖闭包，保留根 `bun.lock` 选定的版本。安装、构建与验证入口见 [根 README](../../README.md)。
