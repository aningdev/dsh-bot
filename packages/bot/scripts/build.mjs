/** Build the plugin and generate strict Remote artifacts through the public npm generator. */
import { fileURLToPath } from 'node:url'

import {
  WorkspaceTypertGenerator,
  writeWorkspaceArtifacts,
} from '@deepseek-ai/dsh-typert-generator'
import { build } from 'esbuild'
import ts from 'typescript'
const root = fileURLToPath(new URL('../../../', import.meta.url))
const packageRoot = fileURLToPath(new URL('../', import.meta.url))
const configPath = packageRoot + 'tsconfig.json'
const config = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file))
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'))
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, packageRoot)
const program = ts.createProgram(parsed.fileNames, parsed.options)
const diagnostics = ts.getPreEmitDiagnostics(program)
if (diagnostics.length)
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (f) => f,
      getNewLine: () => '\n',
    }),
  )
program.emit()
await build({
  entryPoints: [packageRoot + 'src/index.ts', packageRoot + 'src/types.ts'],
  outdir: packageRoot + 'lib',
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  target: 'node24',
})
const artifacts = new WorkspaceTypertGenerator(root).generateContributors(['host'])
if (
  !artifacts.some(
    (artifact) => artifact.package === '@dsh-bot/bot' && artifact.remote !== undefined,
  )
)
  throw new Error('Bot Remote artifacts were not generated')
writeWorkspaceArtifacts(root, artifacts)
