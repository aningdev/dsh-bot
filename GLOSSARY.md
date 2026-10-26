# dsh-bot

本术语表定义 dsh-bot 的产品概念，并区分 DeepSeek Harness 的执行概念。英文名称用于文档、类型与接口，中文用于解释；产品概念不改变上游同名概念的含义。

## 产品与多端

**Bot（助手档案）**：具有稳定身份、名称、工作区与默认执行配置的助手档案，持有该 Bot 唯一的持续对话。
_Avoid_：Agent、Bot template、独立进程

**Bot template（Bot 模板）**：创建 Bot 时用于具体化初始配置的内置模板；创建后的 Bot 独立拥有这些配置，不随模板更新而改变。
_Avoid_：共享可变配置、Harness Agent preset

**Bot configuration（Bot 默认配置）**：由 Bot 持有、用于初始化该 Bot 对话的模型选择、指令、能力与默认工作目录。
_Avoid_：模板引用、插件代码快照

**Conversation（对话框）**：每个 Bot 唯一的持续聊天窗口，在同一消息流中容纳多段执行历史；它不决定后台的执行结构。
_Avoid_：会话列表、新建会话、Harness Session、单次模型请求

**Bot memory（Bot 记忆）**：由用户维护、按 Bot 共享的长期事实，在模型请求中注入且不由系统自动读写。
_Avoid_：对话历史、自动摘要、检索索引

**Conversation configuration（对话配置）**：Bot 首次打开时由 Bot 默认配置与用户选择具体化、之后保持固定并只能在空闲时显式应用的执行配置。
_Avoid_：可变默认配置、凭据副本、插件代码快照、每会话配置

**Runner（后台执行宿主）**：独立于交互客户端存活、承载 Harness 并管理 Bot 与执行连接的后台运行单元。
_Avoid_：Bot、客户端设备、自建 Agent 执行引擎

**Client（交互客户端）**：向 Runner 提交用户操作并展示执行状态的桌面或移动应用。
_Avoid_：Runner、独立 Agent

**Device identity（设备身份）**：Runner 用于区分已配对交互端，并分别授权和撤销其访问的独立身份。
_Avoid_：用户账号、网络连接、Bot 身份

**Pairing（设备配对）**：用户确认一个新交互端可以连接指定 Runner 并获得相应访问权限的过程。
_Avoid_：模型凭据配置、Relay 登录

**Relay（连接中继）**：在不同网络间为 Client 与 Runner 转发连接和加密业务内容的中间设施，无法读取聊天正文、工具结果与审批内容。
_Avoid_：Runner、执行状态权威、模型服务

## Harness 执行

**Harness（执行框架）**：DeepSeek Harness 提供的插件装配、Agent 执行、会话持久化和能力服务体系。
_Avoid_：Bot、客户端、应用自建调度器

**Agent（运行中的执行实例）**：在 Harness 中处理输入、调用模型与工具的活动执行实例，其执行记录属于 Session。
_Avoid_：Bot 档案、Agent 预设、独立进程

**Session（执行会话）**：保存执行历史与持久状态的 Harness 会话，其身份可以跨应用重启保留。
_Avoid_：持久化会话集合、产品聊天入口、客户端缓存

**Session event（会话事件）**：Harness 会话日志中的持久记录，可表示输入、回复、工具活动或其他执行事实。
_Avoid_：尚未发送的草稿、临时回复片段

**Turn（轮次）**：一次从接纳输入到模型与工具停止工作或策略终止的执行过程，可以包含零个或多个 Step。
_Avoid_：一次模型响应、工作目标完成

**Step（执行步骤）**：一次模型请求及该响应引起的工具执行。
_Avoid_：Turn、用户工作目标

**Agent preset（Harness 运行时预设）**：Harness 中具名的 Agent 指令与可用能力组合，包含工具选择。
_Avoid_：Bot template、Bot 档案、模型预设、权限预设

**Working directory（工作目录）**：执行工作时用于解析相对路径的本地目录，选择目录本身不授予文件访问或命令执行权限。
_Avoid_：目录沙箱、文件权限范围

**Tool approval（工具审批）**：对一项需要授权的待执行工具操作作出的允许或拒绝决定；本次允许不授权后续操作。
_Avoid_：永久授权、预设选择

## 桌面呈现

**Theme preference（主题偏好）**：用户选择的浅色、深色或跟随系统偏好；缺失或无法识别的保存值表示跟随系统。

**Appearance（当前外观）**：用户当前看到的浅色或深色外观；跟随系统时随系统偏好变化。

**Window state（窗口状态）**：单个应用窗口的平台与全屏状态。

**Panel（面板）**：主内容两侧可选的区域，折叠后保留此前的展开宽度。
