# dsh-bot

基于 NSH 与 DeepSeek Harness 的 Bot 工作台。客户端使用 TSX 和 NSH 官方预编译原生运行时，后台使用 Node，通过命名 `dsh-bot` profile 启动 Harness；Bun 负责依赖和工程脚本。

当前实现 macOS 三栏界面、Bot 默认配置、多独立会话与固定会话配置（蓝图目标为每个 Bot 单一对话入口）、文本流、历史恢复、取消执行、凭据状态及独立后台。首阶段仅启用文本，不加载工具。真实模型、移动端和正式签名发布尚未验收，完整工程结构见[架构文档](docs/ARCHITECTURE.md)。

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

模型密钥直接复用后台启动环境中的 `DEEPSEEK_API_KEY`，无需在界面输入；客户端启动后台时会继承用户登录 Shell 导出的环境变量。沿用 Harness 凭据优先级：已有保存凭据优先，其次是启动环境，再其次是 `.env`。界面只显示配置状态，不读取密钥。修改环境变量后需重启后台才会生效。

## macOS 成品

`package:macos` 输出 `dist/macos/DSH Bot.app`，包含 Runner 与当前锁定依赖，不携带 Node。用户须安装 Node 24.9.0 或更新稳定版，无需安装 Bun 或 dsh。启动前通过用户登录交互 Shell 自动检测 Node，遵循用户环境的解析顺序，支持由 Shell 初始化的版本管理器；不提供手动路径设置。缺失、无法执行或版本不符时显示错误，安装或升级后点击“重新检测并启动”。后台助手通过 macOS LaunchServices 启动，后续进程沿用选中的 Node。构建使用本地临时签名，尚未完成 Developer ID 签名与公证。

`test:package` 将产物移至临时目录，确认没有内置 Node，以全新数据目录及仅含系统命令的 PATH 验证用户 Shell 检测本机 Node、认证、工作进程崩溃恢复、主动停止与旧安装路径更新，并验证 macOS 实际启动内置后台助手。测试需要用户登录 Shell 能找到符合要求的 Node。该测试会暂时移动构建产物，不应与其他打包命令并行执行。

已在本机 Apple Silicon macOS 验证成品后台与原生窗口打开。受限 PATH 的验证不能替代全新机器安装；Intel macOS、真实模型、移动设备、正式签名分发及完整成品界面端到端流程仍待验证。目前运行依赖较大，未进行裁剪。

## 参考与设计

参考源码按需初始化：

```sh
git submodule update --init references/deepseek-harness references/nsh
```

- [产品蓝图](docs/BLUEPRINT.md)
- [架构文档](docs/ARCHITECTURE.md)
- [NSH 与 Harness 通信调研](docs/research/NSH_HARNESS_RESEARCH.md)
- [生命周期原型记录](docs/research/agent-lifecycle-prototype.md)
- [参考项目说明](references/README.md)
- [领域术语](GLOSSARY.md)

旧 Electron 实现与测试已按重建决定移除，历史仍保留在 Git 中；其他研究文档中的旧实现结论不代表当前产品状态。
