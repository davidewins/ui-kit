# UI Rules (VOID, RIDERS, SELLERS)

David's rules for every screen in these apps. They are not suggestions. Any AI or person working here follows them exactly.

- Rules marked **[checked]** are enforced by `ui-kit check`. It runs in pre-commit and CI, so a commit that breaks one fails.
- The others are checked by eye. Before you say a screen is done, go through this file line by line.
- When a rule and a request conflict, ask David. Never guess.

Source of truth: `ui-kit/bin/rules.mjs` (the checks), `ui-kit/headers.json` (header per screen), this file. Do not edit the copy inside an app; edit the kit and sync.

## 0. How to work

1. **Copy, never invent.** Build a screen from an existing kit component or an existing screen in VOID, RIDERS or SELLERS. Name the source file in a comment at the top. Never write new UI patterns, new typography or new colours.
2. **Fix only what was asked.** A comment in the kit is not a request. Do not "improve" anything nearby.
3. **Same thing, same screen, every app.** If VOID and RIDERS both have a screen (Account, Settings, Help & Support, Delete Account, What's New, About, Send Feedback, Chats, Privacy Policy, Terms of Service), it is the same layout, same title and same header in both. Change one, change all.
4. **Nothing is done until it is seen on a phone.** Never ship UI by OTA, and never say "fixed", without seeing it on a device.
5. **No new files nobody asked for.** No "takes", variants or experiments unless David asks for them.

## 1. Layout

- **[checked: raised]** Content lies flat on the page background. No Panel, RowPanel, Card, Tile, TicketCard or GlassGroup. No `bg-surface`, `bg-card` or `bg-secondary`. No `colors.surface`, `colors.card` or `colors.secondaryBackground` fills. Only David can unlock one named block.
- Lists are kit `SectionHeader` + `SettingsGroup` of `SettingsRow` (or `MediaRow` for a row with a picture). That is the default for almost everything.
- **[checked: stat-cards]** Never put two or more equal-width boxes side by side, each a big figure over a small label (stat tiles, KPI strips, the "3-card" layout). Show each figure as a `SettingsRow` with `label` and `trailing`.
- Default to rows. Use a grid only where it clearly earns the space, and never stack grids.
- No hero at the top of a screen. Never give half a screen to one photo or chart.
- **[checked: scroll-tabs]** No horizontal scroll rows of tabs or chips. Filters go in a header menu, the kit `SegmentedControl`, or rows.
- Segmented controls stay pinned under the header and never scroll away.
- **[checked: scroll-inset]** Every scrolling screen uses the kit `ScrollView`, or sets `contentInsetAdjustmentBehavior="automatic"`, so content sits right under transparent and large headers.
- Bottom actions go on the kit `InsetFooter` (`useInsetFooterSpace` pads the list). The list scrolls under it, and there is no bar behind it.
- No advice cards, generated tips, "insights" or "Worth a look" blocks. Show facts and controls only.
- Say each fact once per screen.
- Swapping content must not make the layout jump. Use a fixed-height region.

## 2. Headers

- Headers are the native Stack header, set only through `useStackScreenOptions()` plus a preset from `lib/stackHeader`:
  - `LARGE_TITLE`
  - `SEE_THROUGH` (transparent on iOS only, so Android is safe)
  - `OPAQUE`
  - none (the default)
- **[checked: header]** A shared screen uses the preset listed in `ui-kit/headers.json`, in every app. Examples:
  - Account and Settings: `SEE_THROUGH`
  - Help & Support, Delete Account, Chats, Privacy Policy, Terms of Service, Become RIDER and Become SELLER: `LARGE_TITLE`
  - What's New, About and Send Feedback: default
- **[checked: fake-header]** Never hide the header (`headerShown: false`) in a screen to draw your own title.
- **[checked: banned]** No raw header style props: `headerStyle`, `headerTransparent`, `headerBlurEffect`, `headerTintColor`, `headerLargeTitle*` and the like.
- **[checked: back-title]** No `headerBackTitle`. The back button is the kit `HeaderBack`, which `useStackScreenOptions` adds where it is missing.
- Header buttons are the kit `HeaderIconButton` (plain lucide icon), grouped in the kit `HeaderActions`. Use icons, not words. Never more than 2 items on the right.
- **[checked: settings-row]** Settings is the cog in the Account screen's `headerRight`, never a "Settings" row in a list.
- Do not change any header (title, preset, buttons) unless David asks in so many words.
- "New" goes in `headerRight` as an icon, never as a fat button in the page.

## 3. Type

- **[checked: font]** Geist only. Numbers use `tabular-nums` (the kit `TABULAR`).
- **[checked: font-size]** Sizes come from the kit `TYPE` scale (title 22, headline 17, body 15, sub 13, caption 11). Never write a `fontSize` number.
- **[checked: big-type]** SELLERS never uses `TYPE.numeral` or `TYPE.display`. Its largest in-page text is the 22 title.
- **[checked: nested-text]** One size and one colour per line. No `<Text>` inside `<Text>`, and no big figure next to a small grey unit.
- **[checked: eyebrow]** No eyebrows: no small uppercase or tracked label above a title, value or card. Fold it into the value or drop it. A small muted label sitting above a value is also an eyebrow.
- **[checked: title-case]** Screen titles, row labels and buttons are Title Case ("Send Feedback", "Date of Birth", "Sign Out"). Body text is normal sentences.
- Small info text is medium weight. Do not change existing weights.

## 4. Colour

- **[checked: raw-colour]** Colours come from `useThemeColors()` or `useHues()`, never hex or rgba literals.
- **[checked: gradient]** No gradients, ever. Use solid colours.
- **[checked: purple]** No purple, violet, indigo or magenta.
- **[checked: teal]** No teal, cyan or aqua.
- Chrome (buttons, selection, tiles) is black, white and grey. Colour is only for:
  - status: red error, green success, amber warning
  - charts and data
  - brand marks
- Selected state is a solid fill with white text. Never only opacity, a thin border or a faint tint.
- Badge and count text is always white (kit `CountBadge`).

## 5. Buttons and controls

- **[checked: square-button]** Every button is a pill (`rounded-full`). Use the kit `Button`, `PillButton`, `GlassButton` or the `InsetFooter` buttons.
- **[checked: ghost-button]** No ghost, link, text-only or outline-only buttons. Every button has a visible fill.
- The main bottom button is the `InsetFooter` primary: black Liquid Glass with a white label. A disabled button stays visible.
- **[checked: banned]** Use only kit controls:
  - `ui/inputs/Switch` (never the React Native Switch)
  - `ui/inputs/SegmentedControl` (never another segmented control)
  - `ui/overlays/Sheet` or `ConfirmDialog` (never the React Native Modal)
  - `ui/actions/ActionMenu` (never `ActionSheetIOS` or a custom popover)
- **[checked: formsheet]** No form sheets (`presentation: "formSheet"`, detents, grabber). Create in a modal, edit in a pushed screen.
- **[checked: keyboard]** No keyboard handling of any kind: no `KeyboardAvoidingView`, KeyboardAware views or `keyboardVerticalOffset`.
- Prefer native controls (`@expo/ui` SwiftUI Menu, Picker, DisclosureGroup) over hand-rolled dropdowns.

## 6. Motion

- **[checked: spring]** No springs or bounce. Use timing animations only.
- No fade-in on page load. Motion only when something changes. Haptics on taps that change state.

## 7. Pictures and icons

- Thiings art goes only in content: row pictures and empty states.
- **[checked: header-art]** No Thiings or art in a `SectionHeader`, `SectionTitle` or nav header.
- Icons are lucide (or SF Symbols through `SymbolView`). No AI-generated icon sets.
- Check every image at its true aspect ratio. VOID product tiles are square.

## 8. Copy

- **[checked: em-dash]** No em dashes. Use commas, colons or parentheses.
- **[checked: legal-wording]** Legal is exactly "Privacy Policy" and "Terms of Service".
- **[checked: product-caps]** Product names are in caps: VOID, RIDERS, SELLERS, TKVR, PREPPERS, SPLITS. It is "Become RIDER" and "Become SELLER".
- **[checked: takeover-copy]** The product is VOID. Never write "Takeover" in copy.
- **[checked: smarm]** No smarm or filler: genuinely, honestly, frankly, obviously, feel free, we'd love to, Oops.
- **[checked: lazy-empty]** Empty states say what is missing and what to do next. A confirm names the consequence. Never "No data", "Nothing here yet" or "Are you sure?".
- **[checked: see-all]** Section headers have nothing on the right (no "See all"). The count goes in the title.
- **[checked: magic-link]** Email sign-in is a 6-digit code, never a magic link.
- Every string carries information. Never restate the title, and no filler lines.
- CTAs are short imperatives ("Apply", "Share Your Code").
- Never invent numbers, customers, offers or claims.
- Never cut off a user's own text (no `numberOfLines` on their content on detail screens).

## 9. Tooling

- **[checked: bun]** npm and npx only, never bun.
- **[checked: kit]** Never edit a file whose first line says `ui-kit: copy of`. Change it in `ui-kit`, then run `node ui-kit/bin/ui-kit.mjs sync <APP>`.

## Conflicts already settled (newest wins)

| Topic | Settled rule |
| --- | --- |
| Raised panels vs flat | Flat (15 Nov block). |
| Form sheets, springs, ActionSheetIOS | All banned, even where an older note suggests them. |
| Thiings in section headers | None (13 Nov). |
| Grey cards "to break up the screen" | No (raised block wins). |
| SELLERS/DESIGN.md eyebrows, 34pt numbers | Not allowed (no-eyebrows, max 22 win). |
| Search | A headerRight icon opening search, never a second search field in the page. |
| Gradients in app UI | Banned (18 Nov). Web marketing is separate. The Referrals invite pass is the one open question for David. |
