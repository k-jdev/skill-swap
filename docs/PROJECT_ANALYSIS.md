# SkillSwap — Project Analysis

State of the codebase after the auth and architecture refactor, what was verified, and
what is still open. Companion documents: [`ARCHITECTURE.md`](../ARCHITECTURE.md) (how it
works) and [`AUTH_REFACTOR_PLAN.md`](./AUTH_REFACTOR_PLAN.md) (the original audit).

---

## 1. Snapshot

| Metric | Value |
|---|---|
| TypeScript / TSX files | 117 |
| Lines of code (src) | ~5,700 |
| Routes built | 16 |
| Server-action modules | 5 (12 actions) |
| Client components | 29 of 117 |
| Zustand stores | 3 (`session`, `profile`, `skills`) |
| Type check | Passing |
| ESLint | Passing, zero warnings |
| Production build | Passing |
| Automated tests | 52 (Vitest, 5 files) |
| CI | GitHub Actions: typecheck · lint · test · build |

Layer distribution: `features` 54 · `app` 27 · `shared` 24 · `entities` 7 · `widgets` 4.
That shape is healthy for Feature-Sliced Design — the weight sits in features, and
`shared` has not become a dumping ground.

---

## 2. Verification performed

### 2.1 Static checks

| Check | Command | Result |
|---|---|---|
| Types | `npm run typecheck` | Clean |
| Lint | `npm run lint` | Clean, whole repo including `tests/` |
| Unit tests | `npm test` | 52 passing across 5 files |
| Build | `npm run build` | 16 routes, no errors |

All four run in CI on every push and pull request (`.github/workflows/ci.yml`).

### 2.2 Route smoke tests (anonymous visitor, dev server)

| Route | Status | Notes |
|---|---|---|
| `/`, `/browser`, `/how-it-works`, `/learn`, `/skill/1` | 200 | Public content reachable — the previous guard blocked skill detail pages |
| `/login`, `/register`, `/forgot-password`, `/auth/reset` | 200 | Auth surfaces render |
| `/profile` | 307 → `/login?redirectTo=%2Fprofile` | Guard plus destination preserved |
| `/skill/create` | 307 → `/login?redirectTo=%2Fskill%2Fcreate` | Guard |
| `/unknown-route` | 404 | `not-found.tsx` |

### 2.3 Browser tests (Chrome, real UI)

| Scenario | Result |
|---|---|
| Login, empty submit | Both field errors render, focus moves to the first invalid field |
| Login, wrong credentials | Inline message and toast read "Invalid email or password." — no raw Supabase text, so no account enumeration |
| Register, invalid input | All four field errors render simultaneously (see the bug below) |
| Password field | Reveal toggle works; hint and caps-lock warning render |
| Navigation, signed out | Login / Sign Up shown, no dead `/contact` link, active-page styling correct |
| Console | No application errors or warnings on `/browser` |

### 2.4 Test suite

| File | Tests | Focus |
|---|---|---|
| `schemas.test.ts` | 14 | Email normalisation and required-vs-malformed messages, password bounds (8/72, letter, digit), login's deliberately laxer policy, cross-field confirmation |
| `routes.test.ts` | 10 | Access-policy precedence (`/skill/create` guarded, `/skill/42` public), guest routes, open-redirect rejection (`//evil.com`, absolute URLs, `javascript:`) |
| `authErrors.test.ts` | 5 | Known codes map to safe copy; unknown codes and raw messages never reach the client; HTTP 429 treated as rate limiting |
| `actions.test.ts` | 17 | Validation before any write; anonymous callers rejected; updates and deletes filtered by the session user; a payload-supplied `id` ignored; upload MIME/size limits; storage paths namespaced per user; no application-side profile insert |
| `useAuthForm.test.tsx` | 6 | Every invalid field reports, focus moves to the first, `aria-invalid`/`aria-describedby` set, `router.refresh()` precedes `push`, action failures render an alert plus toast, thrown errors do not leak internals |

**Mutation-checked.** To confirm the security tests actually bite, two bugs were
reintroduced deliberately: `updateProfileAction` filtering on a client-supplied id, and
`mapAuthError` forwarding `error.message`. Three tests failed, as intended, and the
mutations were reverted.

**Known gap in the suite.** jsdom does not reproduce the browser-only validation failure
below — the same interaction there keeps all four errors. The test asserts the invariant,
not the original repro; locking that behaviour needs an end-to-end test.

### 2.5 Bug found and fixed during testing

`useAuthForm` used `mode: "onTouched"`. Clicking Submit fires a blur on the focused field
first; in that mode RHF revalidated **only** that field and replaced the error map, so a
form with four invalid fields displayed exactly one message. Reproduced in the browser,
confirmed the resolver itself returned all four errors, then fixed by switching to
`mode: "onSubmit"` with `reValidateMode: "onChange"`.

Also improved while testing: an empty email reported "Invalid email address"; the schema
now reports "Email is required" and only falls through to the format message for genuinely
malformed input.

### 2.6 Lighthouse

| Category | Deployed (pre-refactor build) | Local production build |
|---|---|---|
| Performance | 90 | 94 |
| Accessibility | 96 | 100 |
| Best practices | 96 | 100 |
| SEO | 100 | 90 (artifact — see below) |

The accessibility audit found a genuine defect: white text on the brand blue `#137fec`
measured 3.98:1 and the same blue on its soft background 3.49:1, both below WCAG AA's
4.5:1 for normal text. `--color-primary` moved to `#106bc9` (5.29:1 and 4.64:1, same hue),
which fixed every button, tag, and link at once — the argument for the token layer.

The local SEO drop is a measurement artifact: Lighthouse reports a missing meta
description while the served HTML contains one (`curl` confirms it) and the deployed build
scores 100 on that audit.

### 2.7 Not verified

These need a real Supabase account and the migration applied, so they are untested here:

- Successful login / registration round trip and the email-confirmation branch.
- The guest guard redirecting a signed-in user away from `/login`.
- Profile update, avatar upload, skill create, add/remove skill.
- Password reset end to end (`/auth/callback` code exchange → `/auth/reset`).
- Cross-tab sign-out propagation.

---

## 3. What changed in this refactor

| Area | Before | After |
|---|---|---|
| Auth entry point | Browser client in forms; server actions existed but were dead code | One path: server actions only |
| Profile creation | Client-side insert that ran on only one of two code paths | PostgreSQL trigger on `auth.users` + backfill |
| Middleware redirects | Dropped refreshed session cookies → random logouts | Cookies copied onto every redirect |
| Route guards | Two `if` blocks, inconsistent targets, `/skill/[id]` blocked | Declarative policy table, `redirectTo`, guest guard |
| Auth errors | Raw Supabase messages surfaced | Code-keyed generic copy (`shared/lib/authErrors.ts`) |
| Session state | Mixed into the profile store; logout reset 3 of 7 fields | Dedicated `useSessionStore`, full reset on logout |
| First paint | Nav flashed logged-out, then corrected after hydration | Session resolved server-side, correct on first paint |
| Writes | Client `upsert` with a client-supplied id | Server actions resolving the owner from the cookie |
| RLS | Not established in the repo | Migration with owner-scoped policies for tables and storage |
| Env vars | `!` non-null assertions | Zod-validated at boot |
| UI primitives | One `Button` with a duplicated class on wrapper and button | Variant/size/loading system, `PasswordInput`, a11y attributes |
| Segment states | None | `loading.tsx`, `error.tsx`, `not-found.tsx` |
| Password reset | Absent | Full forgot / callback / reset flow |

49 files modified, 30 added, 4 deleted; roughly +1,200 / −860 lines.

---

## 4. Current quality assessment

### Strengths

- **Consistent write path.** Every mutation is a validated, authorised server action
  returning `ActionResult<T>`; no component talks to the database for writes.
- **Layered security.** Middleware, page-level re-check, action-level ownership, and RLS
  each independently prevent unauthorised access.
- **Server-first rendering.** Pages load data in Server Components; client islands are
  limited to genuinely interactive UI (29 of 117 files).
- **Accessible forms.** Labels, `aria-invalid`, `aria-describedby`, `role="alert"`,
  focus-first-error, and keyboard-operable menus.
- **Clean layering.** No cross-feature deep imports remain; every feature exports through
  its barrel.

### Weaknesses, ranked

| # | Issue | Impact | Effort |
|---|---|---|---|
| 1 | **No end-to-end coverage.** Unit and component tests are in place, but every live-session journey — login round trip, email confirmation, uploads, RLS enforcement — is still verified by hand. | High | M |
| 2 | **Reviews are written from the browser** (`entities/review/review.service.ts` inserts with a client-supplied `author_id`). RLS contains it, but it is the last write that bypasses the server-action convention. | High | S |
| 3 | **Database rows are untyped.** `supabase gen types typescript` is not wired in, so page queries still need casts. | Medium | S |
| 4 | **Browse page fetches client-side in `useEffect`** with no URL state: search and filter are not shareable or bookmarkable, there is no pagination, and an empty result renders nothing at all (`if (!skills.length) return null`). | Medium | M |
| 5 | **Credits are display-only.** `Balance` reads `profiles.credits`; nothing debits or credits it, and "Request Exchange" opens a modal whose only action is close. The core marketplace loop is unimplemented. | Medium | L |
| ~~6~~ | ~~Design tokens only half adopted.~~ **Done.** Every hex literal in `src/**/*.tsx` is now a token; the sweep also surfaced a real WCAG AA contrast failure (below). | — | — |
| ~~7~~ | ~~`SkillDetailReviews` is 232 lines.~~ **Done.** Split into a 78-line container plus `ReviewCard`, `ReviewModal`, `StarRatingInput`, and a `useSkillReviews` hook; the star picker became keyboard-operable radios in the process. | — | — |
| 8 | **`Card` misuses skeletons** as fallbacks for missing data (`{skill.description \|\| <Skeleton/>}`), which shows a loading shimmer for records that simply have no description. | Low | S |
| 9 | **No observability.** Errors are `console.error`-ed; there is no error reporting, and no analytics on the funnel. | Low | M |

### Security posture

Addressed: enumeration-safe auth copy, session-preserving redirects, owner-derived writes,
RLS on all tables and storage, upload MIME/size validation, open-redirect protection on
`redirectTo`, security headers, validated env.

Outstanding:

- **Next.js 15.5.15 has published advisories**, including middleware/proxy bypass, cache
  poisoning, and SSRF in Server Actions. `npm audit --omit=dev` reports 4 high findings
  (next, postcss, sharp, ws), all reachable through the framework. Because the auth guards
  live in middleware, a bypass advisory undermines the first layer of defence — the other
  layers (page re-check, action-level ownership, RLS) still hold, which is exactly why they
  exist.
- Weakness 2 above (browser-side review writes).
- Supabase dashboard settings (rate limits, leaked-password protection, redirect
  allow-list) still need to be applied by the project owner.
- No CSP header yet; Next.js inline scripts need a nonce-based policy.

---

## 5. Recommended next steps

**Now (1–2 days)**
1. Run the migration and create the `skill-images` bucket — the trigger and RLS are inert
   until then (see `TODO.md`).
2. Move `addReview` / `updateReview` into a server action (item 2).
3. Generate database types and drop the remaining casts (item 3).

**Next (3–5 days)**
4. Add Vitest for schemas and action-level logic, and one Playwright journey:
   register → confirm → login → edit profile → create skill → logout.
5. Move browse search and filtering into URL search params with server-side rendering and
   pagination; add a real empty state.
6. Finish the token migration and delete the remaining hex literals.

**Later**
8. Implement the credit transaction loop: request → accept → debit/credit, in a database
   transaction so a balance can never go negative or be double-spent.
9. Messaging and a booking calendar.
10. Error reporting (Sentry or equivalent) and funnel analytics.

---

## 6. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Migration not applied in production | Medium | High — signups produce no profile row | Documented as a blocking step in `TODO.md`; add a startup health check |
| Regression in an untested live-session path | Medium | Medium | Playwright journey, step 5 |
| Framework advisories unpatched | High | High | Next.js upgrade, step 2 |
| Credits implemented without transactional integrity | Medium | High — double-spend | Do the balance change in a single SQL transaction or an RPC, never in application code |
| Supabase anon key treated as a secret | Low | Medium | It is public by design; RLS is the real boundary and is now in place |
| Storage bucket rename missed | Medium | Medium — skill image uploads fail | Verify both buckets exist before deploying |
