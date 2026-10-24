import { defineConfig } from 'vite-plus'
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
