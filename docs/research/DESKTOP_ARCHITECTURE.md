# 上游 Desktop 架构调研（判定"UI 与持续会话之外全部复用 Harness"的落点）

调研对象：`references/deepseek-harness`（固定子模块，只读）。分支 `nsh-app`，无 git 写操作。
下文路径均相对 `references/deepseek-harness/`，行号为调研时快照。

## 0. 一句话结论

Desktop 是**一层 Electron 壳 + 一个普通 dsh profile**：壳只做四件事（起 Host 子进程、托管页面、注入 Cookie、原生能力 IPC），业务全部由 `profile: 'desktop'` 的 Cordis 树 + Web bundle 承担。它没有为"桌面产品"发明任何新框架，只用了 `profileContext.name === 'desktop'` 这一个开关（`packages/bundle/web-app/cordis.patch.yml:39,51,290`、`packages/bundle/base/cordis.patch.yml:123`）。**这就是我们要抄的形态**：产品差异 = 一个 profile 名 + 一层 bundle patch + 壳的 IPC，不是第二套后端。

## 1. 进程拓扑

四层：Electron main（壳）/ preload / renderer（页面）/ Host（Node 模式的子进程，跑完整 Harness）。

| 层 | 职责 | 关键位置 |
|---|---|---|
| main | 单实例锁、窗口、`dsh-app://` 协议、Cookie 注入、更新、托盘/菜单、原生对话框、Host 生命周期与退出仲裁 | `apps/desktop/src/main.ts` |
| preload | 只向 `dsh-app://app` 暴露能力：`dshDesktopBoot`/`dshDesktop`/`dshPlatform`/目录选择/路径 | `apps/desktop/src/preload-app.ts:74,88,94,97,101,112` |
| renderer | 打包的 Web 前端 `@deepseek-ai/dsh-web-frontend/dist`，走共享 Web 客户端 | `apps/desktop/src/main.ts:703-707` |
| Host | `node_modules/@deepseek-ai/dsh-desktop-host/lib/index.js`，`runProfile({ profile: 'desktop', args: ['--no-open','--host','127.0.0.1','--port','0'] })` | `apps/desktop-host/src/index.ts:24-46` |

### 1.1 Host 由谁启动、生命周期怎么绑

- 壳以 **Electron 自身作为 Node** 启动 Host：`spawn(this.node, ['--expose-internals', entry, runtimeDir, projectDir, primaryRuntime, pnpm, nodeBin], { stdio: ['ignore','pipe','pipe','ipc'] })`，`this.node = process.execPath` + `ELECTRON_RUN_AS_NODE=1`（`apps/desktop/src/host-process.ts:197-212`、`apps/desktop/src/node-environment.ts:12-18`、`apps/desktop/src/main.ts:155-167`、`apps/desktop/README.zh.md:116`）。
- Host 是**进程**，不是 worker/utilityProcess：有独立 `--inspect` 端口、独立 cwd（profile 目录）、独立 stderr 缓冲（`apps/desktop/src/host-process.ts:197-215`）。
- 生命周期完全由壳拥有：`stop()` 先发 `{type:'shutdown'}`，10s 未退 → `SIGTERM`，再 5s → `SIGKILL`，仍未退则抛错（`apps/desktop/src/host-process.ts:320-341`）。Host 侧 `process.once('disconnect', () => stop())`，异常退出会 `send({type:'shutdown-complete'})` 后 `process.disconnect()`（`apps/desktop-host/src/index.ts:56-66,112`）。
- 启动失败有专用通道：Host 把 `util.inspect(error)` 截断到 64KB 通过 IPC `{type:'fatal'}` 送回（`apps/desktop-host/src/index.ts:139-155`），避免与 stderr 竞速。

### 1.2 IPC 协议形态

三种，均无自建 HTTP API：

1. **main ↔ Host：Node `child_process` JSON IPC**（`stdio[3]='ipc'`）。消息类型（`apps/desktop/src/host-process.ts:8-46`，校验函数 `isDesktopHostEvent`）：
   - Host→main 事件：`ready{url,injections}`、`platform-session{session}`、`shutdown-complete`、`fatal{message,diagnostic}`
   - main→Host / Host→main 请求响应：`update-tasks{action:'inspect'|'lock'|'unlock',requestId}`、`quit-inspection{requestId}`、`file-drag-resource{address,requestId}`、`file-drag-cancel{requestId}`；每条带单调递增 `requestId` + 截止时间（`apps/desktop/src/host-process.ts:250-320`，10s/2s/12s）。
   - 协议版本常量 `DESKTOP_HOST_PROTOCOL_VERSION = 4`（`apps/desktop/src/host-protocol.ts:1`）。
2. **main ↔ renderer：`ipcMain.handle` + `contextBridge`**，通道清单在 `apps/desktop/src/ipc.ts:9-39`（boot、boot-failed、目录选择、文件拖拽、浏览器租约、快捷键、更新、主题、全屏、设备信息、locale）。每个 handler 先过来源围栏 `assertDesktopSender`（校验 `dsh-app:` 协议 + 白名单 hostname，`apps/desktop/src/ipc.ts:104-111`）。
3. **renderer ↔ Host：就是 Harness 原生 `/api` + WebSocket**，壳只做透明转发与 Cookie 注入（见 §3）。

### 1.3 页面托管

- 自定义特权协议 `dsh-app`（`standard/secure/supportFetchAPI/corsEnabled/stream/codeCache`，`apps/desktop/src/main.ts:136-147`）。
- `protocol.handle('dsh-app')`：`dsh-app://shell/*` 走应用包内 `renderer/`（欢迎页等壳自有文档）；`dsh-app://app/*` 的 `/`、`/index.html`、`/assets/*` 直接从 `node_modules/@deepseek-ai/dsh-web-frontend/dist` 读盘；其余路径**全部转发给 Host**（`apps/desktop/src/main.ts:696-713`）。
- 因此页面 origin 永远是 `dsh-app://app`，Host 永远在 `127.0.0.1:<随机端口>`，二者靠壳缝合（`apps/desktop/src/web-document.ts`）。

## 2. 用到的 Harness 原语清单

| 原语 | Desktop 里的形态 | 装配者 / 位置 |
|---|---|---|
| profile | 名为 `desktop` 的普通 profile，目录 `$DSH_HOME/profiles/desktop`，与 CLI 共享 home 但独占该 profile 与锁 | `apps/desktop/src/paths.ts:17-21`、`apps/desktop-host/src/index.ts:30-46`、`apps/desktop/README.zh.md:118` |
| profile 初始化 | `initProfile(projectDir, PROFILE_TEMPLATES.web.bundles)`；`pnpm-workspace.yaml` 里 `allowBuilds: node-pty/koffi/fs-ext` | `apps/desktop/src/project-manager.ts:31,173-175,37-48` |
| bundle / patch 层 | profile 只有两层：`@deepseek-ai/dsh-base` + `@deepseek-ai/dsh-web-app` | `packages/util/official-bundles/src/bundles.ts:14-16` |
| cordis 插件行 | 全部业务能力都是 patch 里的行：webserver(:172)、web-runtime(:190)、modules(:220)、connection(:227)、api-remotes(:241)、workspace(:84)、session-controller(:114)、job-controller(:119)、terminal-controller(:123)、workspace-files(:125)、account-controller(:140)、settings-controller(:143)、workspace-controller(:147)、agent-preset-registry(:590) | `packages/bundle/web-app/cordis.patch.yml` |
| Session Controller | 行 `@deepseek-ai/dsh-api-session-controller` → `ctx.sessionController` / `ctx.remote.session`（会话命令、冷读、实时控制帧、Agent/Session 身份策略） | `packages/bundle/web-app/cordis.patch.yml:114`、`packages/api/session-controller/src/index.ts:1,73-78` |
| typert / gateway / remote-access | base 层三行：`typert-registry`、`api-gateway`、`api-remote-access` | `packages/bundle/base/cordis.patch.yml:46,52-53,57-58` |
| connection（认证 remote） | 行 `@deepseek-ai/dsh-client-connection`，`trustedHosts` 来自 `webStartup` | `packages/bundle/web-app/cordis.patch.yml:225-231` |
| agent preset | `@deepseek-ai/dsh-agent-preset-registry`（`default: standard`）+ `presets/*.patch.yml` 声明 `standard/ptc/minimal/cordis`；UI 行 `ui-agent-preset` | `packages/bundle/web-app/cordis.patch.yml:422-425,583-592`、`packages/bundle/web-app/package.json` 的 `dsh.bundle.patch`、`packages/preset/agent-preset-registry/src/index.ts:46-60` |
| workspace | 行 `@deepseek-ai/dsh-workspace` + controller/workspace-files/workspace-changes | `packages/bundle/web-app/cordis.patch.yml:84,125,147,357-359` |
| settings | `@deepseek-ai/dsh-settings`（`disabled: !ctx.get('profileContext')`）+ `api-settings-controller` | `packages/bundle/base/cordis.patch.yml:109-112`、`packages/bundle/web-app/cordis.patch.yml:143` |
| credentials | `@deepseek-ai/dsh-authorization` + `@deepseek-ai/dsh-credentials-local`（`$DSH_HOME/.credentials.yaml`） | `packages/bundle/base/cordis.patch.yml:113-126` |
| 账号 / Platform 凭据 | `deepseek-account-platform` 的 `desktopPlatform` 由 profile 名决定；凭据只经 IPC 进 main，不进 renderer | `packages/bundle/base/cordis.patch.yml:123`、`apps/desktop-host/src/platform-session.ts:10-35` |

要点：**Desktop 没有独立的 Host bundle**。`apps/desktop-host/src/index.ts:25-27` 只做 `loadProfileDirectory` + `runProfile`，再 `ctx.plugin(desktopOffice, …)` 补一个 Office 引擎行（`:118-122`）。Host 侧私有能力（更新任务准入、退出检查、文件拖拽授权）都是 `install*(ctx)` 形式的**小插件**，不是新框架（`:113-117`）。

## 3. 渲染进程如何取执行状态

- **直连 Harness 协议，无自建业务 API**。页面用相对路径请求 `/api/...`（origin 是 `dsh-app://app`），壳用 `forwardWebRequest(request, hostUrl, hostCookie)` 转发到 `127.0.0.1:<port>` 并附带 Cookie（`apps/desktop/src/main.ts:707-711`、`apps/desktop/src/web-document.ts:77-120`）。
- WebSocket 也一样：页面连 `ws://127.0.0.1/<port>`，main 用 `webRequest.onBeforeSendHeaders` 改写握手头：校验 host/协议一致、`origin` 必须是 `dsh-app://app`（否则 `cancel`），然后写入 `origin: <host origin>`、`cookie: hostCookie`、`sec-fetch-site: same-origin`（`apps/desktop/src/main.ts:745-757`）。**页面 JS 全程看不到凭据**。
- 认证怎么来的：壳 `fetch(ready.url)`，期望 **303 + `set-cookie`**，截到第一个 `;` 前作为 Cookie（`apps/desktop/src/web-document.ts:43-50`）；Host 侧 `authenticatedUrl()` 把 process token 放进 `?token=` 生成 URL（`apps/desktop-host/src/index.ts:133`、`packages/client/connection/src/browser-auth.ts:17,244-247`）。Cookie 名是 `dsh-auth-<sha256(authority)>`，长期 secret 存 credentials 记录（`browser-auth.ts:17-21,241-270`）。
- 反向头处理：`set-cookie` 等连接级头**不**回传给页面（`apps/desktop/src/web-document.ts:57-66`），Cookie 罐归壳所有。
- 启动注入：Host 用 `ctx.webServer.collectIndexInjections(ctx.connection.browserPeer)` 取结构化注入表（`apps/desktop-host/src/index.ts:137`），经 `ipcMain.handle(DESKTOP_IPC.boot)` 返回 `{ injections, streamBaseUrl }`（`apps/desktop/src/main.ts:720-725`）；页面在 `apps/web/src/main.ts:24-35` 里 `applyIndexInjections(...)` 后设 `__DSH_TRANSPORT__ = { ownsHost: true, streamBaseUrl }`，再 `gate.resolve()`。注入行格式见 `packages/host/webserver/src/injections.ts:15-31,86`，客户端读 `__DSH_BOOT__` / `__DSH_BOOT_READY__`（`packages/client/web/src/boot.ts:69-76`）。
- 认证围栏在 Host 侧统一执行：`HostConnectionService.admit()` 先过 Host/Origin 信任检查，再验 Cookie 或 API token（`packages/client/connection/src/rpc-host.ts:129-137`）。

## 4. Desktop 有没有"产品域"概念

**没有独立的领域模型**，只有三样东西叠加：

1. **profile 名** `desktop`：`runProfile({ profile: 'desktop' })`（`apps/desktop-host/src/index.ts:34-41`），并经 `profileContext.name` 供 patch 里的 `!!js` 表达式判断（`packages/boot/app-boot/src/profile-context.ts:15-30`）。全仓只有 4 处 desktop 判定：`web-app/cordis.patch.yml:39`（OTel 产品埋点）、`:51`（product-analytics）、`:290`（侧栏浏览器 tab）、`base/cordis.patch.yml:123`（Platform 账号后端开关）。
2. **壳的 IPC 面**：`window.dshDesktop.protocolVersion === 1`，客户端插件按它开关桌面能力（`packages/client/ui-settings-account/src/client/index.ts:48`、`packages/client/ui-sidebar-browser/src/client/index.ts:72`、`packages/client/ui-file-drag/src/client/index.ts:33`）。另有 `data-platform` 属性供 CSS 分平台（`apps/desktop/src/preload-platform.ts:10-17`）。
3. **profile 内安装的第三方 bundle**：桌面只装"外部插件"，核心依赖树固定在 `app.asar/dsh`（`apps/desktop/README.zh.md:117`；profile 包管理见 `apps/desktop/src/project-manager.ts:37-48`）。

对比我们：**Bot 是真正的产品域**（`docs/BLUEPRINT.md:17-23`），Desktop 没有等价物。它表达差异用的是 profile 名 + patch 行 + 壳 IPC，而不是 preset 或 settings 分节；preset 管的是"Agent 能力集"（工具集合），workspace 管的是"目录"，都不是产品域。

## 5. 扩展点与代价

| 扩展点 | 插入方式 | 代价 |
|---|---|---|
| 新增 Harness 能力 | 在 `cordis.patch.yml` 加一行（id/name/config，可 `inject`/`disabled`） | 最低；跟上游升级同步，无需改壳 |
| 替换/关掉某能力 | profile patch 里 `disabled: true`（web-app 已用它关掉 bash/pwsh/fs 等工具行，`packages/bundle/web-app/cordis.patch.yml:483-533`） | 低 |
| 产品专属行为 | `!!js "ctx.get('profileContext')?.name === 'x'"` 开关，或独立小插件 `installXxx(ctx)` | 低；但会成为 fork 差异点，要跟上游对齐 |
| 原生能力（窗口/托盘/更新/文件拖拽/浏览器 tab） | main 加 `ipcMain.handle` + `ipc.ts` 加通道 + preload 暴露 + client 插件按 `dshDesktop` 探测 | 中；四处要同步，且有来源围栏需要维护 |
| 页面/文档 | `dsh-app://shell/*` 放壳自有 HTML（欢迎页、更新对话框、强制更新页） | 低，天然隔离 |
| Agent 能力集 | 写 `presets/*.patch.yml`，经 `agent-preset-registry` 挂 scope | 中；preset 是"工具集合"，不能承载业务域 |
| UI | client 插件（`dsh.client` 行、`/plugins/<id>/client.js` 由 Host 提供、`__DSH_BOOT__` 清单） | 高；需要走 Harness 的模块系统 |
| 模型 provider | settings 分节 + adapter 行（`llm-pi-ai` 默零路由，靠 settings 激活，`packages/bundle/base/cordis.patch.yml:128-137`） | 低 |
| 后台任务/定时 | `schedule`、`jobs-local`、`api-job-controller` 行 | 低 |

## 6. 打包与更新

- **Node 不单独分发**：用 Electron 二进制以 `ELECTRON_RUN_AS_NODE=1` 运行 dsh（`apps/desktop/README.zh.md:116`；`apps/desktop/src/node-environment.ts:12-18`）。另外自带 `runtime/bin`（Node 启动器 shim）、内置 pnpm、内置 Python/pandas 运行时（`apps/desktop/README.zh.md:100-101,109`；`apps/desktop/scripts/prepare-runtime.ts:36-49`）。
- **Harness 依赖随包**：`files` 把整棵 `dsh` + `dsh/node_modules` 放进 `app.asar/dsh`，`asarUnpack` 放 Office 原生目录，`extraResources` 放 `runtime/`（`apps/desktop/scripts/electron-builder-config.mjs:140-161,188-195`）。运行时树有完整性清单 `desktop-runtime.json`（`apps/desktop/src/runtime-tree.ts:11-32`），启动前 `verifyDesktopRuntime` 校验（`electron-builder-config.mjs:208-213`）。
- **没有独立更新通道**："不提供独立依赖更新器"（`apps/desktop/README.zh.md:107`）；Electron 与 `@deepseek-ai/dsh` **版本必须完全一致**，改 dsh 就要发新 Desktop（`apps/desktop/README.zh.md:115`）。
- 更新走 `electron-updater` + **generic provider**，channel `nightly|latest`（`apps/desktop/src/update-coordinator.ts:6-73`、`apps/desktop/scripts/macos-app-update-config.mjs:34-48`）。安装前必须停 Host 并做任务准入：`update-tasks lock` 会先 drain 已接纳的 API 请求再检查任务（`apps/desktop/src/host-process.ts:250-258`）。
- 只有**第三方插件**在 profile 里用内置 pnpm 安装，与核心依赖隔离（`apps/desktop/README.zh.md:117-120`）。

## 7. 结论两栏

### 可以直接复用的 Harness 模式（几乎零成本）

| 模式 | 上游证据 | 我们的落点 |
|---|---|---|
| profile + bundle patch 分层，产品即一个 profile 名 | `packages/util/official-bundles/src/bundles.ts:14-16`、`apps/desktop-host/src/index.ts:34-41` | `apps/runner` 用 `runProfile({ profile: 'dsh-bot' })`，差异写在自己的 patch |
| 私有 Host 侧能力 = `installXxx(ctx)` 小插件 | `apps/desktop-host/src/index.ts:113-122`、`platform-session.ts:10-35` | 已有 `apps/runner/src/plugin.ts` 同构 |
| Session Controller 拥有会话命令/冷读/控制帧 | `packages/api/session-controller/src/index.ts:73-78`、`packages/bundle/web-app/cordis.patch.yml:114` | 已复用（`docs/ARCHITECTURE.md:86`） |
| typert remote + gateway + remote-access 三层 | `packages/bundle/base/cordis.patch.yml:46-58` | 直接开行，不自建协议 |
| connection 的 Cookie/token 认证 + Host/Origin 围栏 | `packages/client/connection/src/rpc-host.ts:129-137`、`browser-auth.ts:17,244-247,356-370` | 已有 Node 侧适配（`docs/ARCHITECTURE.md:87-90`） |
| 启动注入表（`collectIndexInjections` / `__DSH_BOOT__`） | `packages/host/webserver/src/injections.ts:15-31`、`apps/desktop-host/src/index.ts:137` | 想给 NSH 页面塞启动数据时直接借这个形状 |
| agent preset / workspace / settings / credentials 全是有行就有能力 | 见 §2 表 | 需要哪个加哪行 |
| 退出/更新前的任务准入与优雅停机 | `apps/desktop/src/host-process.ts:250-341`、`apps/desktop-host/src/index.ts:56-66` | 后台停机协议可照抄语义 |

### 只能自建的（UI、持续会话）

| 项 | 为什么上游没有 | 我们的形态 |
|---|---|---|
| UI | Desktop 直接吃 `@deepseek-ai/dsh-web-frontend/dist`，整个 renderer 是 Web bundle 的产物 | NSH 页面 + Node 侧 HTTP/NDJSON 适配 |
| 持续会话（Bot） | Desktop 的模型是"多会话列表 + 用户点选"（`ui-session`、`ui-sidebar` 行），没有"每 Bot 一个固定会话、自动初始化、不切会话"的语义 | `docs/BLUEPRINT.md:13-23`；`apps/runner/src/conversation.ts` |
| Bot 域数据（记忆、归档、模板默认值具体化） | 无对应原语；preset 只管工具集合，workspace 只管目录 | 自建，落 `apps/runner/src/store.ts` |
| 产品 IPC 面 | Desktop 的 IPC 全是原生能力（窗口/拖拽/更新），没有业务 RPC | 我们的 `/api/bot/*`（`docs/ARCHITECTURE.md:90`） |

### 复用会立刻撞到的硬约束

1. **NSH QuickJS 带不了认证头**：`docs/ARCHITECTURE.md:86`、`docs/research/NSH_HARNESS_RESEARCH.md:15,31`。Desktop 的解法是"壳注入 Cookie + 协议转发"（§3），我们没有壳，所以只能在 Node 侧持有 Cookie 并做传输适配——**不能**假设客户端能自己认证。
2. **官方 client 产物是浏览器模块，不是通用 ESM**：`window.__ModuleLoader__.load(...)` 注册（`docs/research/NSH_HARNESS_RESEARCH.md:74`、`packages/client/web/src/boot.ts:69-76`）。想复用 client 插件必须先有模块宿主，QuickJS 里没有。
3. **`?token=` 是现成后门但会进 URL**：`authenticatedUrl()` 把 process token 放 query（`packages/client/connection/src/browser-auth.ts:17,244-247`），可被日志/历史记录捕获；Desktop 恰恰不用它给页面，而是转成 Cookie（§3）。若我们要走 query，需自己兜住泄露面。
4. **profile 是独占资源**：Desktop 持有 `$DSH_HOME/profiles/desktop` 及进程锁（`apps/desktop/src/project-manager.ts:92-129`、`apps/desktop/README.zh.md:118`）。多产品共享同一 `$DSH_HOME` 必须各占一个 profile 名，否则锁冲突。
5. **Host 必须跑在真 Node 上**：Host 用 `--expose-internals`、原生模块（koffi/node-pty/fs-ext，`apps/desktop/src/project-manager.ts:47`）和 `ELECTRON_RUN_AS_NODE`。我们没有 Electron，就要自带 Node 运行时（打包体积与签名成本转到我们这边）。
6. **Host 只绑回环 + 端口随机**：`--host 127.0.0.1 --port 0`（`apps/desktop-host/src/index.ts:41`），web bundle 拒绝通配绑定（`packages/bundle/web-app/cordis.patch.yml:167-177`）。跨设备访问不是既有能力。
7. **shell 才有"会话结束"信号**：Desktop 靠 `disconnect`/`shutdown-complete` 判定（`apps/desktop-host/src/index.ts:56-66,112`）。我们客户端会断线重连（`docs/ARCHITECTURE.md:87`），不能照搬"断连即停机"。

## 8. 与我们现状的差异（避免重复造）

- 启动链、不可变运行时与 profile 定位已调研：`docs/research/DESKTOP_HOST_RESEARCH.md`（结论与 §1、§2 一致，不重复）。
- 我们的 `/api/bot/*` 已经承担了 Desktop 里"壳 + 原生 IPC"那一层的业务部分；**上游没有对应物**，这层继续自建是合理的，但底层能力（模型、队列、取消、历史、workspace、settings、credentials）必须走 Session Controller 等既有行，不许复制。
- 唯一值得马上抄的两处：① 启动注入表形状（`collectIndexInjections`）替代自造 bootstrap JSON；② 更新/停机前的任务准入语义（`update-tasks lock` 先 drain 再检查）。
