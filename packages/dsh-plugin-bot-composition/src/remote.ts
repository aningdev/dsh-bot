/* Hand-authored Client contribution mirroring TypertRemoteInfo for botComposition. */
import { z } from 'zod'
import { createTypertRemoteInfo } from '@deepseek-ai/dsh-typert-protocol/remote-info'

const pkg = '@dsh-bot/dsh-plugin-bot-composition'

const pluginSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  enabled: z.boolean(),
})

const previewResult = () => z.object({
  basePreset: z.string(),
  plugins: z.array(pluginSchema()),
})

const composeRequest = () => z.object({
  basePreset: z.string(),
  disabledEntryIds: z.array(z.string()).optional(),
  name: z.string().optional(),
})

const composeResult = () => z.object({
  agentPreset: z.string(),
  basePreset: z.string(),
  disabledEntryIds: z.array(z.string()),
})

const releaseResult = () => z.object({
  agentPreset: z.string(),
})

function stringCodec(symbol: string) {
  return {
    mode: 'strict' as const,
    typeSymbol: symbol,
    create: () => z.string(),
    jsonSchema: { type: 'string' as const },
  }
}

export default createTypertRemoteInfo({
  package: pkg,
  methods: {
    'botComposition/preview': {
      service: 'botComposition',
      description: 'List toggleable top-level plugins for a base agent preset.',
      implementation: 'preview',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'basePreset',
        description: 'Base agent preset id.',
        source: 'json',
        codec: stringCodec(`${pkg}#botComposition/preview:basePreset`),
        strictCodec: stringCodec(`${pkg}#botComposition/preview:basePreset`),
      }],
      result: {
        mode: 'strict',
        typeSymbol: `${pkg}#botComposition/preview:result`,
        create: previewResult,
        description: 'Toggleable plugin rows for the base preset.',
        jsonSchema: { type: 'object', additionalProperties: true },
      },
    },
    'botComposition/compose': {
      service: 'botComposition',
      description: 'Register or reuse a derived agent preset with selected plugins disabled.',
      implementation: 'compose',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'request',
        description: 'Base preset and disabled entry ids.',
        source: 'json',
        codec: {
          mode: 'strict',
          typeSymbol: `${pkg}#botComposition/compose:request`,
          create: composeRequest,
          jsonSchema: { type: 'object', additionalProperties: true },
        },
        strictCodec: {
          mode: 'strict',
          typeSymbol: `${pkg}#botComposition/compose:request`,
          create: composeRequest,
          jsonSchema: { type: 'object', additionalProperties: true },
        },
      }],
      result: {
        mode: 'strict',
        typeSymbol: `${pkg}#botComposition/compose:result`,
        create: composeResult,
        description: 'Derived agent preset identity and echo fields.',
        jsonSchema: { type: 'object', additionalProperties: true },
      },
    },
    'botComposition/ensure': {
      service: 'botComposition',
      description: 'Re-register a derived preset after backend restart.',
      implementation: 'ensure',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'agentPreset',
        description: 'Derived or base agent preset id.',
        source: 'json',
        codec: stringCodec(`${pkg}#botComposition/ensure:agentPreset`),
        strictCodec: stringCodec(`${pkg}#botComposition/ensure:agentPreset`),
      }],
      result: {
        mode: 'strict',
        typeSymbol: `${pkg}#botComposition/ensure:result`,
        create: composeResult,
        description: 'Ensured agent preset identity and echo fields.',
        jsonSchema: { type: 'object', additionalProperties: true },
      },
    },
    'botComposition/release': {
      service: 'botComposition',
      description: 'Unregister and forget a derived agent preset.',
      implementation: 'release',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'agentPreset',
        description: 'Derived agent preset id.',
        source: 'json',
        codec: stringCodec(`${pkg}#botComposition/release:agentPreset`),
        strictCodec: stringCodec(`${pkg}#botComposition/release:agentPreset`),
      }],
      result: {
        mode: 'strict',
        typeSymbol: `${pkg}#botComposition/release:result`,
        create: releaseResult,
        description: 'Released agent preset id.',
        jsonSchema: { type: 'object', additionalProperties: true },
      },
    },
  },
}, z)
