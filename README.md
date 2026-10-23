# dsh-bot

由 Bun 管理的独立多工作区项目，开发基于 DeepSeek Harness 的 Bot 工作台。当前包含 Electron 桌面应用与固定版本的 Harness npm 运行时；独立 Bot 后台和移动客户端尚未实现，目标见 [产品蓝图](apps/dsh-bot/PRODUCT_BLUEPRINT.md)。

## 工作区

| 路径                                                           | 职责                                   |
| -------------------------------------------------------------- | -------------------------------------- |
| [apps/dsh-bot](apps/dsh-bot/README.md)                         | Electron 桌面界面、原生能力与现有 IPC  |
| [packages/harness-runtime](packages/harness-runtime/README.md) | 固定版本的 Harness npm 依赖与 CLI 入口 |
| [references/deepseek-harness](references/README.md)            | 官方源码 Git submodule，仅作参考       |

目标工作区、进程关系与实施顺序见 [架构与工作区方案](apps/dsh-bot/PROJECT_LAYOUT.md)。共享包放在 `packages/`，有实际消费者或独立装配需求时提取；参考子模块不属于 Bun workspaces，也不是应用构建输入。

## 开发

使用 [`.node-version`](.node-version) 指定的 Node.js 与当前稳定版 Bun，在仓库根目录执行：

```sh
bun install --frozen-lockfile
bun run dev
```

依赖只在根目录统一安装并由根 `bun.lock` 锁定。Bun 用于依赖和脚本管理，桌面运行时仍为 Electron；`bunfig.toml` 使用 hoisted 安装。Forge 8 的 Bun 锁文件识别兼容补丁由 Bun 自动应用，原因与移除条件见 [patches/README.md](patches/README.md)。

```sh
bun run check
bun run test:unit
bun run package
bun run test:e2e
bun run test:smoke
```

`test:e2e` 会先构建桌面产物，`test:smoke` 检查当前产物；完整验证用 `bun run test:all`。桌面详情、签名与发布说明见 [应用 README](apps/dsh-bot/README.md)。

使用 VS Code 时以仓库根目录打开项目。[工作区设置](.vscode/settings.json) 将 Vitest 扩展指向桌面应用的 `vite.config.ts`，并排除 `references/` 中的上游配置和测试脚本，避免加载未安装开发依赖的参考子模块。桌面 E2E 使用 Playwright，仍通过 `bun run test:e2e` 运行。

## Harness 运行时

```sh
bun run harness --version
bun run harness --help
```

`packages/harness-runtime/package.json` 是引擎版本的权威来源。引擎与插件通过 npm 公开入口消费，应用自定义能力通过插件、bundle 和命名 profile 组合；仓库中的参考源码不替代安装依赖。当前 CLI 可用不代表独立 Bot 后台已接入。

## 参考源码

克隆产品本身无需下载参考子模块；需要阅读上游源码时执行：

```sh
git submodule update --init references/deepseek-harness
```

子模块固定到提交，更新方式与职责见 [references/README.md](references/README.md)。产品的 Git 历史保留迁移前的记录，当前工作树只维护应用、运行时工作区与参考指针。

## 产品与接入设计

- [领域术语](apps/dsh-bot/GLOSSARY.md)
- [产品蓝图](apps/dsh-bot/PRODUCT_BLUEPRINT.md)
- [Harness 配置接入探索](apps/dsh-bot/HARNESS_INTEGRATION.md)
- [架构与工作区方案](apps/dsh-bot/PROJECT_LAYOUT.md)
