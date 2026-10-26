# dsh-bot 开发约束

修改产品行为前阅读 [产品蓝图](docs/BLUEPRINT.md) 与 [术语表](GLOSSARY.md)；修改工作区、profile、通信或打包前阅读[架构文档](docs/ARCHITECTURE.md)；修改界面前阅读该文档的「通信与配置 UI」与「复用与移除边界」两节。

- 产品后台使用未经修改的官方 `dsh web`；客户端、bridge 与 Relay 的责任以架构文档为准，不把多端代码注入执行后台。
- 在根目录使用 Bun 管理工作区和唯一的 bun.lock。单机代码放 `apps/client` 与 `scripts/`；多端阶段增加 `apps/bridge` 与 `apps/relay`。旧 `apps/runner` 与 `packages/harness-runtime` 待移除，不新增 `packages/*` 或自有 profile 包。
- 后台就是官方 `dsh web`，固定 profile `web`，数据根 `~/.dsh-bot`（`DSH_HOME`）。不得自建 profile 名（上游只认 `acp/web/headless/sdk/sdk-minimal`），不得按 Bot 分进程、分 profile 或分插件集。
- Bot 是客户端持有的独立对象（`~/.dsh-bot/bots/<id>.json`），引用 profile，不是 profile 的别名。
- 模板复用上游 agent preset，首版选择已安装的内置或用户模板，自建走上游 bundle 安装流程。初始化后固定模板 ID 与工作区；运行期保留已装配组合，重启按 ID 读取当前定义，不承诺永久内容快照。
- 审批展示后台提供的工具名称、操作摘要与关键目标，再允许或拒绝；无在线 UI 时可以等待重连，恢复后展示待审批状态，不静默放行。
- 认证使用上游 token 引导与 Cookie，发现使用 `dsh web:` ready 行；业务直接调用上游 remote。Bot 只读快照属于 bridge 的产品数据契约，不能用自建接口替换上游执行协议。
- references 是固定提交的参考子模块，供阅读、调试和兼容性研究。产品安装、源码导入、类型配置和打包均从 npm 公开产物消费，不能依赖参考源码。
- Harness 直接依赖精确锁定到同一发行版；模板与插件一律通过 profile 的声明式 bundle 提供，不写运行时注入代码。
- 跨进程输入由接收端校验。异步任务明确等待、取消和清理归属；断线未确认的请求不可自动重发。
- Session 恢复故障保留指针并分类报错，提供重新检查，不自动重建或换模板。初始化前选择默认模型，初始化后操作当前模型；从下一步骤生效，已准备步骤保留原选择，不可用时不静默回退。
- 首版普通消息只展示用户消息与 Agent 文本，审批单独呈现操作信息；交付纯文本输入，独立指令、Bot 记忆与附件延后，不新增产品插件。
- 普通输入使用上游排队模式，可撤回未领取项；停止只取消当前活动并保留队列，不等于持续暂停。草稿和未确认输入在桌面本地保存，结果不明先核对，不提供一键重试。
- 首版支持一个经实测的 dsh 发行版，不兼容时保留草稿并阻止发送；Bot 可先保存为未就绪，修复后初始化。归档保留已接纳工作，首版不提供永久删除或独立目标管理。
- 桌面「模型与凭据」页经上游 `settings`/`credentials` remote 读写，保存时携带已读版本。Bot 只保存默认模型选择，供应商、端点和密钥共享；不建配置副本，不把密钥写进客户端文件或 LaunchAgent。
- 协议客户端从第一天就有 transport 抽象；多端只经 bridge 出站，Relay 只转发密文、不持 owner 凭据，后台不暴露公网。Bot 注册表只由桌面客户端写入，移动端只读快照，不引入注册表同步协议。
- 保留用户未提交内容与参考子模块，不改写 Git 历史。旧实现已获授权删除，旧分支供回顾，不移植旧测试。
- 检查入口以根及工作区 package.json 为准。依赖、通信或打包修改须验证实际进程或成品；分别报告本机、真实模型、移动端和签名交付的验证范围。

Issue 工作流见 [issue-tracker](docs/agents/issue-tracker.md)，标签见 [triage-labels](docs/agents/triage-labels.md)，领域文档规则见 [domain](docs/agents/domain.md)。
