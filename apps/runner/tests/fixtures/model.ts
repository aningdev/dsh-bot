/** Deterministic external model replacement, loaded only by the test overlay. */
import type { Context } from '@deepseek-ai/cordis'

import { FakeModelAdapter } from '../../../../packages/bot/tests/fixtures/fake-model.ts'
export const name = 'test-model'
export const inject = ['llm']
/** @param ctx - Test profile context. */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.llm.registerAdapter(['fake'], new FakeModelAdapter()))
}
