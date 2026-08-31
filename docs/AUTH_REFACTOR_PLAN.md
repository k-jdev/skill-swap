# SkillSwap — Auth Integration & Architecture Plan

Stack: Next.js 15 (App Router, Turbopack), React 19, Supabase (`@supabase/ssr`), Zustand, RHF + Zod 4, Tailwind 4, sonner.
Layering: Feature-Sliced Design (`app / widgets / features / entities / shared`).

---

## 1. Audit — what is broken today

### 1.1 Auth (critical)

| # | Issue | Where | Impact |
|---|---|---|---|
| A1 | Two competing auth paths. `loginAction` / `registerAction` server actions exist but **nothing calls them** — the forms sign in with the browser client. | `features/auth/actions.ts` vs `LoginForm.tsx`, `RegisterForm.tsx` | Dead code, drifting logic, no single source of truth. |
| A2 | Client `signUp` never inserts a `profiles` row (only the unused server action does). | `RegisterForm.tsx` | Every new user has `profile === null`; the profile page renders empty and `username` falls back to auth metadata. |
| A3 | `router.push("/")` without `router.refresh()` after login/logout. | Login/Register forms, `NavBar` | Server Components keep the stale (logged-out) render until a hard reload. |
| A4 | Middleware returns `NextResponse.redirect()` **without copying the refreshed session cookies** from `supabaseResponse`. | `middleware.ts:36-46` | Refresh-token rotation is lost on every guarded redirect → random logouts / refresh loops. |
| A5 | The guard blocks the whole `/skill` segment, including public detail pages `/skill/[id]`. Redirect target is inconsistent (`/` for profile, `/login` for skill). No `?redirectTo=` preserved. | `middleware.ts` | Public content unreachable; the user loses their destination after login. |
| A6 | No reverse guard: an authenticated user can still open `/login` and `/register`. | `middleware.ts` | Confusing state. |
| A7 | The register flow ignores email confirmation. It redirects as if signed in even when `session === null`. | `RegisterForm.tsx` | Silent failure when "Confirm email" is enabled in Supabase. |
| A8 | Raw `error.message` surfaced via toast ("User already registered"). | Login/Register forms | **Account enumeration.** Map error codes to generic copy. |
| A9 | Session state lives inside `useProfileStore` (`isAuthenticated` sitting next to `skills`, `reviews`, `isEditing`). | `features/profile/model` | SRP violation; logout resets only 3 of 7 fields → stale `userId`/`reviews` leak into the next session. |
| A10 | `AuthInitializer` derives identity from `user_metadata`, not the `profiles` table. | `AuthInitializer.tsx` | Avatar/username stale after a profile edit; the nav flashes logged-out on every load (server renders anonymous, client corrects). |
| A11 | Env vars read with the `!` non-null assertion, never validated. | `supabase/{client,server}.ts`, `middleware.ts` | Cryptic runtime crash on a missing key. |
| A12 | `updateProfile` does a **client-side** `upsert` with a caller-supplied `id`. | `profile.service.ts` | Safe only if RLS is airtight; belongs in a server action that resolves `auth.getUser()`. |
| A13 | Dead/stub code: `app/api/login/route.ts`, `getCurrentUser()`, `console.log` of profile data. | several | Noise, plus user data in the browser console. |
| A14 | Zod 4: `z.string().email()` is deprecated (`z.email()`); password rule is 6 chars with no max; email is not lowercased. | `auth/schemas/*` | Weak policy, future breakage. |

### 1.2 Architecture

- **Layer leak:** `widgets/navbar/NavBar.tsx` imports the profile store through a relative path `../../features/profile/...` and embeds logout logic plus an inline SVG.
- **No API convention:** three parallel styles — `actions.ts` (server action), `api/*.service.ts` (browser client), `api/*.server.ts` (`"use server"` reads). Nothing says which to use when.
- **`ActionResult<T>` exists but only `features/{auth,skill,browse}` use it;** profile calls return `null` on error.
- **`*Initializer` anti-pattern:** components that render `null` and push props into a store from `useEffect(..., [])`. Empty dep array, double render, no SSR value.
- **No `error.tsx` / `loading.tsx` / `not-found.tsx`** in any route segment. `react-loading-skeleton` is a dependency and is never imported.
- Duplication: Login and Register forms are the same 40 lines with different fields.

### 1.3 UI/UX

- **Auth forms:** no `autoComplete` (`email` / `current-password` / `new-password`), no password reveal toggle, no `aria-invalid` / `aria-describedby`, no focus-first-error, no `noValidate`. The register page has no header block, and `HeaderBlock` is hard-coded to "Welcome back".
- **No forgot-password flow at all.**
- **`Button`:** the wrapper `div` and the `button` receive the *same* `className`; `type` is hard-locked to `submit`; no variants, sizes, or loading spinner.
- **NavBar menu:** hover-only, so it is unreachable by keyboard; no `aria-expanded`, no Escape / click-outside close; no mobile burger; `/contact` links to a route that does not exist; uses a raw `<img>` while the rest of the app uses `next/image`.
- **Layout:** the profile page is `mx-[240px]` fixed → horizontal scroll below ~1200px.
- **Perceived performance:** the auth-dependent nav flips from "Login/Sign Up" to the avatar after hydration — layout shift on every navigation.
- **Design tokens:** `#137fec` is hard-coded in ~8 files; `text-slate-400` body copy on white is borderline for WCAG AA.
- Missing empty states for skills and reviews; `Balance` is a `<div>Balance</div>` stub.

---

## 2. Target design (patterns applied)

| Pattern | Application |
|---|---|
| **Single source of truth / Facade** | New slice `entities/session`: a `SessionUser` type plus a `getSession()` server helper. Every layer asks the session facade, never Supabase directly. |
| **Server-first Provider** | The root layout resolves the session on the server and passes it to `<SessionProvider>`; the Zustand store is created already hydrated. Kills the logged-out flash and both `*Initializer` components. |
| **Command / Server Action as the only mutation entry point** | Login, register, logout, and profile update all go through `"use server"` actions returning `ActionResult<T>`. The browser client stays read-only plus realtime and storage. |
| **Repository layer** | `features/*/api/*.repository.ts` = pure data access (takes a client, returns typed rows). Actions compose repositories; the `service` vs `server` split disappears. |
| **Strategy (route policy)** | A declarative table `{ pattern, access: "public" \| "auth" \| "guest" }` in `shared/config/routes.ts`; the middleware iterates it instead of `if` chains. |
| **Result type everywhere** | `ActionResult<T>` gains a stable `code` field; `shared/lib/authErrors.ts` maps Supabase codes to safe user copy. |
| **Custom hook (Template Method)** | `useAuthForm(schema, action)` wraps RHF, the action call, the toast, `router.refresh()`, and the redirect. Login and Register forms shrink to markup. |
| **DB trigger over app code** | A Postgres `handle_new_user()` trigger on `auth.users` creates the `profiles` row — atomic, and it also covers OAuth and magic-link signups. |
| **Design tokens** | CSS variables in `globals.css` (`--color-primary`, `--color-surface`, …) exposed through the Tailwind 4 `@theme` block; component variants via a small `cva`-style map. |

Target auth flow:

```
Browser form
  -> useAuthForm  -> server action (Zod validate -> supabase.auth.*)
                  -> ActionResult { success | code }
  -> on success: router.refresh() + redirect(redirectTo ?? "/")
Middleware  -> refresh session cookie -> apply route policy (cookies always copied onto redirects)
Root layout -> getSession() on the server -> <SessionProvider initial={session}>
DB trigger  -> profiles row created on auth.users insert
```

---

## 3. Execution plan

### Phase 0 — Safety net (0.5 d)
1. `shared/config/env.ts`: Zod-parse `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, fail fast at boot, and use it in all three Supabase factories.
2. Verify RLS in Supabase: `profiles` select public, update/insert `auth.uid() = id`; `skills` and `reviews` writes restricted to the owner; storage buckets `avatar-images` and `skil-images` (typo — rename to `skill-images`) owner-scoped.
3. Delete `app/api/login/route.ts` and `getCurrentUser()`; strip `console.log` from `UserInfo` and `profile.service`.

### Phase 1 — Auth core (1.5 d) — fixes A1–A8, A11, A14
4. SQL migration: `handle_new_user()` trigger plus a backfill of `profiles` for existing users (fixes A2).
5. Rewrite `features/auth/actions.ts`: `loginAction`, `registerAction`, `logoutAction` — Zod-validated, returning `ActionResult<{ needsEmailConfirmation?: boolean }>` with a `code`, never a raw Supabase message (A8).
6. `shared/lib/authErrors.ts`: code → safe copy map.
7. Schemas: `z.email()`, lowercase and trim the email, password 8–72 chars with at least one letter and one digit, shared `passwordSchema` (A14).
8. `useAuthForm` hook; rewrite `LoginForm` / `RegisterForm` on top of it, calling `router.refresh()` before `push` (A3) and rendering an explicit "check your inbox" state (A7).
9. Rewrite `middleware.ts`: build the response once and copy its cookies onto every redirect (A4), drive guards from `shared/config/routes.ts`, keep `/skill/[id]` public while protecting `/skill/create` and `/profile` (A5), add the guest guard for `/login` and `/register` (A6), and append `?redirectTo=`.

### Phase 2 — Session state (1 d) — fixes A9, A10
10. New `entities/session/model.ts` (`SessionUser`) plus `features/auth/model/useSessionStore.ts` holding only `{ user, status }`.
11. `SessionProvider` hydrated from the root layout's server-side `getSession()`; delete `AuthInitializer` and `ProfileInitializer`; keep `onAuthStateChange` solely for cross-tab sync (`SIGNED_OUT`, `TOKEN_REFRESHED`).
12. Strip `isAuthenticated` and `userId` out of `useProfileStore`; call `logoutAction` plus a full `reset()` on sign-out.
13. `NavBar` imports from `@/features/auth` only (layer leak fixed); extract `UserMenu` and `WalletIcon` into their own files.

### Phase 3 — Data layer consistency (1 d) — fixes A12 and the `ActionResult` gaps
14. Adopt the repository naming convention; move every write (`updateProfile`, `addSkill`, `removeSkill`, avatar upload path resolution) into server actions that resolve `user.id` server-side and ignore any client-sent id (A12).
15. `revalidatePath("/profile")` after profile mutations; drop the manual store patching inside `UserInfo`.
16. Type the Supabase schema: `npx supabase gen types typescript` → `shared/types/database.ts`, and pass the generic to every `createClient`. This removes the untyped rows in the profile page's `Promise.all`.

### Phase 4 — UI/UX (1.5 d)
17. `Button` v2: `variant` (primary / secondary / ghost / danger), `size`, `isLoading` spinner, a real `type` prop, a single `className` target, no wrapper div.
18. `Input` v2: `aria-invalid`, `aria-describedby`, `required`, `autoComplete` passthrough; new `PasswordInput` with a reveal toggle and a caps-lock hint.
19. Auth pages: parametrised `HeaderBlock` (`title` / `subtitle`), header added to the register page, focus-first-error, `noValidate`, submit disabled while pending, forgot-password link.
20. **Forgot / reset password**: `/forgot-password` and `/auth/reset` routes using `resetPasswordForEmail` and `updateUser`.
21. `UserMenu`: a real button with `aria-expanded` / `aria-haspopup`, click to open, Escape and click-outside to close, roving focus; mobile burger nav; remove or implement `/contact`.
22. Route segments: `loading.tsx` (skeletons via the already-installed `react-loading-skeleton`), `error.tsx`, and `not-found.tsx` for `(auth)`, `/profile`, `/skill`, `/browser`.
23. Responsive: `mx-[240px]` → `mx-auto w-full max-w-6xl px-4`; audit the other fixed pixel widths (the 300px avatar becomes a responsive clamp).
24. Design tokens in `globals.css` via the Tailwind 4 `@theme` block; replace the hard-coded `#137fec`; raise muted-text contrast to `slate-500` or darker.
25. Implement `Balance` (TODO #3) against a `credits` column, with a skeleton and an empty state.

### Phase 5 — Hardening (0.5 d)
26. Supabase dashboard: rate limits on sign-in and sign-up, password strength and leaked-password protection on, redirect URLs allow-listed.
27. `next.config.ts`: security headers (`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) and `images.remotePatterns` for the Supabase storage host — the raw `<img>` in NavBar exists because of this gap.
28. Manual test matrix: fresh signup with and without email confirmation · login · wrong password · guarded redirect carrying `redirectTo` · logout in tab A reflected in tab B · token refresh after an hour idle · direct `/profile` hit while logged out · authenticated hit on `/login`.

Estimated total: **~6 developer-days.** Phases 0–2 fix real bugs; 3–5 are hardening and polish.

### Recommended commit sequence
```
fix(auth): validate env and drop dead auth endpoints
feat(db): create profile row via auth.users trigger
refactor(auth): route all auth through server actions
fix(middleware): preserve session cookies on redirect
feat(auth): declarative route access policy
refactor(auth): split session state from profile store
refactor(profile): server actions and repository layer
feat(ui): button and input variants with a11y states
feat(auth): forgot and reset password flow
feat(ui): loading, error and empty states
```
