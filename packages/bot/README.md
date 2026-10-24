# Bot 插件

此包通过标准 Cordis 插件提供 `BotController`，并通过 bundle patch 加入 Runner profile。它拥有 Bot 档案、唯一 Session 关联和 AgentHandle；执行循环、inbox、模型调用、权限与 Session 持久化继续由 Harness 提供。

## 公开入口

| 入口                  | 消费方      | 内容                                            |
| --------------------- | ----------- | ----------------------------------------------- |
| `@dsh-bot/bot`        | Host Loader | 插件、Config、Controller                        |
| `@dsh-bot/bot/types`  | 各客户端    | Bot、消息和流字段及产品错误码；不导入 Host 实现 |
| `@dsh-bot/bot/typert` | Host Loader | 官方生成器输出的严格描述与校验                  |
| `@dsh-bot/bot/remote` | 客户端组合  | 生成的 Remote 贡献及类型                        |

Remote namespace 为 `bot`，方法包括 `create`、`get`、`list`、`history` 和流式 `send`。参数、结果与取消语义使用标准 Gateway；不提供自定义 RPC 协议。共享框架包使用 peerDependencies，构建保留外部包引用，避免第二套 Cordis 实例。

## 记录与执行

Bot 记录使用上游 `storageDomain`，domain 为 `dsh_bot`，版本 1，表为 `bots`。domain 在插件激活时打开并校验，记录写入在上游持久化完成后返回；插件清理等待 Agent 释放，再关闭 domain。Zod 固定为与上游 storage-domain 相同的 4.4.3，避免跨版本复杂 schema 类型比较。

每个 Bot 的 Session ID 稳定，并以 `dsh-bot:<botId>` 注册独立 preset。当前 preset 为空，工具能力和配置事务尚未实现。发送时按持久存储状态选择 create/resume；控制器持有并释放所有创建的句柄，不挂载会自行冷恢复 Agent 的官方 Session Controller。

首版骨架对忙碌 Bot 拒绝新 turn。模型错误以 `bot/turn-failed` 拒绝流；`done` 在空闲和持久化屏障完成后发送。断开观察不取消已接纳执行。`history` 是 user/assistant 文本投影，不包含注入的 runtime-context，也不代替完整会话事件接口。

## 构建与测试

```sh
bun run --cwd packages/bot build
bun run --cwd packages/bot check
bun run --cwd packages/bot test:unit
```

构建通过已发布的 Typert generator 生成 `lib/typert.*`，不手写协议产物。独立 npm protocol 的识别需要一个 Bun 兼容补丁，原因和移除条件见 [补丁说明](../../patches/README.md)。`lib/` 不入库，由构建重新生成。

进程内测试在公开 Controller 接口上使用真实 Agent、JSONL 和 storageDomain，仅替换外部模型。真实 profile、生成 Remote 与进程重启的组合测试由 [Runner](../../apps/runner/README.md) 持有。确定性模型位于测试 fixture，不属于本包公开运行入口。
