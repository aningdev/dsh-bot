# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

This repo is single-context: one glossary covers the whole product; ADRs are created only when a decision needs a separate record. Bot、模板、Session、Client、Bridge、Relay 和设备身份在全仓库含义一致。执行后台使用官方 `dsh web`；产品代码包括 NSH 客户端、薄 Rust 宿主和按需增加的 dsh 能力插件，以及多端阶段独立部署的 Relay。宿主是随 App 打包并注册应用后台身份的轻量辅助程序，内部分为 `DshProcess`、`HostControl` 与后续 `Bridge`；能力实现和专属数据归插件，NSH 直接使用标准 API 与 dsh 公开接口提供本地操作、产品交互和插件管理。后台注册与成品身份验收以架构文档为准。

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── GLOSSARY.md
├── docs/
│   ├── adr/                       # 需要时创建
│   ├── BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── research/
│   └── agents/
├── apps/
│   ├── client/
│   ├── host/                      # App 内轻量 Rust 后台辅助程序；后续内置 Bridge
│   └── relay/                     # 多端阶段
├── packages/
│   └── dsh-plugin-*/              # 后续按需增加能力插件
└── scripts/
```

Product intent, architecture, and integration evidence live in `docs/`. `docs/BLUEPRINT.md` owns confirmed product behavior, `docs/ARCHITECTURE.md` owns the target workspace, profile 装配、配置 UI、进程结构与分阶段验收, and `docs/research/` holds upstream evidence with its verification status. The tree above shows the single-machine layout and the reserved multi-device components; the old Runner and harness-runtime workspaces have been removed.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (launchd owns the Runner lifecycle), but worth reopening because…_
