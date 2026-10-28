# dsh-bot

基于 NSH 与 DeepSeek Harness 的本机 Bot 工作台。桌面客户端管理 Bot、持续对话、审批和模型设置；`apps/host` 的 Rust 宿主独占官方 `dsh web` 的生命周期，NSH 通过官方客户端直连 dsh。

产品规则见[产品蓝图](docs/BLUEPRINT.md)，组件边界见[架构文档](docs/ARCHITECTURE.md)，概念见[术语表](GLOSSARY.md)。开发与成品统一使用同一个 Host 实现，旧客户端 LaunchAgent 管理链和 `scripts/backend` 已删除。App 内的辅助程序通过 `SMAppService` 登记后台服务，原生适配仅补足 Cookie WebSocket、Unix socket 和系统服务调用；不设 Rust `ProductService`。Bridge、Relay 与移动端尚未实现。

## 开发与运行

需要 macOS、Bun、Rust 工具链、NSH 0.3.0，以及已安装的官方 dsh。当前仅支持经本机验证的 `0.2.1-rc.3`，精确值来自 [supported-dsh.json](apps/host/supported-dsh.json)；Host 启动时检查实际 CLI 版本，不自动升级或降级。Node 版本见 [`.node-version`](.node-version)。

```sh
bun install --frozen-lockfile
# 终端一：启动开发 Host，监听 ~/.dsh-bot/host/control.sock
bun run host:dev
# 终端二：启动客户端，显式连接开发 Host
bun run dev
```

开发 Host 不登记系统服务；退出 Host 终端会回收它管理的 dsh，关闭客户端窗口则不会。`bun run dev` 默认设置 `DSH_HOST_SOCKET=$HOME/.dsh-bot/host/control.sock`，也可显式指定其他开发 socket；没有 Host 或 App 服务组件时报告错误，不回退启动另一套后台。开发 Host 与成品使用同一数据根，不并行运行；Host 的单实例锁阻止两个新宿主同时接管，旧服务则须先按下文迁移。

客户端包含三栏工作台与独立设置页。在「设置 → 后台」点击「启动官方后台」，随后在工作台新建 Bot、选择模板、工作区和默认模型；Bot 编辑、模型选择和工具审批通过弹窗完成。

后台使用上游 `web` profile，数据根为 `~/.dsh-bot`，Bot 注册表在 `~/.dsh-bot/bots`。关闭桌面窗口不停止后台；主动停止后台会影响它承载的全部 Bot。Host 通过私有控制 socket 提供当前连接，不扫描历史 ready 日志；诊断日志位于 `~/.dsh-bot/logs`，认证信息不进入公开状态或客户端文件。

Host 使用非交互登录 zsh 读取已导出的环境变量，因此可使用登录环境中的 `DEEPSEEK_API_KEY`，无需在设置页重复录入。launchd 不继承终端的临时 `export`；需要在登录 shell 配置（如 `~/.zprofile`）中导出，修改后重启后台。密钥不写入 plist，shell 初始化输出与 ready 输出隔离；数据根仍固定为 `~/.dsh-bot`。

## App 后台服务与旧服务迁移

默认 `bun run package:macos` 生成 `dist/macos/DSH Bot.app`，同时携带 NSH 客户端、Rust Host、LaunchAgent 配置与 ServiceManagement 动态库，不再提供独立预览包或 shell 后台入口。App、Host 与服务组件的最低系统目标统一为 macOS 14.0，尚未在该最低版本实机验收。

**应用关联服务的实际启动仍有验收阻塞：此前 ad-hoc 签名的辅助程序被 macOS 以 `OS_REASON_CODESIGNING | Launch Constraint Violation` 拒绝执行，本机没有有效签名身份。** 删除旧实现和统一打包入口不代表这一阻塞已解决。可通过 `DSH_CODESIGN_IDENTITY` 指定已安装的签名身份，随后仍须实测服务启动；签名校验、组件存在或注册成功不能代替该验收。系统名称、图标、批准、重新登录不自启、升级与移动迁移也须单独验证，当前成品不能视为已完成发布验收。

首次打开和「重新连接」只查询状态；明确点击「启动官方后台」才登记 App 后台服务并启动 dsh，必要时转到系统设置批准。关闭窗口保留后台，主动停止会持久保存停机意图；「停止全部 Bot 并卸载后台服务」先确认 dsh 停止，再注销服务。宿主崩溃后先回收旧 dsh 进程组，连续异常退出达到预算后阻止自动重启。

如果以前安装过 `dev.dshbot.backend`，先退出旧客户端，停止并卸载旧服务，再使用新入口。客户端会检查旧 plist 和已登记任务，存在时拒绝启动；不会自动中断旧工作，也不提供旧后台回退。完成旧工作后，可在终端手动执行：

```sh
launchctl bootout "gui/$(id -u)/dev.dshbot.backend"
rm "$HOME/Library/LaunchAgents/dev.dshbot.backend.plist"
```

如果任务本就未登记，`bootout` 会报找不到服务；其他失败须先排查。确认旧 dsh 及工具子进程已经退出后再启动 Host，不只凭删除 plist 判断已停机。保留 `~/.dsh-bot`、Bot 文件、Session 与草稿；无需删除历史日志。原 `backend:*` 命令已移除，日常后台操作统一通过客户端及 Host 控制通道。

## 单机功能

- Bot 先保存，首次打开时检查配置并自动初始化唯一对话；未就绪对象保留修复入口，初始化后固定模板与工作区。未确认创建保留候选标识，恢复失败保留原指针。
- 纯文本流式对话；普通输入排队、撤回未领取项。停止取消当前活动并保留队列，不承诺持续暂停。
- 草稿与未确认输入在本地保存；结果未知时先核对后台，客户端不会自动重发。
- 审批展示工具名称及操作说明，允许一次或拒绝；取消清理审批。归档后既有工作与审批保留，阻止新输入。
- 「设置 → 模型与供应商」经上游 settings/credentials 保存共享设置，携带已读 revision；密钥提交后清空、不回显、不进入 Bot 文件。Bot 初始化前修改默认模型，初始化后切换当前对话模型。

独立指令、Bot 记忆、附件、模板编辑器、独立目标管理与多端连接留待后续阶段。模板使用上游已安装的 agent preset。后续 Bot 能力优先复用 dsh 插件，必要的产品插件放在 `packages/dsh-plugin-*`；NSH 经公开接口提供产品交互和插件管理界面，能力实现和专属数据归插件。

## 检查与成品

```sh
bun run check
bun run test
bun run test:startup
bun run test:host-client
bun run test:e2e
bun run build
bun run package:macos
bun run test:package
```

`test` 包含 Rust 宿主生命周期与控制协议、客户端连接竞态、注册表 I/O、服务登记与开发模式策略及 NSH 基础界面测试；不再执行旧后台安装或日志发现测试。连接竞态覆盖认证中换代、旧读取结果丢弃、关闭时清理及连接完成前断流；Host 测试覆盖并发启动失败与失败清理期间的请求归并。

`test:host-client` 在临时数据根使用真实官方 dsh 与真实 NSH，覆盖只读首次连接、明确启动、存活窗口跨宿主重启、generation 切换后重新认证，以及手动停止后重开不自动启动。它同时验证标准 WebSocket 的 Cookie 握手限制和原生适配后的官方认证连接，不登记实际系统服务，不能证明签名成品的系统批准或后台服务启动。

`test:startup` 通过真实 `nsh run` 加载客户端，验证能挂载且环境变量指定的隔离注册表被保留；使用独立夹具、不连接真实后台，结束后清理进程与目录。开发加载器与 `nsh test` 的模块导入行为存在差异，因此单独覆盖桌面启动。

`test:e2e` 在临时数据根启动真实官方 `dsh web`，使用真实 NSH 界面连接外部确定性 Messages 服务；不读取用户模型密钥，不向后台注入测试插件。覆盖注册表、初始化与恢复、丢失响应、队列与审批、归档、设置和凭据。注册表测试使用独立 NSH 夹具调用生产文件 API，覆盖原子保存与 I/O 错误，不登记系统服务；夹具使用每次运行独立的目录，结束后清理。`prepare:sdk` 仅从精确锁定的公开 npm 包生成客户端 SDK，不生成旧后台脚本资产、不导入参考子模块源码。

NSH 标准 API 负责 HTTP / HTTPS 与普通 WS / WSS；当前 `127.0.0.1` 网络授权覆盖本机后台。原生 `CookieWebSocket` 仅用于标准握手 API 不允许设置 Cookie 的认证连接，边界见[架构文档第 7 节](docs/ARCHITECTURE.md#7-通信与配置-ui)。

成品 smoke 检查客户端、Host、服务动态库、plist 入口、支持版本和签名，并拒绝旧运行时与 shell 后台资源；不登记或启动系统服务。构建默认提供本机 ad-hoc 签名；Developer ID 签名、公证、Intel macOS、真实供应商与移动端均需分别验收。本地任务和验收记录在 `.scratch/nsh-rebuild`，不发布 GitHub issue。

## 参考资料

参考源码仅供阅读、调试和兼容性研究：

```sh
git submodule update --init references/deepseek-harness references/nsh references/waku references/lorca
```

- [上游 Desktop 架构调研](docs/research/DESKTOP_ARCHITECTURE.md)
- [NSH 与 Harness 通信调研](docs/research/NSH_HARNESS_RESEARCH.md)
- [生命周期原型记录](docs/research/agent-lifecycle-prototype.md)
- [Lorca 常驻后台与多端调研](docs/research/LORCA_ARCHITECTURE.md)
- [参考项目说明](references/README.md)

研究文档保留当时的证据与验证范围；旧方案的结论以当前蓝图和架构为准。
