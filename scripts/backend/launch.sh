#!/bin/sh
# launchd owns this process; exec preserves the PID recorded in the launch marker.
set -eu
cli="$1"
expected="$2"
actual="$("$cli" --version)"
if [ "$actual" != "$expected" ]; then
  echo 'Unsupported installed dsh version; refusing to launch.' >&2
  exit 78
fi
printf '[launch %s] pid=%s version=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$$" "$actual"
# A GUI launchd job does not inherit exports from the user's terminal. Read the
# macOS login zsh environment in-process; never serialize credentials to the plist.
# Keep shell startup output out of the backend log, then restore the log streams
# for the CLI. Reapply the product roots after shell startup so they stay isolated.
exec /bin/zsh -lc '
  export DSH_HOME="$1" DSH_AGENTS_HOME="$2"
  shift 2
  exec "$@" 1>&3 2>&4 3>&- 4>&-
' dsh-backend "$DSH_HOME" "$DSH_AGENTS_HOME" "$cli" web --host 127.0.0.1 --port 0 --no-open 3>&1 4>&2 >/dev/null 2>&1
