/** Deterministic external model replacement for automated tests. */
import {
  LlmAdapter,
  ReasoningEffortId,
  ToolCallId,
  type GenerateOptions,
  type LlmModelInfo,
  type LlmResolvedModelInfo,
  type StreamChunk,
} from '@deepseek-ai/dsh-llm'

/** Provider route the {@link FakeModelAdapter} owns. */
export const FAKE_PROVIDER = 'fake'

/** Model id the {@link FakeModelAdapter} advertises. */
export const FAKE_MODEL = 'fake-1'

/** Model context window the fake route reports, in tokens. */
const CONTEXT_WINDOW = 128_000

/**
 * Reply the adapter streams for one request: the last user text, echoed back.
 * @param options - the assembled request the loop produced.
 * @returns the exact text the model answers with.
 */
export function replyFor(options: GenerateOptions): string {
  const texts = options.messages
    .filter((message) => message.role === 'user' && message.source?.kind === 'user')
    .flatMap((message) => message.content)
    .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
  const last = texts.at(-1)?.text ?? ''
  if (last === 'inspect configuration')
    return JSON.stringify({
      model: options.model,
      maxTokens: options.maxTokens ?? null,
      reasoningEffort: options.reasoningEffort ?? null,
      system: JSON.stringify(options.messages.filter((message) => message.role === 'system')),
      context: JSON.stringify(
        options.messages.filter(
          (message) => message.role === 'user' && message.source?.kind !== 'user',
        ),
      ),
      tools: options.tools?.map((tool) => tool.name).sort() ?? [],
    })
  return `${options.model === 'fake-2' ? 'echo-v2' : 'echo'}: ${last}`
}

/**
 * Deterministic model route: no network, no key, same answer for the same prompt.
 * Streams character by character so streaming paths are exercised, not assumed.
 */
export class FakeModelAdapter extends LlmAdapter {
  private readonly held = new Set<() => void>()
  /**
   * @param provider - one of the routes this adapter was registered for.
   * @returns display metadata whose id equals the provider.
   */
  override providerInfo(provider: string): { id: string; name: string } {
    return { id: provider, name: 'Fake provider' }
  }

  /**
   * @param provider - registered route.
   * @returns the two advertised models.
   */
  override async listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return [FAKE_MODEL, 'fake-2'].map((id) => ({ provider, id, name: id }))
  }

  /**
   * @param provider - registered route.
   * @param model - requested model id.
   * @returns resolved metadata for the fake route.
   */
  override async resolveModel(provider: string, model: string): Promise<LlmResolvedModelInfo> {
    if (model !== FAKE_MODEL && model !== 'fake-2') throw new Error(`Unknown fake model: ${model}`)
    return {
      provider,
      id: model,
      name: model,
      context: { contextWindow: CONTEXT_WINDOW },
      ...(model === 'fake-2'
        ? { reasoning: { efforts: [{ id: ReasoningEffortId('high'), name: 'High' }] } }
        : {}),
    }
  }

  /**
   * @param options - the assembled request; `options.signal` aborts the stream.
   * @returns the scripted chunk stream.
   */
  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    let text = replyFor(options)
    const userIndex = options.messages.findLastIndex(
      (message) => message.role === 'user' && message.source?.kind === 'user',
    )
    const prompt = options.messages[userIndex]?.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
    if (prompt === 'tool success' || prompt === 'tool failure' || prompt === 'tool approval') {
      const mode =
        prompt === 'tool approval' ? 'approval' : prompt === 'tool success' ? 'success' : 'failure'
      // Providers may reuse a call id in a later Step or Turn.
      const id = ToolCallId('activity-probe')
      const currentTurn = options.messages.slice(userIndex + 1)
      const result = currentTurn.find(
        (message) => message.role === 'tool' && message.toolCallId === id,
      )
      if (result?.role === 'tool') {
        text = result.isError ? 'tool failed' : 'tool completed'
      } else {
        if (
          currentTurn.some((message) =>
            message.content.some((block) => block.type === 'tool-call' && block.id === id),
          )
        )
          throw new Error('Activity tool call has no corresponding result')
        const argumentsJson = JSON.stringify({ mode, value: 'alpha' })
        yield { type: 'block-start', index: 0, blockType: 'tool-call' }
        yield {
          type: 'tool-call-delta',
          index: 0,
          id,
          name: 'activity_probe',
          argumentsDelta: argumentsJson,
        }
        yield {
          type: 'block-end',
          index: 0,
          block: { type: 'tool-call', id, name: 'activity_probe', arguments: argumentsJson },
        }
        yield { type: 'usage', usage: { inputTokens: 1, outputTokens: 1 } }
        yield { type: 'finish', reason: { kind: 'tool-calls' } }
        return
      }
    }
    if (text === 'echo: fail') throw new Error('Deterministic model failure')
    if (text === 'echo: release') for (const release of [...this.held]) release()
    yield { type: 'block-start', index: 0, blockType: 'text' }
    let first = true
    for (const character of text) {
      if (options.signal?.aborted) return
      yield { type: 'text-delta', index: 0, text: character }
      if (first && text === 'echo: hold') {
        first = false
        await this.waitForRelease(options.signal)
      }
    }
    yield { type: 'block-end', index: 0, block: { type: 'text', text } }
    yield { type: 'usage', usage: { inputTokens: 1, outputTokens: text.length } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }

  private waitForRelease(signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanup = (): void => {
        this.held.delete(release)
        signal?.removeEventListener('abort', abort)
      }
      const release = (): void => {
        cleanup()
        resolve()
      }
      const abort = (): void => {
        cleanup()
        reject(new Error('aborted'))
      }
      if (signal?.aborted) {
        abort()
        return
      }
      this.held.add(release)
      signal?.addEventListener('abort', abort, { once: true })
    })
  }
}
