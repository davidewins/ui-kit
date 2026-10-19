# ZESTY UI

ZESTY UI (repo `davidewins/ui-kit`) is the one source for every app's UI components and colour tokens (TAK-1403).
New UI is remixed from here. Nothing is written from scratch.

Rules and screen recipes: [Native UI spec](https://linear.app/takeoversoftware/document/native-ui-spec-sellers-void-riders-admin-demo-d4efcd7af27c).

## Layout

| Path | What |
| -- | -- |
| `tokens.json` | Colour tokens, light + dark (spec §2.1). Generates `native/files/src/globals.css` |
| `native/files/` | Canonical native files, at the same path they live in an app (`src/components/ui/SettingsRow.tsx` etc.), so imports work unchanged |
| `native/seeds/` | App-owned files the kit depends on, copied once when missing (`useFontFamily`: Geist only) |
| `bin/ui-kit.mjs` | `tokens`, `sync`, `check` |
| `recipes/` | Reference screens copied in by hand, never synced (`recipes/auth`: Welcome / Email / Verify OTP + root session gate, from VOID) |
| `server/` | Read-only hq-node API patterns (auth middleware, rate limit, route, handler, error shapes) for tkvr-node / creator-platform |
| `gallery/` | ZESTY UI gallery: Expo app showing every kit component, light and dark. Runs in Expo Go: `cd gallery && npm install && npx expo start`, scan the QR |

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
* SELLERS: `InsetShell`, `WizardProgress`, `SelectRow`, `Switch`, `SkeletonBlock`, `SectionTitle`, `Sparkline`, `CustomToast`, `FuseTopTabs`, `useTabPaneBottomInset`
* `Button` is VOID's: primary, secondary, danger. No ghost or outline buttons, ever
* Tokens: light page `#fff` and grouped surface `#f5f5f5` (VOID, David 15 Oct); amber warning; old names (`danger`, `textMuted`, `primaryText`, `surfaceElevated`, ...) kept as aliases
* Only edit vs source: `Text` imports `FontWeight` from `@/hooks/useFontFamily`

## Data layer (16 Oct 2026)

| Kit file | Source | Synced into | Notes |
| -- | -- | -- | -- |
| `src/lib/utils/safeExecute.ts` | SELLERS (`a6e0f27`: no NetInfo / getSession pre-flights, 50-300ms per call) | RIDERS, VOID, SELLERS | `requiresNetwork` / `requiresAuth` kept on the type, no longer block. No call site read the pre-flight error codes |
| `src/hooks/useSafeQuery.ts`, `useSafeExecute.ts` | SELLERS (VOID + `useQuery<TData, Error>` + usage docs) | RIDERS, VOID, SELLERS | |
| `src/hooks/useSafeMutation.ts` | RIDERS (VOID's zod `variablesSchema` + `onError` context, zod 3 and 4 safe `.issues`) + SELLERS `?? ""` guard and docs | RIDERS, VOID, SELLERS | |
| `src/lib/Logger.ts` | VOID (`unknown[]` args) | RIDERS, VOID, SELLERS, demo | |
| `src/lib/queryClient.ts` | VOID (5 min stale, retry 2, helpers) | RIDERS, VOID, demo | RIDERS' foreground refresh moved to app-owned `src/lib/riderStatus.ts` |
| `src/lib/query.ts` | ADMIN (no retry on 4xx, 429 backoff, 30s stale) | ADMIN, TKVR | Different retry policy from `queryClient.ts`; merging the two changes refetch behaviour, so it's a product call |
| `src/lib/supabase.ts` | VOID (= RIDERS), supabase-js 2.89.0 | RIDERS, VOID | SELLERS (`detectSessionInUrl: false` on web), TKVR (own MMKV id + share extension), ADMIN and demo (untyped client) stay app-owned |

SELLERS keeps its own `queryClient.ts` (signs out on `SESSION_REVOKED`, react-query defaults).

Database types are **not** in the kit. `davidewins/takeover-db` generates `types/database.ts` and its CI recommits it after every migration, so it is already the one source; a kit copy would be a second hand-bumped mirror. Every app that holds `src/types/index.ts` (RIDERS, VOID, SELLERS, demo, ADMIN) has `npm run sync-types`, which fetches it. TKVR uses its own `src/lib/database.types.ts`.

## Added 16 Oct (round 6)

* Toasts: `lib/toast.tsx` (same `Toast.success/error/info/warn` calls as toastify), `components/Toaster.tsx` (sonner-native: top, stacks of 3, swipe up, above modals) and `components/ToastCard.tsx` (interactive Liquid Glass with a solid backing, press scale + light haptic, unlimited lines). Each toast fires one haptic for its kind plus a sound (`assets/sounds/toast-*.wav`, marimba set; gallery Compare → Toast sounds has the other two sets).
* `Button` is now SELLERS' (GlassButton spec: primary, secondary glass, outline filled, danger). `PillButton` is TKVR's (solid pills, clear glass secondary, haptic per variant) with outline filled, never see-through. VOID's old Button is gone.
* `GlassGroup`: container for SelectRows (glass on iOS 26, grey grouped card elsewhere). `Chip`: glass chip, solid tint when selected. `HeaderIconButton`: spec §3.1 header button from SELLERS Today.
* Gallery: Liquid Glass page, SwiftUI controls page (@expo/ui), example pages (list, create modal, edit, detail with sticky footer).

## Native controls (18 Oct 2026)

The @expo/ui SwiftUI controls are kit components now, not raw `Host` blocks in screens. Each one draws SwiftUI on iOS and has a plain RN fallback elsewhere. The row ones keep the 52pt SettingsRow geometry, so they go straight into a `SettingsGroup`.

| Component | iOS (SwiftUI) | Fallback | Use for |
| -- | -- | -- | -- |
| `SegmentedControl` | Picker, segmented | Surface pill track | Range / filter / appearance switch. Replaces `@react-native-segmented-control` |
| `PickerRow` | Picker, menu (in the row's accessory) | Trailing value + Alert list | One of a short list (prep time, category) |
| `StepperRow` | Stepper | - / + buttons | Whole-number quantities |
| `SliderRow` | Slider under the label line | - / + buttons | Continuous values (capacity, radius) |
| `DateRow` | DatePicker, compact | Read-only trailing text | Date, time, or both |
| `ColorRow` | ColorPicker | Swatch | Brand / accent colour |
| `ProgressBar` | ProgressView, linear | 4pt track | Load, upload, onboarding progress |
| `ActionMenu` | Menu with SF Symbols | HeaderIconButton + Alert | Header "..." actions |
| `Sheet` | BottomSheet hosting RN children | Slide-up Modal card | Short confirms and quick forms |
| `Switch` (existing) | Toggle | RN Switch | On / off, as a SettingsRow accessory |

`FuseTopTabs` draws `SegmentedControl` on iOS (19 Oct), so an app syncing FuseTopTabs must list `SegmentedControl` too. Its non-iOS pill sits on the page colour with a soft shadow (light), `surfaceElevated` (dark).

Gallery → **Native controls (store settings)** is one real screen using all of them; **Edit** and **List** examples use them too. Add the files an app needs to its `ui-kit.json` and sync (`StepperRow` is needed by `SliderRow`).

## Synced

| App | Files | Still app-owned (different API, converge next) |
| -- | -- | -- |
| RIDERS | 30 | onboarding `SelectRow` / `WizardProgress` / `InsetShell` (ahead of SELLERS) |
| VOID | 30 | |
| SELLERS | 38 | `Button` (GlassButton-style pill with `outline`), `EmptyState` (`art` / `layout` API, the spec reference) |
| TKVR | 25 | `Button`, `EmptyState`, `InsetShell` (adds `InsetFooter`, `keyboardInsets`) |
| demo | 27 | `Button` |
| ADMIN | 19 | `Button`, `Text`, `TextInput`, `FuseTopTabs`: ADMIN still uses the system font (spec Q12) |
| Web | not yet | |
