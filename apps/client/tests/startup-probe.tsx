import { mount } from 'nsh'
import { ClientApp } from '../frontend/main'
import { backendHost } from '../frontend/application/backend/host'
import { loadBots } from '../frontend/application/bots/registry'
import { botsRoot } from '../frontend/infrastructure/storage/records'

// Run through `nsh run`: its development bundle loader differs from `nsh test`.
const root = globalThis.process.env.DSH_BOTS_HOME
if (!root || botsRoot() !== root) throw new Error('Startup fixture lost its isolated registry environment')
backendHost.discover = async () => { throw new Error('Isolated startup fixture has no backend') }
mount(ClientApp)
void loadBots().then(({ bots, damaged }) => {
  if (bots.length || damaged.length) throw new Error('Startup fixture registry is not empty')
  console.log('[dsh-startup] ready')
}).catch(error => { console.error('[dsh-startup] failed', error) })
