# Harness Host、PWA 与客户端复用调研

本记录针对客户端接口与工程划分，核对参考子模块提交 687f282e8625c6b8d11ff58211a90524be2e4317（0.2.1-rc.2）的官方源码与浏览器 API 文档。以下区分源码事实、可行性判断和待确认建议；本次未实现 Host、Relay 或 PWA，也未验证它们的端到端组合。

## Harness Host 的职责分层

Host 是承载 Cordis 服务与插件的执行侧环境。host/ 目录中的包主要提供 HTTP(S)、静态前端、目录选择和应用打开等 GUI 宿主能力；完整执行能力由 profile 组合引擎和其他插件提供。Runner 可以通过自己的命名 profile 装配这些能力。来源：[Host 包地图](../references/deepseek-harness/packages/host/README.md)、[Web 应用组合](../references/deepseek-harness/packages/bundle/web-app/README.md)。

| 层           | 上游实现               | 职责                                             |
| ------------ | ---------------------- | ------------------------------------------------ |
| 网络监听     | host-webserver         | HTTP(S) 路由与 WebSocket upgrade                 |
| 连接与载体   | client-connection      | 认证、Peer、RPC 通道、Fetch 路由与客户端连接恢复 |
| 服务调用     | api-gateway            | Typert Remote 方法分发、参数校验、取消与逻辑流   |
| 应用事件选择 | api-remotes            | 选择并转发 Host 事件、装配客户端 Remote 贡献     |
| 会话业务     | api-session-controller | Agent 激活、会话操作、历史跟随与流式状态         |

这些层并非只能由官方 UI 使用。Connection 的客户端安装接口可接收自定义 rpc、fetch、流和 WebSocket 工厂；Gateway 的 invoke、stream 接收显式 Peer，与具体物理载体分离。未来 Relay 可以在连接层评估适配，无需改变工具插件的调用机制。来源：[客户端传输选项](../references/deepseek-harness/packages/client/connection/src/client/index.ts)、[Host Connection](../references/deepseek-harness/packages/client/connection/src/index.ts)、[Gateway 调用](../references/deepseek-harness/packages/api/gateway/src/index.ts)、[调用请求类型](../references/deepseek-harness/packages/api/gateway/src/types.ts)。

产品服务也能通过标准插件机制加入这套调用体系：Host 服务继承 TypertRemoteService，用 Remote 声明可调用方法，提供生成的 typert 与 remote 入口，客户端装配相应贡献。独立工程仍需验证公开生成工具、产物和客户端装配，不能直接照搬上游工作区的构建命令。来源：[增加 Remote API](../references/deepseek-harness/docs/cookbook/adding-a-remote-api.md)。

Desktop 实际如何装配这些层、处理运行时资源、认证及退出，见 [Desktop Host 启动链与 Runner 复用调研](./DESKTOP_HOST_RESEARCH.md)。该调研还区分官方 Electron 子进程与本项目 launchd Runner 的所有权，并记录当前 #3 的失败证据。

## 复用时仍需解决的两项问题

Session Controller 自己控制 Agent 激活。其恢复路径调用 agents.resume 后只返回 agent；历史 follow 在输出快照后可调用 promote 触发恢复。Bot 配置即时替换需要应用持有 AgentHandle，因此必须验证统一的生命周期协调方式。单纯在接口前增加 Bot ID 映射不足以解决该问题。来源：[Agent 控制器](../references/deepseek-harness/packages/api/session-controller/src/agent.ts)、[历史跟随](../references/deepseek-harness/packages/api/session-controller/src/history.ts)、[此前配置接入实验](./HARNESS_INTEGRATION.md)。

官方客户端 npm 入口并非全部是可直接由 Vite 引用的浏览器 ESM。Connection 的 client 条件导出在 Node 下指向独立 ESM，在浏览器下指向模块工厂；官方客户端模块系统负责装载和物化工厂。api-remotes 还装配许多官方产品命名空间。自有 React 界面应验证所需客户端运行时及生成贡献的最小组合，不能假设导入整个 api-remotes 就得到轻量的普通浏览器 SDK。来源：[Connection 发布入口](../references/deepseek-harness/packages/client/connection/package.json)、[客户端模块系统](../references/deepseek-harness/docs/subsystems/client-modules.md)、[官方 Remote 客户端装配](../references/deepseek-harness/packages/api/remotes/src/client/index.ts)。

已确认的 Q6 方向是：Runner 使用 Harness Host 的标准服务与 Remote 体系，产品插件补充 Bot 管理和必要协调；上游已有操作与事件逐项复用。服务实现、Remote 声明及生成贡献由所属产品插件共同维护。生命周期与浏览器产物接入仍需要原型验证。

## PWA 可以使用 Relay

PWA 可以用浏览器 WebSocket 连接远端 WSS Relay，Runner 主动连接同一 Relay 后，由 Relay 转发两端加密数据。HTTPS 页面与 WSS 是浏览器正常支持的运行方式，不要求手机直接访问 Runner 的本机端口。页面 CSP 的 connect-src 必须允许实际 Relay 地址。来源：[WebSocket 客户端](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)、[WebSocket 构造参数](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)、[connect-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src)。

WSS 保护客户端到 Relay 的连接，客户端与 Runner 之间的端到端加密需要额外的已认证会话协议。Web Crypto 在安全上下文提供加密和密钥派生能力，但浏览器 API 的存在不等于已经解决配对、对端身份验证、密钥保管或重放保护；具体协议尚未选定。来源：[Crypto.subtle](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle)、[密钥派生](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey)。

官方 HTTP 载体使用签名 Cookie、同源 Host/Origin 校验和进程 token 交换；它不是将地址替换成 Relay 后就能透明使用的端到端加密通道。浏览器 WebSocket 构造参数只有地址和子协议，不能照搬 Electron main 注入任意认证请求头的做法。Relay 接入需要浏览器兼容的认证握手，并将已认证身份在 Runner 中映射到受控 Peer。来源：[Connection 认证说明](../references/deepseek-harness/packages/client/connection/README.md)、[官方桌面 WebSocket 请求头注入](../references/deepseek-harness/apps/desktop/src/main.ts)、[WebSocket 构造参数](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)。

PWA 进入后台或关闭后不能承诺保持实时连接。浏览器可能终止后台工作；Service Worker 也不提供永久驻留保证。再次打开时应恢复连接并从 Runner 补齐状态，后台通知需要另行评估 Push 等机制。Relay 首次交付仅支持双方在线，不暂存离线业务请求；Runner 已接纳的执行不随客户端断连停止。来源：[PWA 离线与后台操作](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)、[产品蓝图](./PRODUCT_BLUEPRINT.md)。

端到端加密依赖可信的客户端代码。若 Relay 运营方同时控制 PWA 页面发布，它可能通过修改页面脚本获取终端明文；传输加密本身不防御这种代码替换。客户端发布来源与 Relay 运营方之间的信任关系仍需在威胁模型中明确。此项是基于浏览器执行模型的设计限制，不代表当前已选择部署方式。

## 桌面与 PWA 页面能共享到什么程度

两者都运行 React DOM，因此聊天、Bot 配置、工具结果、审批和响应式布局可以共享页面源码。共享的是页面实现，桌面与 PWA 仍可拥有独立构建入口、导航外壳和发布产物。这是工程可行性判断，尚未完成迁移。

当前应用的 ipc-client 通过 MessagePort 连接 Electron main，app actions 也直接依赖该客户端；这套入口在普通 PWA 中没有对应 main。因此现有页面不能未经适配直接发布为 PWA。共享页面需要显式获得业务数据访问和平台能力，桌面保留现有受控 oRPC 路径，PWA 使用浏览器连接。来源：[当前 IPC 客户端](../apps/desktop/src/renderer/lib/ipc-client.ts)、[当前 app actions](../apps/desktop/src/renderer/actions/app.ts)、[桌面开发约束](../apps/desktop/AGENTS.md)。

| 可共享页面与逻辑            | 需要平台适配的能力           |
| --------------------------- | ---------------------------- |
| 聊天、历史、审批、Bot 配置  | Runner 启停、安装与本机发现  |
| Markdown 与标准工具结果呈现 | 原生目录选择、窗口与系统菜单 |
| 与平台无关的数据和状态转换  | 桌面通知与 Web Push          |
| 响应式业务布局              | 连接、凭据保管及平台持久化   |

已确认 iOS/Android 使用 Expo 与 React Native 界面。协议、数据和与平台无关的逻辑可按实际相容性共享；React DOM 组件用于 Web 侧共享，必要的原生能力由移动端适配。

## Expo 与 Web 客户端

Expo 官方支持同一项目交付 Web、iOS 和 Android。跨端 UI 复用通常基于 React Native 的 View、Text 等组件，React Native Web 将这些组件用于浏览器。Expo Web 的 PWA 还需要配置 manifest、Service Worker 与缓存策略。来源：[Expo Web](https://docs.expo.dev/workflow/web/)、[Expo PWA](https://docs.expo.dev/guides/progressive-web-apps/)。

当前桌面依赖 shadcn、Base UI、Tailwind 和 React DOM。这些界面不能直接作为原生 React Native 视图使用；Expo 的 DOM components 可以通过 WebView 承载 Web 内容，但数据桥接、状态与性能具有额外约束。若让全部界面使用 Expo，需要迁移现有界面或评估 WebView 组合。来源：[当前桌面依赖](../apps/desktop/package.json)、[Expo DOM components](https://docs.expo.dev/guides/dom-components/)。

| 候选                        | 界面归属                                             | 主要取舍                                                   |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Web 与桌面共享，Expo 移动端 | React Web 覆盖 PWA 与桌面，Expo 覆盖 iOS、Android    | 延续现有 Web 组件，移动端共享 React Native 组件            |
| 保留桌面，Expo 覆盖移动交互 | Electron/React DOM 桌面，Expo 覆盖 PWA、iOS、Android | 延续现有桌面；移动家族共享组件，跨家族共享适用的客户端逻辑 |
| Expo 统一客户端界面         | Expo 覆盖 Web、iOS、Android，Electron 装载 Web 产物  | 通用组件复用范围更大，现有桌面界面需要迁移与原生能力适配   |

已确认桌面目标工作区为 apps/desktop，独立 apps/web 负责 React Web/PWA；相同的聊天、输入、审批、工具结果和附件业务组件放入 packages/web-ui，各应用拥有路由、导航与平台功能。apps/mobile 使用一个 Expo 项目交付 iOS/Android。移动交付范围见 [产品蓝图](./PRODUCT_BLUEPRINT.md#多端演进)，完整职责与依赖方向见 [架构与工作区方案](./PROJECT_LAYOUT.md#目标工作区)。

共享客户端代码需要验证浏览器、Node 和 React Native/Hermes 的实际依赖与模块产物兼容性。加密、密钥存储、文件选择和通知由各平台提供适配。选用 Expo 后，应按所选 SDK 的要求声明 React/React Native 依赖，并验证 Bun hoisted 工作区中的模块解析和原生模块唯一性。来源：[Expo monorepos](https://docs.expo.dev/guides/monorepos/)。

## Expo Web 与 PWA 的具体支持

Expo Web 有正式的开发、路由、构建和部署支持，既能用 React Native Web，也能使用仅 Web 可用的 React DOM 组件。以 React Native 组件构建时，原生与 Web 的界面复用范围更大；采用 Web 专用组件时，需要为原生目标另行呈现。这些机制足以承载在线聊天、状态列表和审批等交互，但不保证每个依赖或复杂内容呈现都可直接跨端复用。来源：[Expo Web](https://docs.expo.dev/workflow/web/)。

PWA 的 manifest、Service Worker、缓存与更新策略需要额外配置。官方指南使用 Workbox 生成 Service Worker，并特别提示激进缓存可能妨碍更新。这属于需要维护的 Web 发布行为，采用 Expo 不会自动消除该工作。来源：[Expo PWA](https://docs.expo.dev/guides/progressive-web-apps/)。

expo-notifications 不支持 Web 通知；PWA 的通知需要单独接入浏览器通知与 Web Push。原生推送和 Web 推送应分别适配。后台连接与进程存活仍由浏览器和操作系统控制，采用独立 React Web PWA 也不会消除这些平台限制。来源：[Expo 通知服务说明](https://docs.expo.dev/guides/using-push-notifications-services/)、[PWA 后台操作](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)。

对当前工程而言，独立 Web/PWA 入口可以延续现有 React DOM、shadcn、Markdown 与代码呈现相关依赖，并与桌面共享适用的内容组件和业务逻辑；Expo 移动端则维护适合触摸与原生导航的界面。此建议基于现有依赖与运行环境，尚未通过跨端原型测量代码复用率、长列表性能或维护成本，不据此认定 Expo Web 无法满足产品需求。

## 远程身份与请求接纳的验证范围

上游 remote-access 已提供按非 owner 身份、资源和方法授权的机制；Gateway 的 forwarded waterfall 回答仍限 owner，Connection 的 exact Fetch 路由也对非 owner 返回拒绝。配对设备的审批和资源读取需要逐项组合验证，并通过标准服务或传输适配补足接入。来源：[Remote access](../references/deepseek-harness/packages/api/remote-access/README.md)、[Gateway](../references/deepseek-harness/packages/api/gateway/README.md)、[Connection](../references/deepseek-harness/packages/client/connection/README.md)。

现有 SessionPromptRequest 带客户端生成的 requestId，prompt 会检查 inbox 与历史中的相同请求标识；返回的 accepted 表达 Agent inbox 接纳。这个接口可作为消息去重的复用基础，尚未据此验证并发提交、进程崩溃和持久恢复的完整保证。来源：[请求与回执类型](../references/deepseek-harness/packages/api/session-controller/src/types.ts)、[输入接纳与去重实现](../references/deepseek-harness/packages/api/session-controller/src/commands.ts)。

## 对工作区划分的影响

以下是待讨论职责，并非已经创建的工作区。

| 归属                 | 候选职责                                            |
| -------------------- | --------------------------------------------------- |
| 桌面 app             | Electron 生命周期、受控 IPC、桌面能力适配和安装包   |
| Runner app           | 命名 profile、Host 组合、后台启动与发布资源         |
| Web app              | 独立 React Web/PWA 入口、浏览器连接与发布           |
| 原生移动 app         | Expo iOS/Android 入口及原生平台适配                 |
| Relay app            | 连接路由和密文转发                                  |
| Web UI package       | 采用桌面与 PWA 共享 React DOM 页面时再提取          |
| 产品插件 package     | Bot 状态与生命周期、必要的 Remote 方法及生成贡献    |
| 通用工具插件 package | 标准 Harness 插件，按独立分发与依赖需要拆分         |
| 连接 package         | 有实际消费者时集中维护本机连接与未来加密 Relay 适配 |

自研工具遵循 Harness 插件机制，当前没有增加自定义工具 UI 扩展体系的需求。工作区职责、客户端技术、本人设备配对范围与后续验证顺序统一记录在 [架构与工作区方案](./PROJECT_LAYOUT.md)。自定义 Remote 的发布版装配、生命周期协调与跨端兼容仍需要原型验证。
