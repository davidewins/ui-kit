#!/usr/bin/env node
// ZESTY UI (ui-kit): one source for every app's components and tokens.
//
//   node bin/ui-kit.mjs tokens        regenerate native/files/src/globals.css from tokens.json
//   node bin/ui-kit.mjs sync <app>    copy the files listed in <app>/ui-kit.json into the app
//   node bin/ui-kit.mjs check <app>   fail if the app's copies differ from the kit, or app
//                                     code imports something ZESTY wraps (BANNED)
//
// Each synced file gets a one-line header saying where it lives. Seeds are
// copied once (only when missing) and are then owned by the app.
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd, appArg] = process.argv.slice(2);

function header(kitPath) {
  const msg = `ui-kit: copy of davidewins/ui-kit ${kitPath}. Edit it there and sync; local edits fail ui-kit:check.`;
  return kitPath.endsWith(".css") ? `/* ${msg} */\n` : `// ${msg}\n`;
}

// Text files get the header line; binary assets (sounds, images) are copied as-is.
const TEXT = /\.(tsx?|jsx?|css|json|md)$/;

function kitContent(kind, file) {
  const kitPath = `${kind}/files/${file}`;
  const src = join(KIT, kitPath);
  if (!existsSync(src)) throw new Error(`not in kit: ${kitPath}`);
  if (!TEXT.test(file)) return readFileSync(src);
  return header(kitPath) + readFileSync(src, "utf8");
}

const sha = (s) => createHash("sha256").update(s).digest("hex");

function readConfig(app) {
  const p = join(app, "ui-kit.json");
  if (!existsSync(p)) throw new Error(`${p} missing`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function tokens() {
  const t = JSON.parse(readFileSync(join(KIT, "tokens.json"), "utf8"));
  const block = (mode) =>
    Object.entries(t[mode])
      .map(([k, v]) => `      --color-${k}: ${v};`)
      .join("\n");
  const css = `@import "tailwindcss";
@import "uniwind";

/* Generated from ui-kit tokens.json (Native UI spec §2.1). Do not edit by hand. */
@layer theme {
  :root {
    @variant light {
${block("light")}
    }

    @variant dark {
${block("dark")}
    }
  }
}
`;
  const out = join(KIT, "native/files/src/globals.css");
  writeFileSync(out, css);
  console.log(`wrote ${out}`);
}

function sync(app) {
  const cfg = readConfig(app);
  const kind = cfg.kit ?? "native";
  let rev = "unknown";
  try {
    rev = execSync("git rev-parse --short HEAD", { cwd: KIT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {}
  const lock = { kit: "davidewins/ui-kit", rev, files: {} };
  for (const file of cfg.files) {
    const content = kitContent(kind, file);
    const dest = join(app, file);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content);
    lock.files[file] = sha(content);
  }
  for (const file of cfg.seeds ?? []) {
    const dest = join(app, file);
    if (existsSync(dest)) continue;
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(join(KIT, kind, "seeds", file)));
    console.log(`seeded ${file}`);
  }
  writeFileSync(join(app, "ui-kit.lock.json"), JSON.stringify(lock, null, 2) + "\n");
  console.log(`synced ${cfg.files.length} files into ${app} (kit ${rev})`);
}

// Text files under src/ whose first line is the kit header, as app-relative paths.
function kitCopies(app) {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (TEXT.test(e.name) && readFileSync(p, "utf8").slice(0, 120).includes("ui-kit: copy of davidewins/ui-kit")) out.push(relative(app, p));
    }
  };
  if (existsSync(join(app, "src"))) walk(join(app, "src"));
  return out;
}

// App code that reaches past ZESTY for something ZESTY already wraps. Only
// files under src/components/ui/ (the kit copies) may import these. David,
// 14 Nov: "I MADE A COMPONENT LIBRARY, USE THE COMPONENT LIBRARY".
const BANNED = [
  { re: /from\s+["']@react-native-segmented-control\/segmented-control["']/, use: "components/ui/inputs/SegmentedControl" },
  { re: /import\s*\{[^}]*\bModal\b[^}]*\}\s*from\s*["']react-native["']/, use: "components/ui/overlays/Sheet or ConfirmDialog" },
  { re: /import\s*\{[^}]*\bSwitch\b[^}]*\}\s*from\s*["']react-native["']/, use: "components/ui/inputs/Switch" },
  { re: /import\s*\{[^}]*\bActionSheetIOS\b[^}]*\}\s*from\s*["']react-native["']/, use: "components/ui/actions/ActionMenu or ConfirmDialog" },
  { re: /\bKeyboardAvoidingView\b/, use: "nothing (no keyboard handling)" },
  // Segmented controls, headers (David, 15 Nov: "every time i see a
  // segmentedcontrol its WRONG"; headers changed app by app without asking).
  { re: /from\s+["']@expo\/ui\/[\w/-]*segmented[\w/-]*["']/, use: "components/ui/inputs/SegmentedControl" },
  { re: /(?:function|const|class)\s+\w*Segment(?:ed)?(?:Control|Bar|Tabs|Picker)\w*\s*[=(<:]/, use: "components/ui/inputs/SegmentedControl or components/ui/data/SegmentBar, not a home-made one" },
  { re: /\bsetIOSHeaderBackground\s*\(\s*["']page["']/, use: "nothing: iOS headers are the system bar (lib/stackHeader)" },
  { re: /\benableLegacyHeaderAppearance\b/, use: "nothing: iOS headers are the system bar (lib/stackHeader)" },
  { re: /\b(?:headerStyle|headerTransparent|headerBlurEffect|headerTintColor|headerTitleStyle|headerLargeTitleStyle|headerShadowVisible|headerLargeTitleShadowVisible|headerBackButtonDisplayMode|headerLargeTitleEnabled|headerBackground)\s*:/, use: "useStackScreenOptions(), LARGE_TITLE or SEE_THROUGH from lib/stackHeader" },
  // Header button rows (David, 15 Nov: "i dont want fucking random spacing").
  { re: /header(?:Left|Right)\s*:\s*\(\)\s*=>\s*\(?\s*<View\b/, use: "components/ui/actions/HeaderActions around the header buttons" },
  { re: /function\s+HeaderTextButton\b/, use: "components/ui/actions/HeaderTextButton" },
];

function bannedImports(app) {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".") || e.name === "__tests__") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (relative(app, p) !== join("src", "components", "ui")) walk(p);
      } else if (/\.(tsx?|jsx?)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) {
        const text = readFileSync(p, "utf8");
        // Kit copies anywhere in src/ (lib/stackHeader, hooks) are the kit.
        if (text.slice(0, 120).includes("ui-kit: copy of davidewins/ui-kit")) continue;
        for (const b of BANNED) if (b.re.test(text)) out.push(`raw      ${relative(app, p)}: use ${b.use}`);
      }
    }
  };
  if (existsSync(join(app, "src"))) walk(join(app, "src"));
  return out;
}

function check(app) {
  const cfg = readConfig(app);
  const kind = cfg.kit ?? "native";
  const drift = [];
  for (const file of cfg.files) {
    const dest = join(app, file);
    if (!existsSync(dest)) drift.push(`missing  ${file}`);
    else if (!readFileSync(dest).equals(Buffer.from(kitContent(kind, file)))) drift.push(`differs  ${file}`);
  }
  // A file carrying the kit header but missing from ui-kit.json is a kit copy
  // check never compares (left behind by a move, or synced by hand).
  const listed = new Set(cfg.files);
  for (const file of kitCopies(app)) if (!listed.has(file)) drift.push(`unlisted ${file}`);
  if ((cfg.kit ?? "native") === "native") drift.push(...bannedImports(app));
  if (drift.length) {
    console.error(`ui-kit drift in ${app}:\n  ${drift.join("\n  ")}\nKit copies: move the change into ui-kit, then sync. Raw imports: use the ZESTY component named.`);
    process.exit(1);
  }
  console.log(`ui-kit: ${cfg.files.length} files match the kit`);
}

try {
  if (cmd === "tokens") tokens();
  else if (cmd === "sync" && appArg) sync(resolve(appArg));
  else if (cmd === "check" && appArg) check(resolve(appArg));
  else {
    console.error("usage: ui-kit tokens | sync <app> | check <app>");
    process.exit(2);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
