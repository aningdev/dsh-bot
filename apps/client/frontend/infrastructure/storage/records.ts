// Bot registry: one JSON file per Bot, written atomically, no hidden state.
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'fs/promises'
import { homedir } from 'os'
import { isAbsolute, join } from 'path'

/** Host-injected values (a test may relocate the registry); never credentials. */
export function hostEnv(name: 'DSH_BOTS_HOME' | 'DSH_E2E_FAULT'): string | undefined {
  return globalThis.process.env[name] || undefined
}

export async function isWorkspace(path: string): Promise<boolean> {
  if (!isAbsolute(path)) return false
  try { return (await stat(path)).isDirectory() }
  catch (error) {
    if (missing(error) || (!!error && typeof error === 'object' && (error as { code?: string }).code === 'ENOTDIR')) return false
    throw error
  }
}

function missing(error: unknown): boolean {
  return !!error && typeof error === 'object' && (error as { code?: string }).code === 'ENOENT'
}

/** `~/.dsh-bot/bots`, or wherever the host pointed the registry. */
export function botsRoot(): string {
  const root = hostEnv('DSH_BOTS_HOME') || join(homedir(), '.dsh-bot', 'bots')
  if (!isAbsolute(root)) throw new Error('Bot 注册表必须是绝对目录')
  return root
}

/** Every record file name, sorted; a missing root is an empty registry. */
export async function listRecords(): Promise<string[]> {
  try { return (await readdir(botsRoot())).filter(name => name.endsWith('.json')).sort() }
  catch (error) { if (missing(error)) return []; throw error }
}

function recordPath(name: string): string {
  const stem = name.endsWith('.json') ? name.slice(0, -5) : name
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(stem)) throw new Error('Bot 注册表文件名不合法')
  return join(botsRoot(), `${stem}.json`)
}

/** Raw text of one record; `''` when it does not exist. */
export async function readRecord(name: string): Promise<string> {
  const path = recordPath(name)
  try { return await readFile(path, 'utf8') }
  catch (error) { if (missing(error)) return ''; throw error }
}

const writes = new Map<string, Promise<unknown>>()
/** Serializes the whole read/modify/write transaction, including raw writes. */
async function serializedRecord<T>(path: string, task: () => Promise<T>): Promise<T> {
  const previous = writes.get(path) ?? Promise.resolve()
  const work = previous.catch(() => {}).then(task)
  writes.set(path, work)
  try { return await work } finally { if (writes.get(path) === work) writes.delete(path) }
}

async function replaceRecord(path: string, contents: string): Promise<void> {
  await mkdir(botsRoot(), { recursive: true })
  const temporary = `${path}.${crypto.randomUUID()}.tmp`
  try {
    await writeFile(temporary, contents)
    await rename(temporary, path)
  } finally {
    try { await unlink(temporary) } catch (error) { if (!missing(error)) throw error }
  }
}

/** Keeps invocation order per record and atomically replaces each whole file. */
export async function writeRecord(name: string, contents: string): Promise<void> {
  const path = recordPath(name)
  await serializedRecord(path, () => replaceRecord(path, contents))
}

/** Runs a read/change/atomic replacement under the same per-record queue as raw writes. */
export async function updateRecord(name: string, change: (contents: string) => string): Promise<void> {
  const path = recordPath(name)
  await serializedRecord(path, async () => {
    const contents = change(await readRecord(name))
    await replaceRecord(path, contents)
  })
}
