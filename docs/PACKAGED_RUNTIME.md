# macOS 随包 Runner 运行时

对应 [Issue #12](https://github.com/zhuxining/dsh-bot/issues/12)，后台管理见 [Runner 服务](RUNNER_SERVICE.md)。当前已实现原生 macOS 构建资源和自动化验证，尚未完成干净目标机、真实模型与实际登录验收，不能据此关闭 #12 或宣布首版交付。

## 组装和边界

上游 [`prepare-runtime.ts`](../references/deepseek-harness/apps/desktop/scripts/prepare-runtime.ts)、[`prepare-primary-runtime.ts`](../references/deepseek-harness/apps/desktop/scripts/prepare-primary-runtime.ts) 和 [`prepare-runtime-manifests.ts`](../references/deepseek-harness/apps/desktop/scripts/prepare-runtime-manifests.ts) 已有运行时准备流程，但面向其源码工作区和官方桌面 Host。本项目保留自己的 Runner/profile 与 npm 依赖，不复制上游桌面实现、不从参考目录导入。实际组装见 [`prepare-runner-runtime.ts`](../apps/desktop/scripts/prepare-runner-runtime.ts)。

Forge `prePackage` 先执行正常 Runner/Bot build，再准备资源；不调用 `build:test`，不复制测试模型、产品源码或 `references`。发布产物包含：

```text
Contents/Resources/runner/
  bin/node                       独立 Node 可执行文件
  NODE_LICENSE                   对应 Node 许可
  apps/runner/package.json       profile 安装锚点
  apps/runner/lib/               Runner 正常构建
  node_modules/.store/           npm 生产依赖和产品运行时包
  runtime.json                   目标、版本、锁文件摘要、补丁列表和依赖清单
```

- Node 固定为 **24.15.0**，来自 `nodejs.org/dist` 的原生 macOS tar.gz；下载后校验固定 SHA-256，再提取 Node 与许可。缓存位于根 `.cache/node`，校验失败删除缓存并终止打包。
- arm64 摘要：`372331b969779ab5d15b949884fc6eaf88d5afe87bde8ba881d6400b9100ffc4`；x64 摘要：`ffd5ee293467927f3ee731a553eb88fd1f48cf74eebc2d74a6babe4af228673b`。本机只验证了 arm64。
- Runner 显式依赖其安装锚点需要的 `dsh-base`；从 Bun 已安装且已应用兼容补丁的生产图递归复制 dependencies、peers 和实际存在的 optional dependencies。每个物理包保留自己的依赖解析边，并在资源根提供同名解析入口，支持原生模块加载器动态解析调用方声明的 optional 包。缺少必需依赖立即失败，devDependencies 不进入遍历。
- 产品工作区只复制清单、构建和 bundle 声明；第三方包保留其运行资源，包括动态加载文件、原生二进制与许可。不会在用户机器运行包管理器或安装脚本。
- 包间使用资源内部的相对链接。Packager 默认额外资源复制会把链接改为指向构建缓存的绝对路径；`afterCopyExtraResources` 在签名前用 `verbatimSymlinks` 重新复制，确保移动后仍能解析。
- `runtime.json` 记录根 `bun.lock` SHA-256、已声明补丁与实际复制包的名称和版本；它用于构建追踪，不替代代码签名或完整性证明。
- 只接受在目标 macOS 架构本机构建，拒绝跨架构原生依赖与非 macOS 打包。CI 保留三平台单元测试；成品 E2E、冒烟和发布只针对 macOS。Windows/Linux 成品尚未提供。

后台运行仍为独立 Node，不使用 Electron RunAsNode，也不放开 Electron 的 Node 选项或调试 fuse。Main 校验并复制资源到用户 home 内独立的版本目录，launchd 使用该目录内的绝对 Node 和入口，PATH 只含该版本的 `bin` 与系统基础目录。更换应用不会改写运行中的依赖；重新打开新桌面后通过「更新后台」先停止并等待旧进程，再切换运行时。时序、失败行为及验证边界见[恢复与更新](RUNNER_RECOVERY.md)。

## 验证入口和现有证据

在根目录执行 `bun run package` 或 `bun run make` 组装成品；`bun run test:smoke` 不重新构建，读取当前应用。

[`smoke-runner.ts`](../apps/desktop/scripts/smoke-runner.ts) 先检查所有依赖链接均留在资源内，再原样复制到包含空格的临时目录。在全新 home、无开发环境变量和不含开发 Node/Bun/pnpm 的 PATH 下，使用复制后的 Node 启动正式 profile，等待私有 IPC `ready`，请求正常关闭并确认退出码为零。原生应用和 renderer/IPC 冒烟仍由原脚本执行。

本机 arm64 的后台 E2E 使用同一成品资源，移除桌面进程开发工具 PATH，验证安装、启动、退出桌面后 PID 不变、重开连接到同一进程、主动停止与卸载。测试使用隔离 home 和 label，最终移除 job 和测试文件，不修改正式后台。

迁移检查先后发现并修正了 Packager 的绝对链接、安装锚点缺少显式 bundle 依赖，以及原生动态加载器需要根解析入口的问题。修正后的独立目录冒烟与正式运行时后台 E2E 均已通过；E2E 在退出桌面前等待实际发布的私有连接描述，重开后通过界面读取 Bot 列表，不把 launchd 已有 PID 当作 API 就绪。现有 Bot、工具、审批和停止 E2E 使用确定性模型及测试 fixture，不能等同于无开发依赖的真实模型验收。

仍需完成：没有开发环境的目标机首次创建、真实 DeepSeek 对话、工具审批与停止；目标 Node 下所启用原生工具的行为；签名/公证及 Gatekeeper 安装；x64 构建运行；实际注销登录；#13 的升级和崩溃恢复验收。原生全屏的既有失败另行跟踪，不能把成品测试报告为全绿。未推送、发布或写入 GitHub Issue 验收结果。
