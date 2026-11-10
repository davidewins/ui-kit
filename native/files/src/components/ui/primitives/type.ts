// The type scale: six roles (plus one giant numeral), nothing in between. A screen that needs a size
// not listed here is reaching for hierarchy the layout should give it.
//
//   numeral   a focus screen's one giant figure: a running clock, a keypad amount
//   display   one per screen at most: the figure the page is about
//   title     the page's own headline, or a hero card's
//   headline  section titles, card titles, the strong line of a row
//   body      row labels, values, prose (the kit's SettingsRow label size)
//   sub       the second line of a row, facts under a title
//   caption   chart axes, legends, timestamps in a dense grid
//
// Weight goes on Text: semibold for display, title, headline and any value
// that should stand out; medium for everything else. Never regular or bold
// for information (David, 11 Oct).
export const TYPE = {
  numeral: { fontSize: 56, lineHeight: 60, letterSpacing: -2 },
  display: { fontSize: 34, lineHeight: 38, letterSpacing: -1 },
  title: { fontSize: 22, lineHeight: 26, letterSpacing: -0.5 },
  headline: { fontSize: 17, lineHeight: 22, letterSpacing: -0.3 },
  body: { fontSize: 15, lineHeight: 20, letterSpacing: -0.2 },
  sub: { fontSize: 13, lineHeight: 17, letterSpacing: -0.1 },
  caption: { fontSize: 11, lineHeight: 14, letterSpacing: 0 },
} as const;

/** Add to any text that shows a number, so digits line up and do not jump. */
export const TABULAR = { fontVariant: ["tabular-nums" as const] };
