import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

const workspace = fileURLToPath(new URL('../../../', import.meta.url))
export const runnerResource = path.join(workspace, 'apps/desktop/.cache/runner')
const nodeVersion = '24.15.0'
const archives: Record<string, string> = {
  arm64: '372331b969779ab5d15b949884fc6eaf88d5afe87bde8ba881d6400b9100ffc4',
  x64: 'ffd5ee293467927f3ee731a553eb88fd1f48cf74eebc2d74a6babe4af228673b',
}
const manifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  dependencies: z.record(z.string(), z.string()).default({}),
  peerDependencies: z.record(z.string(), z.string()).default({}),
  optionalDependencies: z.record(z.string(), z.string()).default({}),
  peerDependenciesMeta: z
    .record(z.string(), z.object({ optional: z.boolean().optional() }))
    .default({}),
})

async function manifest(directory: string) {
  return manifestSchema.parse(
    JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8')),
  )
}

async function resolvePackage(declarer: string, name: string): Promise<string | undefined> {
  const require = createRequire(path.join(declarer, 'package.json'))
  for (const directory of require.resolve.paths(name) ?? []) {
    try {
      return await realpath(path.join(directory, name))
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error
    }
  }
  return undefined
}

/** Copy the installed production graph, including peers.
 * Each physical package keeps its own dependency edges; links are relative and stay inside the resource.
 * Root aliases support published dynamic loaders that resolve a sibling's optional package.
 * Workspace packages contribute only their runtime files, never source, tests, or references.
 */
async function materialize(output: string): Promise<{ name: string; version: string }[]> {
  const copied = new Map<string, string>()
  const exposed = new Set<string>()
  const packages: { name: string; version: string }[] = []
  async function visit(source: string, destination?: string): Promise<string> {
    source = await realpath(source)
    const previous = copied.get(source)
    if (previous !== undefined) return previous
    const info = await manifest(source)
    const target =
      destination ??
      path.join(output, 'node_modules/.store', String(copied.size), 'node_modules', info.name)
    copied.set(source, target)
    if (!exposed.has(info.name)) {
      exposed.add(info.name)
      const alias = path.join(output, 'node_modules', info.name)
      await mkdir(path.dirname(alias), { recursive: true })
      await symlink(path.relative(path.dirname(alias), target), alias, 'dir')
    }
    packages.push({ name: info.name, version: info.version })
    await mkdir(path.dirname(target), { recursive: true })
    if (info.name.startsWith('@dsh-bot/')) {
      await mkdir(target, { recursive: true })
      const files =
        info.name === '@dsh-bot/runner'
          ? ['package.json', 'lib']
          : ['package.json', 'lib', 'cordis.patch.yml']
      if (info.name === '@dsh-bot/harness-runtime') files.splice(files.indexOf('lib'), 1)
      for (const file of files)
        await cp(path.join(source, file), path.join(target, file), {
          recursive: true,
          dereference: true,
        })
    } else {
      await cp(source, target, {
        recursive: true,
        dereference: true,
        filter: (filename) =>
          !path.relative(source, filename).split(path.sep).includes('node_modules'),
      })
    }
    const dependencies = new Set([
      ...Object.keys(info.dependencies),
      ...Object.keys(info.peerDependencies),
      ...Object.keys(info.optionalDependencies),
    ])
    for (const name of dependencies) {
      const resolved = await resolvePackage(source, name)
      if (resolved === undefined) {
        if (name in info.optionalDependencies || info.peerDependenciesMeta[name]?.optional) continue
        throw new Error(`Runner resource: missing ${name} required by ${info.name}`)
      }
      const dependency = await visit(resolved)
      const link = path.join(target, 'node_modules', name)
      await mkdir(path.dirname(link), { recursive: true })
      await symlink(path.relative(path.dirname(link), dependency), link, 'dir')
    }
    return target
  }
  await visit(path.join(workspace, 'apps/runner'), path.join(output, 'apps/runner'))
  return packages
}

async function prepareNode(output: string, arch: string): Promise<void> {
  const expected = archives[arch]
  if (expected === undefined) throw new Error('Runner resource: unsupported macOS architecture')
  const cache = path.join(workspace, '.cache/node')
  await mkdir(cache, { recursive: true })
  const name = `node-v${nodeVersion}-darwin-${arch}`
  const archive = path.join(cache, name + '.tar.gz')
  let body: Buffer
  try {
    body = await readFile(archive)
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error
    const response = await fetch(`https://nodejs.org/dist/v${nodeVersion}/${name}.tar.gz`, {
      signal: AbortSignal.timeout(120_000),
    })
    if (!response.ok) throw new Error(`Node download failed: ${response.status}`)
    body = Buffer.from(await response.arrayBuffer())
  }
  if (createHash('sha256').update(body).digest('hex') !== expected) {
    await rm(archive, { force: true })
    throw new Error('Runner resource: Node archive checksum mismatch')
  }
  await writeFile(archive, body)
  const extracted = await mkdtemp(path.join(cache, 'extract-'))
  try {
    execFileSync('/usr/bin/tar', [
      '-xzf',
      archive,
      '-C',
      extracted,
      '--strip-components=1',
      `${name}/bin/node`,
      `${name}/LICENSE`,
    ])
    await cp(path.join(extracted, 'bin'), path.join(output, 'bin'), { recursive: true })
    await cp(path.join(extracted, 'LICENSE'), path.join(output, 'NODE_LICENSE'))
  } finally {
    await rm(extracted, { recursive: true, force: true })
  }
}

/** Forge prepares only a native macOS payload; cross-target native dependencies must not be guessed. */
export async function prepareRunnerRuntime(platform: string, arch: string): Promise<void> {
  if (platform !== 'darwin' || process.platform !== platform || process.arch !== arch)
    throw new Error('Runner resource: build on the target macOS architecture')
  execFileSync(
    process.execPath,
    [path.join(workspace, 'node_modules/vite-plus/bin/vp'), 'run', '@dsh-bot/runner#build'],
    {
      cwd: workspace,
      stdio: 'inherit',
    },
  )
  await mkdir(path.dirname(runnerResource), { recursive: true })
  const staging = await mkdtemp(path.join(path.dirname(runnerResource), 'runner-stage-'))
  try {
    await prepareNode(staging, arch)
    const packages = await materialize(staging)
    const root = JSON.parse(await readFile(path.join(workspace, 'package.json'), 'utf8'))
    const lock = await readFile(path.join(workspace, 'bun.lock'))
    const metadata = {
      schemaVersion: 1,
      platform,
      arch,
      node: nodeVersion,
      lockSha256: createHash('sha256').update(lock).digest('hex'),
      patches: Object.entries(
        z.record(z.string(), z.string()).parse(root.patchedDependencies ?? {}),
      ).map(([name, filename]) => ({ name, filename })),
      packages,
    }
    await writeFile(path.join(staging, 'runtime.json'), JSON.stringify(metadata, null, 2) + '\n')
    await rm(runnerResource, { recursive: true, force: true })
    await rename(staging, runnerResource)
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}
