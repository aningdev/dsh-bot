# 参考源码

本目录下的 submodule 只用于阅读、调试和兼容性研究，不属于 Bun workspaces，也不是产品构建或发布输入。

| 目录 | 上游 | 用途 |
| --- | --- | --- |
| [deepseek-harness](deepseek-harness/) | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | 固定到产品迁移时采用的上游提交；模型循环、输入队列、会话日志与工具执行的行为依据 |
| [nsh](nsh/) | [longbridge/nsh](https://github.com/longbridge/nsh) | Rust 编写的原生 UI 框架（iOS/Android/macOS/Windows/Linux/Web，TSX + Rust）；桌面与移动端渲染方案的参考 |
| [lorca](lorca/) | [egoist/lorca](https://github.com/egoist/lorca) | 后台常驻、设备配对与撤销、加密 Relay、离线同步与手机生命周期的参考 |
| [waku](waku/) | [egoist/waku](https://github.com/egoist/waku) | 原生客户端、常驻产品后端、版本化协议与客户端 SDK 的分层参考；其多 Agent 消息统一方案与本产品沿用 dsh-web 执行协议的路线分别评估 |

Lorca 固定到 `d14a7a64d8ba9d16543123df82de145a0b5bc96a`，作为常驻后台与后续多端的机制参考；研究结论见 [Lorca 调研](../docs/research/LORCA_ARCHITECTURE.md)。不复用其执行引擎或全账号同步模型。

在仓库根目录初始化：

```sh
git submodule update --init references/deepseek-harness references/nsh references/waku references/lorca
```

检查固定版本与子模块状态：

```sh
git submodule status
git -C references/deepseek-harness status --short
git -C references/nsh status --short
git -C references/waku status --short
git -C references/lorca status --short
```

需要更新参考源码时，在子模块中获取并检出所需的上游提交，再在产品仓库记录 gitlink 变化；正常安装不自动跟随远程分支。参考版本与 npm 引擎版本分别管理，更新参考指针不更新运行时。

在子模块中运行上游测试或构建时，遵循各项目自己的 AGENTS.md 与工具链配置。应用实现消费公开发布的依赖，不从参考目录导入源码；Waku 仅作为架构研究参考，不参与产品构建或发布。
