#!/usr/bin/env node
// ui-kit: one source for every app's components and tokens.
//
//   node bin/ui-kit.mjs tokens        regenerate native/files/src/globals.css from tokens.json
//   node bin/ui-kit.mjs sync <app>    copy the files listed in <app>/ui-kit.json into the app
//   node bin/ui-kit.mjs check <app>   fail if the app's copies differ from the kit
//
// Each synced file gets a one-line header saying where it lives. Seeds are
// copied once (only when missing) and are then owned by the app.
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
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

function check(app) {
  const cfg = readConfig(app);
  const kind = cfg.kit ?? "native";
  const drift = [];
  for (const file of cfg.files) {
    const dest = join(app, file);
    if (!existsSync(dest)) drift.push(`missing  ${file}`);
    else if (!readFileSync(dest).equals(Buffer.from(kitContent(kind, file)))) drift.push(`differs  ${file}`);
  }
  if (drift.length) {
    console.error(`ui-kit drift in ${app}:\n  ${drift.join("\n  ")}\nMove the change into ui-kit, then sync.`);
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
