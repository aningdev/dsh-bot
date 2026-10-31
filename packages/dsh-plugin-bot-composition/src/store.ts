import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { CompositionRecord } from './composition.ts'

export function compositionsPath(dshHome: string): string {
  return join(dshHome, 'bot-composition', 'compositions.json')
}

export async function loadCompositions(path: string): Promise<CompositionRecord[]> {
  try {
    const text = await readFile(path, 'utf8')
    const parsed = JSON.parse(text) as { compositions?: CompositionRecord[] }
    return Array.isArray(parsed.compositions) ? parsed.compositions : []
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

export async function saveCompositions(path: string, compositions: readonly CompositionRecord[]): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify({ compositions }, null, 2)}\n`)
}

export async function upsertComposition(path: string, record: CompositionRecord): Promise<CompositionRecord[]> {
  const current = await loadCompositions(path)
  const next = [...current.filter(item => item.id !== record.id), record]
  await saveCompositions(path, next)
  return next
}

export async function removeComposition(path: string, id: string): Promise<CompositionRecord[]> {
  const current = await loadCompositions(path)
  const next = current.filter(item => item.id !== id)
  await saveCompositions(path, next)
  return next
}
