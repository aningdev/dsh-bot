import { run } from 'process'

/** Resolve the current user's launchd GUI domain and job without caching the UID. */
export async function launchTarget(label: string): Promise<{ domain: string; job: string }> {
  const user = await run('/usr/bin/id', ['-u'], { timeoutMs: 10000 })
  if (user.code !== 0 || !/^\d+$/.test(user.stdout.trim())) throw new Error('无法读取当前用户标识')
  const domain = `gui/${user.stdout.trim()}`
  return { domain, job: `${domain}/${label}` }
}
