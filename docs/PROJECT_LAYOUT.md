# dsh-bot 工程与工作区

当前重建使用 Bun 多工作区：两个应用和一个运行时包，只维护根 bun.lock。NSH 运行客户端，Node 运行后台；Bun 负责安装与脚本调度。旧 Electron 工程已退出，完整设计见 [重建方案](NSH_REBUILD_PLAN.md)。

| 位置 | 责任 |
| --- | --- |
| apps/client | NSH TSX 三栏界面、连接、展示状态及平台适配 |
| apps/runner | Node 入口、命名 profile、Bot 产品插件与后台生命周期 |
| packages/harness-runtime | 同发行版精确依赖和基础服务 bundle |
| scripts | 实际需要的开发、构建、交付和验收脚本 |
| references | 固定上游参考，只读研究，不参与安装和构建 |

产品模块先在 apps/runner 内组织，不创建独立 bot、ui、shared、SDK、web、mobile 或 relay 包。出现实际复用或独立装配需求后再提取。客户端不导入后台实现；当前以官方 Cookie 认证加 HTTP/NDJSON 接入 Node 适配层，不单独提取契约包。

上游 Harness 用 pnpm 管理大量可发布包，本产品消费 npm 公开产物，保留独立 Bun 工程即可。Harness 已有认证、Remote、流式、Session、历史和队列；本产品补充 Bot 身份、多会话归属与固定配置。NSH QuickJS 无法直接满足官方 WebSocket 的认证头接入，本项目在 Node 侧提供必要的 HTTP/NDJSON 适配并调用官方 Session Controller，客户端显式管理官方 Cookie；不复制模型循环、队列或日志。

依赖与脚本以各 package.json 为准。Harness 直接依赖精确锁定到同一版本；内部依赖使用 workspace:*，各工作区声明自身真实依赖。根目录统一协调检查、构建与测试，不沿用旧任务图或旧 E2E。

macOS 产物由 `scripts/package-macos.ts` 组装官方 NSH 应用、内置 Runner.app 和已安装的生产依赖闭包，不携带 Node，不重新解析依赖版本。`scripts/node-launcher.sh` 通过用户登录交互 Shell 自动检测本机 Node，要求 24.9.0 或更新稳定版；开发客户端与成品助手共用此逻辑，不提供手动路径设置。Shell 解析失败或 Node 不满足要求时由客户端提示重新检测。`scripts/smoke-package.ts` 在迁移目录和受限 PATH 下验证本机 Node 检测、成品后台及 LaunchServices 助手启动。当前仅本机 Apple Silicon macOS 验证，正式签名、公证、新机器安装、真实模型和移动端仍待完成。
