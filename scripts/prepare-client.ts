// Bundle only public client entrypoints. The installed official dsh owns the Host.
for (const name of ['sdk', 'presets']) {
  const result = await Bun.build({ entrypoints: [`apps/client/frontend/infrastructure/dsh/${name}.ts`], target: 'node', format: 'esm', outdir: 'apps/client/frontend/infrastructure/dsh' })
  if (!result.success) throw new AggregateError(result.logs, `Cannot build ${name}`)
}
