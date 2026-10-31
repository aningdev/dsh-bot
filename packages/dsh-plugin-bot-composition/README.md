# @dsh-bot/dsh-plugin-bot-composition

dsh 插件：在共享 `web` profile 内按 Bot 派生 agent preset（关闭部分顶层子插件），并经 Remote 供 NSH 客户端调用。

## Remotes

| 方法 | 作用 |
| --- | --- |
| `botComposition.preview` | 列出基模板可关闭的顶层子插件 |
| `botComposition.compose` | 注册/复用派生 preset，并持久化到 `$DSH_HOME/bot-composition/` |
| `botComposition.ensure` | 后台重启后按存储重放 `agentPresets.register` |
| `botComposition.release` | 注销并删除一条派生组合 |

## 装配

开发 / Host：设置 `DSH_BOT_COMPOSITION_PLUGIN` 为本包绝对路径（Host 写入指向 `lib/index.js` 的 `--patch`）。e2e / smoke 同样用绝对入口文件，避免 Node ESM 目录导入失败。

```sh
bun run --cwd packages/dsh-plugin-bot-composition build   # tsc Stage-3 decorators → lib/
bun run --cwd packages/dsh-plugin-bot-composition test
bun run --cwd packages/dsh-plugin-bot-composition smoke:remote  # 隔离 dsh web + preview/compose/ensure
```
