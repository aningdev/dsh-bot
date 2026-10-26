import { defineConfig } from 'vite-plus'

export default defineConfig(({ mode }) => {
  const fixtures = mode === 'test-fixtures'
  const entry: Record<string, string> = fixtures
    ? {
        model: 'tests/fixtures/model.ts',
        'tool-activity': 'tests/fixtures/tool-activity.ts',
        'session-controller-probe': 'tests/fixtures/session-controller-probe.ts',
        'shutdown-failure': 'tests/fixtures/shutdown-failure.ts',
      }
    : { index: 'src/index.ts' }
  return {
    run: {
      tasks: {
        'build-artifacts': {
          command: 'vp build',
          dependsOn: ['@dsh-bot/bot#build-artifacts'],
        },
        'build-fixtures': {
          command: 'vp build --mode test-fixtures',
          dependsOn: ['build-artifacts'],
        },
        'check-types': {
          command: [
            'vp exec tsc --noEmit -p tsconfig.json',
            'vp exec tsc --noEmit -p tsconfig.tests.json',
          ],
          dependsOn: ['@dsh-bot/bot#build-artifacts'],
        },
        unit: { command: 'vp test run', dependsOn: ['build-fixtures'] },
      },
    },
    build: {
      target: 'node24',
      outDir: fixtures ? '.test-output' : 'lib',
      minify: false,
      lib: {
        entry,
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
      testTimeout: 30000,
      hookTimeout: 30000,
    },
  }
})
