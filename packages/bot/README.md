# Bot 插件

此包通过标准 Cordis 插件提供 `BotController`，并通过 bundle patch 加入 Runner profile。它拥有 Bot 档案、配置保存、唯一 Session 关联和 AgentHandle；执行循环、inbox、模型调用、权限与 Session 持久化继续由 Harness 提供。

## 公开入口

| 入口                  | 消费方      | 内容                                              |
| --------------------- | ----------- | ------------------------------------------------- |
| `@dsh-bot/bot`        | Host Loader | 插件、Config、Controller                          |
| `@dsh-bot/bot/types`  | 各客户端    | 配置、Bot、消息、流字段和错误码；不导入 Host 实现 |
| `@dsh-bot/bot/typert` | Host Loader | 官方生成器输出的严格描述与校验                    |
| `@dsh-bot/bot/remote` | 客户端组合  | 生成的 Remote 贡献及类型                          |

Remote namespace 为 `bot`，方法包括 `create`、`get`、`list`、`saveConfiguration`、`history` 和流式 `send`。参数、结果与取消语义使用标准 Gateway；共享框架包使用 peerDependencies，构建保留外部包引用。

## 配置保存

`saveConfiguration(botId, { expectedRevision, configuration })` 接受调用方读取的版本及完整执行配置。成功返回的新版本表示配置已持久化、新 Agent 已就绪、Session 已完成持久化屏障。它不会为了应用配置发起模型请求。

| 配置字段                       | 含义                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `cwd`                          | 执行侧已存在的绝对目录；通过上游 working-directory 服务生效，保留 Session 原始 header |
| `provider`、`model`            | Bot 的模型路由，使用上游精确元数据校验                                                |
| `maxTokens`、`reasoningEffort` | 模型请求覆盖值；`null` 清除该项覆盖，采用 provider 默认行为                           |
| `instructions`                 | 按原文注册的作用域指令，保留 `{{…}}` 字面量；不授予工具或权限                         |
| `capabilities`                 | 已部署能力的唯一 id 列表，映射为该 Bot 的 preset 插件                                 |

插件 Config 的 `capabilities` 是执行侧批准的能力表，默认空表；每项包含 `{ name, config }` 插件条目，config 只接受无损 JSON。客户端保存能力 id，不能提交插件模块或执行侧配置。实际文件、进程、网络工具与权限组合由后续能力票提供。

保存先占用该 Bot 的替换状态，并通过上游 `runMaintenance()` 原子占用真正空闲的阶段。校验目录、模型和候选 preset 后写入持久事务记录及候选配置；再次检查 inbox，再在维护回调内发起旧句柄释放，退出回调后等待释放完成。随后替换稳定 preset，在同一 Session 上恢复 Agent；尚无日志时创建该 Session。确认持久化后删除事务记录，返回成功。应用期间 `get`、`list` 保持返回旧的已提交配置，发送及历史读取被拒绝。

| `bot/config-rejected` 的 reason | 条件                                                           |
| ------------------------------- | -------------------------------------------------------------- |
| `running`                       | 已接纳 turn 或 Agent 正在执行                                  |
| `pending-input`                 | next-turn 或 next-step 中仍有输入，包括冷 Session 的持久化输入 |
| `maintenance`                   | 其他维护任务占用真正空闲阶段，即使公开状态显示 idle            |
| `replacing`                     | 已有一次配置应用正在进行                                       |
| `unavailable`                   | 已停止接纳、处于故障，或活跃 Agent 不属于此控制器              |

版本过期返回 `bot/config-conflict`，校验失败返回 `bot/config-invalid`。装配或提交失败后恢复旧配置与旧配置下的 Agent，返回 `bot/config-failed`；清理或恢复失败则返回 `bot/faulted` 并停止接纳。待处理输入不会为了保存而被清空。

持久事务记录用于识别中断或恢复失败。重启遇到未完成记录时，该 Bot 保持停止接纳，读取仍返回旧配置；当前尚无产品故障恢复入口。事务保证覆盖同一 Runner 中 BotController 协调的入口；官方 Session Controller 在 #5 中已确认缺少统一生命周期委托，正式接入等待扩展版本，见 [共存验证](../../docs/SESSION_CONTROLLER_COMPATIBILITY.md)；Runner 跨进程单实例由 #11 验证。

## 记录与执行

Bot 记录使用上游 `storageDomain`，domain 为 `dsh_bot`，版本 1，表为 `bots` 和 `configuration_transactions`。原始六字段记录仍可读取，新增字段补为版本 0、空指令、空能力及空参数覆盖；Bot 和 Session 身份不变。domain 在插件激活时打开并校验，插件清理等待配置操作、Agent 和 preset 释放，再关闭 domain。Zod 固定为上游使用的 4.4.3。

每个 Bot 以 `dsh-bot:<botId>` 注册独立 preset，Session ID 稳定。发送时按持久存储状态选择 create/resume；控制器持有并释放所有创建的句柄。当前不挂载会自行冷恢复 Agent 的官方 Session Controller。

每个 Bot 同时接纳一个 turn，忙碌时返回 `bot/busy`。模型错误以 `bot/turn-failed` 拒绝流；`done` 在空闲和持久化屏障完成后发送。断开观察不取消已接纳执行。`history` 是 user/assistant 文本投影，不包含注入的 runtime-context，也不代替完整会话事件接口。

## 构建与测试

```sh
bun run --cwd packages/bot build
bun run --cwd packages/bot check
bun run --cwd packages/bot test:unit
```

构建通过已发布的 Typert generator 生成 `lib/typert.*`。独立 npm protocol 的识别需要一个 Bun 兼容补丁，原因和移除条件见 [补丁说明](../../patches/README.md)。`lib/` 不入库，由构建重新生成。check 同时验证 Host 源码与测试类型。

进程内测试使用公开 Controller、真实 Agent、JSONL、storageDomain 和测试模型；通过公共生命周期事件设置初始化屏障或故障。覆盖五种拒绝、暖/冷替换、历史前缀、参数清除、能力隔离、旧记录兼容、回退与故障重启。真实 profile、生成 Remote 与 Node 进程重启的组合测试由 [Runner](../../apps/runner/README.md) 持有。
