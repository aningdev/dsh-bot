import { runnerClient } from '../../runner'
import { createBotHandlers } from './handlers'

export const bot = createBotHandlers(runnerClient)
