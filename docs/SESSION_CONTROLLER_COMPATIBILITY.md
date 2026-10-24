# Session Controller 共存验证

固定 npm 发行版 `0.2.1-rc.2` 不能直接满足 Bot 的 Agent 所有权和严格配置替换要求。#5 按其允许的替代验收交付可执行复现与最小扩展点结论；正式 Runner 继续只开放 Bot 所有者协调的接口。官方 Session Controller 的正式接入需要可消费的上游扩展版本。

## 验证组合与复现

测试使用真实 Node Runner、独立 home、命名 profile、JSONL、storageDomain、Connection/Gateway、已发布 Session Controller 与生成客户端，只替换外部模型。通过调用时 overlay 加入 workspace、file-reference、file-upload、Session Controller 和测试观察插件，保持正式 bundle 不变；不加载官方 Web 应用或页面。

```sh
bun install --frozen-lockfile
bun run --cwd apps/runner check
bun run --cwd apps/runner test:unit -- session-controller-compatibility
```

[兼容性测试](../apps/runner/tests/session-controller-compatibility.spec.ts) 包含三个复现；[观察插件](../apps/runner/tests/fixtures/session-controller-probe.ts) 只报告公开事件、可选注册空 preset，并用明确的初始化屏障控制交错。它不替换官方方法或读取私有字段，正常 build 不构建测试插件。

| 复现                         | 准备与触发                                                                        | 实际观测                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 冷恢复缺少 Bot preset        | 完成 fake-1 一轮，成功保存 fake-2 配置但尚未执行下一轮；重启后加入官方 Controller | `session.rename` 恢复失败；`session.follow` 先返回快照，随后后台激活报告找不到 `dsh-bot:<botId>`             |
| 注册 preset 仍缺少所有者交接 | 在同样的冷启动中，通过公开 registry 预注册空 preset，使官方历史跟随能够恢复       | 官方创建的 Agent 不属于 Bot；Bot 保存返回 `unavailable`。保存记录为 fake-2，官方 prompt 却产生 fake-1 的回复 |
| 历史开流绕过替换拒绝         | 阻塞 Bot 新 Agent 的 `agent/created` 初始化监听器，使配置应用保持未完成           | Bot history 返回 `replacing`；同一时刻官方 follow 返回快照，保存完成前没有经过 Bot 的拒绝判断                |

第二项的空 preset 只用于隔离“找不到 preset”与“所有权、模型选择”两个问题，覆盖的 Bot 能力列表本来为空。它不是恢复 Bot 指令或移交句柄的实现。模型差异来自“最新已保存配置为 fake-2，最后模型请求仍为 fake-1”，不需要真实 API 即可观测。

这些测试固定当前发行版的不兼容行为。升级后若观测改变，应将它们转换为统一所有者的正向验收，并更新本结论。

## 上游现有路径

参考源码固定在 submodule 提交 `687f282e8625c6b8d11ff58211a90524be2e4317`，运行测试实际导入 npm 公开入口。参考目录不参与产品构建。

| 入口                                              | 现有内部路径                                                       | 所需协调                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| 公开 `resolveAgent`                               | `SessionController → ApiSessionAgentController.resolveAgent`       | 从 Bot 所有者取得 Agent，保留句柄所有权                   |
| prompt、queue、rename、模型选择                   | Command Controller 直接使用同一个内部 Agent Controller             | 检查和操作在同一个 Bot 接纳窗口内完成                     |
| Agent / Session 的 Typert lookup 与 Agent context | 内部 Agent Controller 构造时注册闭包                               | 统一解析，不能只改公开 facade 方法                        |
| file upload                                       | Session Controller 注册 resolver，直接调用内部 Agent Controller    | 上传前的 Agent 解析也经过 Bot 所有者                      |
| file-reference                                    | Agent context lookup 激活目标，再调用文件引用服务                  | 复用相同解析与拒绝规则                                    |
| history page、follow 开场                         | `SessionHistoryController.sourceFor → sessionQuery.observeSession` | 替换期间在读取内容和返回快照前明确拒绝                    |
| 冷 follow 后台激活                                | `follow → promote → resolveObservedAgent`                          | 开场之后重新取得接纳资格，委托 Bot 创建或恢复             |
| create、fork                                      | Controller 内部独立创建 Agent                                      | Bot profile 拒绝独立会话创建，产品创建继续由 Bot 服务完成 |

来源：[Session Controller 构造、上传与 promote](../references/deepseek-harness/packages/api/session-controller/src/index.ts)、[Agent 解析、Typert 注册及 resumeObserved](../references/deepseek-harness/packages/api/session-controller/src/agent.ts)、[命令入口](../references/deepseek-harness/packages/api/session-controller/src/commands.ts)、[历史开场与后台激活](../references/deepseek-harness/packages/api/session-controller/src/history.ts)、[文件引用](../references/deepseek-harness/packages/api/session-controller/src/file-references.ts)。

内部 `resumeObserved` 取出 `AgentHandle.agent` 后只返回 Agent；句柄仍由其创建上下文管理，没有 Bot 接收句柄的公开入口。内部 `selections` 也由官方 Controller 独立维护；恢复时优先使用 Session 的模型选择投影或最后 request header，再使用全局默认选择，不读取 Bot 记录。仅补齐 preset 不能保证最新 Bot 配置生效。来源：[Agent Controller](../references/deepseek-harness/packages/api/session-controller/src/agent.ts)。

follow 的开场先 yield 快照，随后才保留 observation 并发起 promotion。读取开场与后续激活是两次不同操作，不能用一个“进入 follow 前检查一次”的判断覆盖。Agent 发布到 registry 后，初始化监听器可能仍在等待；因此只拦截找不到 Agent 时的冷恢复，也不能阻止替换期间的 live fast path。来源：[history.follow](../references/deepseek-harness/packages/api/session-controller/src/history.ts)、[Agent 工厂发布与初始化](../references/deepseek-harness/packages/core/agent-loop/src/index.ts)。

公开类型也只提供原生打开应用等测试替换项，没有生命周期委托。Typert 的 Host lookup 和 Host context resolver 只接收 id、返回对象或 Context，没有把释放函数交给调用生命周期的返回类型；Gateway 在解析这些值之后才建立 invocation。因此，重新配置 lookup 可以改变解析结果，却不能靠它单独保持整个异步操作的租约。来源：[Controller 公共定义](../references/deepseek-harness/packages/api/session-controller/src/index.ts)、[Typert resolver 类型](../references/deepseek-harness/packages/typert/protocol/src/types.ts)、[Gateway.prepareInvocation 与 resolveParameter](../references/deepseek-harness/packages/api/gateway/src/index.ts)。

## 最小扩展点

扩展应位于 Session Controller，复用现有查询、事件、队列、权限与执行循环。应用提供 Host 生命周期委托，官方 Controller 负责让下列入口使用它。当前 npm 版没有此接口；以下是待上游实现和验证的接口草案。

```ts
interface SessionControllerLifecycle {
  run<T>(request: SessionOperation, operation: (route: SessionAgentRoute) => Promise<T>): Promise<T>
}

type SessionAgentRoute =
  | { readonly kind: 'controller' }
  | { readonly kind: 'owner'; readonly resolve: () => Promise<Agent> }
```

`SessionOperation` 至少包含经过授权的 SessionAddress（创建操作另有全局目标）、操作种类和取消信号。实际 Service Definition 留在官方 Controller 包中；Bot 插件提供实现，普通 profile 保持官方默认路由。此草案不增加客户端 RPC 或持久 Session 字段。

委托同时提供受保护的操作窗口与 Agent 解析：对 Bot，`resolve` 调用 Bot 的受控创建/恢复，使用最新配置并保留 AgentHandle；官方 Controller 跳过自身 preset、默认模型和 selection 的装配。对普通 Session，`controller` 路由保留现有行为。不能先检查 idle、释放窗口，再把裸 Agent 交回任意调用者继续修改。

入口适配有三个必要部分：命令、lookup 和 upload 复用委托解析并在操作完成后释放窗口；历史开场在窗口内完成订阅和快照准备，在首个 yield 前释放窗口；冷 follow promotion 在后续再次取得窗口。整个长连接不持有替换锁，已有 follower 继续使用标准同 Session 事件流跨越 Agent 替换。

Bot 提供者在应用期间拒绝新的读写与激活；替换也拒绝与已接纳的互斥操作交错。禁止官方 `selectModel` 绕过 Bot 的版本校验和完整配置事务，也不允许 create/fork 替 Bot 产生额外会话。不能通过 `selectionFor` 在操作时重新安装官方模型选择，覆盖 Bot 已安装的选择。

原有 Remote 授权、SessionAddress/子 Agent 归属检查、writer 锁和查询校验保留。租约需覆盖异步操作和失败清理，支持同一受保护调用内部的 lookup，避免重复获取自身窗口造成死锁；保存拒绝和故障错误还须通过生成的客户端完整传递。

委托接线集中在 Controller 的 `src/index.ts`、`agent.ts`、`commands.ts` 和 `history.ts`。对 Typert 间接调用，还需要 Gateway 在参数/context lookup 前获取操作租约、在调用结算后释放的生命周期入口，或等价的 Host owned-lookup 支持；只改 Controller 的解析闭包不足以覆盖这段时间。这个调用生命期接口也需随扩展版本验收。无须修改 AgentLoop、JSONL 或把 AgentHandle 暴露给客户端。

## 替代方案

| 方案                             | 评估                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 启动时注册所有 Bot preset        | 只解决 preset 不存在；第二个复现证明句柄归属与配置选择仍不一致                                                                             |
| 子类覆盖公开 `resolveAgent`      | 内部命令、upload、lookup 和 `resolveObservedAgent` 不通过这个 facade 方法                                                                  |
| 重配 Typert lookup               | 只覆盖使用该 lookup 的入口，不能覆盖内部命令与历史开场/promotion                                                                           |
| `agent/created` 监听器接管       | 此时已进入发布流程，事件不提供 AgentHandle；第三个复现也证明仅有 live Agent 不代表替换已结束                                               |
| Gateway 或 Remote access 过滤    | 授权不能替代运行中操作的租约；Host 直接调用、upload resolver 和后台 promotion 也需协调                                                     |
| 替换 AgentFactory                | 已有工厂注册时会被拒绝，且扩大到执行循环和其他 Agent；来源见 [setFactory](../references/deepseek-harness/packages/core/agent/src/index.ts) |
| 复制 Controller 或访问其私有成员 | 增加维护面，不能继续消费公开 npm 入口；不采用                                                                                              |
| 暂时保持 Bot Remote              | 当前正式组合；继续复用公开 Agent/Session 能力，官方 Controller 待扩展版本验收后接入                                                        |

## 启用前验收

可消费版本需要将三个复现改成：冷 follow 由 Bot 创建/恢复且下一轮使用最新配置；配置应用期间 page/follow 在返回内容前拒绝；配置成功后相同 Session 可继续跟随，已打开的 follower 不会长期阻止保存。还需覆盖命令、upload 和 Typert lookup 的交错、子 Agent 归属，以及新错误码的客户端传递。尤其要验证 lookup 返回后、实际方法仍在执行时，配置替换不会提前销毁其 Agent；长历史流的租约只覆盖开场。

这些路径中，当前自动化实际验证的是表内三个缺口及既有 Bot/Runner 契约。upload、其他 lookup、所有权策略接口草案尚未完成扩展后的行为验收；真实模型、非 macOS 环境与成品交付不在本次兼容性结论内。优先等待或提供包含上述委托的上游发行版，固定同一版本的 DSH 依赖后再启用；未经验证的兼容补丁不进入正式 profile。
