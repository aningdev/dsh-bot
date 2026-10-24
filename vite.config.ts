import { builtinModules } from 'node:module'

import { defineConfig } from 'vite-plus'

const nativeImports = [
  ...new Set([
    ...builtinModules,
    ...builtinModules.map((name) => (name.startsWith('node:') ? name : 'node:' + name)),
    'electron',
    'electron/main',
    'electron/renderer',
    'electron/common',
  ]),
]
const ignorePatterns = [
  'references/**',
  '.vite-hooks/_/**',
  '**/routeTree.gen.ts',
  '**/node_modules/**',
  '**/.tanstack/**',
  '**/.vite/**',
  '**/dist/**',
  '**/out/**',
  '**/coverage/**',
  '**/playwright-report/**',
  '**/test-results/**',
]
export default defineConfig({
  lint: {
    ignorePatterns,
    jsPlugins: [
      { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
      { name: 'shadcn', specifier: '@shadcn/lint' },
    ],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    plugins: ['eslint', 'typescript', 'react', 'import', 'promise', 'node', 'vitest'],
    overrides: [
      {
        files: ['packages/ui/src/**'],
        rules: {
          'no-restricted-globals': [
            'error',
            'process',
            'Buffer',
            'require',
            'module',
            'exports',
            '__dirname',
            '__filename',
            'global',
          ],
          'no-restricted-imports': [
            'error',
            { paths: nativeImports, patterns: ['@/**', '**/apps/**'] },
          ],
        },
      },
      {
        files: ['apps/desktop/src/renderer/**'],
        rules: {
          'no-restricted-globals': [
            'error',
            'process',
            'Buffer',
            'require',
            'module',
            'exports',
            '__dirname',
            '__filename',
            'global',
          ],
          'no-restricted-imports': [
            'error',
            {
              paths: nativeImports,
              patterns: [
                {
                  group: ['@/main/**', '@/preload/**', '**/main/**', '**/preload/**'],
                  allowTypeImports: true,
                  message: 'Use the typed IPC client for native capabilities.',
                },
              ],
            },
          ],
        },
      },
      {
        files: ['apps/desktop/src/main/**'],
        rules: {
          'no-restricted-imports': [
            'error',
            { patterns: ['@/renderer/**', '**/renderer/**', '@/preload/**', '**/preload/**'] },
          ],
        },
      },
      {
        files: ['apps/desktop/src/preload/**'],
        rules: {
          'no-restricted-imports': [
            'error',
            { patterns: ['@/renderer/**', '**/renderer/**', '@/main/**', '**/main/**'] },
          ],
        },
      },
      {
        files: ['apps/desktop/src/shared/**'],
        rules: {
          'no-restricted-globals': [
            'error',
            'process',
            'Buffer',
            'require',
            'module',
            'exports',
            '__dirname',
            '__filename',
            'global',
          ],
          'no-restricted-imports': [
            'error',
            {
              paths: nativeImports,
              patterns: [
                '@/renderer/**',
                '@/main/**',
                '@/preload/**',
                '**/renderer/**',
                '**/main/**',
                '**/preload/**',
              ],
            },
          ],
        },
      },
    ],
  },
  fmt: {
    ignorePatterns,
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
    sortScripts: true,
    sortImports: true,
    sortTailwindcss: true,
  },
  staged: { '*': 'vp check --fix' },
})
