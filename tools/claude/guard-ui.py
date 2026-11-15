#!/usr/bin/env python3
"""PreToolUse guard for app UI (David, 15 Nov 2026).

Headers, segmented controls, primary buttons and the shared screens (settings,
account, personal details, location, terms, privacy, GDPR) are locked to the
ZESTY kit in ~/Desktop/os/ui-kit. Claude kept changing them in single apps.

- deny: editing a kit copy inside an app (first line "ui-kit: copy of").
  The change belongs in the kit, then `ui-kit sync`.
- deny: a segmented control that is not the kit's SegmentedControl.
- ask:  any header option, any locked shared screen, and the kit's own locked
  files. David approves in the permission prompt or it does not happen.
Bash edits (sed -i, python open(..., "w"), heredocs into files) get the same
checks, so routing around Edit/Write does not get past this.

Unlock for work David asked for: ~/.claude/ui-unlock holding his request.
It lasts UNLOCK_HOURS from when it was written; writing it is itself an
"ask", so David approves every unlock. Kit copies stay denied either way.
"""
import json
import os
import re
import sys
import time

HOME = os.path.expanduser("~")
OS = os.path.join(HOME, "Desktop/os")
APP_ROOTS = [os.path.join(OS, p) + "/" for p in ("void-app", "preppers-app", "tos-admin")]
KIT_ROOT = os.path.join(OS, "ui-kit") + "/"
UNLOCK = os.path.join(HOME, ".claude/ui-unlock")
UNLOCK_HOURS = 8

HEADER = re.compile(
    r"\b(headerTransparent|headerStyle|headerBlurEffect|headerLargeTitle\w*|"
    r"headerShadowVisible|headerTintColor|headerTitleStyle|headerBackground|"
    r"headerBackButtonDisplayMode|setIOSHeaderBackground|"
    r"enableLegacyHeaderAppearance|scrollEdgeEffects|stackHeaderOptions)\b"
)
FOREIGN_SEGMENTED = re.compile(
    r"@react-native-segmented-control|@expo/ui/[\w/-]*segmented|"
    r"(function|const|class)\s+\w*Segment(ed)?(Control|Bar|Tabs|Picker)\w*\s*[=(<:]"
)
LOCKED_SCREEN = re.compile(
    r"/(privacy|terms|gdpr|personal-details[\w-]*|personal|settings|location[\w-]*|"
    r"locations?/index|account/index)\.tsx\b"
)
KIT_LOCKED = re.compile(
    r"(?:^|/)(SegmentedControl|SegmentBar|InsetShell|PillButton|Button|useThemeColors|"
    r"stackHeader\w*)\.tsx?\b|/native/files/src/screens/"
)
WRITES = re.compile(r"sed\s+-i|perl\s+-[a-z]*i|open\([^)]*['\"][wa]|write_text|tee\s|>\s*\S+\.(tsx?|json)")


def out(decision, reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def in_app(path):
    return any(path.startswith(r) for r in APP_ROOTS) and "/node_modules/" not in path


def first_line(path):
    try:
        with open(path, encoding="utf-8", errors="ignore") as f:
            return f.readline()
    except OSError:
        return ""


def unlocked():
    try:
        return time.time() - os.path.getmtime(UNLOCK) < UNLOCK_HOURS * 3600
    except OSError:
        return False


def check_text(path, text):
    """Shared rules for one file path and the text being written into it."""
    if path == UNLOCK:
        out("ask", "UNLOCKS headers, segmented controls and shared screens for 8 hours. Approve only if David asked for this work in chat.")
    if in_app(path):
        if "ui-kit: copy of" in first_line(path):
            out("deny", f"{path} is a ZESTY kit copy. Edit it in ~/Desktop/os/ui-kit/native/files and run `node ~/Desktop/os/ui-kit/bin/ui-kit.mjs sync <app>`.")
        if unlocked():
            return
        if FOREIGN_SEGMENTED.search(text):
            out("deny", "Segmented controls come from the kit only: import { SegmentedControl } from \"@/components/ui/inputs/SegmentedControl\" (or SegmentBar). No other library, no home-made one.")
        if HEADER.search(text):
            out("ask", f"HEADER CHANGE in {path}. Headers are locked (David, 15 Nov). Approve only if David asked for this exact change in chat.")
        if LOCKED_SCREEN.search(path):
            out("ask", f"LOCKED SHARED SCREEN {path}. Settings/account/personal details/location/terms/privacy/GDPR come from the ZESTY kit. Approve only if David asked.")
    elif path.startswith(KIT_ROOT) and KIT_LOCKED.search(path) and not unlocked():
        out("ask", f"KIT LOCKED FILE {path}: this changes every app. Approve only if David asked.")


def main():
    try:
        data = json.load(sys.stdin)
    except ValueError:
        sys.exit(0)
    tool = data.get("tool_name", "")
    ti = data.get("tool_input") or {}

    if tool in ("Edit", "Write", "MultiEdit", "NotebookEdit"):
        path = os.path.realpath(ti.get("file_path") or ti.get("notebook_path") or "")
        parts = [ti.get("new_string", ""), ti.get("content", ""), ti.get("new_source", "")]
        parts += [e.get("new_string", "") for e in ti.get("edits") or []]
        check_text(path, "\n".join(p for p in parts if p))
        sys.exit(0)

    if tool == "Bash":
        cmd = ti.get("command", "")
        cwd = os.path.realpath(data.get("cwd") or "") + "/"
        touches_app = in_app(cwd) or any(r.rstrip("/") in cmd for r in APP_ROOTS) or "void-app" in cmd
        touches_kit = cwd.startswith(KIT_ROOT) or "ui-kit/native" in cmd or "ui-kit/gallery" in cmd
        if "ui-unlock" in cmd:
            out("ask", "UNLOCKS headers, segmented controls and shared screens for 8 hours. Approve only if David asked for this work in chat.")
        if not WRITES.search(cmd):
            sys.exit(0)
        if touches_app:
            if "ui-kit: copy of" in cmd:
                out("deny", "Shell edit of a ZESTY kit copy inside an app. Edit the kit and sync.")
            if unlocked():
                sys.exit(0)
            if FOREIGN_SEGMENTED.search(cmd):
                out("deny", "Segmented controls come from the kit only.")
            if HEADER.search(cmd) or LOCKED_SCREEN.search(cmd):
                out("ask", "Shell edit touching HEADERS or a LOCKED SHARED SCREEN in an app. Approve only if David asked for it in chat.")
        if touches_kit and KIT_LOCKED.search(cmd) and not unlocked():
            out("ask", "Shell edit of a locked kit file (changes every app). Approve only if David asked.")
    sys.exit(0)


if __name__ == "__main__":
    main()
