# Harness npm 运行时

此工作区固定 dsh-bot 使用的 Harness npm 版本，并提供标准服务 bundle。它不启动独立进程，也不实现 Bot 生命周期。`apps/runner` 通过命名 profile 加载本包和 Bot 插件，承载同一棵 Host 插件树。

在仓库根目录安装和调用 CLI：

```sh
bun install --frozen-lockfile
bun run harness --version
bun run harness --help
```

版本以 [package.json](package.json) 为准；直接依赖的 DSH 服务包与该发行版一致，Cordis 与 Loader 使用该发行版要求的版本。参考子模块不参与产品构建。

## Bundle 与 Runner

`cordis.patch.yml` 在 `dsh-base` 上补充独立 WebServer、Connection、Remote 事件贡献、AgentPresetRegistry、Workspace、Session Controller、文件引用与上传，调整 Host 全局工具作用域。当前 standard preset 为空，各 Bot 使用自己的稳定 preset 和批准的能力 id；全局模型工具（包括 working-directory 工具）被禁用，working-directory 服务继续供配置应用使用。官方 `dsh-web-app` 和页面不进入 profile；桌面与后续 Web 页面由本项目提供。

Runner 拥有应用入口、profile 选择、就绪/故障通知和进程级清理。Bot bundle 的 Host 适配器为标准 Session 服务提供统一所有者；安装须应用根 Bun 锁文件中的兼容补丁，见 [共存验证](../../docs/SESSION_CONTROLLER_COMPATIBILITY.md)。此包只提供固定依赖和装配资源，不另建 `startHost()` 或根 Context。默认模型保持官方 provider；确定性模型只在 Runner 的测试 overlay 中注册。

当前已验证发布版 npm 下的 profile、认证 Remote、真实日志和进程重启。launchd 注册、随包 Node、安装签名和运行时替换尚未实现；这里的“运行时包”不表示已经携带 Node 可执行程序。操作与验证命令见 [Runner README](../../apps/runner/README.md)，职责依据见 [Harness 映射方案](../../docs/HARNESS_MAPPING_PLAN.md)。
