/** Scoped test capability loaded through the real preset registry. */
export const name = 'probe-capability'
export const inject = ['tools']

/** Register one inert tool so tests can observe the model-facing capability set. */
export function apply(ctx, config) {
  ctx.effect(() =>
    ctx.tools.register({
      name: config.toolName ?? 'probe',
      description: 'Report that the probe capability is enabled.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: {
        schema: { type: 'string' },
        render: (_args, value) => [{ type: 'text', text: value }],
      },
      execute: async () => 'probe',
    }),
  )
}
