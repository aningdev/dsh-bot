# Harness 配置接入探索

本记录针对 [产品蓝图](../BLUEPRINT.md) 中的 Bot 独立配置与空闲时即时生效要求，区分源码事实、本机组合实验和应用接入建议。实验使用模拟模型与真实 JSONL 持久化，不代表桌面、Remote/API 或安装包已经完成集成。

## 结论

每个 Bot 可以拥有稳定的运行时预设标识，并通过公开的 Agent create/resume setup 装配自己的配置。配置改变时，释放空闲 Agent 的句柄，再用同一 Session ID 恢复新的 Agent，可以保留历史并使下一轮使用新的工具、指令和模型；不需要重新启动整个 Runner。

上述核心机制不要求修改上游执行循环或持久化实现。应用已实现 Bot 生命周期所有权、配置事务、恢复与 Bot 接口操作互斥；现有 Web Session Controller 的自动恢复行为由 #5 单独处理。

## Bot 独立配置

创建 Bot 时将模板具体化为 Bot 自身的配置，以稳定 Bot ID 派生稳定运行时预设标识，例如 dsh-bot:<botId>。更新配置不改变这个标识，其他 Bot 拥有不同标识；模板名称与模板是否仍存在都不参与历史恢复。

Bot 配置解析为上游 PresetDefinition 的插件条目，注册与释放由应用 Cordis 插件的 effect 管理。进程服务继续由 profile 装配；需要服务隔离的预设提供者与消费者遵循上游同一 isolation group 的要求。Bot 名下的配置独立不等于所有服务都在进程内独立。

[AgentPresetRegistry.register](../../references/deepseek-harness/packages/preset/agent-preset-registry/src/index.ts) 接受配置并返回释放函数，重复标识会被拒绝。[mount](../../references/deepseek-harness/packages/preset/agent-preset-registry/src/index.ts) 将未发布 Agent 绑定到当前版本；旧 Agent 保留旧版本，注销声明也不直接撤销其已有绑定。修改 Bot 因而不能只覆盖预设声明。

恢复使用 Bot 保存的配置重新注册其稳定标识，再在 setup 中 mount。模型与参数通过公开 AgentOptions 和需要时的 installModelSelection 配置；后者还负责模型切换提示与下一次请求选择，不能让官方全局默认模型覆盖 Bot 自身选择。

## 同一 Session 上应用新配置

[AgentRegistry.create/resume](../../references/deepseek-harness/packages/core/agent/src/index.ts) 返回 AgentHandle，只有持有句柄的创建方可以执行完整销毁。ResumeAgentOptions.setup 在发布前装配新的 Agent 作用域；[AgentLoop](../../references/deepseek-harness/packages/core/agent-loop/src/index.ts) 使用 resumeSessionId 打开原持久日志，setup 成功后才发布。

#4 已在 BotController 和生成 Remote 中实现以下保存流程；Bot 与已挂载的标准 Session Controller 入口均由同一个所有者协调。

1. Runner 为该 Bot 独占处理此次配置修改，检查配置读取版本，阻止新的执行操作和冷恢复与替换过程交错。
2. 执行中立即拒绝修改，不等待当前任务结束后悄悄保存。检查 nextTurn、nextStep 和其他执行资源，不能在仍有待处理输入时销毁 Agent。
3. 解析并校验候选配置，尽可能提前验证模型、插件装配和服务引用；保留旧配置用于失败恢复。
4. 写入持久事务记录与候选配置，再次确认无待处理输入，在维护回调中发起旧 AgentHandle 释放、退出回调后等待日志写入完成、写句柄关闭和身份从活动注册表移除。
5. 替换该 Bot 的运行时预设声明，用原 Session ID 恢复新 Agent，在 setup 中挂载新配置并验证装配。
6. 新 Agent 就绪且 Session 持久化屏障完成后删除事务记录，才向客户端返回保存成功；应用期间查询保持返回旧配置，客户端仍显示同一 Bot 和聊天历史。
7. 应用失败时恢复旧配置及旧配置下的 Agent；若恢复也失败，停止该 Bot 的执行接纳并报告故障，不伪装成已生效。

销毁时上游会取消并清空 inbox，所以不能只检查公开 status === idle，也不能为了配置更新清空用户输入。上游 runMaintenance 能原子占用真正空闲阶段，且该阶段对外仍显示 idle；应用需要考虑维护操作。不能在 runMaintenance 回调里等待自己的 AgentHandle.dispose，因为销毁会等待维护结束。

保存成功后的即时生效表示新 Agent 已准备好，下一次执行使用新配置，不表示修改历史消息或为了应用配置立即发起模型请求。Agent 的进程内对象会更换，持久 Session ID 与聊天历史保持连续。

## Remote/API 接入约束

[Session Controller 的 Agent 控制器](../../references/deepseek-harness/packages/api/session-controller/src/agent.ts) 在内部 create/resume 后仅保留 Agent，没有向应用返回 AgentHandle。应用无法先让官方控制器任意创建 Agent，再取得其销毁能力。官方 agentPresets.select 只允许空白 Session，不能用于替换已经产生历史的会话；recompose 的公开说明同样限定为空白 Agent。

[历史跟随](../../references/deepseek-harness/packages/api/session-controller/src/history.ts) 对冷会话发送快照后可能触发后台恢复。模型选择接口还会写入官方默认模型，不直接等价于更新 Bot 的独立配置。

推荐应用 Bot 生命周期插件从首次创建开始持有所有 AgentHandle。复用官方查询、跟随、审批和输入能力时，所有会激活或修改 Bot 的入口都必须受同一个生命周期所有者协调，包括历史跟随触发的冷恢复、文件引用与上传等间接入口。不能只串行化保存按钮，也不能在配置替换窗口直接暴露未受协调的官方接口。

早期方案曾以运行时兼容补丁挂载标准 Session Controller，并由 Host 委托覆盖历史开场、后台 promotion、命令、lookup、方法使用与 upload。该方案连同其验证记录已随旧实现删除；当前实现不挂补丁、不生成 Remote，改由 `apps/runner` 的 `bot-product` 插件直接调用官方 `sessionController`，状态与拒绝规则见[架构文档](../ARCHITECTURE.md#5-配置保存的生命周期)。上游相关证据见[桌面 Host 调研](./DESKTOP_HOST_RESEARCH.md)。

## 当前 npm Runner 接入状态

#3 曾建立真实 Node Runner profile、标准 Bot 插件、生成 Remote、JSONL 与实际进程重启闭环。当前 profile 仍为真实 Node Runner 与 JSONL，但生成 Remote 与补丁版 Controller 已被 `bot-product` 插件取代；覆盖范围和操作命令见 [Runner README](../../apps/runner/README.md)。#4、#5 的配置事务、同一 Session 替换与 Controller 共存验证属旧实现证据，现仅保留结论于[生命周期原型记录](./agent-lifecycle-prototype.md)。

此前空回复的直接原因已通过 `agent/error` 定位为 adapter 精确模型元数据缺少 `id`、`name`，产生 `INVALID_MODEL_INFO`；修正后继续修复了历史字段、持久化读取及清理入口。原始失败基线保留在 [Desktop Host 调研](./DESKTOP_HOST_RESEARCH.md#3-实施前失败证据)，不与本次通过的契约测试混用。

## 此前源码工作区组合证据

临时组合实验使用现有预设贡献 fixture、MockAdapter 和真实 JSONL 持久化，在 macOS 上验证了以下结果。

- A、B Bot 使用相同初始能力、不同运行时预设标识，更新 A 后 B 工具集不变。
- A 完成第一轮后销毁 Agent，更换同标识的工具与提示词，再按相同 Session ID 恢复成功。
- 历史事件前缀保持一致，第二轮使用新模型，工具与提示词变为新配置，事件序号和轮次连续。
- 新装配失败时 Agent 不被发布；恢复旧预设后，同一 Session 可以恢复并继续对话。
- 最终日志从真实持久化读回，与内存中已提交事件一致。

初次运行相关测试因缺少本机原生 flock 模块失败；执行 pnpm run build:native-system 后，预设注册测试、Agent 恢复测试与首个组合实验合计 84 项通过。新增失败恢复实验后，单独执行两个组合实验，2 项通过。临时实验没有作为上游包变更保留。

这些早期实验仅证明公开机制可组合。当前 npm 接入另有上述 #3/#4 验证；标准 Remote/API 跟随跨 Agent 替换已有独立 npm 正向测试；真实模型、配置提交中途强制终止进程以及安装交付仍未验证。
