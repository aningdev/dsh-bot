# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

This repo is single-context: one glossary and one ADR directory cover the whole product, including `apps/` and `packages/`. The apps split clients and processes; it does not split the vocabulary. Bot, Runner, Session, Client, Relay, and Device identity mean the same thing everywhere.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── GLOSSARY.md
├── docs/
│   ├── adr/                       # 当前为空，决策记录按需创建
│   ├── BLUEPRINT.md
│   ├── ARCHITECTURE.md
│   ├── research/
│   └── agents/
└── apps/
```

Product intent, architecture, and integration evidence live in `docs/` beside the ADRs. `docs/BLUEPRINT.md` owns confirmed product behavior, `docs/ARCHITECTURE.md` owns workspace, process and runtime structure, and `docs/research/` holds upstream evidence with its verification status (harness integration, host and client reuse, NSH communication, lifecycle prototype).

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (launchd owns the Runner lifecycle), but worth reopening because…_
