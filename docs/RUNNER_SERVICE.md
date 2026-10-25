# 用户级 Runner 服务

对应 [Issue #11](https://github.com/zhuxining/dsh-bot/issues/11)。桌面「后台服务」通过受控 oRPC 请求 Main 管理当前用户的 LaunchAgent；窗口退出只关闭客户端连接，不调用停止服务。

## 实现与上游依据

上游 [`host-process.ts`](../references/deepseek-harness/apps/desktop/src/host-process.ts) 以桌面子进程持有 Host，不满足独立存活要求。上游 [`macos-runner-service.sh`](../references/deepseek-harness/apps/desktop/scripts/macos-runner-service.sh) 管理 GitHub Actions runner，不是 Harness 产品后台。本项目复用原有 Runner profile、持久化与退出清理，新增本机 launchd 管理，不另建执行引擎。

launchd 行为依据本机 `man launchd.plist`、`launchctl help bootstrap`、`launchctl help bootout` 与 `launchctl help print`。产品实现位于 [`runner-service.ts`](../apps/desktop/src/main/runner-service.ts)，环境组装和惰性实例位于 [`runner.ts`](../apps/desktop/src/main/runner.ts)。

- 同一 Runner home 使用稳定 label：应用 ID 加 home 的 SHA-256 前 12 位。开发、测试、正式 home 可独立管理；重复 bootstrap 由 launchd label 保证单 job。
- 主配置保存在 `<home>/service/runner.plist`。单独安装只写配置，不启动后台，也不启用登录启动。成品桌面启动时先连接已有 Runner；连接不可用且没有明确停止标记时，自动安装、启动并等待就绪。开发环境仅在指定 `DSH_BOT_RUNTIME_ROOT` 时执行该流程。
- 启动先检查运行时文件，再 bootstrap 当前用户 `gui/<uid>`。重复启动读取既有 job，不使用会重启进程的 `kickstart -k`。
- `KeepAlive=true` 负责意外退出后的重新拉起；节流为 10 秒。模型执行、恢复和输入语义仍由 Runner/Harness 管理，不通过重发消息恢复。
- 主动停止使用 `bootout` 移除 job，并确认其不再加载且先前 PID 已退出。保留主配置并写入 `<home>/service/stopped`，重开桌面不会撤销主动停止；明确启动成功后移除标记；若已开启登录启动，下次登录也会启动。
- 登录启动通过 `~/Library/LaunchAgents/<label>.plist` 的配置副本控制。切换只更新文件，不改变当前运行或停止状态。两个副本以私有临时文件原子替换；重复安装会修复中断后尚未更新的登录副本。
- 卸载先停止 job，再删除两个 plist，保留 Bot、Session、凭据、连接目录与日志。
- 状态分别表达配置已安装、登录启动已开启、job 已加载和 PID。已加载但没有 PID 显示正在启动或等待恢复，不能据此声称连接已就绪。模型和认证连接就绪仍以 Runner 发布的私有连接资料为准。
- 运行时路径变化时，已加载的 job 拒绝替换，要求先停止。服务日志位于 `<home>/service/stdout.log` 和 `stderr.log`；连接凭据不通过管理 IPC 返回。

## 当前运行时边界

Main 默认从 `process.resourcesPath/runner` 准备随包资源，再复制校验到 `<home>/service/runtimes/<sha256>`，launchd 使用该独立目录内的 Node 和入口。桌面同一会话复用已校验的版本；替换应用后重新打开新桌面，再通过「更新后台」应用新版本。开发诊断可用绝对 `DSH_BOT_RUNTIME_ROOT` 指向同样布局；该变量仅由 Main 环境读取，renderer 不提供路径或命令。缺少运行时会返回可操作错误，不将写入文件视为成功运行。

**已实现随包 Node 与生产依赖资源。** 构建和迁移检查见[随包运行时](PACKAGED_RUNTIME.md)。本机 arm64 的桌面验收使用资源内 Node，移除开发工具 PATH 后验证安装、启停、关闭桌面后 PID 保持及重开，再卸载清理。「停止后台」和「更新后台」均需在界面确认。「更新后台」先停止、等待旧 PID 退出、备份应用数据，再替换启动配置和按原状态重启；备份失败时不继续更新，详见[恢复与更新](RUNNER_RECOVERY.md)。它不代替干净目标机、真实模型、实际登录和人工升级验收，此阶段不代表首次交付完成。

## 本机证据

以下为本机实际执行结果，不能替代干净目标机和实际登录会话验收：

- 确定性进程边界契约：未启用登录启动的安装保持停止；并发启动共用一个 job；主动停止后不再加载；登录副本可修复；关闭登录启动与卸载生效。它使用真实临时文件和受控 `launchctl` 边界，未模拟成真实系统验收。
- 打包桌面 E2E：打开后台管理查询状态；缺少运行时时安装明确失败，仍显示尚未安装，启动按钮保持禁用；Escape 关闭弹窗。
- 真实 launchd 开发进程验证：临时 home、独立随机测试 label、发布版依赖和标准 Runner profile；并发启动发布一个就绪 Runner，`SIGKILL` 后 launchd 拉起新 PID 和新连接实例，主动停止后保持卸载，再次启动发布新实例，最后卸载并清理测试配置。开启和关闭登录启动确实创建和删除当前用户的 LaunchAgents 文件；**未实际注销并重新登录**。
- 随包资源桌面 E2E：隔离 home 和 label，移除开发工具 PATH，安装并启动成品资源内 Node，关闭桌面后同一 PID 继续存在，重开查看运行状态，再停止、卸载并清理。正式 profile 的独立迁移启动与退出由成品冒烟验证。
- 登录开关的成品界面专项：停止状态开启后，真实 LaunchAgents 副本存在而 job 没有启动；重开桌面和升级后台后保持开启；停止后关闭，副本移除而 job 仍未加载。两项后台 E2E 通过，日志 `/tmp/dsh-bot-login-toggle-complete.log`。Checkbox 的状态等待 Main 写入完成，不使用点击即成功的断言；**该结果不包含实际注销与登录**。
- 开发进程异常恢复日志：`/tmp/dsh-bot-ticket11-launchd-manual-final.log`。首次 PID 5289，异常恢复 PID 5467，再次启动 PID 5523；卸载后 installed、loginAtStartup、loaded 均为 false。

审查分别核对工程规范和 Issue #11。两个 reviewer 子代理均因 `spawn /opt/homebrew/Cellar/node/26.12.1/bin/node ENOENT` 未启动，没有独立审查结果；主代理完成两轴检查，并修正了 handler 持有跨调用状态和登录副本重试恢复问题。

## 真实安装包手工验收

完成 #12 后使用交付安装包、独立验收 home 逐项记录；测试开发 Node 不计入这一组：

1. 在没有系统 Node/Bun/pnpm 的运行环境打开应用，安装并启动后台，确认连接就绪且能完成真实模型对话。
2. 退出桌面，确认已接纳的执行继续；重开恢复同一 Bot 的历史与状态。
3. 对该验收 job 的 PID 注入异常终止，确认新 PID 和新连接实例；不自动重发输入或重复工具。
4. 主动停止并等待超过重启节流间隔，确认 job 保持未加载；明确启动后恢复。
5. 开启登录启动，实际注销和登录后确认后台启动；关闭后再次注销和登录，确认不自动启动。不要用 plist 存在代替登录验证。
6. 重复点击启动和重开桌面，确认同一 home 只有一个 Runner；开发与正式 home 相互独立。
7. 停止后卸载服务，确认不再加载，配置和历史仍在；重新安装后保留同一 Bot/Session。
8. 按 #13 升级时序验证旧进程已退出后替换资源，历史保留，失败不会报告已生效。

结果尚未满足前，Issue #11 的安装包及登录验收保持未完成；GitHub 外部更新和发布不在本次授权范围。
