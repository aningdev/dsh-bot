import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    tasks: {
      'build-artifacts': {
        command: ['vp build', 'vp exec tsc -p tsconfig.json', 'vpx scripts/build.mjs'],
      },
      'check-types': {
        command: 'vp exec tsc --noEmit -p tests/tsconfig.json',
        dependsOn: ['build-artifacts'],
      },
      unit: { command: 'vp test run', dependsOn: ['build-artifacts'] },
    },
  },
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
