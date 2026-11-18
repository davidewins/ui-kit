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
  {
    id: "formsheet",
    why: "no form sheets (push a screen or use the kit Sheet)",
    re: /presentation\s*:\s*["']formSheet["']|\bsheetAllowedDetents\b|\bsheetGrabberVisible\b/g,
    code: true,
  },
  {
    id: "spring",
    why: "no bouncy animation: timing, never a spring",
    re: /\bwithSpring\s*\(|\.springify\s*\(|\bEasing\.(?:bounce|elastic|back)\b|\bAnimated\.spring\s*\(|type\s*:\s*["']spring["']/g,
    code: true,
  },
  {
    id: "eyebrow",
    why: "no eyebrows (small uppercase labels over titles)",
    re: /textTransform\s*:\s*["']uppercase["']|className\s*=\s*\{?\s*["'`][^"'`]*\buppercase\b/g,
    code: true,
  },
  {
    id: "ghost-button",
    why: "no ghost or link buttons; every button is a visible pill",
    re: /variant\s*=\s*\{?\s*["'](?:ghost|link|text|plain)["']/g,
    code: true,
  },
  {
    id: "font",
    why: "Geist only, no other font family",
    re: /fontFamily\s*:\s*["'`](?![^"'`]*Geist)[^"'`]+["'`]|\bfont-\[(?![^\]]*Geist)/g,
    code: true,
  },
  {
    id: "font-size",
    why: "type comes from the kit TYPE scale, not a hand-picked fontSize",
    re: /\bfontSize\s*:\s*\d/g,
    code: true,
  },
  {
    id: "raw-colour",
    why: "colours come from useThemeColors / useHues, not hex or rgba literals",
    re: /["'`]#[0-9a-fA-F]{3,8}["'`]|\brgba?\(\s*\d/g,
    code: true,
  },
  {
    id: "purple",
    why: "no purple",
    re: /\b(?:bg|text|border|from|to|via)-(?:purple|violet|fuchsia|indigo)-\d|["'](?:purple|violet|indigo|fuchsia)["']|#(?:8b5cf6|7c3aed|a855f7|9333ea|6d28d9|5b21b6|c084fc|a78bfa|6366f1|4f46e5|7e22ce|9d4edd)\b/gi,
    code: true,
  },
  {
    id: "back-title",
    why: "no headerBackTitle; the kit back button has no label",
    re: /\bheaderBackTitle\w*\s*:/g,
    code: true,
  },
  {
    id: "takeover-copy",
    why: "the product is VOID; never \"Takeover\" in copy",
    re: /["'`>][^"'`<\n{}]*\bTakeover\b(?![\w.-]*\.(?:software|me))/g,
    code: true,
  },
  {
    id: "product-caps",
    why: "product names in caps: VOID, RIDERS, SELLERS (Become RIDER, Become SELLER)",
    re: /\bBecome an? (?:Rider|Seller|rider|seller)\b|["'`>][^"'`<\n{}]*\b(?:Void|Riders|Sellers) app\b|["'`>][^"'`<\n{}]*\b(?:Tkvr|Preppers|Splits)\b/g,
    code: true,
  },
  {
    id: "header-art",
    why: "no Thiings or art in section headers (David, 13 Nov)",
    re: /<Section(?:Header|Title)\b[^>]*\b(?:image|art|source|thiing|illustration)\s*=/g,
    code: true,
  },
  {
    id: "keyboard",
    why: "no keyboard handling (no KeyboardAwareScrollView, keyboardVerticalOffset)",
    re: /\bKeyboardAware\w+|\bkeyboardVerticalOffset\b|\bKeyboardStickyView\b/g,
    code: true,
  },
  {
    id: "teal",
    why: "no teal, cyan or aqua (no water themes)",
    re: /\b(?:bg|text|border|from|to|via)-(?:teal|cyan|aqua)-\d|["'](?:teal|cyan|aqua|turquoise)["']/gi,
    code: true,
  },
  {
    id: "fake-header",
    why: "headers are the native Stack header; a screen never hides it to draw its own title",
    re: /headerShown\s*:\s*false/g,
    code: true,
    skipLayouts: true,
  },
  {
    id: "square-button",
    why: "every button is a pill (rounded-full); use the kit Button",
    re: /<(?:Pressable|TouchableOpacity|TouchableHighlight|Button)\b[^>]*className=["'`][^"'`]*\brounded-(?:none|sm|md|lg|xl|2xl|3xl)\b/g,
    code: true,
  },
  {
    id: "nested-text",
    why: "one text size and colour per line; no Text inside Text",
    re: /<Text\b[^>]*>[^<]*<Text\b/g,
    code: true,
  },
  {
    id: "scroll-tabs",
    why: "no horizontal scroll rows of tabs or chips; filters go in a header menu, SegmentedControl or rows",
    re: /<(?:ScrollView|FlatList)\b[^>]*\bhorizontal\b/g,
    code: true,
  },
  {
    id: "see-all",
    why: "section headers have nothing on the right (no See all); the count goes in the title",
    re: /["'`>]\s*(?:See all|View all|See more|Show all)\s*["'`<]/g,
    code: true,
  },
  {
    id: "smarm",
    why: "no smarm or filler in copy (genuinely, honestly, feel free, we'd love to)",
    re: /["'`>][^"'`<\n{}]*\b(?:genuinely|honestly|frankly|obviously|feel free|we'd love|happy to help|Oops)\b/gi,
    code: true,
  },
  {
    id: "lazy-empty",
    why: "empty states say what is missing and the next action; confirms name the consequence",
    re: /["'`>]\s*(?:No data|Nothing here yet|Nothing to see here|Are you sure\??)\s*["'`<]/g,
    code: true,
  },
  {
    id: "magic-link",
    why: "email sign-in is a 6-digit code, never a magic link",
    re: /["'`>][^"'`<\n{}]*\bmagic[ -]?link\b/gi,
    code: true,
  },
];

// The AI "3-card" layout: two or more equal-width boxes side by side, each a
// figure over a label (stat tiles, KPI strips). Figures go in a list as a
// SettingsRow with `trailing` (David, 18 Nov: "ur 3-card bullshit").
const STAT_ROW_MAP = /flexDirection\s*:\s*["']row["'][\s\S]{0,400}?\.map\(\s*\(?[\w{},\s]*\)?\s*=>[\s\S]{0,500}?\bflex\s*:\s*1\b[\s\S]{0,500}?(?:TABULAR|tabular-nums)/g;
const STAT_ROW_LITERAL = /(?:<View\b[^>]*(?:className=["'][^"']*\bflex-1\b|flex\s*:\s*1\b)[^>]*>\s*<Text\b[\s\S]{0,300}?<\/Text>\s*<Text\b[\s\S]{0,300}?<\/Text>\s*<\/View>\s*(?:\{[^}]*\?\s*\(\s*)?){2,}/g;
// An equal-width box that opens with a tabular figure (the box a helper returns).
const STAT_BOX = /<View\b[^>]*(?:\bflex\s*:\s*1\b|className=["'][^"']*\bflex-1\b)[^>]*>\s*<Text\b[^>]*(?:TABULAR|tabular-nums)[^>]*>[\s\S]{0,200}?<\/Text>\s*<Text\b[\s\S]{0,300}?<\/Text>\s*<\/View>/g;
function statRows(code) {
  const at = [...code.matchAll(STAT_ROW_MAP), ...code.matchAll(STAT_ROW_LITERAL), ...code.matchAll(STAT_BOX)].map((m) => m.index);
  return [...new Set(at.map((i) => code.slice(0, i).split("\n").length))].map((line) =>
    code.split("\n").slice(0, line - 1).join("\n").length + 1,
  );
}

// Route screens that scroll must sit under transparent and large headers.
const RN_SCROLL = /import\s*\{[^}]*\b(?:ScrollView|FlatList|SectionList)\b[^}]*\}\s*from\s*["']react-native["']/;
function missingInset(file, code) {
  if (!/^src\/app\//.test(file) || /_layout\.tsx$/.test(file)) return false;
  if (!RN_SCROLL.test(code)) return false;
  return /<(?:ScrollView|FlatList|SectionList)\b/.test(code) && !/contentInsetAdjustmentBehavior/.test(code);
}

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
  const sellers = basename(app) === "SELLERS";
  for (const [file, text] of appFiles(app)) {
    const code = stripComments(text);
    if (sellers)
      for (const m of code.matchAll(/\bTYPE\.(?:numeral|display)\b/g))
        found.push({ key: `big-type|${file}`, msg: `big-type      ${file}:${code.slice(0, m.index).split("\n").length}  SELLERS never uses TYPE.numeral or TYPE.display (max title 22)` });
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
    for (const at of statRows(code))
      found.push({ key: `stat-cards|${file}`, msg: `stat-cards    ${file}:${code.slice(0, at).split("\n").length}  no rows of equal stat boxes (figure over label); use SettingsRow trailing in a list` });
    if (missingInset(file, code))
      found.push({ key: `scroll-inset|${file}`, msg: `scroll-inset  ${file}  a scrolling screen needs contentInsetAdjustmentBehavior="automatic" (or the kit ScrollView)` });
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
  for (const lock of ["bun.lockb", "bun.lock"])
    if (existsSync(join(app, lock))) found.push({ key: `bun|${lock}`, msg: `bun           ${lock}  never bun; npm only` });
  const pkg = existsSync(join(app, "package.json")) ? readFileSync(join(app, "package.json"), "utf8") : "";
  if (/"[^"]*":\s*"[^"]*\bbunx?\s/.test(pkg)) found.push({ key: "bun|package.json", msg: "bun           package.json  a script runs bun; npm only" });
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
