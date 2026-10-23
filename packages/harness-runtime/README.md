# Harness npm 运行时

此工作区声明 dsh-bot 使用的固定版本 `@deepseek-ai/dsh`，为产品提供发布版 CLI。当前不实现 Bot 生命周期、服务端接口或独立后台进程。

在仓库根目录安装和调用：

```sh
bun install --frozen-lockfile
bun run harness --version
bun run harness --help
```

版本以 [package.json](package.json) 为准；后续直接依赖的 DSH 服务包须与该发行版一致，Cordis 与 Loader 使用该发行版要求的版本。应用插件通过 bundle 加入命名 profile，参考子模块不参与本工作区构建。

当前工作区只验证 CLI 能启动。具体工具需要的原生依赖、独立后台和随应用分发仍需对应的集成验证，详见 [产品蓝图](../../docs/PRODUCT_BLUEPRINT.md)。
