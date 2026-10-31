import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { dump } from 'js-yaml'
import { buildDefinition, parsePluginRows } from './composition.ts'
import { compositionsPath, loadCompositions, removeComposition, upsertComposition } from './store.ts'

const sample = dump([
  { id: 'persona', name: '@deepseek-ai/dsh-persona' },
  { id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash' },
  { id: 'tool-web', name: '@deepseek-ai/dsh-tool-web' },
])

let root = ''
afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true })
  root = ''
})

describe('composition store', () => {
  test('persists derived presets and survives a restart reload', async () => {
    root = await mkdtemp(join(tmpdir(), 'bot-comp-'))
    const path = compositionsPath(root)
    const rows = parsePluginRows(sample)
    const a = buildDefinition('standard', rows, ['tool-web'], 'A')
    const b = buildDefinition('standard', rows, ['tool-bash'], 'B')
    expect(a.id).not.toBe(b.id)

    await upsertComposition(path, a.record)
    await upsertComposition(path, b.record)
    const loaded = await loadCompositions(path)
    expect(loaded.map(item => item.id).sort()).toEqual([a.id, b.id].sort())

    // Simulate process restart: rebuild definitions from persisted records only.
    for (const record of loaded) {
      const rebuilt = buildDefinition(record.basePreset, rows, record.disabledEntryIds, record.name)
      expect(rebuilt.id).toBe(record.id)
      expect(rebuilt.definition.plugins.some(item => item.id === 'tool-web')).toBe(!record.disabledEntryIds.includes('tool-web'))
      expect(rebuilt.definition.plugins.some(item => item.id === 'tool-bash')).toBe(!record.disabledEntryIds.includes('tool-bash'))
    }

    await removeComposition(path, a.id)
    expect((await loadCompositions(path)).map(item => item.id)).toEqual([b.id])
  })

  test('missing store file is empty, not an error', async () => {
    root = await mkdtemp(join(tmpdir(), 'bot-comp-empty-'))
    expect(await loadCompositions(compositionsPath(root))).toEqual([])
  })
})
