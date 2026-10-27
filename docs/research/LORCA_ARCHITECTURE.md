# Lorca 常驻后台与多端机制调研

研究基线：[egoist/lorca](https://github.com/egoist/lorca/tree/d14a7a64d8ba9d16543123df82de145a0b5bc96a)，固定提交 `d14a7a64d8ba9d16543123df82de145a0b5bc96a`，本地参考位于 `references/lorca`。本文基于文档和源码静态核验，没有运行 Lorca 或验证其服务、密码学和手机行为。产品取舍以[架构文档](../ARCHITECTURE.md)与[产品蓝图](../BLUEPRINT.md)为准。

## 结论与借鉴范围

Lorca 提供两条生命周期路径：桌面持有 CLI，或者系统服务独立托管 CLI。关窗留驻依赖桌面应用仍在运行；独立服务才脱离桌面进程。多端采用设备身份、签名加密信封、密文存储转发和增量同步，允许重复传输、接收端去重，但不保证业务恰好执行一次。

本项目采用它作为后续多端的主要机制参考：借鉴配对、撤销、加密传输、离线同步、确认分层和手机前台恢复。继续保持常驻薄 Rust 宿主、唯一官方 `dsh web` 与官方客户端协议；不引入 Lorca 自有 Agent 引擎、聊天 API 或全账号复制模型。

## 常驻、启动与退出

| 场景 | 已核对的机制 | 证据 |
| --- | --- | --- |
| 关闭桌面窗口 | macOS 或存在托盘时，`keepsRunning()` 返回真，应用继续运行 | [桌面应用](../../references/lorca/desktop/app.go)，`keepsRunning`；[桌面入口](../../references/lorca/desktop/main.go) |
| 桌面退出 | `willTerminate()` 调用 launcher.stop；启动的 CLI 带 `--parent-pid`，父进程消失时清理并退出 | [应用退出](../../references/lorca/desktop/app.go)、[launcher](../../references/lorca/desktop/launcher.go)、[CLI](../../references/lorca/crates/cli/src/main.rs) 的 `watch_parent` |
| 独立常驻 | `lorca service install` 安装系统管理的服务；macOS LaunchAgent 设置 `RunAtLoad`、`KeepAlive`，Linux user unit 设置 `Restart=always`、`RestartSec=2` 并启用 lingering | [service 实现](../../references/lorca/crates/cli/src/service.rs) |
| 就绪发现 | 桌面先探测既有服务；新进程以 `--ready-stdout` 启动，等待就绪信息后连接 | [launcher](../../references/lorca/desktop/launcher.go)；[桌面架构说明](../../references/lorca/docs/architecture/desktop-app.md) |
| 客户端断线 | 当前 pending 请求以连接丢失结束，客户端退避重连；该层不重放请求 | [客户端](../../references/lorca/desktop/client.go) 的 `dropped`、`scheduleReconnect` |
| 进程停止 | 信号处理和父进程监测清理 shell、coding agent 与 browser；不等于聊天 Stop | [CLI](../../references/lorca/crates/cli/src/main.rs) 的 `stop_on_signal`、`watch_parent`；[停止语义](../../references/lorca/docs/architecture/stopping.md) |

本机客户端拨号超时为 5 秒，重连间隔从 400 ms 乘以 1.6，最多 5 秒。父进程监测每秒一次，但后续清理需要等待，不能称为一秒内退出保证。固定端口有响应也不能证明实例版本、数据根与进程所有权。

对本项目的对应关系是 `launchd → Rust Host → dsh web`：UI 关闭只断开连接，Host 继续运行。系统监督、子进程监督与客户端重连分别负责不同失败；显式停止必须与自动崩溃恢复区分。Lorca 的桌面父进程联动不能直接绑定到 NSH，否则违背 UI 退出后继续执行的产品规则。既有 Waku guardian、生命周期锁和 generation 方案继续有效。

## 设备身份、配对与撤销

[身份设计](../../references/lorca/docs/architecture/identity.md)区分身份密钥与每设备密钥。普通配对设备获得账号内容密钥及 keyring，不获得身份 master secret。身份设备可以签发新 keyring，撤销设备排除在后续密钥分发之外，见 [identity.rs](../../references/lorca/crates/cli/src/identity.rs) 的 `rotate_if_due`、`forward_keyrings`。

[配对实现](../../references/lorca/crates/cli/src/pairing.rs)使用含 relay 地址、身份公钥、临时加密公钥及 nonce 的配对串。加入设备向临时公钥密封请求，并提供随机 `reply_key`；邀请设备登记新设备后，用该密钥加密回复。加入设备核对回复身份与配对串一致。文档规定配对有效期十分钟。可信传递配对材料是安全前提，不能把“知道 relay 地址”当作授权。

撤销同时依赖 relay 拒绝旧身份和客户端持久拒绝旧发送者；[信封实现](../../references/lorca/crates/cli/src/envelope.rs)检查 `unpaired` 与已知设备。撤销不能收回旧设备已有的历史明文与旧密钥，轮换需要身份设备在线；持有 master 的设备也不能仅靠撤销条目彻底失去身份权限。具体限制见[Relay 信任分析](../../references/lorca/docs/architecture/relay-trust.md)。

Lorca 已配对设备的账号能力较宽。本项目仍要求手机只读 Bot 快照，禁止修改 Bot 注册表与共享供应商配置；设备信任不能直接等同于后台 owner 权限。

## 加密与 Relay 信任边界

[crypto.rs](../../references/lorca/crates/cli/src/crypto.rs)中的账号记录使用 `XChaCha20Poly1305`，随机 24 字节 nonce，记录类型作为关联数据。设备间操作另使用签名信封再密封给接收设备，不能只靠公钥加密证明发送者。

[envelope.rs](../../references/lorca/crates/cli/src/envelope.rs)将 `identity/kind/from/to/id/at/body` 纳入签名，域分离值为 `lorca/envelope/v1\0`。接收端验证账号、类型、收件设备、已知且未撤销的发送者、签名、时间窗口和去重记录。`request/response` 最长一小时，`job/job_cancel/job_result` 最长八天；允许领先一小时的时钟偏差。这些是 Lorca 参数，不直接作为我们的默认值。

Relay 仍可见设备公钥、记录类型、大小、时间、序号、收件设备、在线状态等元数据，可以扣留、延迟或重放数据。旧账号记录重放、恢复时扣留最新 keyring 等限制在其信任分析中有明确说明。Lorca 的 hosted receivers 还会接触 webhook 明文，不属于本项目“Relay 仅处理密文”的范围。机制与例外见[Relay 文档](../../references/lorca/docs/architecture/relay.md)和[信任分析](../../references/lorca/docs/architecture/relay-trust.md)。

## 离线同步、去重与确认

| 层次 | Lorca 机制 | 本项目需要保留的区别 |
| --- | --- | --- |
| 变化通知 | WebSocket 提示有变更，再以 HTTP 拉取；文档说明提示队列可丢弃 | 提示不是持久事件，不按通知次数推导完整交付 |
| 上传与拉取 | SQLite 保存 outbox、`last_seq`；按游标拉取，稳定 blob ID 用于上传重试 | 同一传输项重试不等于重新提交 dsh 输入 |
| 防重放 | 内层签名信封 ID 与发送者持久去重，外层 blob ID 改变不能绕过 | 去重确认不代表副作用已完成 |
| 接收后崩溃 | 先登记信封再执行业务；退出后同一信封不再执行，调用方可能超时 | 不承诺恰好一次或必然完成；保留结果待核对状态 |
| 保留期限 | 文档说明定向信封七天后清扫，不活跃身份默认 365 天清理 | 任意长离线后的完整恢复不受保证 |

直接实现依据：[sync.rs](../../references/lorca/crates/cli/src/sync.rs) 的 `drain_outbox` 与按 `last_seq` 拉取；[local_store.rs](../../references/lorca/crates/cli/src/local_store.rs) 的 outbox、`opened_envelopes` 表与 `remember_envelope`；[envelope.rs](../../references/lorca/crates/cli/src/envelope.rs)在返回业务载荷前写入去重记录。保留期限和整体协议承诺来自[协议文档](../../references/lorca/docs/architecture/protocols.md)与[信任分析](../../references/lorca/docs/architecture/relay-trust.md)，没有通过故障注入验证。

未来至少区分四种状态：本机待发送、Relay 已接收、dsh 已接纳、业务结果可见。Relay 的存储确认、bridge 收到信封和 dsh 接纳各有独立边界。尤其“bridge 已转交 dsh，但答复丢失”必须按 Session 与请求标识核对，不能由 outbox 重试自动变成第二次业务提交。

## 手机生命周期与本项目差异

Lorca 手机包含本地 core 和设备密钥，具有账号写能力；其文档也涉及共享凭据同步与通知扩展的 Keychain。我们目前规定手机密钥与令牌只存内存、冷启动重新验证，Bot 注册表及共享模型设置只由桌面管理。这些规则保持不变，不能因参考 Lorca 自动引入持久设备凭据、账号恢复或手机设置管理。

Lorca 文档通过 `wake_sync` 在回到前台时显式拉取和 ping，重建可能失效的 HTTP 连接池；不能据此宣称手机后台 socket 可以持续运行。推送是独立提醒通道，Relay 接受推送排队不代表设备收到或用户已读。我们未来需实际验证冷启动认证、前台恢复、游标补齐、断线未确认输入与审批竞争。

## 后续协议设计与验证

1. 设计短期配对材料、每设备授权及撤销；明确内存密钥策略下冷启动如何重新验证。
2. 绑定设备身份、请求标识、方法、资源和会话归属，验证官方协议的连接与 Peer 隔离，不增加统一聊天 API。
3. 明确帧签名、时钟偏差、防重放、存储上限与过期策略；传输重试和业务重提分开。
4. 验证 bridge 在转交前、转交后和接纳确认后崩溃的恢复，不能将宿主重启或 Relay ACK 当成业务恢复成功。
5. 在真实手机验证后台挂起、回到前台、冷启动、撤销、旧审批答复和长时间离线。

本轮只完成固定参考添加与静态研究，不实现 Host、bridge、Relay 或移动端，也不改变既有产品权限和密钥存储规则。Lorca 采用 GPL-3.0；这里借鉴设计机制，未复制其源码进入产品。
