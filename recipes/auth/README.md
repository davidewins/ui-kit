# Auth recipe (Native UI spec §3.7)

Reference screens, not synced. Copied from VOID `src/app/(auth)/` and `src/app/_layout.tsx` at `7b5e990` (16 Oct 2026). Copy them into a new app, then cut what that app doesn't need. Every app's auth folder differs today (RIDERS, VOID, SELLERS, TKVR, ADMIN all have different hashes), so nothing here is a synced kit file.

| File | What |
| -- | -- |
| `(auth)/index.tsx` | Welcome: logo, email, Google, Apple, terms line |
| `(auth)/email.tsx` | Email field, `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })`, push to verify-otp |
| `(auth)/verify-otp.tsx` | 6-digit code (`react-native-otp-entry`), `supabase.auth.verifyOtp({ email, token, type: "email" })`, resend, then `router.replace` into `(protected)` |
| `(auth)/_layout.tsx` | The `(auth)` Stack. VOID's version also holds the service-area gate (`location-not-active`); drop that part in apps without one |
| `session-gate.excerpt.tsx` | Root layout: `getSession` + `onAuthStateChange`, redirect between `(auth)` and `(protected)`, splash held until the session is known, a plain cover over the one wrong frame |

## Rules

* OTP codes, never magic links. `detectSessionInUrl` stays off on native (the kit's `src/lib/supabase.ts`).
* Only edit vs VOID: the App Store reviewer login is removed from `index.tsx` (5-tap logo unlock plus `signInWithPassword` with a hard-coded demo email and password). Never copy hard-coded credentials into a new app. VOID, SELLERS and RIDERS still have them in their own `(auth)/index.tsx`.
* App-specific imports to swap or drop: `GoogleSignInButton`, `useCreateAccount`, `@/context/LocationProvider`, `@/lib/storage` keys, `@/lib/validation/schemas` (`emailSchema`, `otpSchema`, `parseForm`), splash images, and the post-login route `/(protected)/(tabs)/home`.
