/** Generate strict Remote artifacts through the public npm generator after the build. */
import { fileURLToPath } from 'node:url'

import {
  WorkspaceTypertGenerator,
  writeWorkspaceArtifacts,
} from '@deepseek-ai/dsh-typert-generator'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const artifacts = new WorkspaceTypertGenerator(root).generateContributors(['host'])
if (
  !artifacts.some(
    (artifact) => artifact.package === '@dsh-bot/bot' && artifact.remote !== undefined,
  )
)
  throw new Error('Bot Remote artifacts were not generated')
writeWorkspaceArtifacts(root, artifacts)
