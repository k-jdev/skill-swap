# SkillSwap — Peer-to-Peer Skill Exchange Platform

[![CI](https://github.com/k-jdev/skill-swap/actions/workflows/ci.yml/badge.svg)](https://github.com/k-jdev/skill-swap/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-live-137fec)](https://skill-swap-orpin.vercel.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**Live demo → [skill-swap-orpin.vercel.app](https://skill-swap-orpin.vercel.app/)**

![SkillSwap home page](./docs/screenshots/home.png)

A full-stack web application where people offer skills they can teach, browse what others
offer, and exchange lessons using an in-app credit balance. Built with **Next.js 15 (App
Router)**, **React 19**, **TypeScript**, **Supabase (PostgreSQL + Auth + Storage)** and
**Tailwind CSS 4**, organised with **Feature-Sliced Design**.

**Live stack:** Next.js · React · TypeScript · Supabase · PostgreSQL · Tailwind CSS ·
Zustand · React Hook Form · Zod · Server Actions · Row Level Security · Vitest ·
Testing Library · GitHub Actions CI

---

## Table of contents

- [Live demo](#live-demo)
- [Overview](#overview)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [Engineering highlights](#engineering-highlights)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Quality checks](#quality-checks)
- [Lighthouse](#lighthouse)
- [Security](#security)
- [Roadmap](#roadmap)

---

## Live demo

<https://skill-swap-orpin.vercel.app/>

Browsing skills, the "How it works" page, and both auth screens are reachable without an
account. Creating a skill or opening a profile requires signing up — registration is open
and takes a few seconds.

---

## Overview

|                  |                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Type**         | Full-stack web application (SSR + Server Actions)                                         |
| **Domain**       | Marketplace / community platform for skill exchange                                       |
| **Codebase**     | ~5,700 lines of TypeScript across 117 files                                               |
| **Architecture** | Feature-Sliced Design — `app / widgets / features / entities / shared`                    |
| **Rendering**    | React Server Components with selective client islands (29 client components)              |
| **Data layer**   | Supabase PostgreSQL accessed through 5 server-action modules and typed repositories       |
| **Auth**         | Cookie-based Supabase Auth with middleware route guards and PostgreSQL Row Level Security |

---

## Key features

**Accounts and access**

- Email/password registration and login handled entirely through server actions.
- Email-confirmation aware sign-up: the UI waits for confirmation instead of pretending
  the user is signed in.
- Forgot-password and reset-password flows with a one-time code exchange endpoint.
- Route protection driven by a declarative access policy: public, authenticated-only, and
  guest-only routes, with the original destination preserved through `?redirectTo=`.

**Profiles**

- Editable profile with avatar upload to Supabase Storage (server-validated MIME type and
  size limits, per-user storage paths).
- Public profile pages for other members, with the owner's private data kept out.
- Skills managed as tags; reviews with a star-rating distribution summary.
- Credit balance panel visible only to the profile owner.

**Skill marketplace**

- Skill listing with full-text search and category filtering.
- Skill creation with image upload, pricing, proficiency level, and language.
- Skill detail pages with the seller profile, reviews, and a booking panel.

**User experience**

- Session resolved on the server, so the navigation renders in its final state on first
  paint — no logged-out flash or layout shift.
- Accessible forms: labels, `aria-invalid` / `aria-describedby`, `role="alert"` errors,
  focus moved to the first invalid field, password reveal toggle, caps-lock hint.
- Keyboard-accessible account menu (Escape, click-outside, `aria-expanded`), responsive
  navigation with a mobile menu.
- Loading skeletons, error boundaries, and a 404 page per route segment.

---

## Tech stack

| Layer              | Technology                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| Framework          | Next.js 15.5 (App Router, Server Components, Server Actions, Middleware) |
| Language           | TypeScript 5 (strict)                                                    |
| UI                 | React 19, Tailwind CSS 4 with CSS-variable design tokens                 |
| Forms & validation | React Hook Form 7, Zod 4, `@hookform/resolvers`                          |
| State              | Zustand 5 (session store and profile-view store)                         |
| Backend            | Supabase — PostgreSQL, Auth (SSR cookie sessions), Storage               |
| Notifications      | Sonner                                                                   |
| Loading states     | react-loading-skeleton                                                   |
| Testing            | Vitest 3, Testing Library (React + user-event), jsdom                    |
| CI                 | GitHub Actions — type check, lint, tests, build on every push           |
| Tooling            | ESLint 9 (`eslint-config-next`), Turbopack                               |

---

## Architecture at a glance

```
Browser
  │
  ├─ Client islands (forms, menus, filters) ── Server Actions ─┐
  │                                                            │
  ├─ Middleware ── refresh session cookie ── route policy ──────┤
  │                                                            ▼
  └─ Server Components ── getSession() ──────────────► Supabase (PostgreSQL + RLS)
                                                        Auth · Storage
```

- **Every mutation is a server action.** The browser Supabase client is read-only; the
  owner of a write is always resolved from the session cookie, never from the request body.
- **Row Level Security** is the last line of defence: profiles, skills, reviews, and
  storage objects all carry owner-scoped policies.
- **Sessions are resolved server-side** and handed to a client provider, so the first
  render already knows who is signed in.

A full write-up — layer responsibilities, request lifecycle, data model, and the design
patterns used — lives in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
A code-level audit, the verification log, and the ranked backlog live in
[`docs/PROJECT_ANALYSIS.md`](./docs/PROJECT_ANALYSIS.md); the original refactor plan is in
[`docs/AUTH_REFACTOR_PLAN.md`](./docs/AUTH_REFACTOR_PLAN.md).

---

## Engineering highlights

Concrete problems solved in this codebase — useful context for reviewers:

- **Session loss on guarded redirects.** Middleware returned a redirect without carrying
  the refreshed auth cookies, so token rotation was dropped and users were logged out at
  random. Redirects now copy the refreshed cookie jar.
- **Account enumeration removed.** Raw Supabase auth messages ("User already registered")
  were surfaced to the client. Errors are now mapped server-side to generic copy keyed by
  a stable error code.
- **Atomic profile creation.** Profile rows are created by a PostgreSQL trigger on
  `auth.users` instead of a second client-side insert that could silently fail — this also
  covers OAuth and magic-link sign-ups.
- **Privilege boundary on writes.** Profile updates previously ran a client-side `upsert`
  with a client-supplied id. Writes moved into server actions that derive the owner from
  the session and ignore any id in the payload.
- **Validation bug found by browser testing.** With `mode: "onTouched"`, the blur fired by
  clicking Submit revalidated a single field and cleared the other field errors, so only
  one message ever appeared. Switching to `onSubmit` + `reValidateMode: "onChange"` fixed
  it — caught by driving the real UI, not by unit tests.
- **Tests verified by mutation.** The security assertions were checked by deliberately
  reintroducing two bugs — accepting a client-supplied profile id, and forwarding raw
  Supabase error text — and confirming the suite went red for both.
- **Layered state.** Authentication identity and profile-view state were tangled in one
  Zustand store, so signing out left the previous user's data behind. They are now two
  stores with distinct lifecycles.

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- A Supabase project (free tier is enough)

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

`.env.local` needs two values from your Supabase project (Project settings → API):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Both variables are validated at boot by `src/shared/config/env.ts`; a missing or malformed
value fails fast with a readable message instead of a runtime crash.

### 3. Set up the database

Run `supabase/migrations/0001_profiles_trigger_and_rls.sql` in the Supabase SQL editor
(or `supabase db push`). It:

- adds the profile columns the app writes,
- creates the `handle_new_user()` trigger that inserts a `profiles` row for every new
  auth user, and backfills existing users,
- enables Row Level Security with owner-scoped policies on `profiles`, `skills`,
  `reviews`, and the storage buckets.

Create two **public** storage buckets: `avatar-images` and `skill-images`.

In **Authentication → URL configuration**, allow-list `<origin>/auth/callback` and
`<origin>/auth/reset`.

### 4. Run

```bash
npm run dev      # http://localhost:3000
```

---

## Project structure

```
src/
├── app/                     # Next.js App Router: routes, layouts, loading/error states
│   ├── (auth)/              # login, register, forgot-password, reset
│   ├── (main)/              # home, browse, skills, profiles
│   └── auth/callback/       # email confirmation / recovery code exchange
├── widgets/                 # Composite UI blocks (navigation, account menu)
├── features/                # Business capabilities, each self-contained
│   ├── auth/                # actions, schemas, session store, forms
│   ├── profile/             # actions, repository, profile board and panels
│   ├── skill/               # actions, repository, create and detail views
│   ├── browse/              # search and filtering
│   ├── home/  how-it-works/ # marketing surfaces
├── entities/                # Domain models shared across features
│   ├── session/             # SessionUser + server-side getSession()
│   ├── profile/  skill/  review/
└── shared/                  # Framework-agnostic building blocks
    ├── config/              # validated env, route access policy
    ├── lib/                 # error mapping, metadata helper
    ├── ui/                  # Button, Input, PasswordInput, Modal, skeletons, icons
    ├── types/  constants/  utils/supabase/
```

Each feature exposes a public API through its `index.ts` barrel; cross-feature imports go
through that barrel, never into a feature's internals.

---

## Available scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Development server (Turbopack)  |
| `npm run build`      | Production build                |
| `npm start`          | Serve the production build      |
| `npm test`           | Run the Vitest suite once       |
| `npm run test:watch` | Vitest in watch mode            |
| `npm run typecheck`  | TypeScript, no emit             |
| `npm run lint`       | ESLint                          |

---

## Quality checks

Current status on the working branch:

| Check               | Result                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck` | Passing, no errors                                                                                                         |
| `npm run lint`      | Passing, no errors or warnings                                                                                             |
| `npm test`          | 52 tests across 5 files, all passing                                                                                       |
| `npm run build`     | Passing — 16 routes compiled                                                                                               |
| Route smoke tests   | Public routes 200; `/profile` and `/skill/create` redirect anonymous visitors to `/login?redirectTo=…`; unknown routes 404 |
| Browser UI tests    | Form validation, focus-first-error, and generic auth error copy verified in Chrome                                         |

All four commands run in CI on every push (`.github/workflows/ci.yml`).

### What the suite covers

| File | Focus |
| --- | --- |
| `tests/schemas.test.ts` | Email normalisation, password policy bounds, cross-field confirmation |
| `tests/routes.test.ts` | Route access policy precedence, open-redirect rejection |
| `tests/authErrors.test.ts` | Auth errors never leak raw Supabase text (account enumeration) |
| `tests/actions.test.ts` | Server actions derive the owner from the session, ignore client-supplied ids, validate before writing, and namespace uploads per user |
| `tests/useAuthForm.test.tsx` | Form pipeline: all field errors surface, focus moves to the first, `aria-invalid` set, refresh precedes redirect, thrown errors are not leaked |

The security assertions were mutation-checked: reintroducing a client-supplied profile id
and forwarding raw Supabase messages both turn the suite red.

End-to-end coverage (a real Supabase project, the confirmation email journey) is not in
place yet — see the roadmap.

---

## Lighthouse

Measured with Lighthouse 12, headless Chrome, home page.

| Category | Deployed build | Local production build (this branch) |
|---|---|---|
| Performance | 90 | 94 |
| Accessibility | 96 | **100** |
| Best practices | 96 | **100** |
| SEO | 100 | 90 * |

The accessibility gain is a real fix, not a tweak: Lighthouse flagged white text on the
original brand blue `#137fec` at **3.98:1** and the same blue on its soft background at
**3.49:1**, both under the WCAG AA 4.5:1 threshold for normal text. The token was moved to
`#106bc9` — same hue, **5.29:1** and **4.64:1** — so every button, tag, and link inherited
the fix at once. That is the payoff for having a token layer instead of a hex literal in
twelve components.

\* The local SEO score is a measurement artifact: Lighthouse reports a missing meta
description, but the served HTML contains `<meta name="description" content="Exchange
skills with others">` (verified with `curl`), and the deployed build scores 100 on the
same audit.

The deployed numbers predate this branch — the live demo still runs the pre-refactor build.

---

## Security

- Passwords are never handled by application code; Supabase Auth owns hashing and sessions.
- Session cookies are HTTP-only and refreshed in middleware on every request.
- All writes run through server actions that resolve the acting user from the session.
- PostgreSQL Row Level Security enforces ownership at the database level, so a leaked anon
  key cannot be used to modify another user's data.
- Uploads are validated server-side (MIME allow-list, 2 MB avatars / 5 MB skill images)
  and stored under per-user paths matched by storage policies.
- Auth errors are mapped to generic messages to prevent account enumeration.
- `?redirectTo=` accepts same-origin absolute paths only, blocking open redirects.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are set for every response.

---

## Roadmap

- Playwright end-to-end journey against a disposable Supabase project: register → confirm
  → login → edit profile → create skill → logout.
- Generated database types (`supabase gen types typescript`) for end-to-end type safety.
- Credit transactions: booking a lesson should debit the learner and credit the teacher.
- Messaging between members, and a booking calendar.
- Internationalisation of user-facing copy.
