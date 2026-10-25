import { execFileSync } from 'node:child_process'

/**
 * macOS refuses native full-screen transitions while the session is locked, so a
 * full-screen E2E cannot be exercised there. Returns a reason to skip, or false.
 */
export function lockedScreenReason(): false | string {
  if (process.platform !== 'darwin') return false
  try {
    const output = execFileSync('ioreg', ['-n', 'Root', '-d1'], { encoding: 'utf8' })
    return output.includes('"CGSSessionScreenIsLocked"=Yes')
      ? 'macOS session is locked, which blocks native full-screen transitions'
      : false
  } catch {
    return false
  }
}
