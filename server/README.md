# server/ (read-only reference)

hq-node's API patterns, copied verbatim from `~/Desktop/os/hq-node` main at `3b4bbd5` (16 Oct 2026).
Copy from here when adding routes to tkvr-node or creator-platform. Nothing here is synced: these files are not built, and hq-node stays the source.

| File | What |
| -- | -- |
| `src/middleware/auth.ts` | `requireAuth` (Supabase JWT from `Authorization: Bearer`, user on `res.locals.user`, Sentry user tag), `requireRider` (role check after `requireAuth`, row on `res.locals.rider`), `resolveOptionalUserId` (anonymous endpoints: never trust a client-sent user id) |
| `src/middleware/rateLimit.ts` | Upstash limiter per route type; `auth`, `payment`, `assistant` fail closed when Redis is down |
| `src/routes/riders.ts` | A router: `router.use("/api/riders", requireAuth, requireRider)` once, then one line per endpoint, rate limit per route |
| `src/controllers/riders/riderController.excerpt.ts` | Two handlers: a GET reading `res.locals.user`, and a POST with a zod schema |
| `src/utils/params.ts` | `param()`, `query()`, `queryInt()`: route and query params as single strings |
| `src/main.excerpt.ts` | Middleware order, 404, global error handler |

## Shapes

* Every error is `res.status(code).json({ error: "Human sentence" })`. Add `details` for validation, `message` for 404 / 429 / 503 / 500.
* Validation: `schema.parse(req.body)` inside the handler's `try`; `catch` returns 400 `{ error: "Validation failed", details: err.issues }`. An uncaught `ZodError` reaches the global handler, which also returns 400.
* Success: return the object itself (`res.json(profile)`), or `{ ok: true }` for writes with nothing to return. hq-node also has older `{ success: true, ... }` responses; don't copy those into new routes.
* Unknown failures: log with `logger.error(name, err)`, return 500 `{ error: "Internal server error" }`. Never send `err.message` to the client in production.
* Status codes: 400 bad input, 401 no or bad token, 403 signed in but wrong role, 404 missing row, 409 conflict, 429 rate limited, 503 limiter down on a fail-closed route.
* Never take a user id, price or fee from the request body. Read the user from `res.locals.user`, resolve everything else server-side.

## The app side

Apps call these routes with a `fetch` wrapper that adds the Supabase session token per request (TKVR `src/lib/api.ts`, ADMIN `src/lib/admin-fetch.ts`). Errors come back as `{ error }`, so the wrapper throws `new Error(body.error)` and `useSafeQuery` / `useSafeMutation` (in the kit) classify it by status and message.

## Known drift

tkvr-node's `requireAuth` returns snake_case codes (`missing_bearer_token`, `invalid_token`) and doesn't tag Sentry. New tkvr-node routes should use hq-node's shapes above; converging the existing ones is a separate change.
