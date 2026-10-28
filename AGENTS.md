# dsh-bot 开发约束

## 阅读与职责验收

- 修改产品行为前读[产品蓝图](docs/BLUEPRINT.md)与[术语表](GLOSSARY.md)；修改工作区、profile、通信、原生适配、宿主、模块结构或打包前读[架构文档](docs/ARCHITECTURE.md)。涉及界面或客户端职责时核对「通信与配置 UI」与「复用与移除边界」，并读[客户端约束](apps/client/AGENTS.md)；涉及宿主、后台服务登记与控制、迁移升级或 macOS 打包时读[宿主约束](apps/host/AGENTS.md)，客户端与脚本调用方同样遵守。
- 蓝图定义业务，架构文档定义职责，术语表定义概念；实现状态与验证范围见 [README](README.md)，研究材料只作证据。职责变更依据已授权目标或明确设计决策推进；文档区分既定目标、当前实现与临时兼容，不通过改写文档追认实现偏差。
- 重构前确认受影响逻辑的所有者，再决定保留、迁移或删除。已有代码不是职责依据；目录拆分须纠正任务范围内的职责偏离。交付前核对职责归属、依赖方向与原生导出，编译和测试通过不能代替边界验收。

## 目录与模块组织

- 优先采用按领域与职责划分的目录结构，让目录名和文件名直接表达负责的概念；同一领域的相关实现放在对应模块目录，避免大量不同职责的文件堆在同一层。
- 文件保持职责集中、体量可读；一个文件承载多个领域或过长时，按业务概念、接口与内部实现拆成清晰的文件和子目录。新增代码优先归入所属领域，避免持续追加到大文件或通用杂物目录。
- 模块入口集中公开 Interface，内部实现保持私有，依赖方向清晰。拆分同时保持策略与状态的唯一所有者，不按行数机械切割或拆出重复策略。

## 组件与依赖

- 全部 Bot 共用未经修改的官方 `dsh web`、`web` profile 与隔离数据根 `~/.dsh-bot`（`DSH_HOME`）；不按 Bot 拆进程、profile 或插件集，不自拼执行运行时。
- `apps/client` 的 TypeScript 负责界面、Bot 注册表、本地操作与产品策略，优先使用 NSH 标准 API；官方客户端与生成 remote 直连 dsh，承担认证、订阅、恢复与业务调用。
- `apps/client/src` 仅补足 NSH 标准 API 的实际缺口，返回传输结果或系统事实；新增原生接口前核实缺口。常驻 `apps/host` 负责 App 后台身份、dsh 生命周期、连接发现及后续 Bridge。两者均不设 `ProductService`、转换业务事件或提供统一聊天接口。
- Bot 能力优先复用 dsh 插件；明确缺口放 `packages/dsh-plugin-*`，能力规则、专属数据与执行注入归插件，经官方安装与 profile 声明式 bundle 装配。NSH 直接调用公开接口提供插件管理与产品交互。
- 多端只经宿主内 Bridge 出站，Relay 独立放 `apps/relay`，只转发密文、不持 owner 凭据；后台保持本机访问。沿用官方协议与 transport 抽象，Bot 只读快照另设契约，不增加注册表同步或第二份权威执行状态。
- 根目录用 Bun 管理 JS 工作区与唯一 `bun.lock`，Rust 依赖由 Cargo 管理。Harness 直接依赖精确锁定同一发行版，共享 Host 服务使用兼容 peer 契约。`references` 是固定提交的参考子模块；产品安装、导入、类型配置与打包消费公开产物，不依赖参考源码。

## NSH 原生能力参考目录

实现或调整客户端功能前，先按下表查阅 `references/nsh/website` 中对应的 elements 与 modules 文档，确认已有组件、行为、API 及平台边界后再选方案；优先组合 NSH 原生能力。新增自定义控件或 Rust 接口时，说明已核对的原生能力及具体缺口，并遵守[客户端约束](apps/client/AGENTS.md)中的安装版类型核对、权限与实际运行验证要求。以下是参考提交的文档索引，API 可用性以实际 CLI 生成的 `.nsh/types/` 与运行验证为准。

### Elements：按界面需求查组件

总入口：[元素与通用 props](references/nsh/website/elements/index.md)（样式、事件、焦点、无障碍与 ref 等公共契约）。

| 实现需求 | 优先查阅 |
| --- | --- |
| 基础容器、文本、条件与循环 | [View](references/nsh/website/elements/view.md)、[Text](references/nsh/website/elements/text.md)、[If / Each](references/nsh/website/elements/control-flow.md) |
| 滚动、长列表、跨文本选择 | [Scroll](references/nsh/website/elements/scroll.md)、[List](references/nsh/website/elements/list.md)、[Text selection](references/nsh/website/elements/text-selection.md) |
| 输入、焦点、键盘避让与安全区 | [Input](references/nsh/website/elements/input.md)、[Keyboard](references/nsh/website/elements/keyboard.md)、[Safe area](references/nsh/website/elements/safe-area.md) |
| 按钮、表单选择与数值调整 | [Button](references/nsh/website/elements/button.md)、[Checkbox](references/nsh/website/elements/checkbox.md)、[Radio](references/nsh/website/elements/radio.md)、[Switch](references/nsh/website/elements/switch.md)、[Slider](references/nsh/website/elements/slider.md) |
| 页面导航、标签页与折叠区域 | [NavStack / NavPage](references/nsh/website/elements/nav-stack.md)、[Tabs](references/nsh/website/elements/tabs.md)、[Collapsible](references/nsh/website/elements/collapsible.md) |
| 弹窗、系统确认与边缘面板 | [Dialog](references/nsh/website/elements/dialog.md)、[AlertDialog](references/nsh/website/elements/alert-dialog.md)、[Sheet](references/nsh/website/elements/sheet.md) |
| 浮层、锚定弹出、菜单与提示 | [Overlay](references/nsh/website/elements/overlay.md)、[Popover](references/nsh/website/elements/popover.md)、[Menu / ContextMenu](references/nsh/website/elements/menu.md)、[Tooltip](references/nsh/website/elements/tooltip.md)、[Toast](references/nsh/website/elements/toast.md) |
| Markdown / HTML 展示、代码、差异与富文本编辑 | [TextView](references/nsh/website/elements/text-view.md)、[Editor](references/nsh/website/elements/editor.md)、[DiffView](references/nsh/website/elements/diff-view.md)、[RichEditor](references/nsh/website/elements/rich-editor.md) |
| 表格、图表与进度反馈 | [Table](references/nsh/website/elements/table.md)、[DataTable](references/nsh/website/elements/data-table.md)、[Plot](references/nsh/website/elements/plot.md)、[Progress](references/nsh/website/elements/progress.md) |
| 图片、绘图、网页嵌入与视频 | [Image](references/nsh/website/elements/image.md)、[Canvas](references/nsh/website/elements/canvas.md)、[WebView](references/nsh/website/elements/web-view.md)、[Video](references/nsh/website/elements/video.md) |
| 可调整分栏与停靠工作区 | [Resizable](references/nsh/website/elements/resizable.md)、[Dock](references/nsh/website/elements/dock.md) |

### Modules：按运行时能力查 API

总入口：[模块分层与导入位置](references/nsh/website/modules/index.md)。元素页查 props、事件与 ref；模块页查导出、函数签名与运行语义。

| 实现需求 | 优先查阅 |
| --- | --- |
| 响应式、生命周期、上下文、动画、设备信息、手势、快捷键与无障碍 | [nsh](references/nsh/website/modules/nsh.md)：`signal`、`computed`、`effect`、`cleanup`、`context`、动画、`PanResponder`、`keymap` 等 |
| 剪贴板、媒体选择、键值存储、宿主通道与原生扩展注册 | 同页的 [Clipboard](references/nsh/website/modules/nsh.md#clipboard)、[Picker](references/nsh/website/modules/nsh.md#picker)、[Storage](references/nsh/website/modules/nsh.md#storage)、[host](references/nsh/website/modules/nsh.md#host)、[nativeComponent / nativeModule](references/nsh/website/modules/nsh.md#nativecomponent-and-nativemodule) |
| 基础组件、导航状态、系统弹窗与主题 | [nsh/base](references/nsh/website/modules/nsh-base.md)：组件行为、`createNavStack`、`AlertDialog` 等；具体组件同时查 elements 对应页 |
| 桌面窗口、标题栏、应用菜单与系统上下文菜单 | [nsh/desktop](references/nsh/website/modules/nsh-desktop.md)：`Window`、`titleBar`、`Menu`（与 `nsh/base` 的菜单组件区分） |
| 移动端标签栏、键盘附件与 Android 返回键 | [nsh/mobile](references/nsh/website/modules/nsh-mobile.md)：`TabBar`、`InputAccessoryView`、`BackHandler` |
| 列表、图片、画布、网页与视频的专属 API | [List](references/nsh/website/modules/nsh-list.md)、[Image](references/nsh/website/modules/nsh-image.md)、[Canvas](references/nsh/website/modules/nsh-canvas.md)、[WebView](references/nsh/website/modules/nsh-webview.md)、[Video](references/nsh/website/modules/nsh-video.md) |
| 文件、路径、进程、环境、TCP / WebSocket、编码、加密与压缩 | [标准模块](references/nsh/website/modules/standard-modules.md)：`fs/promises`、`path`、`process`、`os`、`net`、`websocket`、`buffer`、`crypto`、`url`、`zlib`、`console`；核对支持子集、权限与资源限制 |
| HTTP、流、取消、URL、定时器与国际化 | [全局 API](references/nsh/website/modules/globals.md)：`fetch`、Streams、`AbortController`、`URL`、timers、`Intl` 等 |
| 样式字段、主题与 Tailwind 支持范围 | [Style reference](references/nsh/website/modules/style-reference.md)、[Tailwind reference](references/nsh/website/modules/tailwind-reference.md) |

### 配套指南：按实现环节补读

- 组件与状态：[JSX 与组件](references/nsh/website/docs/jsx-and-components.md)、[响应式](references/nsh/website/docs/reactivity.md)、[编码指南](references/nsh/website/docs/coding-guides.md)。
- 布局与交互：[布局](references/nsh/website/docs/layout.md)、[样式](references/nsh/website/docs/styling.md)、[滚动](references/nsh/website/docs/scrolling.md)、[列表](references/nsh/website/docs/lists.md)、[表单与键盘](references/nsh/website/docs/forms-and-keyboard.md)、[导航](references/nsh/website/docs/navigation.md)、[手势](references/nsh/website/docs/touch-and-gestures.md)、[无障碍](references/nsh/website/docs/accessibility.md)。
- 系统接入与能力缺口核对：[网络](references/nsh/website/docs/networking.md)、[沙箱与 capabilities](references/nsh/website/docs/sandbox-and-capabilities.md)、[平台差异](references/nsh/website/docs/platform-specific.md)、[原生组件与模块](references/nsh/website/docs/native-components.md)。
- 调试与交付：[测试与 trace](references/nsh/website/docs/testing-and-trace.md)、[开发与调试](references/nsh/website/docs/dev-server-and-debugging.md)、[CLI](references/nsh/website/docs/cli.md)、[打包](references/nsh/website/docs/packaging.md)。中文文档在同路径的 `website/zh-CN/` 下，交互示例在 [demos](references/nsh/website/demos/)。

## 异步、协议与持久化

- 跨进程输入由接收端做运行时校验；TypeScript 类型和 Rust 类型不能替代边界校验。共享协议集中定义与校验，新增操作同时核对调用方、接收方和失败语义；公开状态与只读快照不携带认证 token。
- 异步任务明确等待、取消和清理归属。连接换代、切换 Bot 或关闭窗口后，旧读取与回调不得回写当前状态；连接重建不自动重发结果未确认的写请求。
- 同步迁异步时重新检查交错与错误语义。同一 Bot 的读取最新记录、应用字段修改、原子保存须串行完成；只排队整文件写入不足以保护草稿、改名、归档和 Session 指针。读取将不存在、损坏与 I/O 失败分别处理，不把权限等错误解释为空数据。
- Session 初始化前保存候选标识与核对记录，串行初始化，正式指针保存后才允许发送；输入提交前保存稳定请求标识与正文。超时不证明后台未接纳，结果未知先核对事实，不盲目重建 Session 或重发输入。

## 业务不变量

- Bot 是桌面持有的独立对象，引用 profile，每个 Bot 对应唯一持续对话；桌面独占写注册表，移动端只读快照。允许先保存未就绪 Bot，修复后初始化；共享工作区不提供并发隔离或目录沙箱。
- 模板复用已安装的上游 agent preset，初始化后固定模板 ID 与工作区。运行期保留装配组合，后台重启按 ID 读取当前定义，不承诺永久内容快照。Session 恢复失败保留指针并分类报错，提供重新检查；模板、模型不可用时保留选择，不静默重建或替换。
- 普通输入沿用上游排队与撤回规则；停止当前执行、撤回输入与停止后台分别处理。停止保留未领取输入，不等于持续暂停；归档只阻止新输入，保留历史、已接纳工作与待审批请求。
- 审批展示后台提供的工具名称、操作摘要与关键目标，再允许或拒绝。无在线 UI 时允许等待重连，恢复后显示待审批状态；缺少界面不构成放行理由。
- 供应商、端点与凭据归共享后台设置，桌面经 `settings` / `credentials` remote 读写；设置保存携带已读 revision，冲突保留编辑、重读并由用户确认。客户端不建配置副本，密钥不回显、不进入客户端文件、plist 或日志。
- Bot 默认模型与已有 Session 当前模型分开；初始化后切换当前模型，从下一步骤生效，已准备步骤保留原选择。后台版本不兼容时保留草稿并阻止发送，不自动升级或降级用户安装。
- 首版交付纯文本、用户消息与 Agent 文本，审批单独呈现。独立指令、Bot 记忆、附件、模板编辑器、永久删除、独立目标管理与正式多端按蓝图留待后续，不在重构中顺带引入。

## 验证与工作区

- 检查入口读根及工作区 `package.json`，验证说明见 README。依赖、通信、原生接口与打包修改须验证实际 NSH、进程或成品；确定性模型服务只证明相应协议行为。本机、真实模型、移动端与签名交付分别报告。
- 涉及持久化或进程的测试使用每次运行独立的数据根、socket、端口与配置，清理自身资源；普通回归不触碰真实 Bot、凭据或系统后台登记，不用共享生成文件传递并行测试状态。服务注册验收使用隔离 App 标识，并负责注销测试登记。
- 保留用户未提交内容与参考子模块，不改写 Git 历史。旧实现已获授权删除，旧分支供回顾，不移植旧测试。

Issue 操作时读 [issue-tracker](docs/agents/issue-tracker.md)，标签调整时读 [triage-labels](docs/agents/triage-labels.md)，领域术语或决策变更时读 [domain](docs/agents/domain.md)。
