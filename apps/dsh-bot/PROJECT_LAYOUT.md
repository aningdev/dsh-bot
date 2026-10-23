# dsh-bot 工程与依赖决策

本仓库是独立产品工程，由 Bun 管理 `apps/*` 和 `packages/*` 工作区，通过固定发行版 npm 包消费 DeepSeek Harness。上游源码作为 `references/deepseek-harness` Git submodule 保存，用于参考和兼容性研究。产品行为以 [产品蓝图](./PRODUCT_BLUEPRINT.md) 为准。

## 工作区与参考源码

| 位置                          | 责任                                |
| ----------------------------- | ----------------------------------- |
| `apps/dsh-bot`                | Electron 桌面交互、窗口、安全与 IPC |
| `packages/harness-runtime`    | 固定版本 Harness npm 依赖与 CLI     |
| `references/deepseek-harness` | 上游参考源码，不参与产品安装和构建  |

未来移动客户端加入 `apps/`，共享包在有实际消费者时放入 `packages/`。所有产品依赖在根目录安装，只维护根 `bun.lock`；根命令与 CI 不运行参考子模块的 pnpm 工作区。

Bun 使用 hoisted 安装，配合 Electron Forge 收集运行依赖以及 CI 中的根 node_modules 安装入口。Bun 负责包管理和脚本，Node/Electron 仍是实际执行环境。

## 选择独立项目的原因

dsh-bot 拥有自己的 Bot、配置、后台生命周期、桌面界面与未来移动客户端，产品变化通过 Harness 插件和公开服务扩展。独立消费发布包使上游跟进主要表现为依赖升级和兼容验证，避免持续维护整个上游工程与产品工具链的差异。

| 方式                       | 主要代价                                         | 选择                         |
| -------------------------- | ------------------------------------------------ | ---------------------------- |
| 继续在上游工作区中开发应用 | 共同维护上游根构建、依赖和测试规则，承担合并冲突 | 仅在经常修改上游核心时有优势 |
| 独立工程依赖 npm           | 验证公开 API、版本兼容与运行时打包               | 当前采用                     |
| 将上游源码作为产品构建依赖 | 构建与同步整个上游，维护定制补丁                 | 有明确未发布能力需求时再评估 |

参考子模块保留上游自己的历史和开发规则。更新 submodule 指针不更新 npm 引擎，更新 npm 引擎也不自动更新参考源码，两者需要分别记录和验证。

## npm 插件开发

官方将引擎、工具、模型提供者、预设、API 与 bundle 发布到 npm。产品从公开入口导入，不引用参考目录的 src 或 lib。运行时引擎版本以 [运行时 package.json](../../packages/harness-runtime/package.json) 为准，直接使用的 DSH 服务包与之保持同一发行版，Cordis/Loader 使用其要求的版本。

各子包的 latest 标签可能指向不同历史版本，不能逐个无版本安装后假设兼容。兼容性声明使用实际支持的 engines.dsh 或 peer 范围。

插件实现服务、工具、提示词和事件，bundle 通过 dsh.bundle 提供配置层，profile 通过 dsh.profile 组合 bundle 并作为命名 dsh 启动入口。普通库安装不自动激活插件。本地链接、预构建 tarball 和 npm 均可用于自定义插件分发，TypeScript 插件发行时提供构建后的 ESM 与类型。

需要与 Host 共享实例的 Cordis 和 DSH 服务在插件中声明 peerDependencies，并用相容 devDependencies 支持检查与测试；构建时保留外部引用。纯工具库与独立第三方库作为普通 dependencies。应用不在 Electron main 中另建裸 Context 引擎，也不把当前能力不足的 SDK stdio 当作唯一交互接口。

## 接入与打包责任

npm 提供代码与类型，不替代 Bot 配置管理、独立后台安装、进程管理、多端认证或同步。成品仍需携带所需运行时和插件闭包，使用独立 Harness home，并验证用户不依赖系统 Node 与包管理器即可运行。

AgentHandle 的唯一所有权、Session Controller 的冷恢复协调与同一 Session 上的配置替换继续遵循 [配置接入探索](./HARNESS_INTEGRATION.md)。若公开接口不足，保留最小 patch 或构建明确版本的 fork 包，不手改 node_modules，也不复制整套上游 packages。

## 已有验证依据

迁移前已在仓库外独立安装固定发行版 @deepseek-ai/dsh，并验证公开的 create、resume、register、mount 服务接口可导入。发布版 CLI 初始化自定义 profile，安装并实际加载本地自定义 bundle，插件使用 Host 的同一套 Cordis Service，关闭后 effect 清理完成。该实验未发送模型请求，不等同于完整 Bot 生命周期或安装包验收。

上游规则见参考子模块中的 [插件分发](../../references/deepseek-harness/docs/user/develop/basic/publish.md)、[CLI profile](../../references/deepseek-harness/apps/cli/README.md) 与 [运行时解析](../../references/deepseek-harness/packages/boot/app-boot/README.md)。
