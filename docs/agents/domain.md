# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

This repo is single-context: one glossary covers the whole product; ADRs are created only when a decision needs a separate record. Bot、模板、Session、Client、Bridge、Relay 和设备身份在全仓库含义一致。执行后台使用官方 `dsh web`；产品代码包括 NSH 客户端，以及多端阶段的 bridge 与 Relay。

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
│   ├── bridge/                    # 多端阶段
│   └── relay/                     # 多端阶段
└── scripts/
```

Product intent, architecture, and integration evidence live in `docs/`. `docs/BLUEPRINT.md` owns confirmed product behavior, `docs/ARCHITECTURE.md` owns the target workspace, profile 装配、配置 UI、进程结构与分阶段验收, and `docs/research/` holds upstream evidence with its verification status. The tree above is the target layout; old `apps/runner` and `packages/harness-runtime` remain until reconstruction.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (launchd owns the Runner lifecycle), but worth reopening because…_
