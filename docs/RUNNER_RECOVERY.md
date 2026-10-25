# Runner 崩溃恢复

当前实现覆盖 #13 的崩溃恢复部分；自动升级的停止、运行时替换与重启时序尚未实现。

## 当前行为

用户级 LaunchAgent 通过 `KeepAlive` 拉起意外退出的 Runner。新进程生成新的实例身份和连接资料，Main 在下一次请求时重新认证；不复用旧实例的连接。

Bot 恢复复用 Harness 的 Session JSONL 修复机制。未结束的轮次补记 `turn/end` 的 `interrupted` 原因；未返回的工具调用补记保守错误结果，恢复代码不重新执行工具。标准 inbox 恢复保留未处理消息，但读取状态、历史和工具活动不唤醒驱动。

Bot 的 `inputState.interrupted` 从最后一轮的持久结束原因计算：意外中断或生命周期释放导致的取消在空闲状态显示中断提示，用户主动停止不归入该提示。桌面重新打开后仍可显示。用户查看记录并撤回保留输入后，可主动发送新请求；完成新轮次后提示消失。已有发送观察断流不会自动重发。

此状态复用标准 Session 日志，没有新增产品恢复日志、消息队列或工具执行器。未完成配置事务仍沿用原有故障保护，不会因崩溃恢复而绕过。

## 本机验证

- `packages/bot/tests/bot.spec.ts` 重建进程退出时的持久日志前缀，验证冷恢复后状态为中断、队列身份不变、读取不执行输入，以及主动新请求后的状态。
- `apps/desktop/tests/e2e/runner-service.test.ts` 使用成品随包 Node 和真实用户 launchd，SIGKILL 后验证新实例连接资料产生，并可停止和卸载。
- `apps/desktop/tests/e2e/bot-recovery.test.ts` 在确定性工具等待结果期间 SIGKILL 真实 Runner 进程；用同一 home 重启 Runner、重新打开打包桌面，验证中断提示、未重复用户消息、保留输入及主动恢复。模型与工具为测试适配器；此用例不声称经过 launchd 重启，launchd 由前一用例单独验证。

- 本机工作区单元测试 95 项通过（Bot 33、Runner 20、桌面 42）；工作区检查 0 错误、6 项已有 UI 警告；成品 IPC 与迁移后的随包 Runner 冒烟通过。
- 桌面全量 E2E 为 29/30 通过，已有原生全屏用例仍在 45 秒超时。补强新实例重新认证断言后，恢复与服务专项 3/3 再次通过。

工程规范与 #13 崩溃条款由主代理分别复核。两个独立 reviewer 均因 `spawn /opt/homebrew/Cellar/node/26.12.1/bin/node ENOENT` 未启动，没有独立审查结果；没有据此声称完成双代理审查。

依据来自固定上游：`packages/core/session/src/repair.ts` 的 `ToolCallRecovery` 与 `interruptedTurnClosers`、`packages/core/agent-loop/src/agent.ts` 的空闲初始化，以及标准 inbox 持久投影。本项目只增加受控状态读取和界面呈现，不改写上游恢复规则。

## 尚待完成

升级必须先停止后台并等待资源清理，之后才能替换运行时并重新启动。当前服务管理器阻止运行中改写启动配置，但没有自动升级入口或运行时回滚流程。升级中的用户提示、人工验收记录以及真实模型和工具的断电场景仍待验证，不能据上述崩溃测试关闭整个 #13。
