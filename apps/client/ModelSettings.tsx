import { signal, cleanup, View, Text, Scroll } from 'nsh'
import { Input } from 'nsh/base'
import { Connection, readableError } from './connection'

const field = 'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground'
function Action(props: { id: string; label: string; disabled?: boolean; run: () => void }) {
  return <View role="button" testID={props.id} accessibilityLabel={props.label} disabled={props.disabled} onPress={props.run} class="rounded-md bg-muted p-2"><Text class="text-sm text-foreground">{props.label}</Text></View>
}
function at(value: any, path: string[]): any { return path.reduce((item, key) => item?.[key], value) }

/** Read field names from the Host's serialized Schemastery graph. Validation stays on the Host. */
function schemaFields(schema: any, path: string[]): string[] {
  if (!schema?.refs) return []
  const visited = new Set<string>()
  const walk = (id: any, parts: string[]): string[] => {
    const key = `${id}:${parts.join('/')}`
    if (visited.has(key)) return []
    visited.add(key)
    const node = typeof id === 'number' ? schema.refs[id] : id
    if (!node) return []
    if (node.list) return node.list.flatMap((item: any) => walk(item, parts))
    if (!parts.length) return Object.keys(node.dict ?? {})
    const child = node.dict?.[parts[0]!] ?? (node.type === 'dict' ? node.inner : undefined)
    return child === undefined ? [] : walk(child, parts.slice(1))
  }
  return [...new Set(walk(schema.uid, path))]
}

/** Settings and credentials stay in the Host. Only secret input lives in memory. */
export function ModelSettings(props: { connection: Connection; changed: () => Promise<void>; close: () => void }) {
  const routes = signal<any[]>([]), namespaces = signal<any[]>([]), writable = signal(false)
  const selected = signal(''), endpoint = signal(''), protocol = signal(''), models = signal('')
  const reference = signal(''), secret = signal(''), credentialStatus = signal('')
  const status = signal('读取供应商…'), busy = signal(false)
  let disposed = false, generation = 0
  const route = () => routes().find(item => item.provider === selected())
  const section = () => namespaces().find(item => item.ns === route()?.settingsNs)
  const profile = () => at(section()?.value, route()?.settingsPath ?? []) ?? {}
  const fields = () => schemaFields(section()?.schema, route()?.settingsPath ?? [])
  const supports = (key: string) => fields().includes(key)
  const unsupported = () => fields().filter(key => !['baseURL', 'api', 'models', 'apiKeyEnv'].includes(key))

  async function choose(id: string) {
    const epoch = ++generation
    selected.set(id); secret.set(''); credentialStatus.set('')
    const value = profile(), provider = route()
    endpoint.set(value.baseURL ?? '')
    protocol.set(value.api ?? '')
    models.set(value.models ? JSON.stringify(value.models, null, 2) : '')
    reference.set(value.apiKeyEnv ?? provider?.nativeAuth?.env?.[0] ?? '')
    if (reference()) {
      try {
        const info = await props.connection.credentialInfo(reference())
        if (!disposed && epoch === generation) credentialStatus.set(`${info.configured ? '已配置' : '未配置'}${info.source ? ` · ${info.source}` : ''}${info.writable ? '' : ' · 只读'}`)
      } catch (error) { if (!disposed && epoch === generation) credentialStatus.set(readableError(error)) }
    }
  }
  async function refresh(preserveEdits = false) {
    const providerId = selected(), value = profile()
    const edits = preserveEdits ? {
      endpoint: endpoint() !== (value.baseURL ?? '') ? endpoint() : undefined,
      protocol: protocol() !== (value.api ?? '') ? protocol() : undefined,
      models: models() !== (value.models ? JSON.stringify(value.models, null, 2) : '') ? models() : undefined,
      reference: reference() !== (value.apiKeyEnv ?? route()?.nativeAuth?.env?.[0] ?? '') ? reference() : undefined,
    } : undefined
    const [description, providers] = await Promise.all([props.connection.settings(), props.connection.providers()])
    if (disposed) return
    namespaces.set(description.namespaces); writable.set(description.writable); routes.set(providers)
    await choose(providers.some((item: any) => item.provider === selected()) ? selected() : providers[0]?.provider ?? '')
    if (!disposed && edits && selected() === providerId) {
      if (edits.endpoint !== undefined) endpoint.set(edits.endpoint)
      if (edits.protocol !== undefined) protocol.set(edits.protocol)
      if (edits.models !== undefined) models.set(edits.models)
      if (edits.reference !== undefined) reference.set(edits.reference)
    }
  }
  async function save() {
    const provider = route(), ns = section()
    if (!provider || !ns || !writable() || busy()) return
    const ref = reference().trim(), key = secret()
    secret.set('')
    let stage = '配置与密钥尚未提交'
    busy.set(true)
    try {
      const value = profile(), path = provider.settingsPath as string[], ops: any[] = []
      const edit = (key: string, next: any, old: any) => {
        if (!supports(key)) return
        if (JSON.stringify(next) === JSON.stringify(old)) return
        ops.push(next === undefined ? { op: 'unset', path: [...path, key] } : { op: 'set', path: [...path, key], value: next })
      }
      if (endpoint().trim()) { const url = new URL(endpoint().trim()); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('地址必须是没有账号密码的 HTTP(S) URL') }
      edit('baseURL', endpoint().trim() || undefined, value.baseURL)
      edit('api', protocol().trim() || undefined, value.api)
      edit('models', models().trim() ? JSON.parse(models()) : undefined, value.models)
      // Native-auth routes declare their reference outside the settings object.
      if (!provider.nativeAuth?.env?.length) edit('apiKeyEnv', reference().trim() || undefined, value.apiKeyEnv)
      if (key && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref)) throw new Error('请填写有效凭据名称')
      if (ops.length) {
        stage = '配置提交未确认，密钥尚未提交'
        await props.connection.mutate(ns.ns, ops, ns.revision)
        stage = '配置已保存，密钥尚未提交'
      } else stage = '配置未改动，密钥尚未提交'
      // A secret write is independent; no config file ever receives its contents.
      if (key) {
        const configuration = stage.split('，')[0]
        stage = `${configuration}，密钥提交未确认`
        await props.connection.credential(ref, key)
        stage = `${configuration}，密钥已保存`
      }
      await refresh(); await props.changed()
      status.set('已保存并重新读取。更改作用于后续请求；当前模型仍需在 Bot 信息中选择。')
    } catch (error) {
      // Never echo remote error details after submitting a secret.
      secret.set('')
      const code = /^([a-z-]+\/[a-z-]+):/.exec(error instanceof Error ? error.message : '')?.[1]
      status.set(`保存未确认：${stage}${code ? `（${code}）` : ''}。输入仍保留；请重新读取配置并核对，勿直接重复提交密钥。`)
    } finally { busy.set(false) }
  }
  async function removeCredential() {
    if (!reference() || busy()) return
    busy.set(true); secret.set('')
    try { await props.connection.credential(reference()); await refresh(); status.set('已移除存储值；环境变量等后备来源仍可能生效。') }
    catch { status.set('凭据移除结果待确认，请重新读取状态。') }
    finally { busy.set(false) }
  }
  async function reload() {
    if (busy()) return
    busy.set(true); secret.set('')
    try { await refresh(true); status.set('已重新读取当前后台配置；未保存的编辑已保留，请核对后保存。') }
    catch (error) { status.set(readableError(error)) }
    finally { busy.set(false) }
  }
  cleanup(() => { disposed = true; generation++; secret.set('') })
  void refresh().then(() => { if (!disposed) status.set('') }).catch(error => { if (!disposed) status.set(readableError(error)) })
  return <Scroll class="flex-1"><View class="p-5 gap-3">
    <Text class="text-lg font-semibold text-foreground">模型与供应商</Text>
    <Action id="settings-close" label="返回 Bot" disabled={busy()} run={props.close} />
    {routes().map(item => <Action id={`provider-${item.provider}`} label={`${selected() === item.provider ? '✓ ' : ''}${item.displayName}${item.error ? ' · 配置待修复' : ''}`} disabled={busy()} run={() => { void choose(item.provider) }} />)}
    <Text class="text-xs text-muted-foreground">{route()?.error ?? ''}</Text>
    <Text class="text-xs text-muted-foreground">{unsupported().length ? `其他字段尚未适配，请在官方设置中维护：${unsupported().join('、')}` : ''}{!fields().length ? '该供应商没有可编辑的配置描述；只展示凭据状态。' : ''}</Text>
    <Text class="text-sm text-foreground">服务地址</Text>
    <Input testID="provider-endpoint" disabled={busy() || !supports('baseURL')} accessibilityLabel="服务地址" class={field} value={endpoint()} placeholder={route()?.defaultBaseURL ?? '使用默认地址'} onChange={value => endpoint.set(value)} />
    <Text class="text-sm text-foreground">协议（供应商支持的协议名）</Text>
    <Input testID="provider-protocol" disabled={busy() || !supports('api')} accessibilityLabel="协议" class={field} value={protocol()} onChange={value => protocol.set(value)} />
    <Text class="text-sm text-foreground">自定义模型目录（JSON，可留空使用默认目录）</Text>
    <Input testID="provider-models" disabled={busy() || !supports('models')} accessibilityLabel="模型目录" multiline class={field} value={models()} onChange={value => models.set(value)} />
    <Text class="text-sm text-foreground">凭据名称</Text>
    <Input testID="credential-ref" disabled={busy() || !!route()?.nativeAuth?.env?.length || !supports('apiKeyEnv')} accessibilityLabel="凭据名称" class={field} value={reference()} onChange={value => reference.set(value)} />
    <Text testID="credential-status" class="text-xs text-muted-foreground">{credentialStatus()}</Text>
    <Input testID="credential-value" disabled={busy()} accessibilityLabel="新密钥" class={field} masked autoComplete="off" value={secret()} placeholder="留空保留现有密钥" onChange={value => secret.set(value)} />
    <Action id="settings-save" label="保存配置与密钥" disabled={busy() || !writable()} run={() => { void save() }} />
    <Action id="credential-remove" label="移除存储密钥" disabled={busy() || !reference()} run={() => { void removeCredential() }} />
    <Action id="settings-refresh" label="重新读取" disabled={busy()} run={() => { void reload() }} />
    <Text testID="settings-status" class="text-xs text-muted-foreground">{status()}</Text>
  </View></Scroll>
}
