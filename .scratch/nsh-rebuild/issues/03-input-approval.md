# 03：排队撤回、未知输入核对、停止与审批

**What to build:** 用户在持续对话中发送、查看和撤回待处理输入，停止当前执行，处理有操作信息的审批；断线和归档不丢失既有工作。

**Blocked by:** 02：创建 Bot、唯一对话与重开恢复。

**Status:** done — 本地实现与真实 NSH / 官方后台验收通过；范围和审查修复见 [验收记录](../EVIDENCE.md)。未发布 GitHub。

- [x] 普通输入使用上游 next-turn，可查看队列、撤回尚未领取项，正确处理领取竞争。
- [x] 提交前持久保存 sessionId、requestId 与正文；未知结果只提供重新核对和复制，不自动重发或一键重试。
- [x] 核对覆盖 inbox、事件与必要历史分页；未查到不能直接推断未接纳，修改后另发须提示旧输入仍可能已接纳。
- [x] 停止保留尚未领取队列，区分取消接纳和停稳；再发提示原队列继续，不承诺竞争输入下持续暂停。
- [x] 审批展示工具名称、后台操作摘要及命令/路径/域名等目标，支持参数展开和允许/拒绝。
- [x] 无在线 UI 时允许等待重连；恢复 pending 审批，拒绝/取消/失效更新状态，断线不静默放行。
- [x] 归档阻止新输入、保留历史与既有执行和审批；归档区可观察工作、撤回和处理审批，取消归档继续原对话。
- [x] 验证请求取消、订阅关闭、竞争答复及本地未确认记录恢复与清理；不引入客户端执行队列或永久删除。

来源：已确认的产品蓝图、架构，以及[实施规格](../SPEC.md)。

## 上游契约（已从本机安装产物读到，供实现与验收对照）

审批走 Agent 作用域的 Remote Event waterfall，不是自建 HTTP 接口：

- 订阅：`ctx.remote.$on('approval/request', (request, next) => Promise<ApprovalOutcome>)`（`node_modules/@deepseek-ai/dsh-api-remotes/lib/types/remote-events.js:18` 声明 `{ event: 'approval/request', mode: 'waterfall' }`）。
- 结果全集：`'allowed-once' | 'rejected' | 'cancelled' | 'unavailable'`（`node_modules/@deepseek-ai/dsh-user-approval/lib/types/index.js:15`）；返回非法值会被 Host 归一为 `'unavailable'`（`dsh-user-approval/lib/index.js:176`）。
- 请求字段：`toolName`、可选 `callId`、`reason`、`displayReason`、`signal`（`dsh-client-ui-approval/lib/client.js:287-298`）。
- 未作答时调用 `next()` 表示交给下一个监听者；没有监听者时 Host 默认 `'unavailable'`，即“没有界面就等于拒绝”，与本产品“不得静默放行”一致。
- `signal` 中止要以 `'cancelled'` 结束，不能当拒绝以外的结果；同一时刻只有一条请求可作答，已被撤回或替换的请求不得再次答复（`dsh-client-ui-approval/README.zh.md`）。
- 审批策略 `approval/policy` 只有 `'ask' | 'never'`（`dsh-user-approval/lib/types/index.js:17`）；本产品使用 `ask` 并提供最小允许/拒绝界面。

因此 03 的最小实现：订阅该事件 → 展示工具名与后台给出的原因/目标 → 允许（`allowed-once`）或拒绝（`rejected`）→ 断线/中止时 `cancelled`；不新增自建审批端点，也不做持久授权。
