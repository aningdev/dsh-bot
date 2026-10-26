import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute } from 'node:path'

export interface BotConfig { name: string; model: string; instructions: string; cwd: string }
export interface Bot extends BotConfig { id: string }
export interface Conversation { id: string; botId: string; name: string; config: BotConfig }
interface State { bots: Bot[]; conversations: Conversation[] }

export function configFrom(value: unknown): BotConfig {
  if (!value || typeof value !== 'object') throw new Error('Bot 配置必须是对象')
  const data = value as Record<string, unknown>
  for (const key of ['name', 'model', 'instructions', 'cwd']) {
    if (typeof data[key] !== 'string' || data[key].length > 100_000) throw new Error(`无效字段：${key}`)
  }
  const { name, model, instructions, cwd } = data as unknown as BotConfig
  if (!name.trim() || !model.trim() || !isAbsolute(cwd)) throw new Error('名称、模型和绝对工作目录不能为空')
  return { name: name.trim(), model: model.trim(), instructions, cwd }
}

/** Owns product metadata only; Harness owns every message and execution record. */
export class ProductStore {
  private state: State = { bots: [], conversations: [] }
  private pending: Promise<unknown> = Promise.resolve()
  constructor(private readonly path: string) {}
  async open(): Promise<void> {
    try {
      const raw: unknown = JSON.parse(await readFile(this.path, 'utf8'))
      if (!raw || typeof raw !== 'object') throw new Error('无效的产品配置')
      const state = raw as State
      if (!Array.isArray(state.bots) || !Array.isArray(state.conversations)) throw new Error('无效的产品配置')
      for (const bot of state.bots) {
        configFrom(bot)
        if (typeof bot.id !== 'string') throw new Error('无效 Bot 标识')
      }
      for (const session of state.conversations) {
        configFrom(session.config)
        if (typeof session.id !== 'string' || typeof session.botId !== 'string' || typeof session.name !== 'string') throw new Error('无效会话')
      }
      this.state = state
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
  snapshot(): State { return structuredClone(this.state) }
  conversation(id: string): Conversation {
    const found = this.state.conversations.find(item => item.id === id)
    if (!found) throw new Error('会话不存在')
    return structuredClone(found)
  }
  bot(id: string): Bot {
    const found = this.state.bots.find(item => item.id === id)
    if (!found) throw new Error('Bot 不存在')
    return structuredClone(found)
  }
  private mutate<T>(change: (state: State) => T): Promise<T> {
    const task = this.pending.then(async () => {
      const state = structuredClone(this.state)
      const result = change(state)
      await mkdir(dirname(this.path), { recursive: true, mode: 0o700 })
      const temp = `${this.path}.${randomUUID()}.tmp`
      await writeFile(temp, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 })
      await rename(temp, this.path)
      this.state = state
      return structuredClone(result)
    })
    this.pending = task.catch(() => undefined)
    return task
  }
  saveBot(id: string | undefined, config: BotConfig): Promise<Bot> {
    return this.mutate(state => {
      const bot = { ...configFrom(config), id: id ?? randomUUID() }
      const index = state.bots.findIndex(item => item.id === bot.id)
      if (id && index < 0) throw new Error('Bot 不存在')
      if (index < 0) state.bots.push(bot)
      else state.bots[index] = bot
      return bot
    })
  }
  prepareConversation(botId: string, cwd?: string): Conversation {
    const bot = this.bot(botId)
    const { id: _, ...defaults } = bot
    const config = configFrom({ ...defaults, ...(cwd === undefined ? {} : { cwd }) })
    return { id: randomUUID(), botId, name: '新会话', config }
  }
  commitConversation(item: Conversation): Promise<Conversation> {
    return this.mutate(state => {
      if (!state.bots.some(bot => bot.id === item.botId)) throw new Error('Bot 不存在')
      if (state.conversations.some(value => value.id === item.id)) throw new Error('会话已存在')
      state.conversations.push(item)
      return item
    })
  }
}
