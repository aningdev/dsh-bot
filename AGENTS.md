# dsh-bot 开发约束

修改产品行为前阅读 [产品蓝图](docs/PRODUCT_BLUEPRINT.md) 与 [术语表](GLOSSARY.md)；修改工作区、profile、通信或打包前阅读 [工程方案](docs/architecture/PROJECT_LAYOUT.md)；修改界面前阅读 [界面规范](docs/architecture/UI_GUIDELINES.md)。

- 在根目录使用 Bun 管理工作区和唯一的 bun.lock；客户端运行于 NSH，后台运行于 Node。
- apps/client 拥有 NSH 页面、连接和平台适配；apps/runner 拥有后台与产品插件；packages/harness-runtime 管理固定版本 Harness npm 依赖。模块先在实际消费者内部组织。
- references 是固定提交的参考子模块，供阅读、调试和兼容性研究。产品安装、源码导入、类型配置和打包均从 npm 公开产物消费，不能依赖参考源码。
- 编码前阅读 Harness 对应实现与 README，说明复用点和偏离原因。使用命名 dsh profile；模型循环、队列、日志和工具执行归上游。
- Harness 直接依赖精确锁定到同一发行版；共享 Host 服务使用兼容 peer 契约，避免打包第二套框架。
- 跨进程输入由接收端校验。异步任务明确等待、取消和清理归属；断线未确认的请求不可自动重发。
- 会话配置创建后固定；修改 Bot 默认配置只影响新会话。客户端状态不能替代后台事实。
- 首版只展示用户消息与 Agent 文本，不提供审批交互；需要审批的操作必须拒绝。
- 保留用户未提交内容与参考子模块，不改写 Git 历史。旧实现已获授权删除，旧分支供回顾，不移植旧测试。
- 检查入口以根及工作区 package.json 为准。依赖、通信或打包修改须验证实际进程或成品；分别报告本机、真实模型、移动端和签名交付的验证范围。

Issue 工作流见 [issue-tracker](docs/agents/issue-tracker.md)，标签见 [triage-labels](docs/agents/triage-labels.md)，领域文档规则见 [domain](docs/agents/domain.md)。
