import { app } from 'electron'

import { RunnerClient } from './runner-client'
import { runnerHome } from './runner-connection'

// No filesystem or network access until an IPC operation asks for a connection.
export const runnerClient = new RunnerClient({ home: () => runnerHome(app.getPath('userData')) })
