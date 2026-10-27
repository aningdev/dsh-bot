# 05：launchd 托管官方后台与当前进程发现

**What to build:** 用户打开桌面能够找到受 launchd 管理的兼容后台，关闭 UI 后已接纳工作继续；显式停止保持停止，异常退出可诊断并受控恢复。

**Blocked by:** 01：NSH 连接官方 dsh web 的真实协议闭环。

**Status:** done — 已在本机 LaunchAgent 与实际进程上完成验证，证据见文末；验证后已卸载，数据与日志保留。

- [x] LaunchAgent 使用官方 dsh 绝对路径、独立 DSH_HOME 和回环监听；不携带 Node，不自建运行时解析。
- [x] 从受控日志识别当前启动的 ready 行并验证认证，拒绝旧启动记录，限制含 token 日志访问。
- [x] 处理日志轮转、进程重启、安装路径变化和异常退出；失败可见、重启有效节流。
- [x] 检查实际运行版本；不兼容保留草稿并阻止发送，不自动升级或降级。
- [x] 关闭窗口不停止后台；显式停止与取消当前执行分开，bootout 后保持停止。
- [x] 验证安装、启动、状态、停止与卸载，只管理本产品服务；RunAtLoad 与登录加载分别记录，不新增开机自启产品功能。
- [x] 对实际进程验证数据根、日志、恢复和清理，不仅测试生成的 plist 文本。

来源：已确认的产品蓝图、架构，以及[实施规格](../SPEC.md)。

## 验证记录

实现：`scripts/backend/launchd.ts`（plist 渲染、版本守卫、ready 行识别、日志权限与轮转、launchctl 查询）、`scripts/backend/cli.ts`（install/start/status/stop/uninstall）、`scripts/backend/pin-version.ts`（唯一写入受支持版本）、`scripts/backend/launchd.test.ts`。根 `package.json` 增加 `backend` 与 `test:backend`。

单元测试 `bun test scripts/backend/launchd.test.ts`：7 通过 0 失败，覆盖版本守卫（不一致即报错且声明不自动升降级）、plist 不含密钥且 `RunAtLoad=false`/`KeepAlive.SuccessfulExit=false`、只认最新 launch 标记下的 ready 行、未标记 ready 行不可信、token 脱敏、安装路径缺失报错、日志轮转保留旧日志。

真实进程验收（本机 macOS，官方 `dsh` 位于 `/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh`，`DSH_HOME=~/.dsh-bot`，日志 `~/Library/Logs/dsh-bot/backend.log`）：

- `install`：写入 `~/Library/LaunchAgents/dev.dshbot.backend.plist`（0600），日志目录 0700、日志文件 0600；plist 无模型密钥。
- `start`：经 `launchctl bootstrap` 启动，读到 ready 行并验证认证（302 + Cookie），输出端口与脱敏 URL。
- `status`：Loaded=是、PID 存在、ready 行认证有效；数据根生成 `profiles/`、`storages/`。
- 异常退出：`kill -9` 后台进程后 KeepAlive 在节流窗口内重启（新 PID、新端口、新 token 认证有效），旧 token 返回 401 且旧端口不复用，证明旧 ready 行不会被当成当前事实。
- `stop`：`launchctl bootout` 后等待 job 真正消失再报告，12 秒后仍保持停止（不被 KeepAlive 复活），plist 保留；`status` 返回退出码 1 并标注 ready 行为旧进程。
- 再次 `start` 可正常恢复；`uninstall` 移除 plist 并确认 job 已消失，保留 `~/.dsh-bot` 与日志。
- 卸载后复查：LaunchAgent 不再加载、无遗留 `dsh web` 进程。

未覆盖：关闭窗口与审批重连依赖客户端（02/03），登录自动加载产品功能本轮不做；版本不兼容时阻止发送依赖客户端组件（在 02/03 的客户端侧验收）。
