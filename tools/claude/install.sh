#!/bin/sh
# Installs the ZESTY UI guard for Claude Code on this Mac (David, 15 Nov 2026).
# Blocks Claude from editing kit copies inside apps or adding non-kit segmented
# controls, and asks before any header or shared-screen change.
set -e
mkdir -p "$HOME/.claude/hooks"
cp "$(dirname "$0")/guard-ui.py" "$HOME/.claude/hooks/guard-ui.py"
python3 - <<'PY'
import json, os
p = os.path.expanduser("~/.claude/settings.json")
s = json.load(open(p)) if os.path.exists(p) else {}
pre = s.setdefault("hooks", {}).setdefault("PreToolUse", [])
cmd = "python3 " + os.path.expanduser("~/.claude/hooks/guard-ui.py")
if not any(h.get("command") == cmd for e in pre for h in e.get("hooks", [])):
    pre.append({"matcher": "Edit|Write|MultiEdit|NotebookEdit|Bash", "hooks": [{"type": "command", "command": cmd, "timeout": 10}]})
json.dump(s, open(p, "w"), indent=2)
print("guard-ui installed")
PY
