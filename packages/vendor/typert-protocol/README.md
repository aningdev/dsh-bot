# Vendored Typert protocol declarations

`src/*.d.ts` are verbatim copies of `node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/*.d.ts`
from the locked `@deepseek-ai/dsh-typert-protocol` release.

## Why a copy exists

The build-time Typert analyzer (`@deepseek-ai/dsh-typert-generator`, `isTypeMetaSymbol`) only
recognizes a `Remote` decorator, a `RemoteScope` decorator, or a `TypertRemoteService` base class
when the marker's declaration resolves inside a package registered from the workspace root
(`<root>/packages/**`, referenced by `tsconfig.host.json`). The protocol itself is a published npm
dependency, so its declarations live in `node_modules` and no registration covers them; an
unrecognized marker makes `writePackageArtifacts` fail with
`publishes Remote artifacts but has no Remote methods`.

The copy is registered exactly like a workspace package - same package name, project reference in
`tsconfig.host.json` - and `packages/bot/tsconfig.json` maps the module specifier onto it with
`paths`. Type checking therefore reads declarations from this directory, while runtime imports
still resolve to the real npm package, so decorator behavior, service identity, and every exported
type stay the published package's. The directory is nested under `packages/vendor/`, which the root
`workspaces` globs (`packages/*`) do not match, so it is never installed, linked, or bundled.

## Keeping it in sync

`bun run --cwd packages/bot vendor:protocol` rewrites the copy from the installed package;
`bun run --cwd packages/bot vendor:protocol:check` fails when the copy drifts from the locked
dependency. The check runs as part of the workspace `verify` task, so a protocol upgrade that
changes these declarations cannot pass unnoticed.
