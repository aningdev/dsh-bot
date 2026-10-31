import { listRecords, readRecord, writeRecord, updateRecord } from '../../infrastructure/storage/records'
import type { BotRecord } from './types'
export type { BotRecord, BotModel, Draft, Initializing } from './types'

function fileName(id: string): string {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error('Bot 标识不合法')
  return `${id}.json`
}

function parse(value: unknown): BotRecord | undefined {
  if (!value || typeof value !== 'object') return undefined
  const record = value as Partial<BotRecord>
  if (typeof record.id !== 'string' || typeof record.name !== 'string') return undefined
  if (typeof record.preset !== 'string' || typeof record.workspace !== 'string') return undefined
  const model = record.model
  if (!model || typeof model.provider !== 'string' || typeof model.model !== 'string') return undefined
  const disabledPlugins = Array.isArray(record.disabledPlugins)
    ? record.disabledPlugins.filter((item): item is string => typeof item === 'string')
    : undefined
  return {
    id: record.id,
    name: record.name,
    preset: record.preset,
    model: { provider: model.provider, model: model.model, ...(model.reasoningEffort ? { reasoningEffort: model.reasoningEffort } : {}) },
    workspace: record.workspace,
    archived: record.archived === true,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    ...(typeof record.basePreset === 'string' ? { basePreset: record.basePreset } : {}),
    ...(disabledPlugins?.length ? { disabledPlugins } : {}),
    ...(typeof record.sessionId === 'string' ? { sessionId: record.sessionId } : {}),
    ...(record.initializing ? { initializing: record.initializing } : {}),
    ...(record.draft ? { draft: record.draft } : {}),
  }
}

/** Atomic: a whole file appears, or the previous one stays. */
export async function saveBot(record: BotRecord): Promise<void> {
  await writeRecord(fileName(record.id), JSON.stringify(record, null, 2) + '\n')
}

/** The latest-record read and field change run inside the storage transaction. */
export async function updateBot(id: string, change: (latest: BotRecord) => BotRecord): Promise<BotRecord> {
  let next!: BotRecord
  await updateRecord(fileName(id), text => {
    let latest: BotRecord | undefined
    try { latest = text ? parse(JSON.parse(text)) : undefined } catch { /* damaged record */ }
    if (!latest) throw new Error('Bot 登记不存在或已损坏，未保存修改')
    next = change(latest)
    if (next.id !== id) throw new Error('Bot 修改不能更换标识')
    return JSON.stringify(next, null, 2) + '\n'
  })
  return next
}

export async function loadBot(id: string): Promise<BotRecord | undefined> {
  const text = await readRecord(fileName(id))
  try { return text ? parse(JSON.parse(text)) : undefined }
  catch { return undefined }
}

/** Every readable record; a damaged file is reported instead of being guessed. */
export async function loadBots(): Promise<{ bots: BotRecord[]; damaged: string[] }> {
  const names = await listRecords()
  const bots: BotRecord[] = []
  const damaged: string[] = []
  for (const name of names) {
    if (!/^[A-Za-z0-9_-]{1,128}\.json$/.test(name)) { damaged.push(name); continue }
    const text = await readRecord(name)
    try {
      const record = parse(JSON.parse(text))
      if (record) bots.push(record)
      else damaged.push(name)
    } catch {
      damaged.push(name)
    }
  }
  bots.sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  return { bots, damaged }
}

export function newBotId(): string {
  return `bot_${crypto.randomUUID().replace(/-/g, '')}`
}

export function newSessionId(): string {
  return `sess_${crypto.randomUUID().replace(/-/g, '')}`
}

export function newRequestId(): string {
  return `req_${crypto.randomUUID()}`
}
