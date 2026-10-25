# dsh-bot

基于 Electron、React 和 TypeScript 的 dsh-bot 桌面工作区，提供原生窗口控件、三栏布局、类型安全的进程通信，以及异步数据和 UI 状态管理。仓库结构与统一入口见 [根 README](../../README.md)，Bot 产品目标见 [产品蓝图](../../docs/PRODUCT_BLUEPRINT.md)。

## 技术栈

依赖版本和完整命令以 [`package.json`](./package.json) 为准。

- **基础工具**：[Electron](https://www.electronjs.org)、[Vite Plus](https://viteplus.dev)、[TypeScript](https://www.typescriptlang.org)。
- **界面**：[React](https://react.dev)、[Tailwind CSS](https://tailwindcss.com)、[shadcn/ui](https://ui.shadcn.com)、[Geist](https://vercel.com/font)、[Lucide](https://lucide.dev)、[i18next](https://www.i18next.com)。
- **数据与状态**：[TanStack Query](https://tanstack.com/query) 管理异步数据缓存，[Zustand](https://zustand.docs.pmnd.rs) 管理 UI 状态。
- **路由与进程通信**：[TanStack Router](https://tanstack.com/router) 提供文件路由，[oRPC](https://orpc.dev) 提供类型安全的 IPC，[Zod](https://zod.dev) 校验输入。
- **测试**：[Vitest](https://vitest.dev)、[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)、[Playwright](https://playwright.dev)。
- **打包与发布**：[Electron Forge](https://www.electronforge.io) 及其 GitHub publisher。

React Compiler 已通过 React Vite 插件启用。Vite Plus 使用 Oxlint 和 Oxfmt 执行代码检查与格式化。开发环境可使用 Electron 内置 DevTools；模板不会自动安装 React DevTools。

## 快速开始

使用根 [`.node-version`](../../.node-version) 指定的 Node.js 版本；支持范围见 `package.json` 的 `engines`。安装当前稳定版 Bun，用于依赖管理和执行脚本。应用运行时不依赖 Bun。

在仓库根目录安装依赖并启动桌面工作区：

```bash
git clone https://github.com/zhuxining/dsh-bot.git
cd dsh-bot
bun install --frozen-lockfile
bun run dev
```

只维护根 `bun.lock`，不要在本应用目录单独安装依赖或创建锁文件。下文的应用专属命令在 `apps/desktop` 中执行；根目录也提供 `package`、`check`、`test:unit`、`test:e2e` 与 `test:smoke` 转发入口。

从 [`src/renderer/routes/index.tsx`](./src/renderer/routes/index.tsx) 开始修改首页。不需要第二个示例页面时，可以删除 [`src/renderer/routes/second.tsx`](./src/renderer/routes/second.tsx)。开发期间修改 main 进程代码会自动重启应用。

适配自己的应用时，在 [`src/shared/app-config.ts`](./src/shared/app-config.ts) 中设置应用名、app ID 和仓库身份；自动更新与 Forge 发布共用这里的仓库配置。同时调整 `package.json` 的 `name`、`productName`、`description`、`author`、`repository`，并检查 [`forge.config.ts`](./forge.config.ts) 中的安装包配置。

## Bot 对话与后台连接

桌面默认显示 Bot 列表与对话工作台。选择 Bot 后读取其已有 Session 历史，发送时逐段显示回复；完成后读取权威历史。选中的 Bot ID 保存在现有布局 store，消息不写入本地 UI store。切回对话或重新打开应用会读取同一 Bot 的历史，不创建新 Session。

打包的 macOS 应用可从「后台服务」安装并启动随包 Runner，无需外部 Node、Bun 或 pnpm。开发时也可独立启动 Runner；桌面默认连接 `app.getPath('userData')/runner`，可为两者指定同一个绝对 home：在仓库根目录先执行 `bun run --cwd apps/runner build`，再分别运行下面两个命令：

```sh
bun run --cwd apps/runner start --home "$HOME/.dsh-bot/dev"
DSH_BOT_RUNNER_HOME="$HOME/.dsh-bot/dev" bun run dev
```

Runner 不可用时，工作台提供重试连接；启动后台后可直接重试，无需重开窗口。对话中的工具活动显示调用名称、参数、结果与失败原因，随标准 Session 事件实时更新；重新打开应用后从同一 Session 恢复。需要授权时，对话显示工具名称和操作说明，可选择「允许一次」或「拒绝」；下一次调用仍会单独询问。执行中可继续发送，按 Bot 已保存的模式排队或追加到下一步；待处理消息显示模式并可单独撤回。「停止执行」保留未处理消息，重新打开桌面后仍可查看或撤回。侧栏「新建 Bot」选择模板并设置名称与工作目录；模板在创建时复制，后续变更不影响已有 Bot。「配置 Bot」显示工作目录、模型、基础与附加指令、能力、参数覆盖和输入模式。保存成功显示「配置已生效」，下一次执行使用新配置；执行中或有待处理消息时明确拒绝并显示剩余条数，保留草稿。版本冲突可重新加载配置。凭据设置由后续任务完成；随包资源与待完成验收见[运行时说明](../../docs/PACKAGED_RUNTIME.md)。

首页「后台服务」提供安装、启动、停止、更新、查询、卸载和登录启动设置。更新先停止并等待旧进程退出，再切换随包运行时；原先已停止的后台保持停止，失败不会报告已生效。安装只保存服务配置，启动后由用户级 launchd 维持后台，退出桌面不会停止它；主动停止后保持停止，直到再次启动或已启用的下次登录启动。卸载保留 Bot 和对话。管理实现已通过真实 launchd 开发进程和随包资源的桌面启停、重开验证；版本目录切换及重启已通过成品验证，干净目标机、实际登录和人工安装升级验收尚待完成，资源缺失时明确报错。开发时可用绝对 `DSH_BOT_RUNTIME_ROOT` 指定 `bin/node` 与 `apps/runner/lib/index.js` 所在根目录，正式源资源位于 `process.resourcesPath/runner`，安装后从 home 下的独立版本副本运行，避免更换应用影响旧进程。细节、证据和未完成验收见[用户级 Runner 服务](../../docs/RUNNER_SERVICE.md)。

Main 读取 home 下的私有连接资料，校验文件权限、实例身份与本机 loopback URL，交换标准认证 Cookie 后装配 Harness Connection/Gateway 和生成的 Bot Remote。认证信息留在 Main；renderer 只能通过已有受控 oRPC 调用列表、历史与发送，不能取得 origin、连接 URL 或 Cookie。正式退出应用会清理 Main 连接，不停止独立 Runner。

离开页面或断开窗口只停止回复观察，已经接纳的执行仍在 Runner 中进行。Runner 意外退出后由 launchd 重新拉起；重新打开对话会显示持久记录中的中断状态，保留待处理消息，不自动重发消息或重跑工具。当前覆盖与升级限制见[崩溃恢复](../../docs/RUNNER_RECOVERY.md)。收到错误或提前断流时不会自动重发，界面保留未确认内容并允许重新加载历史；历史未收录的失败消息会恢复到输入框，供用户编辑或手动重试。超过 32768 个字符的草稿在页面提示，完整原文保留在输入框。没有本地发送任务时定期刷新历史，以显示后台随后完成的回复。单次读取取消不会关闭共享连接或中断其他回复观察。

工具活动复用 Session Controller 的 `follow` 开场快照与持久工具事件，调用与结果按轮次、步骤和 `callId` 配对，以调用事件序号区分活动；模型跨轮复用 ID 不会覆盖历史。助手消息中的工具请求也用于恢复调用身份，覆盖执行前崩溃产生 `TOOL_NOT_STARTED` 结果的情况；窗口中缺少请求时保留结果并明确提示缺失的名称和参数。Main 校验事件顺序与所需字段后投影为受控 IPC 数据，不在客户端执行工具或另存日志。当前显示最近 500 条消息窗口内最近 100 次调用，参数和结果分别限制为 4096 和 8192 个字符，超长内容明确标记截断；非文本结果显示占位。这里不订阅临时模型参数片段，完整调用参数在 Harness 提交助手消息后显示。

Main 持续消费标准事件并合并最新活动快照；renderer 确认接收后才发送下一帧，慢观察端最多保留一个在途 IPC 快照和一个 Main 最新快照，不积压每次更新。观察失败保留已显示内容并提供重新加载；历史读取确认连接恢复后自动重新订阅。取消观察不取消执行。

审批复用 Harness `approval/request` 交互。Main 在认证握手和 Connection 中声明回答能力，将 Agent Session 映射到 Bot，只向 renderer 提供当前待处理项和一次性决定入口。Main 持有回答回调，问题撤回、连接关闭后立即移除；过期、重复或 Bot 不匹配的回答返回冲突。决定不写入长期授权；跨客户端的第一份有效回答与其余问题取消由上游审批服务裁决。renderer 每 500 毫秒读取当前请求，切换 Bot 后重新读取，不能用缓存中的过期问题授权。

## 项目结构

```text
src/
  main/       应用生命周期、窗口、安全策略和 IPC handlers
  preload/    隔离环境中的端口转发
  renderer/   React 界面、actions、路由、布局、状态和本地化
  shared/     跨进程共享的类型、常量和纯函数
tests/
  unit/       main 与 renderer 的单元测试
  e2e/        Playwright 应用级测试
scripts/      构建与验证脚本
```

文件路由位于 `src/renderer/routes`，路由插件自动生成 `src/renderer/routeTree.gen.ts`。工程约束见 [`AGENTS.md`](./AGENTS.md)，领域术语见 [`GLOSSARY.md`](../../GLOSSARY.md)。

TypeScript 使用三份配置：[`tsconfig.json`](./tsconfig.json) 保存公共选项并声明项目引用；[`tsconfig.node.json`](./tsconfig.node.json) 检查 main、preload、工具脚本和测试；[`tsconfig.renderer.json`](./tsconfig.renderer.json) 检查 renderer 与 shared。两个子项目均使用 `noEmit`，不生成声明文件。renderer 通过 `import type` 引用 main router，为 oRPC 推导类型。

基础组件和设计 Token 位于 [`packages/ui`](../../packages/ui/README.md)，通过 `@dsh-bot/ui/components/ui/*` 消费；桌面样式只维护窗口布局与滚动策略。

## Vite、代码检查与测试配置

根 [`vite.config.ts`](../../vite.config.ts) 统一配置 lint、格式化、进程边界与暂存文件检查；应用 [`vite.config.ts`](./vite.config.ts) 保留 React 插件、别名和 Vitest 单元测试。Forge 构建分别使用 [`vite.main.config.mts`](./vite.main.config.mts)、[`vite.preload.config.mts`](./vite.preload.config.mts) 和 [`vite.renderer.config.mts`](./vite.renderer.config.mts)；Playwright 使用 [`playwright.config.ts`](./playwright.config.ts)。

lint 的通用规则统一配置；`lint.overrides` 按源码目录约束不同进程的能力和依赖方向，同时覆盖路径别名与相对导入：

| 目录              | 限制                                                                            | 目的                          |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------- |
| `src/main/**`     | 禁止导入 renderer、preload 实现                                                 | 原生能力不依赖界面和桥接层    |
| `src/preload/**`  | 禁止导入 main、renderer 实现                                                    | 桥接层只负责转发端口          |
| `src/renderer/**` | 禁止 Node/Electron 运行时导入和 Node 全局变量；main、preload 引用只允许类型导入 | 页面通过受控 IPC 使用原生能力 |
| `src/shared/**`   | 禁止 Node/Electron 能力及各进程实现的导入                                       | 共享代码可以跨进程复用        |

这些限制与运行环境相关，不能合并成同一套全局规则：全局禁止 Node 会阻止 main 的正常调用，全局允许则无法检查 renderer 的越界引用。

Vitest 的 `test.projects` 决定测试如何运行，与 lint 的目录规则分别生效：

| 测试项目   | 文件位置                                 | 执行环境                                 |
| ---------- | ---------------------------------------- | ---------------------------------------- |
| `main`     | `tests/unit/main/**/*.test.ts`           | Node.js                                  |
| `renderer` | `tests/unit/renderer/**/*.test.{ts,tsx}` | jsdom，加载测试初始化脚本并启用 CSS 处理 |

jsdom 用于验证 DOM 和组件逻辑，真实 Electron 的沙箱、IPC、窗口和布局行为由 Playwright E2E 验证。

## 开发与验证命令

| 命令                    | 用途                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| `bun run start`         | 启动开发环境                                                            |
| `bun run check`         | 只读执行格式、lint 和类型检查                                           |
| `bun run fix`           | 写回格式和 lint 修复                                                    |
| `bun run test:unit`     | 执行单元测试；也可使用 `bun run test`                                   |
| `bun run test:watch`    | 监听文件变化并运行单元测试                                              |
| `bun run test:coverage` | 执行单元测试并生成覆盖率报告                                            |
| `bun run test:e2e`      | 先重新打包，再对本次产物执行 Playwright 测试                            |
| `bun run test:smoke`    | 启动当前成品验证 renderer/IPC，并迁移随包 Node/profile 后验证启动与退出 |
| `bun run test:all`      | 依次执行检查、单元测试、E2E 和成品冒烟测试                              |

`check` 已包含类型检查。`test:smoke` 不负责构建，单独运行时先打包：

```bash
bun run package
bun run test:smoke
```

E2E 通过 [`launchTestApp`](./tests/e2e/fixtures.ts) 启动应用，使用隔离的临时 profile，启用沙箱，并关闭 Playwright 的主题模拟。重启持久化场景复用 profile，关闭使用它的实例后再删除目录，避免 Windows 文件锁导致清理失败。Bot 对话 E2E 额外启动带确定性模型的真实 Runner；根 `bun run test:e2e` 会先构建 Runner 与测试 fixture；在桌面目录单独运行时，先从根执行 `bun run --cwd apps/runner build:test`。流式验证在首字符处暂停模型，再从另一个 Bot 显式释放；使用真实 Cookie 认证与打包应用，未调用真实 DeepSeek API。

工具活动 E2E 通过测试 profile 批准的真实工具注册，使用 IPC 门闩分别释放成功与抛错调用，验证等待、结果及重开恢复；审批 E2E 由同一工具调用真实审批服务，验证允许一次、下一次仍需授权、拒绝结果及执行结束。输入控制 E2E 分别验证排队与追加模式，覆盖执行中接纳、独立撤回、停止保留、重开恢复及释放工具后的实际执行顺序。该工具只随 `--test-fixtures` 构建，不进入生产 profile。

[testing.yaml](../../.github/workflows/testing.yaml) 在 Linux、macOS、Windows 上执行单元测试；随包原生运行时的 E2E、成品冒烟和[发布工作流](../../.github/workflows/release.yaml) 当前仅面向 macOS，并上传 Playwright 报告。[check.yaml](../../.github/workflows/check.yaml) 执行代码检查。工作流从根目录安装与运行，参考子模块不参与构建。本地结果只代表当前操作系统，其他平台由 CI 矩阵验证。签名、公证及原生窗口交互需要在目标平台另外确认。

## 进程通信与安全

renderer 关闭 Node integration，启用沙箱和上下文隔离。原生能力经过 actions、preload 端口桥接及类型安全的 oRPC handlers。main 接收连接前，会校验已登记的 WebContents、当前主 frame 和预期 renderer URL。

通信采用官方 [Electron Message Port Adapter](https://orpc.dev/docs/adapters/electron) 方案，每个 renderer 文档创建一个 MessageChannel：

```text
renderer：惰性创建 client 和 MessageChannel
  → preload：校验消息来源并转发端口
  → main：校验发送方，升级端口并启动 oRPC handler
```

[`ipc-client.ts`](./src/renderer/lib/ipc-client.ts) 持有惰性创建的 client 与 Query utilities。端口在页面离开、加载新文档或 WebContents 销毁时清理。main handler 通过 `onError` 拦截器记录调用失败。端口机制见 Electron 的 [MessagePorts 指南](https://www.electronjs.org/docs/latest/tutorial/message-ports)。

模板使用 oRPC v2，目前为 beta。`@orpc/client`、`@orpc/server`、`@orpc/publisher`、`@orpc/tanstack-query` 应保持版本一致，并一起重新构建 main 和 renderer；v2 的 RPC 通信格式与 v1 不兼容。窗口订阅使用 `@orpc/publisher/memory` 的 `MemoryPublisher`，异步发布失败时关闭订阅。迁移说明见 [v1 → v2 官方文档](https://orpc.dev/docs/migrations/from-v1)。

外链仅允许不含凭据的 HTTP/HTTPS URL；禁止导航到非预期页面、打开新窗口和挂载 webview。相关实现位于 [`security.ts`](./src/main/security.ts)、[`window.ts`](./src/main/window.ts) 和 [`index.ts`](./src/main/index.ts)。

## 异步数据与 UI 状态

[`query-client.ts`](./src/renderer/lib/query-client.ts) 创建唯一的 QueryClient，由 `QueryClientProvider` 和 Router context 共享。React Query 保存异步查询结果，Zustand 保存面板宽度等同步 UI 状态；查询结果不再复制到 store。主题同步和原生窗口事件由各自现有实现持有。

### oRPC 查询与 mutation

通过[官方 TanStack Query 集成](https://orpc.dev/docs/integrations/tanstack-query)，IPC client 使用 `createTanstackQueryUtils` 创建一份共享 utilities。`ipc` 前缀将本地缓存键与后续 HTTP client 区分开。各领域 actions 导出 `.queryOptions()`、`.mutationOptions()` 生成的配置，组件和 loader 只导入这些配置工厂。

官方集成生成类型安全的缓存键与执行函数，并自动转发查询取消信号。现有示例包括：

- [首页](./src/renderer/routes/index.tsx) 使用 [app actions](./src/renderer/actions/app.ts) 的 `appVersionQueryOptions()`，展示加载、缓存和失败后重试。
- [外链组件](./src/renderer/components/external-link.tsx) 使用 [shell actions](./src/renderer/actions/shell.ts) 的 `openExternalLinkMutationOptions()`，打开期间禁用按钮，失败后恢复可用。

查询默认在 30 秒内保持有效，读取失败重试一次；mutation 默认不自动重试。QueryClient 对 `ipc` 前缀的查询和 mutation 设置 `networkMode: "always"`，保证离线可执行本地操作；HTTP 操作保留默认在线语义。

应用版本在进程生命周期内不变，单独使用 `staleTime: Infinity`。`createQueryKeyHashFn()` 支持缓存键中的 `BigInt`、`Date`、`Set`、`Map` 等 oRPC 类型。缓存回收使用库的默认时间，不跨应用重启持久化。

### 路由加载与扩展

项目使用 TanStack Router 的内存路由。oRPC 的 React Router 资源路由示例适用于 React Router framework mode 中的 HTTP 服务；本项目的原生调用使用 MessagePort。

Router 与 Provider 共用 QueryClient，`defaultPreloadStaleTime: 0` 将预取有效期交给 Query 管理。首页 loader 使用不阻塞页面的 `prefetchQuery` 读取可选的版本信息，组件通过 `useQuery(appVersionQueryOptions())` 读取同一份缓存。关键路由数据可以在 loader 中等待：

```tsx
loader: ({ context }) => context.queryClient.ensureQueryData(appVersionQueryOptions()),
```

新增领域时，在 actions 中通过 `ipc.utils.<domain>.<procedure>` 生成配置，并向官方 builder 传入查询参数。用 `.key()` 部分匹配需要失效的查询，用 `.queryKey()` 定位完整缓存项。写入成功后，在 `onSuccess` 中等待相关查询失效。

主题 action 中的原生操作顺序与 DOM 更新仍归它所有，不能用生成的 mutation 绕过这些业务步骤。handler 定义的错误会保留类型，可以通过 `@orpc/client` 的 `isDefinedError` 收窄。

后续接口需要时，可在对应 action 中提供 `.infiniteOptions()` 分页配置、`.liveOptions()` 最新流值或 `.streamedOptions()` 累积事件。窗口状态继续使用现有订阅。增加服务端渲染时，再配置 SSR hydration。

## 原生标题栏与面板

[`src/shared/window.ts`](./src/shared/window.ts) 集中定义标题栏高度、原生控件的回退预留宽度和主题颜色。窗口选项位于 [`src/main/window.ts`](./src/main/window.ts)，界面实现位于 `src/renderer/components`、`src/renderer/layouts` 和 [`global.css`](./src/renderer/styles/global.css)。`BaseLayout` 持有平台与标题栏 CSS 变量。

macOS 使用 `hiddenInset`，原生红绿灯按钮按共享标题栏高度居中。Windows 使用原生窗口控件覆盖层，通过 CSS 环境变量预留实际控件区域。其他平台使用原生标题栏。原生窗口控件保留系统行为。

三栏各自包含可拖动的标题区域，内容填满剩余高度；普通、最大化和全屏状态下，分隔线贯穿窗口。`DragWindowRegion` 提供 `leading`、`title`、`toolbar` slots，空白区域用于拖动，工具栏和常见交互元素排除拖动。自定义交互内容可添加 `window-no-drag`。

`BaseLayout` 提供 `title`、`toolbar`、`leftPanel`、`rightPanel`、`children` slots。两侧面板可独立调整宽度和折叠，展开时恢复之前的宽度；手动调整的宽度跨重启保留，折叠状态仅在当前会话保留。面板折叠后，开关移到中间标题栏。省略某侧面板 slot，即可移除该面板及开关。根路由使用 Sidebar 组件展示面板内容。

```tsx
<BaseLayout
  title={<span>我的工作区</span>}
  toolbar={<Button variant="ghost">新建</Button>}
  leftPanel={<nav>导航</nav>}
  rightPanel={<div>详情</div>}
>
  <Outlet />
</BaseLayout>
```

应用通过 oRPC 事件流订阅当前窗口的原生全屏状态，共享类型见 [`window-state.ts`](./src/shared/window-state.ts)。进入全屏时移除红绿灯区域预留，退出后恢复；布局卸载时取消订阅。Windows 原生控件颜色跟随 main 中的主题变化。

发布前，在目标操作系统验证原生拖动、双击标题栏偏好、Windows 贴靠布局、显示缩放和全屏切换。

<a id="theme-initialization"></a>

## 主题初始化

[`public/theme-init.js`](./public/theme-init.js) 是独立的经典脚本，在 HTML head 中先于样式表和应用模块加载，使已保存主题或系统主题在首次绘制前生效。

运行时的 [`theme.ts`](./src/renderer/actions/theme.ts) 与首屏脚本共用 [`src/shared/theme.ts`](./src/shared/theme.ts) 中的规范化规则，将无效偏好恢复为 `system`。启动恢复和用户操作按顺序排队，避免并发操作导致 renderer 与原生窗口外观不一致。选择 `system` 时持续跟随系统主题。

## 打包与发布

```bash
bun run package  # 生成本地应用包
bun run make     # 生成当前平台的分发产物
bun run release  # 通过 Forge 构建并发布到 GitHub 草稿 Release
```

本地发布时，提供对 `src/shared/app-config.ts` 中目标仓库具有 Release 写入权限的 `GITHUB_TOKEN`。发布版本来自 `package.json`。

手动触发的 [release 工作流](../../.github/workflows/release.yaml) 在 Linux、macOS、Windows 上构建并验证产物，然后发布到 GitHub 草稿 Release。工作流通过 `workflow_dispatch` 启动，不使用 tag 触发。检查草稿和产物后，再正式发布。

`forge.config.ts` 通过以下环境变量启用可选签名与公证：

| 用途         | 环境变量                                                   |
| ------------ | ---------------------------------------------------------- |
| Windows 签名 | `WINDOWS_CERTIFICATE_FILE`、`WINDOWS_CERTIFICATE_PASSWORD` |
| macOS 签名   | `APPLE_SIGN_IDENTITY`                                      |
| macOS 公证   | `APPLE_ID`、`APPLE_APP_PASSWORD`、`APPLE_TEAM_ID`          |

构建机需要预先导入签名证书并设置对应变量。CI 中应在 make 步骤前增加证书导入和 secrets 映射，模板不负责自动配置证书。不要提交证书、密码或其他凭据；配置了这些入口，也需要另外确认产物实际完成签名和公证。

## 自动更新

Windows 和 macOS 的打包应用通过 [update-electron-app](https://github.com/electron/update-electron-app) 使用公开 GitHub Releases 更新。Linux 未内置更新器。私有仓库需要其他更新服务，参见 Electron 的[应用更新指南](https://www.electronjs.org/docs/latest/tutorial/updates)。

应用自动检查更新，在后台下载可用版本，默认提示用户重启并安装。正式发布经过审核的 GitHub Release 后，用户才能收到更新。
