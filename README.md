# dsh-bot

基于 NSH 与 DeepSeek Harness 的 Bot 工作台。桌面客户端管理 Bot、持续对话和设置页；执行后台使用官方 `dsh web`，由 launchd 托管。多端阶段增加本机 bridge 与公网 Relay，移动端只读 Bot 快照并参与对话。

**本仓库正从旧实现迁移到目标方案，代码重建尚未开始。** 产品规则见[产品蓝图](docs/BLUEPRINT.md)，整体技术方案与分阶段验收见[架构文档](docs/ARCHITECTURE.md)，概念见[术语表](GLOSSARY.md)。

## 目标方案

| 组件 | 职责 | 阶段 |
| --- | --- | --- |
| `apps/client` | NSH 三栏界面、Bot 注册表、上游 remote 客户端、最小审批、「模型与凭据」设置页 | 单机重建 |
| 官方 `dsh web` | 一个 `web` profile 承载全部 Bot 的 Workspace、Session、模型与工具执行 | 单机重建 |
| `scripts` | LaunchAgent、启停、构建、macOS 组装与验收 | 单机重建 |
| `apps/bridge` | 主动出站连接、设备授权、上游协议转发、只读 Bot 快照 | 多端阶段，未实现 |
| `apps/relay` | 路由端到端加密帧；不持后台凭据、不保存权威会话 | 多端阶段，未实现 |
| `references` | 固定提交的参考子模块，供阅读和调试，不参与产品导入或打包 | 参考资料 |

模型供应商、服务地址和凭据在桌面设置页统一管理，经上游 `settings` / `credentials` remote 保存。Bot 初始化前选择默认模型，初始化后查看和切换当前对话模型，不另存供应商连接。客户端不保存密钥，不自建模型配置存储；环境变量只保留给引导与自动化。

目标数据根为 `~/.dsh-bot`（`DSH_HOME`），profile 为上游 `web`。桌面独占写入 Bot 注册表，手机只读快照。会话与执行状态由后台持有；关闭客户端后继续执行，遇审批可等待重连，主动停止后台交给 launchd 启停脚本。

首版交付纯文本持续对话、已安装模板选择、排队与撤回、含操作信息的审批和模型设置。初始化后模板与工作区固定；运行中的模板组合保留，后台重启后按模板 ID 使用当前定义。停止保留尚未领取的队列，未确认输入先核对。归档保留历史与既有工作，不提供永久删除；独立指令、Bot 记忆、附件、模板编辑器与独立目标管理延后。

## 当前代码与开发入口

仓库仍包含旧 `apps/runner` 产品插件、Host 服务、自建 REST 与监督进程，以及 `packages/harness-runtime`。它们将在重建中移除，现有脚本与测试仍针对旧实现，不能据此判断目标方案已可运行。

开发工具以 [`.node-version`](.node-version) 和根及工作区的 `package.json` 为准，使用 Bun 管理依赖。本机曾使用 `nsh 0.2.0 (68531fb)` 验证旧界面；参考子模块固定在另一提交，不能视为同一版本已验证。

```sh
bun install --frozen-lockfile
bun run dev
```

现有检查入口：

```sh
bun run check
bun run test
bun run build
bun run package:macos
bun run test:package
```

当前测试覆盖旧实现的认证、会话隔离、配置快照、流式文本、取消、历史恢复及后台监督。目标方案重建时将按架构文档更新检查入口，新增配置 UI、上游协议与 LaunchAgent 验收，不迁移已废弃方案的专用测试。

## 交付与验证状态

目标桌面交付使用用户已安装的 `dsh` 与 LaunchAgent，产品不携带 Node、不自建运行时解析。首版只支持一个经实测的 dsh 发行版，具体版本在连通验收时记录；不兼容时保留草稿、阻止发送并提供修复指引，不自动升级或降级。现有 `package:macos` 与 `test:package` 仍按旧 Runner 方案构建和验收，不代表目标交付物已经完成。成品测试会暂时移动构建产物，不与其他打包命令并行执行。

旧成品曾在本机 Apple Silicon macOS 验证后台与原生窗口打开，使用本地临时签名。真实模型、新配置 UI、bridge/Relay、移动端、Intel macOS、Developer ID 签名与公证均未按目标方案验收。

## 参考资料

参考源码按需初始化：

```sh
git submodule update --init references/deepseek-harness references/nsh
```

- [上游 Desktop 架构调研](docs/research/DESKTOP_ARCHITECTURE.md)
- [NSH 与 Harness 通信调研](docs/research/NSH_HARNESS_RESEARCH.md)
- [生命周期原型记录](docs/research/agent-lifecycle-prototype.md)
- [参考项目说明](references/README.md)

研究文档保留当时的证据与验证范围；旧方案的结论须以当前蓝图和架构为准。
