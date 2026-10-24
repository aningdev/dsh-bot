# Runner

Runner 是通过命名 `runner` profile 启动的 Node 后台骨架。它加载固定版本的 Harness、runtime bundle 和 Bot 插件，提供认证的 Bot Remote、标准 Session API、文件引用与上传，不加载官方 `dsh-web-app` 或页面。桌面 Main 接入、launchd 注册、自带 Node 和安装升级尚未实现。

## 构建与启动

在仓库根目录执行：

```sh
bun install --frozen-lockfile
bun run --cwd apps/runner build
bun run --cwd apps/runner start --home /absolute/path/to/dsh-bot-dev
```

`--home` 必须为绝对路径。开发、测试和生产使用不同目录；该参数设置本进程的 `DSH_HOME`。`--patch /absolute/path/overlay.yml` 可以重复提供，沿用 Harness 的调用时 overlay 机制。默认监听 `127.0.0.1`，端口由系统分配；监听配置由 runtime bundle 的 `webserver` 条目提供。

启动通过 `loadProfileDirectory` 和公开的 `dsh/profile-boot` 完成。安装锚点是 Runner 的 `package.json`：上游解析器从其依赖图同时找到 DSH、runtime 和产品 Bot 包。直接锚定官方 DSH 清单不能包含我们的 Bot 包。运行时保持 Node，并保留上游模块解析所需的 `--expose-internals`。

默认模型为 `deepseek-official` / `deepseek-flash`，使用执行侧的标准凭据服务和 `DEEPSEEK_API_KEY` 引用。启动不要求已有模型密钥；本机自动化使用测试 overlay，未验证真实 API 调用。

## 进程控制与认证

通过 Node 私有 IPC 启动时，Runner 发送 `ready`，其中包含本机 origin 和带进程 token 的 `/connect` URL。调用方通过标准 API 握手取得 Cookie，并在 HTTP 和 WebSocket 上使用同一凭据；未认证请求会被拒绝。认证 URL 只经私有 IPC 返回，普通命令行只输出不带凭据的 origin。该控制接口供当前测试与后续本机管理接入，不是已经完成的 launchd 发现协议。

私有 IPC 的 `shutdown` 请求触发上游有序清理，完成后返回 `shutdown-complete`。SIGTERM/SIGINT 使用 Harness 的信号清理。退出前先停止接纳并排空 Session 操作，再释放 Bot 资源和插件树；记录域在 Bot 清理后关闭。客户端或父 IPC 断开不会请求停止 Runner，已接纳的 turn 继续执行。

## 数据与调用

profile 位于 `$DSH_HOME/profiles/runner`，组合顺序为 `dsh-base`、`@dsh-bot/harness-runtime`、`@dsh-bot/bot`。Bot 记录使用标准 `storageDomain` 的 `dsh_bot` domain；Session 日志由 JSONL 插件保存到 home 下的 `sessions`。Bot history、标准 page 与 projections 不为了查询激活 Agent；follow 可以通过 Bot 触发冷恢复。

Bot Remote 提供 `create`、`get`、`list`、`saveConfiguration`、`history` 和流式 `send`。配置保存成功表示新配置已持久化且在同一 Session 的新 Agent 上生效；拒绝原因、版本冲突、失败回退与故障保持见 [Bot 插件](../../packages/bot/README.md)。`bot.send` 同时接纳一个流式 turn，忙碌时返回 `bot/busy`；标准 prompt、队列更新和 cancel 复用上游语义，队列产品界面和实际工具权限组合由后续票实现。`send` 的 `done` 表示执行已空闲且完成持久化屏障；模型失败会拒绝流，客户端取消观察不会取消已接纳执行。

## 验证

```sh
bun run --cwd apps/runner check
bun run --cwd apps/runner test:unit
```

测试构建后使用真实 Node 子进程、独立 home、标准 Connection/Gateway 和生成的 Bot Remote。覆盖逐段回复、真实 JSONL、实际进程重启后同 Session 继续对话、配置应用与持久化、冷替换、失败流、参数校验、未认证请求和客户端断连。测试模型由 `tests/fixtures/model.overlay.yml` 加载；`--test-fixtures` 构建的模型和兼容性观察插件放在 `.test-output/`，正常 build 不构建它们。

正式 profile 加载标准 Session Controller 和 `@dsh-bot/bot/session-controller` 适配器，就绪检查要求二者及文件服务已安装。`session-lifecycle.spec.ts` 验证冷恢复、长历史流跨替换、异步 lookup 与方法收尾、上传、退出排空和绕过操作拒绝。接入依赖根锁文件的运行时兼容补丁，见 [共存验证](../../docs/SESSION_CONTROLLER_COMPATIBILITY.md)。

架构职责见 [Harness 映射方案](../../docs/HARNESS_MAPPING_PLAN.md)，引擎资源见 [harness-runtime](../../packages/harness-runtime/README.md)。
