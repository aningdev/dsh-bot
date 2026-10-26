# dsh-bot

基于 NSH 与 DeepSeek Harness 的 Bot 工作台。客户端使用 TSX 和 NSH 官方预编译原生运行时，后台使用 Node，通过命名 `dsh-bot` profile 启动 Harness；Bun 负责依赖和工程脚本。

当前实现 macOS 三栏界面、Bot 默认配置、多独立会话、会话配置固定、文本流、历史恢复、取消执行、凭据设置及独立后台。首阶段仅启用文本，不加载工具。真实模型、移动端和正式签名发布尚未验收，完整决定见 [重建方案](docs/NSH_REBUILD_PLAN.md)。

## 工作区

| 路径 | 职责 |
| --- | --- |
| `apps/client` | NSH 页面、连接、文本投影与平台适配 |
| `apps/runner` | Node 启动、后台监督、Bot 产品插件及持久配置 |
| `packages/harness-runtime` | 精确锁定的 Harness npm 依赖与 profile bundle |
| `scripts` | 开发配置生成、macOS 组装与成品后台验收 |
| `references` | 固定的 Harness 与 NSH 参考子模块，不参与构建 |

模型循环、队列、Session 与执行历史继续由 Harness 管理。NSH 原生 fetch 通过官方认证入口获取 Cookie；Node 侧提供必要的 HTTP/NDJSON 适配，调用官方 Session Controller。连接模块目前只允许本机回环地址，尚不支持远程配对和移动端访问。

## 开发与验证

使用 [`.node-version`](.node-version) 指定的 Node、Bun，以及 NSH CLI。本次本机验证使用 `nsh 0.2.0 (68531fb)`；参考子模块固定在另一提交，不能将其行为视为已在该 CLI 上验证。

在根目录执行：

```sh
bun install --frozen-lockfile
bun run dev
```

```sh
bun run check
bun run test
bun run build
bun run package:macos
bun run test:package
```

`check` 检查 Runner、Harness CLI 与 NSH 页面。`test` 运行确定性模型接口下的真实 Harness 会话测试、后台监督测试与 NSH 页面/文本投影测试。测试覆盖认证、会话隔离、默认配置更新不影响已有会话、流式文本、取消、重启读取历史而不重放输入，以及并发启动、故障恢复和主动停止。

数据默认位于 `~/.dsh-bot-nsh`，与原有应用及默认 dsh 数据分离。开发时可通过 `DSH_BOT_HOME` 指定隔离目录；生成的客户端启动配置不纳入 Git。关闭客户端保留后台，主动停止后台通过认证接口完成。

## macOS 成品

`package:macos` 输出 `dist/macos/DSH Bot.app`，同时携带官方 Node 24.15.0、Runner 与当前锁定依赖，无需用户另装 Node、Bun 或 dsh。首次构建下载 Node 归档并校验官方 SHA-256；后台助手内置在应用中，通过 macOS LaunchServices 启动。构建使用本地临时签名，尚未完成 Developer ID 签名与公证。

`test:package` 将产物移至临时目录，以全新数据目录及仅含系统命令的 PATH 验证内置 Node、认证、工作进程崩溃恢复、主动停止与旧安装路径更新，并验证 macOS 实际启动内置后台助手。该测试会暂时移动构建产物，不应与其他打包命令并行执行。

已在本机 Apple Silicon macOS 验证成品后台与原生窗口打开。受限 PATH 的验证不能替代全新机器安装；Intel macOS、真实模型、移动设备、正式签名分发及完整成品界面端到端流程仍待验证。目前运行依赖较大，未进行裁剪。

## 参考与设计

参考源码按需初始化：

```sh
git submodule update --init references/deepseek-harness references/nsh
```

- [产品蓝图](docs/PRODUCT_BLUEPRINT.md)
- [工程与工作区](docs/PROJECT_LAYOUT.md)
- [界面规范](docs/UI_GUIDELINES.md)
- [NSH 重建方案与验收范围](docs/NSH_REBUILD_PLAN.md)
- [NSH 与 Harness 通信调研](docs/NSH_HARNESS_RESEARCH.md)
- [参考项目说明](references/README.md)
- [领域术语](GLOSSARY.md)

旧 Electron 实现与测试已按重建决定移除，历史仍保留在 Git 中；其他研究文档中的旧实现结论不代表当前产品状态。
