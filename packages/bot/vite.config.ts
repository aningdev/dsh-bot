import { defineConfig } from 'vite-plus'

export default defineConfig({
  build: {
    target: 'node24',
    outDir: 'lib',
    minify: false,
    lib: {
      entry: {
        index: 'src/index.ts',
        types: 'src/types.ts',
        'session-controller': 'src/session-controller.ts',
      },
      formats: ['es'],
      fileName: (_format, name) => name + '.js',
    },
    rolldownOptions: {
      platform: 'node',
      external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0'),
    },
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
  },
})
