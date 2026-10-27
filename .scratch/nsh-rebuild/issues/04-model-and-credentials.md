
## 上游契约（读本机安装产物所得）

模型与凭据设置页不需要自建后端，直接消费 Host Remote：

- `ctx.remote.llm.listProviders()` / `listConfigurableProviders()`：可选供应商（含未启用项），后者用于渲染设置行。
- `ctx.remote.session.modelCatalog()`：绑定到当前 session 的可用模型，用于 Bot 默认模型选择。
- `ctx.remote.settings.mutate(ns, ops, expectedRevision)`：写 settings，携带内容版本；陈旧写入返回 `settings-conflict`，其他拒绝为 `settings-rejected`。`settings.describe()` 在 `redactSecrets: true` 下返回脱敏视图。
- `ctx.remote.credentials.describe(refs)` / `set(ref, value)` / `unset(ref)`：单次最多 64 个引用；只在此方向传密钥，任何方法都不回传机密值；提供方拒绝为 `credential-rejected`。
- `ctx.remote.llm.discoverModels(settingsNs, request)`：可选，用于探测供应商模型。
- 依据：`node_modules/@deepseek-ai/dsh-client-ui-settings-models/lib/client.js:1341-1395,3172-3195`、`node_modules/@deepseek-ai/dsh-api-settings-controller/README.zh.md`。

产品约束：密钥只经 `credentials.set` 进入系统凭据存储，不写进 `~/.dsh-bot` 明文、不进 LaunchAgent plist、不写日志；Bot 默认模型只写 Bot 注册表，不按会话改写。
