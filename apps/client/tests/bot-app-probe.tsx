import { mount } from 'nsh'
import { ClientApp } from '../frontend/main'
import { backendHost } from '../frontend/application/backend/host'

// This composition uses the actual UI and protocol client with an isolated backend.
// The production manifest and discovery code do not need a test endpoint override.
backendHost.discover = async () => {
  const url = globalThis.process.env.DSH_SPIKE_URL
  if (!url) throw new Error('Missing isolated backend endpoint')
  return { url }
}
mount(ClientApp)
