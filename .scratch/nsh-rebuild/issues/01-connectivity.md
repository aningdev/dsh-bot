# 01：NSH 连接官方 dsh web 的真实协议闭环

**What to build:** 用户在 NSH 中连接隔离运行的官方 dsh web，能看到已认证的连接状态、读到后台目录，并观察事件流、审批和取消的公开结果。保留旧产品入口，先证明新路径可行。

**Blocked by:** 无，可立即开始。

**Status:** done — 2026-02 在真实 NSH 与真实官方 dsh 上跑通全部验收项；证据见文末。

- [x] 记录实际运行的 dsh 版本、NSH 版本与使用的公开 npm 产物；不把参考提交当成发行产物。
- [x] 启动隔离官方进程，正确区分根页面 303 与 API connect 302；Cookie 仅存内存，不硬编码名称。
- [x] 通过真实 NSH 完成 HTTP Remote、认证 WebSocket、事件流就绪、流取消及连接关闭；记录脱敏报文。
- [x] 用公开接口证明审批请求与答复可以在同一有效连接生命周期内完成；断线后重新认证，不自动重放写操作。
- [x] 证明不兼容版本或不支持的传输明确失败、保留用户草稿；必要的原生传输适配只承担网络能力。
- [x] 测试辅助进程、临时目录、订阅与连接均有超时、取消和清理；不读取或修改用户模型密钥。
- [x] 明确可复用的上游客户端范围及偏离原因；通过完整连通验收后才允许后续移除旧链路。

来源：已确认的产品蓝图、架构，以及[实施规格](../SPEC.md)。

## 验证记录

实测环境：官方 `dsh 0.2.1-rc.5`（用户安装，npm `@deepseek-ai/*` 同版本）、`nsh 0.2.0 (68531fb)`、macOS。隔离程序在 `.scratch/nsh-transport/`，运行入口 `bun .scratch/nsh-transport/run.ts`，最近一次退出码 0。

- 数据根为临时目录（`DSH_HOME` 隔离），官方进程监听 `127.0.0.1:0`，只从受控 stdout 解析 `dsh web: http://127.0.0.1:<port>/?token=…` 就绪行。
- 认证：`/connect?token=…` 返回 302 并下发 Cookie（根页面是 303，两者不混用）；无效 token 返回 401 且不下发 Cookie，失败显式可见。Cookie 只存在内存。
- 传输：NSH 标准 WebSocket 无法携带该 Cookie，因此用原生 Rust `tokio-tungstenite` 适配层（`tungstenite 0.28`）只承担网络能力；Mux/RPC 全部由官方 npm 客户端处理。
- 已通过：事件流 `ready` 与 generation 就绪；`session/modelCatalog` 返回真实目录（`deepseek-flash`、`deepseek-v4-pro`，默认 `deepseek-flash`）；`session/control` 首帧为 baseline 且独立取消；`session/create` + `selectModel`；`session/follow` 首帧为 snapshot。
- 审批：外部确定性 Messages 服务（`model-fixture.ts`，独立 node 进程，`DEEPSEEK_BASE_URL` 指向它）驱动模型请求 `bash`，客户端经 `agent.remote.$on('approval/request')` 拒绝；外部服务观察到 `is_error: true` 的 tool_result，证明答复在同一连接生命周期内生效，且未调用真实供应商、未向 Host 注入插件。
- 重连：销毁首个客户端后重新认证，`session/projections` 恢复原 Session，未重放 prompt。
- 清理：超时、SIGTERM→SIGKILL 兜底、临时目录删除、fixture 关闭均有覆盖；测试不读取或修改用户模型密钥（fixture key 为固定字符串）。

上游复用范围：`sdk.ts` 只重导出公开 npm 入口（`@deepseek-ai/cordis` 的 `Context`、`dsh-client-connection/client` 的 `installConnection`、`dsh-typert-registry`、`dsh-api-gateway/client`），以 Node export 条件预编译成 `sdk.js` 供 QuickJS 使用。偏离只有一处：网络层换成原生 socket，因为 QuickJS 无 WebSocket 且标准实现不能附加认证 Cookie；协议、重连、队列与日志仍归上游。

未覆盖：launchd 托管与登录加载（05）、真实模型质量与真实供应商调用（另验收）、移动端与签名交付（06 之外）。
