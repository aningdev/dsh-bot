/** Scripted model provider used by tests and local development. */
import { LlmAdapter, type GenerateOptions, type LlmModelInfo, type LlmResolvedModelInfo, type StreamChunk } from '@deepseek-ai/dsh-llm'

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
    .filter((message) => message.role === 'user')
    .flatMap((message) => message.content)
    .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
  const last = texts.at(-1)?.text ?? ''
  return `echo: ${last}`
}

/**
 * Deterministic model route: no network, no key, same answer for the same prompt.
 * Streams character by character so streaming paths are exercised, not assumed.
 */
export class FakeModelAdapter extends LlmAdapter {
  /** @param provider - registered route; the adapter reports itself under this id. */
  constructor(private readonly provider: string = FAKE_PROVIDER) {
    super()
  }

  /**
   * @param provider - one of the routes this adapter was registered for.
   * @returns display metadata whose id equals the provider.
   */
  override providerInfo(provider: string): { id: string; name: string } {
    return { id: provider, name: 'Fake provider' }
  }

  /**
   * @param _provider - ignored; the fake route advertises one model.
   * @returns the single advertised model.
   */
  override async listModels(_provider: string): Promise<readonly LlmModelInfo[]> {
    return [{ id: FAKE_MODEL, name: 'Fake model', contextWindow: CONTEXT_WINDOW }]
  }

  /**
   * @param provider - registered route.
   * @param model - requested model id.
   * @returns resolved metadata for the fake route.
   */
  override async resolveModel(provider: string, model: string): Promise<LlmResolvedModelInfo> {
    return { provider, model, contextWindow: CONTEXT_WINDOW }
  }

  /**
   * @param options - the assembled request; `options.signal` aborts the stream.
   * @returns the scripted chunk stream.
   */
  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const text = replyFor(options)
    yield { type: 'block-start', index: 0, blockType: 'text' }
    for (const character of text) {
      if (options.signal.aborted) return
      yield { type: 'text-delta', index: 0, text: character }
    }
    yield { type: 'block-end', index: 0, block: { type: 'text', text } }
    yield { type: 'usage', usage: { inputTokens: 1, outputTokens: text.length } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
