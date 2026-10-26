import { typertPlugin } from '@deepseek-ai/dsh-typert-generator/tsdown'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    tasks: {
      'build-artifacts': {
        command: ['vp build', 'vp exec tsc -p tsconfig.json', 'vpx scripts/verify-artifacts.mjs'],
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
        admission: 'src/admission.ts',
        'file-uploads': 'src/file-uploads.ts',
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
      // Upstream's builder plugin lowers the Typert marker decorators to plain
      // calls and emits the Remote artifacts; the Node runtime has no decorator
      // syntax, so neither step may be skipped.
      plugins: [typertPlugin({ faces: ['host'] })],
    },
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
  },
})
