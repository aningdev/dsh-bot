import { createServer } from 'node:http'

const callId = 'nsh_fixture_bash'
const completion = 'NSH_APPROVAL_REJECTED'
type Block = { type?: string; text?: string; tool_use_id?: string; is_error?: boolean }
type Request = { messages?: { content?: string | Block[] }[] }

/** External Messages provider. Never calls a real model or injects a Host plugin. */
export async function startModelFixture() {
  let asked = false
  let rejected = false
  let requests = 0
  const server = createServer(async (request, response) => {
    try {
      if (request.method !== 'POST' || request.url !== '/v1/messages') {
        response.writeHead(404).end()
        return
      }
      let body = ''
      for await (const chunk of request) {
        body += chunk.toString()
        if (body.length > 2_000_000) throw new Error('Fixture request too large')
      }
      const parsed = JSON.parse(body) as Request
      requests++
      const blocks = (parsed.messages ?? []).flatMap(message => typeof message.content === 'string'
        ? [{ type: 'text', text: message.content }] : message.content ?? [])
      const target = blocks.some(block => block.text?.includes('NSH_APPROVAL_PROBE'))
      const result = blocks.find(block => block.type === 'tool_result' && block.tool_use_id === callId)
      const tool = target && result === undefined
      if (tool) asked = true
      if (result !== undefined) {
        if (result.is_error !== true) throw new Error('Expected rejection to produce a tool error')
        rejected = true
      }
      const events: object[] = [
        { type: 'message_start', message: { id: `nsh-${requests}`, model: 'deepseek-flash', usage: { input_tokens: 3, output_tokens: 0 } } },
      ]
      if (tool) events.push(
        { type: 'content_block_start', index: 0, content_block: { type: 'tool_use', id: callId, name: 'bash', input: {} } },
        { type: 'content_block_delta', index: 0, delta: { type: 'input_json_delta', partial_json: JSON.stringify({
          command: "printf 'fixture-ok\\n'",
          description: 'Print a harmless fixture marker',
          sandbox_permissions: 'danger-full-access',
          justification: 'NSH approval rejection transport probe',
        }) } },
      )
      else events.push({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: target ? completion : 'Fixture session' } })
      events.push(
        { type: 'content_block_stop', index: 0 },
        { type: 'message_delta', delta: { stop_reason: tool ? 'tool_use' : 'end_turn' }, usage: { output_tokens: 1 } },
        { type: 'message_stop' },
      )
      response.writeHead(200, { 'content-type': 'text/event-stream' })
      response.end(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join(''))
    } catch (error) {
      console.error('Model fixture:', String(error))
      response.writeHead(500).end('Fixture failed')
    }
  })
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Fixture has no TCP address')
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    verify() {
      if (!asked || !rejected) throw new Error(`Approval fixture incomplete: asked=${asked}, rejected=${rejected}, requests=${requests}`)
      console.log('External model observed rejected tool result; no real supplier used')
    },
    async close() {
      server.closeAllConnections()
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    },
  }
}
