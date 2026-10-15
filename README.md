# ui-kit

The one source for every app's UI components and colour tokens (TAK-1403).
New UI is remixed from here. Nothing is written from scratch.

Rules and screen recipes: [Native UI spec](https://linear.app/takeoversoftware/document/native-ui-spec-sellers-void-riders-admin-demo-d4efcd7af27c).

## Layout

| Path | What |
| -- | -- |
| `tokens.json` | Colour tokens, light + dark (spec §2.1). Generates `native/files/src/globals.css` |
| `native/files/` | Canonical native files, at the same path they live in an app (`src/components/ui/SettingsRow.tsx` etc.), so imports work unchanged |
| `native/seeds/` | App-owned files the kit depends on, copied once when missing (`useFontFamily`: Geist only) |
| `bin/ui-kit.mjs` | `tokens`, `sync`, `check` |

## Use

```bash
node ~/Desktop/os/ui-kit/bin/ui-kit.mjs sync void-app/RIDERS
node ~/Desktop/os/ui-kit/bin/ui-kit.mjs check void-app/RIDERS
node ~/Desktop/os/ui-kit/bin/ui-kit.mjs tokens
```

Each app has a `ui-kit.json` listing the kit files it uses, plus a `ui-kit.lock.json` written by sync (kit commit and a hash per file). Synced files start with a `ui-kit:` header line.

To change a component: edit it here, commit, sync into every app that lists it, typecheck each app. Never edit the copy inside an app; `check` fails on it.

## Files each app must own

The kit imports these but does not ship them:

* `@/components/ui` barrel (`index.tsx`)
* `@/hooks/useFontFamily`: exports `useFontFamily()` and `type FontWeight` (seeded for Geist-only apps; VOID and demo have a font picker)
* `src/components/phone/CountryCodePicker.tsx` (its route differs per app)

## Where each file came from (15 Oct 2026)

* VOID (superset of RIDERS for every file): `ui/*` primitives, `SettingsRow` (adds `href` + Link.Preview), `GlassButton`, `Input`, `EmptyState`, `Text`, `useThemeColors`, `PressableScale`, `GlassSurface`, `LoadErrorState`, `phone/PhoneInput`
* SELLERS: `InsetShell`, `WizardProgress`, `SelectRow`, `Switch`, `SkeletonBlock`, `Sparkline`, `CustomToast`, `FuseTopTabs`, `useTabPaneBottomInset`
* Only edit vs source: `Text` imports `FontWeight` from `@/hooks/useFontFamily`

## Synced

| App | Files | Not yet in kit |
| -- | -- | -- |
| RIDERS | 29 | `Button`, onboarding (`SelectRow`, `WizardProgress`, `InsetShell` differ from SELLERS) |
| VOID | 29 | `Button` |
| SELLERS, TKVR, demo, ADMIN | not yet | |
| Web | not yet | |
