#!/bin/sh
# Resolve Node inside the user's login/interactive environment, including version managers.
# Arguments stay in environment variables so shell startup output and paths cannot become code.
export DSH_BOT_NODE_MODE="$1" DSH_BOT_NODE_SERVICE="$2" DSH_BOT_NODE_HOME="$3"
export DSH_BOT_NODE_PROBE='
const minimum = "24.9.0";
const version = process.versions.node;
const parts = version.split(".").map(Number);
if (process.versions.bun || parts[0] < 24 || (parts[0] === 24 && parts[1] < 9) || version.includes("-")) {
  console.error(`Node 版本不符合要求：${version}（${process.execPath}）。请安装 Node ${minimum} 或更新稳定版，然后重新检测。`);
  process.exit(1);
}
const [mode, service, home] = process.argv.slice(1);
if (mode === "check") {
  console.log("DSH_BOT_NODE:" + JSON.stringify({ path: process.execPath, version }));
} else if (mode === "start" && service) {
  const result = require("node:child_process").spawnSync(process.execPath, [service, "start", ...(home ? [home] : [])], { stdio: "inherit", env: process.env });
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
} else {
  console.error("无效的 Node 启动请求"); process.exit(1);
}
'
user_shell=${SHELL:-}
if [ -z "$user_shell" ] && [ -x /usr/bin/dscl ]; then
  shell_record=$(/usr/bin/dscl . -read "/Users/$(/usr/bin/id -un)" UserShell 2>/dev/null)
  case "$shell_record" in 'UserShell: '*) user_shell=${shell_record#UserShell: } ;; esac
fi
user_shell=${user_shell:-/bin/sh}
if [ ! -x "$user_shell" ]; then
  printf '%s\n' '无法启动用户 Shell，请检查系统登录 Shell 配置后重新检测。' >&2
  exit 1
fi
"$user_shell" -ilc 'exec node -e "$DSH_BOT_NODE_PROBE" "$DSH_BOT_NODE_MODE" "$DSH_BOT_NODE_SERVICE" "$DSH_BOT_NODE_HOME"'
result=$?
if [ "$result" -ne 0 ]; then
  printf '%s\n' '无法启动本机 Node。请确认用户终端中的 node 可执行且版本至少为 24.9.0，安装或升级后重新检测。' >&2
fi
exit "$result"
