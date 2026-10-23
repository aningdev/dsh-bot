# 参考源码

[deepseek-harness](deepseek-harness/) 是 [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness) 的 Git submodule，固定到产品迁移时采用的上游提交。只用于阅读、调试和兼容性研究，不属于 Bun workspaces，也不是产品构建或发布输入。

在仓库根目录初始化：

```sh
git submodule update --init references/deepseek-harness
```

检查固定版本与子模块状态：

```sh
git submodule status
git -C references/deepseek-harness status --short
```

需要更新参考源码时，在子模块中获取并检出所需的上游提交，再在产品仓库记录 gitlink 变化；正常安装不自动跟随远程分支。参考版本与 npm 引擎版本分别管理，更新参考指针不更新运行时。

在子模块中运行上游测试或构建时，遵循它自己的 AGENTS.md 和 pnpm 配置。应用实现通过 [Harness npm 工作区](../packages/harness-runtime/README.md) 消费已发布依赖，不从参考目录导入源码。
