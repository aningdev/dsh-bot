# dsh-bot

基于 NSH 与 DeepSeek Harness 的本机 Bot 工作台。桌面客户端管理 Bot、持续对话、审批和模型设置；执行后台使用用户已安装的官方 `dsh web`，由 launchd 托管。

产品规则见[产品蓝图](docs/BLUEPRINT.md)，组件边界与后续多端设计见[架构文档](docs/ARCHITECTURE.md)，概念见[术语表](GLOSSARY.md)。单机实现位于 `apps/client` 与 `scripts`；旧 Runner、产品 REST 与随包 Harness runtime 已移除。bridge、Relay 与移动端尚未实现。

## 开发与运行

需要 macOS、Bun、NSH 0.2.0，以及已安装的官方 dsh。当前仅支持经本机验证的 `0.2.1-rc.3`，精确值来自 [pinned-version.json](scripts/backend/pinned-version.json)，启动与实际进程发现都会检查版本，不自动升级或降级。Node 版本见 [`.node-version`](.node-version)。

```sh
bun install --frozen-lockfile
bun run dev
```

在客户端点击「启动官方后台」，随后创建 Bot、选择模板、工作区和默认模型。也可通过脚本管理同一个 LaunchAgent：

```sh
bun run backend:install
bun run backend:start
bun run backend -- status
bun run backend:stop
```

后台使用上游 `web` profile，数据根为 `~/.dsh-bot`，Bot 注册表在 `~/.dsh-bot/bots`。关闭桌面窗口不停止后台；主动停止后台会影响它承载的全部 Bot。日志中的认证令牌仅供本机发现使用，状态命令隐藏令牌。

后台启动脚本通过 macOS 的非交互登录 zsh 读取已导出的环境变量，因此可直接使用登录环境中的 `DEEPSEEK_API_KEY`，无需在设置页重复录入。launchd 本身不会继承当前终端的临时 `export`；需要在登录 shell 配置（如 `~/.zprofile`）中导出，修改后重启后台。密钥不写入 plist 或客户端文件，shell 初始化输出不进入后台日志；数据根仍固定为 `~/.dsh-bot`。

## 单机功能

- Bot 先保存，首次打开时检查配置并自动初始化唯一对话；未就绪对象保留修复入口，初始化后固定模板与工作区。未确认创建保留候选标识，恢复失败保留原指针。
- 纯文本流式对话；普通输入排队、撤回未领取项。停止取消当前活动并保留队列，不承诺持续暂停。
- 草稿与未确认输入在本地保存；结果未知时先核对后台，客户端不会自动重发。
- 审批展示工具名称及操作说明，允许一次或拒绝；取消清理审批。归档后既有工作与审批保留，阻止新输入。
- 「模型与供应商」页经上游 settings/credentials 保存共享设置，携带已读 revision；密钥提交后清空、不回显、不进入 Bot 文件。Bot 初始化前修改默认模型，初始化后切换当前对话模型。

独立指令、Bot 记忆、附件、模板编辑器、独立目标管理与多端连接留待后续阶段。模板使用上游已安装的 agent preset，不引入产品后台插件。

## 检查与成品

```sh
bun run check
bun run test
bun run test:e2e
bun run build
bun run package:macos
bun run test:package
```

`test:e2e` 在临时数据根启动真实官方 `dsh web`，使用真实 NSH 运行界面，并连接外部确定性 Messages 服务；不读取用户模型密钥，也不向后台注入测试插件。覆盖注册表、初始化与恢复、丢失响应、队列与审批、归档、设置和凭据。`prepare:sdk` 从精确锁定的公开 npm 包生成客户端 SDK，不导入参考子模块源码。

macOS 成品为 `dist/macos/DSH Bot.app`，只包含 NSH 客户端与原生传输，使用用户安装的官方后台。构建提供本机 ad-hoc 签名；Developer ID 签名、公证、Intel macOS、真实供应商与移动端均需分别验收。本地任务和验收记录在 `.scratch/nsh-rebuild`，不发布 GitHub issue。

## 参考资料

参考源码仅供阅读、调试和兼容性研究：

```sh
git submodule update --init references/deepseek-harness references/nsh
```

- [上游 Desktop 架构调研](docs/research/DESKTOP_ARCHITECTURE.md)
- [NSH 与 Harness 通信调研](docs/research/NSH_HARNESS_RESEARCH.md)
- [生命周期原型记录](docs/research/agent-lifecycle-prototype.md)
- [参考项目说明](references/README.md)

研究文档保留当时的证据与验证范围；旧方案的结论以当前蓝图和架构为准。
