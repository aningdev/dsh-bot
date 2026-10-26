import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

import { sourceAlias } from './scripts/vite-shared'

export default defineConfig({
  run: {
    tasks: {
      dev: {
        command: 'electron-forge start',
        dependsOn: ['@dsh-bot/runner#build-artifacts'],
      },
      unit: { command: 'vp test run', dependsOn: ['@dsh-bot/bot#build-artifacts'] },
      'package-e2e': {
        command: 'vp run package',
        dependsOn: ['@dsh-bot/runner#build-fixtures'],
      },
      e2e: { command: 'vp exec playwright test', dependsOn: ['package-e2e'] },
    },
  },
  plugins: [react({ compiler: true })],
  resolve: { alias: sourceAlias },
  test: {
    coverage: {
      include: ['src/main/**/*.ts', 'src/renderer/**/*.{ts,tsx}', 'src/shared/**/*.ts'],
      exclude: ['**/routeTree.gen.ts', '**/components/ui/**'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    reporters: ['verbose'],
    projects: [
      {
        extends: true,
        test: { name: 'main', include: ['tests/unit/main/**/*.test.ts'], environment: 'node' },
      },
      {
        extends: true,
        test: {
          name: 'renderer',
          include: ['tests/unit/renderer/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['tests/unit/renderer/setup.ts'],
          css: true,
        },
      },
    ],
  },
})
