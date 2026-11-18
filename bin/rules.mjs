// David's UI rules, enforced for every author (Claude sessions, agents, people)
// by `ui-kit check`, which runs in each app's pre-commit hook and CI. Hooks on
// one Mac only stopped one Claude; these stop the commit (David, 18 Nov: "what
// are you actually doing to prevent constant regressions?").
//
// Existing violations are frozen per app in baselines/<app>.json (this repo,
// so an app cannot quietly raise its own allowance). A file may only go down.
// `ui-kit baseline <app>` rewrites it after real fixes.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const KIT = resolve(import.meta.dirname, "..");

// Same patterns as tools/claude/guard-ui.py, so the hook and CI agree.
const RULES = [
  {
    id: "gradient",
    why: "no gradients, solid calm colours (David, 18 Nov)",
    re: /linear-gradient\(|radial-gradient\(|<LinearGradient\b|from\s+["']expo-linear-gradient["']/g,
  },
  {
    id: "raised",
    why: "no raised surfaces, lay content flat (David, 15 Nov); David alone unlocks one",
    re: /<(?:Panel|RowPanel|Card|Tile|TicketCard|GlassGroup)\b|useRaisedCardStyle|\bbg-(?:surface|card|secondary)\b|colors\.(?:surface|card|secondaryBackground)\b/g,
  },
  {
    id: "settings-row",
    why: "Settings is the Account header cog, never a row (David, 18 Nov)",
    re: /\b(?:label|title)\s*[=:]\s*\{?\s*["'`]Settings["'`]/g,
    skipLayouts: true,
  },
  {
    id: "legal-wording",
    why: 'legal is exactly "Privacy Policy" and "Terms of Service"',
    re: /["'`>]\s*(?:Privacy policy|privacy policy|Terms of service|terms of service|Terms (?:&|and) Conditions|Terms of Use|T&Cs?)\b/g,
    code: true,
  },
  {
    id: "em-dash",
    why: "no em dashes in copy",
    re: /—/g,
    code: true,
  },
];

// One header preset per shared screen title, the same in every app, so
// "Become RIDER and Become SELLER have different headers" cannot recur.
// "default" = useStackScreenOptions() with no preset spread.
const HEADERS = JSON.parse(readFileSync(join(KIT, "headers.json"), "utf8"));

/** Source with comments blanked out (same length, so offsets still match). */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - p.length));
}

function appFiles(app) {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".") || e.name === "__tests__") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (relative(app, p) !== join("src", "components", "ui")) walk(p);
      } else if (/\.tsx$/.test(e.name)) {
        const text = readFileSync(p, "utf8");
        if (text.slice(0, 120).includes("ui-kit: copy of davidewins/ui-kit")) continue;
        out.push([relative(app, p), text]);
      }
    }
  };
  if (existsSync(join(app, "src"))) walk(join(app, "src"));
  return out;
}

/** The text of a balanced {...} starting at text[i] === "{". */
function braced(text, i) {
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    if (text[j] === "{") depth++;
    else if (text[j] === "}" && --depth === 0) return text.slice(i, j + 1);
  }
  return text.slice(i);
}

const STR = /(?:headerTitle|title)\s*:\s*(?:"([^"]*)"|'([^']*)'|`([^`$]*)`)/;

/** Every <Stack.Screen name=... options={{...}}> in a layout: title and preset. */
function stackScreens(text) {
  const out = [];
  const re = /<Stack\.Screen\b/g;
  let m;
  while ((m = re.exec(text))) {
    const head = text.slice(m.index, m.index + 400);
    const name = /\bname=["']([^"']+)["']/.exec(head.split(/options=/)[0])?.[1];
    const at = text.indexOf("options={", m.index);
    const close = text.indexOf("/>", m.index);
    if (!name || at < 0 || (close >= 0 && close < at)) continue;
    const body = braced(text, at + "options=".length);
    const t = STR.exec(body);
    const title = t && (t[1] ?? t[2] ?? t[3]);
    if (!title) continue;
    const presets = [...body.matchAll(/\.\.\.(LARGE_TITLE|SEE_THROUGH|OPAQUE)\b/g)].map((x) => x[1]);
    out.push({ name, title, preset: presets.at(-1) ?? "default", hidden: /headerShown\s*:\s*false/.test(body) });
  }
  return out;
}

// Title Case: every word capitalised except short joining words; product
// names (VOID, SELLERS, RIDERS) and other all-caps words pass as they are.
const SMALL = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with", "your", "vs"]);
function notTitleCase(title) {
  return title
    .split(/\s+/)
    .some((w, i) => /^[a-z]/.test(w) && !(i > 0 && SMALL.has(w.toLowerCase())));
}

/** Violations as { key, line } where key = "rule|file" (counted against the baseline). */
export function findViolations(app) {
  const found = [];
  for (const [file, text] of appFiles(app)) {
    const code = stripComments(text);
    for (const rule of RULES) {
      if (rule.skipLayouts && /_layout\.tsx$/.test(file)) continue;
      const src = rule.code ? code : text;
      for (const m of src.matchAll(rule.re)) {
        // A Stack.Screen title is a header, not a row.
        if (rule.id === "settings-row" && /options|Stack\.Screen/.test(src.slice(Math.max(0, m.index - 80), m.index))) continue;
        const line = src.slice(0, m.index).split("\n").length;
        found.push({ key: `${rule.id}|${file}`, msg: `${rule.id.padEnd(13)} ${file}:${line}  ${rule.why}` });
      }
    }
    if (/_layout\.tsx$/.test(file)) {
      for (const s of stackScreens(text)) {
        if (notTitleCase(s.title))
          found.push({ key: `title-case|${file}|${s.name}`, msg: `title-case    ${file} "${s.title}" is not Title Case` });
        const want = HEADERS[s.title];
        if (!want || s.hidden || want === s.preset) continue;
        found.push({
          key: `header|${file}|${s.name}`,
          msg: `header        ${file} "${s.title}" is ${s.preset}, every app uses ${want} (ui-kit headers.json)`,
        });
      }
    }
  }
  return found;
}

const baselinePath = (app) => join(KIT, "baselines", `${basename(app)}.json`);

const tally = (found) => found.reduce((t, v) => ((t[v.key] = (t[v.key] ?? 0) + 1), t), {});

/** Messages for violations beyond the app's frozen baseline. */
export function checkRules(app) {
  const p = baselinePath(app);
  const base = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  const found = findViolations(app);
  const counts = tally(found);
  const over = new Set(Object.keys(counts).filter((k) => counts[k] > (base[k] ?? 0)));
  return found.filter((v) => over.has(v.key)).map((v) => `rule     ${v.msg}`);
}

export function writeBaseline(app) {
  const counts = tally(findViolations(app));
  const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(baselinePath(app), JSON.stringify(sorted, null, 2) + "\n");
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`baseline ${basename(app)}: ${total} existing violations frozen in ${relative(KIT, baselinePath(app))}`);
}

/** Every titled Stack.Screen in an app, for building headers.json. */
export function listHeaders(app) {
  return appFiles(app)
    .filter(([f]) => /_layout\.tsx$/.test(f))
    .flatMap(([f, t]) => stackScreens(t).map((s) => ({ file: f, ...s })));
}
