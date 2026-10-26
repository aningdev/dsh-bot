import { signal, cleanup, Input, Scroll, Text, View, List } from 'nsh'
import { SafeAreaView, SelectionArea } from 'nsh/base'
import { Storage } from 'nsh/storage'
import { Connection, type Bot, type ProductState, type Conversation } from './connection'
import { TextHistory, type Message } from './history'
import { discovery, startBackend, defaultDirectory } from './platform'

function Button(props: { label: string; onPress: () => void; disabled?: boolean }) {
  return <View role="button" accessibilityLabel={props.label} disabled={props.disabled} onPress={props.onPress}
    class="rounded-md border border-border px-3 py-2 hover:bg-muted disabled:opacity-40">
    <Text class="text-sm text-foreground">{props.label}</Text>
  </View>
}
export function BotApp(props: { discover?: () => Promise<string> } = {}) {
  const connection = new Connection()
  const state = signal<ProductState>({ bots: [], conversations: [] })
  const selectedBot = signal(''), selectedSession = signal('')
  const online = signal(false), connecting = signal(false), needsNodeCheck = signal(false), note = signal('正在连接后台…')
  const messages = signal<Message[]>([]), running = signal(false), draft = signal(''), sending = signal(false)
  const editId = signal<string | undefined>(undefined), name = signal(''), model = signal('deepseek-flash')
  const instructions = signal(''), cwd = signal(defaultDirectory), sessionCwd = signal(defaultDirectory)
  const keyStatus = signal('尚未检查凭据')
  const lastSession = new Map<string, string>()
  let disposed = false, reconnect: ReturnType<typeof setTimeout> | undefined
  let stream: AbortController | undefined
  let viewGeneration = 0
  let didAutoStart = false
  const bot = () => state().bots.find(item => item.id === selectedBot())
  const current = () => state().conversations.find(item => item.id === selectedSession())
  const report = (error: unknown) => note.set(String(error))
  const refresh = async () => state.set(await connection.request<ProductState>('/api/bot/state'))
  async function connect(start = false) {
    if (connecting() || disposed) return
    connecting.set(true)
    let checkingNode = start
    try {
      if (start) { await startBackend(); needsNodeCheck.set(false); checkingNode = false }
      await connection.connect(await (props.discover ?? discovery)())
      await refresh()
      online.set(true)
      note.set('已连接')
      const credential = await connection.request<{ configured: boolean; source?: string }>('/api/bot/credentials')
      keyStatus.set(credential.configured
        ? credential.source === 'env' ? '已读取环境变量 DEEPSEEK_API_KEY' : 'API 密钥已配置'
        : '未检测到 DEEPSEEK_API_KEY，请在启动环境中设置后重启后台')
      if (!selectedBot() && state().bots[0]) chooseBot(state().bots[0]!)
      else watch()
    } catch (error) {
      online.set(false)
      note.set(`后台未连接：${String(error)}`)
      if (checkingNode) { needsNodeCheck.set(true); return }
      if (!didAutoStart) { didAutoStart = true; connecting.set(false); return connect(true) }
      if (!disposed) reconnect = setTimeout(() => { void connect() }, 2000)
    } finally { connecting.set(false) }
  }
  function chooseBot(value: Bot) {
    selectedBot.set(value.id); editId.set(value.id)
    name.set(value.name); model.set(value.model); instructions.set(value.instructions); cwd.set(value.cwd); sessionCwd.set(value.cwd)
    const remembered = lastSession.get(value.id)
    selectedSession.set(state().conversations.find(item => item.id === remembered && item.botId === value.id)?.id
      ?? state().conversations.filter(item => item.botId === value.id).at(-1)?.id ?? '')
    void remember(); watch()
  }
  async function remember() {
    try { await Storage.setItem('selection', JSON.stringify({ bot: selectedBot(), sessions: [...lastSession] })) }
    catch (error) { report(error) }
  }
  function chooseSession(value: Conversation) {
    selectedSession.set(value.id); lastSession.set(value.botId, value.id); void remember(); watch()
  }
  function watch() {
    stream?.abort(); stream = undefined
    const generation = ++viewGeneration
    messages.set([]); running.set(false)
    if (!online() || !selectedSession()) return
    const abort = new AbortController(); stream = abort
    const history = new TextHistory()
    void connection.follow(selectedSession(), abort.signal, frame => {
      if (generation !== viewGeneration) return
      messages.set(history.receive(frame)); running.set(history.running)
      if (history.status) note.set(history.status)
    }).catch(error => {
      if (abort.signal.aborted || generation !== viewGeneration || disposed) return
      online.set(false); note.set(`连接中断：${String(error)}；正在重连`)
      reconnect = setTimeout(() => { void connect() }, 1000)
    })
  }
  async function save() {
    try {
      const value = await connection.request<Bot>('/api/bot/config', { id: editId(), config: { name: name(), model: model(), instructions: instructions(), cwd: cwd() } })
      await refresh(); chooseBot(value); note.set('已保存；新的默认配置用于新会话')
    } catch (error) { report(error) }
  }
  async function createConversation() {
    const botId = selectedBot()
    const generation = viewGeneration
    const value = await connection.request<Conversation>('/api/bot/conversation', { botId, cwd: sessionCwd() })
    await refresh()
    if (selectedBot() === botId && viewGeneration === generation) chooseSession(value)
    note.set('会话已创建')
    return value.id
  }
  async function newConversation() {
    if (sending() || !online() || !bot()) return
    sending.set(true)
    try { await createConversation() }
    catch (error) { note.set(`创建会话失败：${String(error)}`) }
    finally { sending.set(false) }
  }
  async function send(mode: 'queue' | 'steer') {
    if (!draft().trim() || !bot() || sending() || !online()) return
    if (mode === 'steer' && !selectedSession()) return
    const content = draft()
    let id = selectedSession()
    sending.set(true)
    try {
      if (!id) {
        try { id = await createConversation() }
        catch (error) { note.set(`创建会话失败：${String(error)}`); return }
      }
      await connection.request('/api/bot/prompt', { id, requestId: crypto.randomUUID(), text: content, mode })
      if (selectedSession() === id && draft() === content) draft.set('')
      note.set('后台已接纳')
    } catch (error) { note.set(`提交结果未知，请查看会话后再决定是否重发：${String(error)}`) }
    finally { sending.set(false) }
  }
  async function cancel() {
    try { await connection.request('/api/bot/cancel', { id: selectedSession() }); note.set('已请求停止当前执行；待处理输入保留') }
    catch (error) { report(error) }
  }
  async function shutdown() {
    try {
      didAutoStart = true
      await connection.request('/api/bot/shutdown', {})
      if (reconnect) clearTimeout(reconnect)
      stream?.abort(); online.set(false); note.set('已请求停止后台')
    } catch (error) { report(error) }
  }
  cleanup(() => { disposed = true; stream?.abort(); if (reconnect) clearTimeout(reconnect) })
  void (async () => {
    try {
      const value = await Storage.getItem('selection')
      if (value) {
        const saved = JSON.parse(value) as { bot?: string; sessions?: [string, string][] }
        for (const entry of saved.sessions ?? []) lastSession.set(...entry)
        if (saved.bot) selectedBot.set(saved.bot)
      }
    } catch (error) { report(error) }
    await connect()
    if (bot()) chooseBot(bot()!)
  })()
  const field = 'rounded-md border border-border bg-background p-2 text-sm text-foreground'
  return <SafeAreaView class="flex-1 bg-background">
    <View class="flex-1 flex-row">
      <View class="w-52 border-r border-border p-4 gap-4">
        <Text class="text-xl font-semibold text-foreground">DSH Bot</Text>
        <Button label="新建 Bot" disabled={!online()} onPress={() => {
          editId.set(undefined); name.set(''); model.set('deepseek-flash'); instructions.set(''); cwd.set(defaultDirectory)
        }} />
        <Scroll class="flex-1"><View class="gap-2">
          {state().bots.map(item => <View role="button" accessibilityLabel={item.name} onPress={() => chooseBot(item)} class={selectedBot() === item.id ? 'rounded-md bg-muted p-3' : 'rounded-md p-3 hover:bg-muted'}>
            <Text class="text-foreground">{item.name}</Text>
          </View>)}
        </View></Scroll>
        <Text class="text-xs text-muted-foreground">{online() ? '后台已连接' : '后台未连接'}</Text>
        <Button label={needsNodeCheck() ? '重新检测并启动' : '启动后台'} disabled={connecting() || online()} onPress={() => { didAutoStart = true; void connect(true) }} />
        <Button label="停止后台" disabled={!online()} onPress={() => { void shutdown() }} />
      </View>
      <View class="flex-1 min-w-0">
        <View class="border-b border-border p-4 gap-3">
          <Text class="text-lg font-semibold text-foreground">{bot()?.name ?? '选择或新建 Bot'}</Text>
          <Scroll horizontal><View class="flex-row gap-2">
            {state().conversations.filter(item => item.botId === selectedBot()).map((item, index) =>
              <Button label={`${selectedSession() === item.id ? '● ' : ''}${item.name} ${index + 1}`} onPress={() => chooseSession(item)} />)}
          </View></Scroll>
          <View class="flex-row gap-2 items-center">
            <Input class={`${field} flex-1`} accessibilityLabel="新会话工作目录" placeholder="新会话工作目录" value={sessionCwd()} onChange={value => sessionCwd.set(value)} />
            <Button label="新建会话" disabled={!online() || !bot() || sending()} onPress={() => { void newConversation() }} />
          </View>
        </View>
        <SelectionArea style={{ flex: 1 }}>
          <List each={messages()} keyExtractor={item => item.id} estimatedItemSize={100} style={{ flex: 1 }} contentStyle={{ padding: 24, gap: 18 }}
            maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 50 }}>
            {item => <View class="gap-2"><Text class="text-xs text-muted-foreground">{item().role === 'user' ? '你' : 'Agent'}</Text>
              <Text class="text-base text-foreground">{item().text}</Text></View>}
          </List>
        </SelectionArea>
        <View class="border-t border-border p-4 gap-3">
          <Text class="text-xs text-muted-foreground">{running() ? '执行中 · ' : ''}{note()}</Text>
          <Input class={`${field} min-h-20`} multiline value={draft()} onChange={value => draft.set(value)} accessibilityLabel="消息" placeholder="输入消息" />
          <View class="flex-row gap-2">
            <Button label={sending() ? '提交中…' : '发送'} disabled={!online() || !bot() || sending() || !draft().trim()} onPress={() => { void send('queue') }} />
            <Button label="追加到当前执行" disabled={!online() || !running() || sending() || !draft().trim()} onPress={() => { void send('steer') }} />
            <Button label="停止执行" disabled={!online() || !selectedSession()} onPress={() => { void cancel() }} />
          </View>
        </View>
      </View>
      <Scroll class="w-80 border-l border-border"><View class="p-5 gap-4">
        <Text class="text-lg font-semibold text-foreground">{editId() ? 'Bot 默认配置' : '新建 Bot'}</Text>
        <Text class="text-xs text-muted-foreground">保存后用于新会话</Text>
        <Text class="text-sm text-foreground">名称</Text><Input class={field} accessibilityLabel="Bot 名称" value={name()} onChange={value => name.set(value)} />
        <Text class="text-sm text-foreground">DeepSeek 模型</Text><Input class={field} accessibilityLabel="默认模型" value={model()} onChange={value => model.set(value)} />
        <Text class="text-sm text-foreground">指令</Text><Input class={`${field} min-h-28`} accessibilityLabel="默认指令" multiline value={instructions()} onChange={value => instructions.set(value)} />
        <Text class="text-sm text-foreground">默认工作目录</Text><Input class={field} accessibilityLabel="默认工作目录" value={cwd()} onChange={value => cwd.set(value)} />
        <Button label="保存 Bot" disabled={!online() || !name().trim()} onPress={() => { void save() }} />
        <Text class="text-sm font-semibold text-foreground">当前会话实际配置</Text>
        <Text class="text-xs text-muted-foreground">{current() ? `${current()!.config.model}\n${current()!.config.cwd}\n\n${current()!.config.instructions || '未设置额外指令'}` : '尚未选择会话'}</Text>
        <Text class="text-sm font-semibold text-foreground">DeepSeek API 密钥</Text>
        <Text class="text-xs text-muted-foreground">{keyStatus()}</Text>
      </View></Scroll>
    </View>
  </SafeAreaView>
}
