# 参考源码

本目录下的 submodule 只用于阅读、调试和兼容性研究，不属于 Bun workspaces，也不是产品构建或发布输入。

| 目录 | 上游 | 用途 |
| --- | --- | --- |
| [deepseek-harness](deepseek-harness/) | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | 固定到产品迁移时采用的上游提交；模型循环、输入队列、会话日志与工具执行的行为依据 |
| [nsh](nsh/) | [longbridge/nsh](https://github.com/longbridge/nsh) | Rust 编写的原生 UI 框架（iOS/Android/macOS/Windows/Linux/Web，TSX + Rust）；桌面与移动端渲染方案的参考 |

在仓库根目录初始化：

```sh
git submodule update --init references/deepseek-harness references/nsh
```

检查固定版本与子模块状态：

```sh
git submodule status
git -C references/deepseek-harness status --short
git -C references/nsh status --short
```

需要更新参考源码时，在子模块中获取并检出所需的上游提交，再在产品仓库记录 gitlink 变化；正常安装不自动跟随远程分支。参考版本与 npm 引擎版本分别管理，更新参考指针不更新运行时。

在子模块中运行上游测试或构建时，遵循它自己的 AGENTS.md 和 pnpm 配置。应用实现通过 [Harness npm 工作区](../packages/harness-runtime/README.md) 消费已发布依赖，不从参考目录导入源码。
