import { stat } from 'fs/promises'
import { dirname } from 'path'
import { run } from 'process'

// Standard readFile is limited to 64 MiB. Stream the old unbounded append-only log
// through a fixed system command, returning only its latest startup records.
const summary = String.raw`/^\[launch / { launch = $0; ready = "" }
/dsh web: http:\/\/127\.0\.0\.1:[0-9]+\/\?token=[A-Za-z0-9_-]+([[:space:]]|$)/ { ready = $0 }
END { print launch; print ready }`

export async function readLaunchLog(path: string): Promise<string> {
  await stat(path) // Preserve ENOENT and I/O failures at the caller's boundary.
  const result = await run('/usr/bin/awk', [summary, path], { cwd: dirname(path), timeoutMs: 10000 })
  if (result.code !== 0) throw new Error('无法读取旧后台的当前启动记录')
  return result.stdout
}
