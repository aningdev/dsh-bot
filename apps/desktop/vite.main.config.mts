import { defineConfig } from 'vite'

import { sourceAlias } from './scripts/vite-shared'
export default defineConfig({
  resolve: { alias: sourceAlias },
  build: {
    target: 'node22',
    lib: { entry: 'src/main/index.ts', formats: ['es'], fileName: () => 'main.mjs' },
    rolldownOptions: {
      output: {
        // Bundled CommonJS dependencies still load Node/Electron built-ins.
        banner:
          "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
      },
    },
  },
})
