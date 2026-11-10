// Fails if a route file under src/app is not reachable from the home page
// (missing from src/gallery/catalog.ts), or the catalog lists a route that
// has no file. Run: node scripts/check-routes.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const appDir = join(root, "src/app");
const catalog = readFileSync(join(root, "src/gallery/catalog.ts"), "utf8");

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(relative(appDir, p).replace(/\.tsx$/, ""));
  }
})(appDir);

const SPECIAL = new Set(["_layout", "index", "+not-found"]);
const onDisk = new Set(files.filter((f) => !SPECIAL.has(f) && !f.endsWith("/_layout")));

const listed = new Set();
for (const [, kind, id] of catalog.matchAll(/s\("(\w+)", "([\w-]+)"/g)) listed.add(kind === "foundations" ? "foundations/index" : `${kind}/${id}/index`);
for (const [, section, slug] of catalog.matchAll(/c\("([\w-]+)", "([\w-]+)"/g)) listed.add(`components/${section}/${slug}`);
for (const [, route] of catalog.matchAll(/route: "([^"]+)"/g)) listed.add(route);

const orphans = [...onDisk].filter((f) => !listed.has(f));
const missing = [...listed].filter((r) => !onDisk.has(r));
const dotted = files.filter((f) => f.split("/").pop().replace(/^\[.*\]$/, "").includes("."));

for (const f of orphans) console.error(`orphan route (not in catalog): ${f}`);
for (const r of missing) console.error(`catalog route with no file: ${r}`);
for (const f of dotted) console.error(`dot in route filename: ${f}`);
if (orphans.length || missing.length || dotted.length) process.exit(1);
console.log(`routes: ${onDisk.size} pages, all in the catalog and reachable from home`);
