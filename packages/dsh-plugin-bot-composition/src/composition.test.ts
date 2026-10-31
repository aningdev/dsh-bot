import { describe, expect, test } from 'bun:test'
import { dump } from 'js-yaml'
import {
  applyDisabled,
  buildDefinition,
  compositionId,
  isDerivedPreset,
  listToggleable,
  parsePluginRows,
} from './composition.ts'

const sample = dump([
  { id: 'persona', name: '@deepseek-ai/dsh-persona', config: { prefix: 'hi' } },
  { id: 'agent-instructions', name: '@deepseek-ai/dsh-agent-instructions' },
  { id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash' },
  { id: 'tool-web', name: '@deepseek-ai/dsh-tool-web' },
  { id: 'compaction', name: 'cordis:group', group: true, config: [{ id: 'compaction-basic', name: '@deepseek-ai/dsh-compaction-basic' }] },
])

describe('bot composition', () => {
  test('lists only toggleable top-level tool rows', () => {
    const rows = parsePluginRows(sample)
    const plugins = listToggleable(rows)
    expect(plugins.map(item => item.id)).toEqual(['tool-bash', 'tool-web'])
    expect(listToggleable(rows, ['tool-web']).find(item => item.id === 'tool-web')?.enabled).toBe(false)
  })

  test('derive id is stable and empty disables keep the base', () => {
    expect(compositionId('standard', [])).toBe('standard')
    expect(isDerivedPreset(compositionId('standard', []))).toBe(false)
    const a = compositionId('standard', ['tool-web', 'tool-bash'])
    const b = compositionId('standard', ['tool-bash', 'tool-web'])
    expect(a).toBe(b)
    expect(isDerivedPreset(a)).toBe(true)
  })

  test('applyDisabled removes selected rows and rejects locked ids', () => {
    const rows = parsePluginRows(sample)
    expect(applyDisabled(rows, ['tool-web']).map(item => item.id)).toEqual([
      'persona', 'agent-instructions', 'tool-bash', 'compaction',
    ])
    expect(() => applyDisabled(rows, ['persona'])).toThrow('核心插件')
  })

  test('buildDefinition registers a named derived preset', () => {
    const rows = parsePluginRows(sample)
    const built = buildDefinition('standard', rows, ['tool-web'], 'Coding')
    expect(built.id.startsWith('dshbot_')).toBe(true)
    expect(built.definition.plugins.some(item => item.id === 'tool-web')).toBe(false)
    expect(built.definition.plugins.some(item => item.id === 'tool-bash')).toBe(true)
    expect(built.record.basePreset).toBe('standard')
    expect(built.record.disabledEntryIds).toEqual(['tool-web'])
  })
})
