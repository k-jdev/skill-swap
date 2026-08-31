# SkillSwap — Architecture

This document describes how the application is put together: the layers, the request
lifecycle, the auth model, the data model, and the design patterns each part relies on.

---

## 1. Layering — Feature-Sliced Design

Imports flow strictly downward. A layer may import from the layers below it, never above,
and never sideways into another slice's internals.

```
app/         routes, layouts, loading & error boundaries        (composition only)
  ↓
widgets/     composite UI blocks assembled from features        (NavBar, UserMenu)
  ↓
features/    business capabilities: actions, stores, forms      (auth, profile, skill, browse)
  ↓
entities/    domain models shared by several features           (session, profile, skill, review)
  ↓
shared/      framework-agnostic building blocks                 (ui, config, lib, utils)
```

Each feature publishes a public API through `features/<name>/index.ts`. Cross-feature
imports use that barrel; reaching into `features/profile/components/...` from another
feature is a layering violation (one such violation existed in `NavBar` and was removed).

| Layer | Files | Responsibility |
|---|---|---|
| `app` | 27 | Route definitions, server-side data loading, segment states |
| `widgets` | 4 | Cross-feature UI composition |
| `features` | 54 | Business logic: server actions, schemas, stores, feature UI |
| `entities` | 7 | Shared domain types and the session facade |
| `shared` | 24 | Design system, validated env, route policy, Supabase clients |

---

## 2. Runtime topology

```
                       ┌──────────────────────────────────────────┐
      HTTP request ───►│ middleware.ts                            │
                       │  1. refresh Supabase session cookie      │
                       │  2. resolveAccess(pathname)              │
                       │  3. redirect (carrying refreshed cookies)│
                       └───────────────┬──────────────────────────┘
                                       │ allowed
                                       ▼
                       ┌──────────────────────────────────────────┐
                       │ app/layout.tsx  (Server Component)       │
                       │  getSession() ── profiles join           │
                       │  <SessionProvider initial={session}>     │
                       └───────────────┬──────────────────────────┘
                                       ▼
             ┌─────────────────────────┴────────────────────────┐
             │                                                  │
   Server Components                                   Client islands
   (pages, data loading)                        (forms, menus, filters)
             │                                                  │
             │ supabase/server.ts (cookie-bound)                │ server actions
             ▼                                                  ▼
        ┌───────────────────────────────────────────────────────────┐
        │ Supabase: PostgreSQL (RLS) · Auth · Storage               │
        └───────────────────────────────────────────────────────────┘
```

Three Supabase clients exist, one per execution context:

| Client | File | Used by | Notes |
|---|---|---|---|
| Browser | `shared/utils/supabase/client.ts` | client islands | Reads and realtime only |
| Server | `shared/utils/supabase/server.ts` | Server Components, server actions | Reads cookies; writes them when possible |
| Middleware | inline in `middleware.ts` | edge middleware | Owns cookie rotation |

All three read credentials from `shared/config/env.ts`, which Zod-validates at boot.

---

## 3. Authentication and authorisation

### 3.1 Sign-in flow

```
LoginForm (client)
   └─ useAuthForm ── zodResolver(loginSchema)
        └─ loginAction (server)
             ├─ re-validates the payload server-side
             ├─ supabase.auth.signInWithPassword  → sets the session cookie
             ├─ mapAuthError(error) on failure    → generic, code-keyed copy
             └─ revalidatePath("/", "layout")
        └─ router.refresh() → Server Components re-render with the new session
        └─ router.push(redirectTo ?? "/")
```

The client never talks to `supabase.auth` for sign-in, sign-up, sign-out, or password
reset. That keeps one code path, one validation source, and one place where errors are
sanitised.

### 3.2 Route access policy (Strategy)

`shared/config/routes.ts` holds a declarative table instead of `if` chains in middleware:

```ts
{ pattern: "/login",         access: "guest"  }
{ pattern: "/profile*",      access: "auth"   }
{ pattern: "/skill/create",  access: "auth"   }
{ pattern: "/skill*",        access: "public" }   // detail pages stay public
```

The first matching rule wins, so specific paths precede the subtree they live in.
`safeRedirect()` accepts only same-origin absolute paths, which closes the open-redirect
hole that `?redirectTo=` would otherwise open.

### 3.3 Cookie rotation on redirects

`supabase.auth.getUser()` inside middleware may rotate the refresh token and write new
cookies onto the response object. A bare `NextResponse.redirect()` creates a *different*
response and silently drops them — the cause of random logouts. Redirects therefore go
through:

```ts
function redirectPreservingSession(url: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
```

### 3.4 Defence in depth

| Layer | Control |
|---|---|
| Middleware | Route policy, session refresh |
| Page | `getUser()` re-check with `redirect()` fallback on protected pages |
| Server action | Owner derived from the session cookie; client-supplied ids ignored |
| PostgreSQL | Row Level Security policies scoped to `auth.uid()` |
| Storage | Object policies matching `auth.uid() = (storage.foldername(name))[1]` |

Any single layer failing does not grant access on its own.

---

## 4. State management

Two Zustand stores with deliberately different lifetimes:

| Store | Holds | Lifetime |
|---|---|---|
| `useSessionStore` | `user` (id, email, username, avatar), `status` | The signed-in session |
| `useProfileStore` | Profile currently on screen: skills, reviews, credits, `isOwner`, `isEditing` | One profile page view |

They were a single store before, which meant signing out left the previous user's skills
and reviews in memory. Splitting them makes `clear()` and `reset()` independent and
obvious.

**Hydration.** `getSession()` runs in the root layout, and `SessionProvider` seeds the
store during its first render. The navigation therefore renders its final state on the
server — no "Login / Sign Up" flash for a signed-in user. `onAuthStateChange` is kept only
for cross-tab events (sign-out elsewhere, token refresh) and triggers `router.refresh()`
so the server recomputes the session.

`ProfileBoard` applies the same idea per page: the store is seeded from server props and
re-seeded when the profile id changes, replacing the previous `*Initializer` components
that rendered `null` and pushed props into the store from `useEffect(..., [])`.

---

## 5. Data access

Two roles, deliberately separated:

```
features/<name>/api/*.repository.ts   pure reads; take a client, return rows; no auth logic
features/<name>/actions.ts            "use server"; validate → authorise → mutate → revalidate
```

Every action returns a discriminated result rather than throwing:

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

The shape forces call sites to handle failure, and `code` lets the UI branch on a stable
identifier while `error` stays human-readable and safe to display.

Server action inventory:

| Module | Actions |
|---|---|
| `features/auth/actions.ts` | `loginAction`, `registerAction`, `logoutAction`, `forgotPasswordAction`, `resetPasswordAction` |
| `features/profile/actions.ts` | `updateProfileAction`, `uploadAvatarAction` |
| `features/skill/actions.ts` | `createSkillAction`, `addSkillAction`, `removeSkillAction`, `uploadSkillImageAction` |
| `features/browse/actions.ts` | `getSkillAction` (search + category filter) |
| `features/skill/api/skill.server.ts` | `getSkillById`, `getSkillProfile` (server reads) |

---

## 6. Data model

```
auth.users ──(trigger: handle_new_user)──► profiles
                                             │ id (PK, = auth.users.id)
                                             │ username, email, description,
                                             │ location, avatar_url, credits
                                             │
                        ┌────────────────────┼────────────────────┐
                        ▼                                         ▼
                     skills                                    reviews
       id, user_id → profiles.id              id, profile_id → profiles.id  (subject)
       skill_title, skill_price,                  author_id  → profiles.id  (author)
       category[], language[],                    rating, content, created_at
       proficiency_level, description,
       image_url
```

Storage buckets: `avatar-images` (`<user id>/avatar.<ext>`) and `skill-images`
(`<user id>/<uuid>.<ext>`). The per-user prefix is what makes ownership expressible as a
storage policy.

---

## 7. Design patterns in use

| Pattern | Where | Why |
|---|---|---|
| **Facade** | `entities/session` — `getSession()` | One answer to "who is the viewer", read from `profiles` rather than `user_metadata` so profile edits propagate |
| **Provider + server hydration** | `SessionProvider` | Correct first paint, no post-hydration layout shift |
| **Command** | Server actions | Every mutation is one named, validated, authorised unit |
| **Repository** | `*.repository.ts` | Data access isolated from policy and presentation |
| **Strategy** | `shared/config/routes.ts` | Route access as data, not branching logic |
| **Result type** | `ActionResult<T>` | Failure is part of the signature, not an exception |
| **Template Method** | `useAuthForm` | One submit pipeline — validate, call, toast, refresh, redirect — reused by four forms |
| **Adapter** | Three Supabase client factories | One dependency, three execution contexts |
| **Design tokens** | `globals.css` `@theme` | Brand colour defined once instead of a hex literal in a dozen components |

---

## 8. Rendering and UX conventions

- Server Components load data; client components own interaction. 29 of 117 files are
  client components.
- Every route segment that loads remote data has `loading.tsx` (skeletons) and
  `error.tsx`; the app has a global `not-found.tsx`.
- Forms: labelled inputs, `aria-invalid`, `aria-describedby`, `role="alert"` messages,
  focus moved to the first invalid field after a failed submit.
- Validation runs on submit and re-validates on change. `onTouched` mode is deliberately
  avoided: the blur event that a submit click fires revalidated a single field and cleared
  the other errors, so only one message ever appeared.
- Layout uses fluid containers (`mx-auto max-w-6xl`) rather than fixed pixel margins.

---

## 9. Request lifecycles

**Anonymous visitor opens `/profile`**

```
GET /profile
 → middleware: no session, policy = "auth"
 → 307 /login?redirectTo=%2Fprofile   (with refreshed cookies attached)
 → LoginForm reads redirectTo and returns the user there after sign-in
```

**Signed-in owner edits their profile**

```
UserInfo (client) → updateProfileAction (server)
   → Zod validation
   → supabase.auth.getUser()      ← owner comes from the cookie
   → UPDATE profiles WHERE id = user.id     ← RLS re-checks ownership
   → revalidatePath("/profile"), revalidatePath("/", "layout")
   → router.refresh()             ← nav avatar and session pick up the change
```

**Email confirmation**

```
Supabase email link → /auth/callback?code=…
   → exchangeCodeForSession(code) → session cookie
   → redirect to ?redirectTo= (same-origin only) or "/"
```

---

## 10. Testing strategy

Tests live in `tests/` and run on Vitest with jsdom; `vitest.config.ts` supplies the
Supabase env vars that `shared/config/env.ts` validates at import time.

The suite deliberately targets the parts where a mistake is expensive rather than chasing
coverage:

| Kind | Target | Why |
|---|---|---|
| Pure unit | Zod schemas, `resolveAccess`, `safeRedirect`, `mapAuthError` | No mocks needed, and they encode the security rules |
| Action | Server actions with a chainable Supabase mock | Asserts *which rows* an action targets — the ownership question |
| Component | `useAuthForm` through a form mirroring `RegisterForm` | The shared submit pipeline every auth screen depends on |

`tests/helpers/supabaseMock.ts` records `from(table).op(payload).eq(column, value)` chains,
so a test can assert that `updateProfileAction` filtered on the session user's id rather
than anything supplied by the caller.

Two limitations worth knowing:

- **jsdom does not reproduce the original `onTouched` failure.** The browser lost three of
  four field errors; the same interaction in jsdom keeps all four. The unit test therefore
  asserts the invariant ("every invalid field reports"), and locking the real behaviour
  would need an end-to-end test.
- **No end-to-end coverage.** Everything that requires a live Supabase session — login
  round trip, email confirmation, uploads, RLS enforcement — is currently verified by hand.

---

## 11. Known constraints

- Database rows are not yet typed from the schema; `supabase gen types typescript` would
  remove the remaining casts in the profile pages.
- Credits are displayed but no transaction path writes them.
- Automated coverage stops at the unit and component level; the live-session journeys are
  still verified by hand.
- The pinned Next.js version (15.5.15) carries published middleware-bypass advisories.
  Since route guards depend on middleware, upgrading is a security task, not housekeeping.
