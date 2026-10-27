// Bot registry: one JSON file per Bot, written atomically, no hidden state.
import { Store, Transport } from 'dsh-client/native'

/** Host-injected values (a test may relocate the registry); never credentials. */
export function hostEnv(name: 'DSH_BOTS_HOME' | 'DSH_E2E_FAULT'): string | undefined {
  try {
    const value = Transport.hostEnv(name)
    return value || undefined
  } catch {
    return undefined
  }
}

export function isWorkspace(path: string): boolean { return Store.isDirectory(path) }

/** The model a Bot asked for before its Session existed. */
export interface BotModel {
  provider: string
  model: string
  reasoningEffort?: string
}

/** A Session the client asked for but has not confirmed as its pointer yet. */
export interface Initializing {
  /** When the initialization intent was written; not evidence for claiming a Session. */
  startedAt: string
  /** The identity handed to `session.create`, so a retry reuses the same blank Session. */
  candidateSessionId: string
  /** The backend made the Session but the pointer was not persisted; repaired without a new create. */
  createdSessionId?: string
}

/** Text typed but not confirmed: kept so a lost outcome is never blindly resent. */
export interface Draft {
  text: string
  /** Only present once the text was handed to `session.prompt`. */
  requestId?: string
  /**
   * `typing`: never submitted, restored on reopen.
   * `pending`: submitted, the outcome not yet known.
   * `unknown`: submitted with a lost outcome;核对 before resending.
   */
  state: 'typing' | 'pending' | 'unknown'
}

export interface BotRecord {
  id: string
  name: string
  preset: string
  model: BotModel
  workspace: string
  archived: boolean
  createdAt: string
  /** The official Session pointer; absent until initialization committed. */
  sessionId?: string
  initializing?: Initializing
  draft?: Draft
}

/** `~/.dsh-bot/bots`, or wherever the host pointed the registry. */
export function botsRoot(): string {
  return Store.root()
}

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
  return {
    id: record.id,
    name: record.name,
    preset: record.preset,
    model: { provider: model.provider, model: model.model, ...(model.reasoningEffort ? { reasoningEffort: model.reasoningEffort } : {}) },
    workspace: record.workspace,
    archived: record.archived === true,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    ...(typeof record.sessionId === 'string' ? { sessionId: record.sessionId } : {}),
    ...(record.initializing ? { initializing: record.initializing } : {}),
    ...(record.draft ? { draft: record.draft } : {}),
  }
}

/** Every record file name, sorted; the registry creates no root of its own. */
export function listRecords(): string[] {
  return Store.list()
}

/** Raw text of one record; `''` when it does not exist. */
export function readRecord(name: string): string {
  return Store.read(name)
}

/** Replaces one record atomically: a whole file appears, or the previous one stays. */
export function writeRecord(name: string, contents: string): void {
  Store.write(name, contents)
}

/** Atomic: a whole file appears, or the previous one stays. */
export async function saveBot(record: BotRecord): Promise<void> {
  writeRecord(fileName(record.id), JSON.stringify(record, null, 2) + '\n')
}

export async function loadBot(id: string): Promise<BotRecord | undefined> {
  try {
    const text = readRecord(fileName(id))
    return text ? parse(JSON.parse(text)) : undefined
  } catch {
    return undefined
  }
}

/** Every readable record; a damaged file is reported instead of being guessed. */
export async function loadBots(): Promise<{ bots: BotRecord[]; damaged: string[] }> {
  const names = listRecords()
  const bots: BotRecord[] = []
  const damaged: string[] = []
  for (const name of names) {
    try {
      const record = parse(JSON.parse(readRecord(name)))
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
