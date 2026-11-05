// Copies an app screen and every app-local file it imports into
// src/apps/<app>/, rewriting "@/x" imports of copied files to "@/apps/<app>/x".
// Kit-synced files (header "// ui-kit:") are not copied: the gallery has its own.
// Usage: node scripts/port.mjs <APP dir name> <screen path under src/app>...
import fs from "fs";
import path from "path";

const [app, ...screens] = process.argv.slice(2);
const src = path.resolve(import.meta.dirname, "../../../void-app", app, "src");
const out = path.resolve(import.meta.dirname, "../src/apps", app.toLowerCase());
const exts = ["", ".tsx", ".ts", ".js", "/index.tsx", "/index.ts"];
const copied = new Map();
const kitFiles = new Set();
const packages = new Set();

function resolve(spec, from) {
  const base = spec.startsWith("@/") ? path.join(src, spec.slice(2))
    : spec.startsWith(".") ? path.resolve(path.dirname(from), spec) : null;
  if (!base) {
    packages.add(spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/"));
    return null;
  }
  for (const e of exts) {
    const f = base + e;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

const IMPORT = /((?:import|export)[^'"]*?from\s*|import\s*\(\s*|require\(\s*)(["'])([^"']+)\2/g;

function walk(f) {
  if (copied.has(f)) return;
  if (!/\.(tsx?|js)$/.test(f)) {
    copied.set(f, null);
    return;
  }
  const text = fs.readFileSync(f, "utf8");
  if (text.startsWith("// ui-kit:")) {
    kitFiles.add(f);
    return;
  }
  if (f === path.join(src, "components/ui/index.tsx")) return;
  copied.set(f, text);
  for (const m of text.matchAll(IMPORT)) {
    const r = resolve(m[3], f);
    if (r) walk(r);
  }
}

for (const s of screens) walk(path.join(src, "app", s));

for (const [f, text] of copied) {
  const rel = path.relative(src, f);
  const rewritten = text !== null
    ? text.replace(IMPORT, (all, pre, q, spec) => {
        if (!spec.startsWith("@/") && !spec.startsWith(".")) return all;
        const r = resolve(spec, f);
        if (r && kitFiles.has(r)) return `${pre}${q}@/${path.relative(src, r).replace(/\.tsx?$/, "")}${q}`;
        if (!spec.startsWith("@/")) return all;
        if (r === path.join(src, "components/ui/index.tsx")) return `${pre}${q}@/components/ui${q}`;
        return r && copied.has(r) ? `${pre}${q}@/apps/${app.toLowerCase()}/${spec.slice(2)}${q}` : all;
      })
    : text;
  const dest = path.join(out, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) continue;
  if (text === null) fs.copyFileSync(f, dest);
  else fs.writeFileSync(dest, rewritten);
}

const gallery = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf8"));
const have = new Set([...Object.keys(gallery.dependencies), ...Object.keys(gallery.devDependencies)]);
const missing = [...packages].filter((p) => !have.has(p) && !["react", "react-native"].includes(p));
console.log(`copied ${copied.size} files into ${path.relative(process.cwd(), out)}`);
console.log([...copied.keys()].map((f) => "  " + path.relative(src, f)).join("\n"));
if (missing.length) console.log("missing packages: " + missing.join(" "));
