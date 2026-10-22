# dsh-bot 开发规范

本目录用于开发基于 DeepSeek Harness 的独立 Electron 桌面应用。共同规范见 [根 AGENTS.md](../../AGENTS.md)；本文件补充应用开发、依赖管理与上游同步要求。

## 改动范围与上游同步

- 优先将应用代码、配置、测试和文档放在本目录，通过已有 SDK、插件和 profile 扩展 DeepSeek Harness。
- 修改上游已有代码或根公共配置前，先检查能否在应用内实现；确需修改时保持范围最小，并将上游修改与应用功能分开提交，便于同步时审查和处理冲突。
- 不为复用功能复制整套上游源码，不将本机路径、密钥或安装产物提交到仓库。

## 包管理与 DSH 接入

- 仅使用 pnpm，版本以本目录 `package.json` 的 `packageManager` 为准。应用是独立 pnpm 工作区，被根工作区排除；依赖和锁文件由本目录维护，不使用 Bun、npm 或 Yarn 安装依赖。
- 保留本目录 `pnpm-workspace.yaml` 的 `nodeLinker: hoisted`，满足 Electron Forge 的依赖布局要求，不为应用修改根工作区的依赖布局。
- 添加或升级依赖时，同时提交本目录 `package.json` 和 `pnpm-lock.yaml`；不手工编辑锁文件。仅允许实际需要的依赖构建脚本。
- 优先通过已发布的 DSH 包接入运行时，明确固定经过验证的版本；相关 DSH 包保持版本兼容，不依赖默认发布标签。当前应用尚未接入 DSH。
- 独立工作区不能直接使用 `workspace:*` 引用根工作区包。需要联调本地源码时，先评估其传递依赖和打包方式，再确定接入方案。
- DSH 运行时接入遵循上游 profile 启动机制。SDK 和运行时管理放在主进程或专用后端进程，通过受控 IPC 向界面提供能力；应用退出时关闭自己启动的后端进程。

## 应用代码

- 沿用现有 Electron Forge、React、TypeScript、Vite Plus、oRPC 和 i18next 配置，新增功能优先复用现有组件与 IPC 机制。
- 保持 Electron 上下文隔离；渲染进程通过 preload 暴露的受限接口访问系统能力，不直接暴露 Node.js、凭据或任意命令执行入口。
- 用户可见文案通过现有国际化资源管理；跨进程输入在接收端校验，错误在负责处理的层提供可操作的反馈。
- 不批量格式化无关文件，不修改生成的路由文件或构建产物；行为、配置和开发命令变更同步更新相关文档。

## 开发与验证

以下命令均从仓库根目录执行：

```bash
pnpm --dir apps/dsh-bot install --frozen-lockfile
pnpm --dir apps/dsh-bot run start
pnpm --dir apps/dsh-bot run test
pnpm --dir apps/dsh-bot run package
```

- 添加运行依赖使用 `pnpm --dir apps/dsh-bot add <包名>`，开发依赖追加 `-D`。
- 只读检查使用 `pnpm --dir apps/dsh-bot exec vp check`；现有 `run check` 脚本包含 `--fix`，会修改文件，执行后须检查改动范围。
- 根据改动运行最小相关测试；依赖、主进程、preload 或构建配置变更需验证打包。涉及 DSH 的功能还需验证真实后端启动、事件传递和关闭，不能仅凭界面或 mock 测试认定接入成功。
- 提交前检查差异和 `git diff --check`，如实报告通过、失败和未执行的检查，不顺带修复无关历史问题。
- 本目录内嵌的 `.github/workflows/` 不会被 GitHub 自动执行；启用应用 CI 时需接入仓库根工作流，并将任务范围限制到应用及其实际依赖。
