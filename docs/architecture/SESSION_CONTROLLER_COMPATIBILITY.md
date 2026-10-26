# Session Controller 共存验证

正式 Runner profile 已接入标准 Session Controller、文件引用与上传，BotController 继续独占 Bot 的 AgentHandle、配置和 preset。固定 npm 基线缺少所需委托，因此当前通过根 Bun 锁文件应用五个运行时兼容补丁；这不是上游已经发布生命周期扩展的声明。包版本见 [runtime 清单](../../packages/harness-runtime/package.json)，补丁职责和移除条件见 [补丁说明](../../patches/README.md)。

产品仍通过 npm 公开入口与命名 `runner` profile 启动，不加载官方 Web 应用，不复制 Controller，不替换 AgentFactory，也不从参考子模块导入产品代码。Session 事件、查询、队列、权限和模型循环保持上游实现；没有新增 Session 格式或客户端传输协议。

## 所有权与操作窗口

[产品适配器](../../packages/bot/src/session-controller.ts) 连接以下 Host 接口；这些接口由补丁增加，不是新的客户端 Remote 方法。

| 所属包                 | 接口                                           | 作用                                                        |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| typert-protocol        | `OperationGuardRegistry`                       | 单提供者注册、取消、幂等释放、退出等待和退役后的拒绝        |
| api-session-controller | `registerLifecycle({ acquire, resolveAgent })` | 命令、历史开场、后台 promotion 和统一 Agent 解析            |
| api-gateway            | `registerOperationGuard`                       | 在 Context/参数 lookup 前取得窗口，保留到调用与结果编码结束 |
| client-file-upload     | `registerUploadGuard`                          | 从冷解析到字节接收、持久化和回执暂存保持窗口                |
| dsh/profile-boot       | `runProfile({ beforeDispose })`                | 在整棵插件树销毁之前排空已接纳操作                          |

BotController 按稳定 Session 身份识别 Bot，并沿标准 subagent header 的父链识别所属 Bot。操作窗口是按 Bot 计数的共享租约，允许同一调用内的嵌套解析；配置替换要求计数为零，已有调用期间立即返回 `maintenance`。配置应用开始后，新查询、激活、上传与命令在使用候选 Agent 前返回 `replacing`。冷初始化也阻止替换，并由 Bot 持有一个共享初始化任务，避免不同调用各自创建 Agent。

创建与恢复使用 Bot 插件自身的 Context，句柄不会归属于一次 Gateway invocation。取消一个初始化观察者不撤销 Bot 已拥有的初始化任务；退出时由 Bot 等待任务终结。Agent 的模型、参数、cwd、字面指令与能力来自最新已提交配置，Controller 不重新安装官方默认模型选择。

Gateway 保留原有授权和参数校验顺序。通过授权后，先取得操作窗口，再解析 Host Context 和参数；并行参数解析全部结算后才能释放窗口。失败清理、流迭代结束和 RPC 编码均有释放路径。调用方不能在 lookup 返回后、异步方法仍使用 Agent 时开始替换它。

## 历史、上传和命令

历史 page 与 projections 只读取，不为了查询激活 Agent。follow 的开场保护订阅与首个快照，首帧交出后仅释放配置窗口；guard 继续跟踪消费者，退出会主动驱动暂停在两次读取之间的流完成清理。首次读取之前调用 `return()` 也释放窗口。已有长流不占用配置替换资格，并能在同一 Session 上继续收到新 Agent 的事件。冷 follow 的后台 promotion 独立重新取得窗口，覆盖恢复及 observation 清理。尚无日志的新 Bot 由所有者先建立空 Session，再返回快照。

原始上传在接收字节之前取得窗口，优先使用注册的普通 Session resolver；原有 subagent 所有权检查保留。`uploadStream` 接受原有 iterable 或接收完整取消信号的 source factory。HTTP 入口使用 source factory 和 Node `Readable.fromWeb`，让生命周期退役可以中断等待字节的 reader；租约到持久化、事件发布和回执暂存结束才释放。编码上传还受 Gateway 与暂存操作窗口保护。文件存储与回执继续使用上游实现，不额外承诺跨物理 Session 关闭保留暂存回执。

标准 prompt、queue 更新、cancel 和 rename 经过相同所有者解析；cancel 保留标准输入队列语义。标准 create、fork、selectModel 在产品 profile 中返回 `bot/operation-unavailable`，避免独立创建第二个会话所有者或绕过完整配置事务。Bot 创建和模型更新仍使用 Bot Remote。传统 `bot.send` 保持单轮流式观察：有运行或待处理用户输入时返回 `bot/busy`，其观察期间不接受标准 prompt 混入另一轮；标准 prompt 在异步准备期间也阻止 `bot.send` 抢先接纳。标准 prompt 自身继续使用上游队列。

## 退出顺序

Runner 的退出前钩子先停止 Bot 接纳，再关闭三类操作 guard，取消并等待查询、lookup、上传和流的收尾。之后 Bot 等待已接纳创建、配置与初始化任务、取消活动执行并等待其持久化、释放 Agent 和 preset，最后才调用上游插件树清理。记录域的关闭也明确等待 Bot 清理完成。

这段顺序不能只靠 Cordis `inject`：整棵树销毁会并发启动兄弟清理，服务 withdrawal 的等待不保证其他资源关闭尚未开始。受控测试在消费者最后一次使用 Agent 与记录域之前暂停，再分别触发私有 IPC shutdown 和 SIGTERM；省略退出前钩子时观测到 Agent 已不活跃，恢复钩子后两种退出路径都等待清理完成并保留依赖可用。

guard 退役后新的访问明确失败，不能落回官方自动恢复。取消或清理失败不会伪装成成功：流收尾失败进入 guard 排空结果，Launcher 记录清理错误或超时并返回非零退出码；已有配置事务失败、回退及故障保持继续使用 Bot 的既有错误与持久 intent。退出前钩子不改变进程强制终止的恢复保证。

## 自动化证据

```sh
bun install --frozen-lockfile
bun run --cwd packages/bot check
bun run --cwd packages/bot test:unit
bun run --cwd apps/runner check
bun run --cwd apps/runner test:unit
```

[Runner 生命周期测试](../../apps/runner/tests/session-lifecycle.spec.ts) 使用真实 Node、独立 home、正式命名 profile、JSONL、storageDomain、Connection/Gateway 和生成客户端，只替换外部模型。受控文件引用 provider、初始化和上传屏障仅存在于 [测试插件](../../apps/runner/tests/fixtures/session-controller-probe.ts)，正常 build 不构建这些 fixture。

| 路径                         | 验证结果                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 重启后标准 rename 触发冷恢复 | 由 Bot 保留句柄；下一轮使用最新模型、参数与字面指令，并可再次保存            |
| 冷 follow 与已有长流         | 后台激活经过 Bot；长流跨替换继续收到新模型回复，不长期阻止保存               |
| 配置应用中的间接入口         | 标准历史开场、rename、文件引用、编码上传与原始 HTTP 上传均在候选被使用前拒绝 |
| 异步 lookup                  | 初始化未就绪时保存返回 `maintenance`，就绪后查询和替换成功                   |
| lookup 后的方法执行          | 文件引用方法仍在异步使用 Agent 时，保存保持拒绝；方法结算后可替换            |
| 原始上传及适配器退役         | 上传接收期间保持窗口，退役取消接收和消费者收尾，暂存文件清理后才完成         |
| Runner 全树退出              | IPC 与 SIGTERM 都等待消费者最后一次依赖使用，之后正常退出                    |
| 首次 prompt 前打开新 Bot     | 先建立唯一空 Session，首帧后配置仍可应用                                     |
| 缺失生命周期绑定             | Runner 拒绝报告就绪                                                          |
| 独立 create/fork/selectModel | 返回产品错误，Bot 配置和身份不变                                             |

[操作窗口测试](../../packages/bot/tests/operation-guard.spec.ts) 另验证无提供者的直通、取消、释放完成前等待、退役期间才交付的租约清理、失败获取和重新注册。真实模型、非 macOS、设备 Peer 授权、实际 subagent 执行、保存中途强制杀进程、launchd 与自带运行时仍未完成验证。

## npm 基线的缺口

补丁前的三个真实进程复现保留在 Git 提交 `7febdc2cd3`：冷恢复缺少动态 Bot preset；预注册空 preset 后官方 Controller 持有 Agent 且采用旧模型；历史开场绕过 Bot 的替换拒绝。当前测试已改为对应的统一所有者正向契约，不能继续把基线缺口当作产品期望行为。

参考源码固定在 `687f282e8625c6b8d11ff58211a90524be2e4317`，与运行补丁分别管理。[Agent Controller](../../references/deepseek-harness/packages/api/session-controller/src/agent.ts) 的内部命令、lookup 闭包、upload resolver 和 `resolveObservedAgent` 不统一通过公开 facade；仅覆盖公开 `resolveAgent` 无法协调所有入口。其内部模型选择还优先使用历史投影或 request header，而不是 Bot 记录。

[history.follow](../../references/deepseek-harness/packages/api/session-controller/src/history.ts) 先返回快照再触发 [后台 promotion](../../references/deepseek-harness/packages/api/session-controller/src/index.ts)。[Typert lookup 类型](../../references/deepseek-harness/packages/typert/protocol/src/types.ts) 只返回对象或 Context，[Gateway](../../references/deepseek-harness/packages/api/gateway/src/index.ts) 原本在解析后才建立 invocation；因此只替换 lookup 也不能保护后续异步使用。[原始上传](../../references/deepseek-harness/packages/client/file-upload/src/index.ts) 的 live Agent 路径还先于 resolver，需要单独覆盖整个上传。

仅补齐 preset、覆盖 facade、监听 `agent/created` 接管、做一次授权过滤或替换 AgentFactory 均不满足这些时间与所有权要求。当前选择在公开 npm 安装物上补充 Host 委托和操作生命周期，保持应用策略在 Bot 包。上游提供等价可消费接口后，统一升级同版 DSH 依赖、移除兼容补丁，并重新通过上述正向测试；不直接删除补丁后依赖基线行为。
