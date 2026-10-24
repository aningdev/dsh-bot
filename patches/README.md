# 第三方兼容补丁

根 package.json 的 patchedDependencies 与 bun.lock 管理补丁，安装时由 Bun 自动应用，不手动改写 node_modules。补丁的 diff 上下文保留上游原始空白，`.gitattributes` 仅对 `patches/*.patch` 关闭 Git 空白样式检查；应用正确性由冻结安装和相应行为测试验证。

## Session 生命周期接入

正式 Runner 需要 Bot 独占 AgentHandle，并让标准 Session API、间接 lookup 和上传遵守配置替换与清理顺序。固定 npm 基线没有这些 Host 接缝；以下五个补丁只补充委托与操作生命周期，产品策略仍由 `packages/bot` 实现。没有复制 Controller、改写执行循环或修改 Session 格式。

| 包                         | 增补内容                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| dsh-typert-protocol        | 每实例操作 guard registry，退出取消与等待、幂等释放和退役拒绝                                       |
| dsh-api-session-controller | Host 生命周期提供者，统一 Agent 解析、命令、历史开场与后台 promotion；外部所有者保留模型装配        |
| dsh-api-gateway            | 授权后、lookup 前取得窗口，完整等待解析并保留至方法、流清理及 RPC 编码完成                          |
| dsh-client-file-upload     | 上传操作 guard、外部普通 Session resolver 优先、带取消信号的原始 source factory 与 HTTP reader 取消 |
| dsh                        | `runProfile.beforeDispose` 在 Launcher 销毁插件树之前执行；退出与 fail-loud 共用同一个清理任务      |

`apps/runner` 在退出钩子中先停止接纳，排空间接调用与上传，再清理 Bot 资源。历史流首帧只释放配置占用，消费者仍受取消与排空管理；未开始读取的流也有关闭路径。流清理错误汇入退出结果，Launcher 清理失败或超时记录原因并以非零状态退出。仅增加 `inject` 不能保护整棵树并发销毁中的消费者。真实 Node/profile 正向测试、故障基线和范围见 [共存验证](../docs/SESSION_CONTROLLER_COMPATIBILITY.md)。

上游提供等价可消费接口后，统一升级同版 DSH 包、移除这五个补丁，并重新通过冷恢复、最新模型、长流跨替换、lookup 后使用、上传取消及 IPC/SIGTERM 退出测试。无提供者时 guard 保持原路径；当前产品不以缺失提供者的 profile 报告就绪。补丁只针对根锁文件中的发行版，不能将未经兼容验证的新依赖与它们混用。

## Typert generator 0.2.1-rc.2

发布版生成器只将工作区注册的 protocol 包或 ambient module 中的符号识别为 Remote 元数据。产品通过 npm 导入同版 protocol 时，原生成器报告 Bot 没有 Remote 方法，无法生成严格的 Host/Client 产物。

当前补丁只在现有符号识别处补充检查：声明所属的已安装 npm 包必须为 `@deepseek-ai/dsh-typert-protocol`。不按装饰器名称猜测来源，不修改生成格式，也不复制生成器。Runner 契约测试经生成客户端发起真实调用，并确认错误 wire 参数返回 `gateway/input-invalid`，验证严格描述已生效。

上游版本支持独立 npm protocol 后，移除此补丁，重建 Bot 并通过 profile、Remote、输入拒绝和进程重启测试。

## Electron Forge 8.0.1

core-utils 的 Electron 查找只识别 package-lock.json、yarn.lock 与 pnpm-lock.yaml。Bun hoisted 工作区将 Electron 安装在根 node_modules，应用目录查找不到它时，需要通过根锁文件定位依赖。

当前补丁仅向该查找列表加入 bun.lock 和 bun.lockb，不改变 Electron 版本选择或打包流程。打包 E2E 可验证应用子目录能够发现根 Electron；上游支持 Bun 锁文件后，升级并验证成品启动，再移除此补丁。
