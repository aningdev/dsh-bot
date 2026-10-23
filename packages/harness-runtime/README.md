# Harness npm 运行时

此工作区声明 dsh-bot 使用的固定版本 `@deepseek-ai/dsh`，为产品提供发布版 CLI。当前不实现 Bot 生命周期、服务端接口或独立后台进程。

在仓库根目录安装和调用：

```sh
bun install --frozen-lockfile
bun run harness --version
bun run harness --help
```

版本以 [package.json](package.json) 为准；后续直接依赖的 DSH 服务包须与该发行版一致，Cordis 与 Loader 使用该发行版要求的版本。应用插件通过 bundle 加入命名 profile，参考子模块不参与本工作区构建。

## 与 Runner 的关系

`apps/runner` 是规划中的后台应用，负责通过命名 profile 启动 Host、发布就绪和故障并完成进程级清理，由 launchd 管理。此包为它提供固定的 Harness npm 依赖；后续规划增加标准服务 bundle 与运行资源定义，由 Runner 的 profile 加载。此包不会另起后台进程，也不自行创建根 Context。

Runner 不加载官方 `dsh-web-app`，通信按需装配独立的 WebServer、Connection 和 Gateway 插件；桌面与后续 Web 页面由本项目提供。具体映射及当前与规划的区别见 [Harness 映射方案](../../docs/HARNESS_MAPPING_PLAN.md)。

当前工作区只验证 CLI 能启动，尚无上述服务 bundle 或随包 Node 可执行程序。具体工具需要的原生依赖、独立后台和随应用分发仍需对应的集成验证，详见 [产品蓝图](../../docs/PRODUCT_BLUEPRINT.md)。
