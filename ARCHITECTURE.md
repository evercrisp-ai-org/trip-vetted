# Architecture

How Trip Vetted works and why. Read this before changing the database,
auth, or anything security-adjacent.

## Stack

Next.js (App Router) + TypeScript + Tailwind 4, Supabase (Postgres, magic
link auth, storage, RLS), Vercel for hosting. Chosen so any competent Next
developer is productive the same afternoon. Do not add exotic dependencies.

## The two load-bearing rules

### 1. The citation rule (briefs, ships in S5, schema exists now)

Briefs are assembled, not generated. Retrieval pulls stamps from the
requester's network; the model only sequences and writes connective prose.
Every item in `briefs.content_json` must reference a row in
`brief_citations`, which points at the `stamp_id` it came from. A brief that
fails citation validation is not saved. The model never introduces a place
that is not in a retrieved stamp. If the network has no coverage, the brief
says so.

The `briefs` and `brief_citations` tables exist from the first migration so
nothing built now can make this hard later.

### 2. Security lives in the database

Row-level security is enabled on every table in the first migration
(`supabase/migrations/20260901000001_initial_schema.sql`) and is the actual
security boundary. The anon key is public by design; RLS is what stands
between users. UI checks are convenience, not protection.

The policy summary:

| Table             | Read                                        | Write                          |
| ----------------- | ------------------------------------------- | ------------------------------ |
| profiles          | any signed-in member                        | own row; insert needs invite   |
| invites           | your own (sent or redeemed)                 | create as self; revoke unused  |
| connections       | your own                                    | trigger only                   |
| places            | members                                     | members                        |
| stamps            | author; community; network if connected     | author only                    |
| stamp_media       | follows the stamp                           | stamp author only              |
| questions/answers | asker/scope, mirrors stamps                 | as self                        |
| briefs/citations  | requester only                              | requester only                 |
| waitlist_signups  | nobody (service role only)                  | insert by anyone               |

### Emails are never exposed

There is no email column anywhere in `public`. Emails live in `auth.users`
(never client-readable) and `waitlist_signups` (insert-only for clients).
Invites store an optional hash, not an address. `tests/rls/emails.test.ts`
proves all of this against a live database.

## Membership: the invite gate

You cannot become a member without a valid invite, enforced in Postgres:

1. `check_invite_code(code)` is a SECURITY DEFINER function the join page
   calls before any account exists. It leaks only validity plus the
   inviter's display name.
2. After the magic link lands, onboarding calls `redeem_invite(code)`,
   which marks the invite `accepted_by = auth.uid()` inside the database.
   Revoked and used codes are rejected there, not in JavaScript. Note that
   `accepted_by` references auth.users, not profiles: redemption happens
   before the profile exists.
3. The `profiles` INSERT policy refuses any row unless a redeemed invite
   exists for the caller and `invited_by` equals that invite's inviter.
   You cannot join uninvited and you cannot lie about who invited you.
4. A trigger creates the connection between inviter and newcomer, and a
   second trigger makes `invited_by` immutable forever.

An auth user without a profile is not a member; middleware and every member
page route such accounts to onboarding.

The invitation chain (profile pages showing who invited whom) reads
directly from `profiles.invited_by` and `invites`. It is a first-class
record, not derived display.

## Auth flow

Magic link only, via `@supabase/ssr` cookies.

- `/join`: invite code check, then email, then `signInWithOtp`. The code is
  parked in an httpOnly cookie for onboarding.
- `/login`: email, magic link, for existing members.
- `/auth/confirm`: verifies the one-time token, then routes to `/home`
  (profile exists) or `/onboarding` (fresh account). This is the token_hash
  flow: the auth email templates (supabase/templates/, wired in
  config.toml, mirrored in the hosted dashboard) link straight to this
  route. Default Supabase templates will not work with it.
- `src/middleware.ts` refreshes the session cookie and fences `/home`,
  `/people`, `/onboarding`. Pages re-check server-side; the middleware is
  the outer fence, not the only one.

## Frontend conventions

- Organized by feature: `src/features/<feature>/`. Routes in `src/app/` are
  thin and compose feature components.
- All user-facing copy is in `src/content/site.ts`. Never hardcode a string
  in a component. The owner edits that one file.
- Design tokens are defined once in `src/app/globals.css` under `@theme`
  and consumed as Tailwind utilities (`bg-ground`, `text-ink`,
  `bg-accent`, `bg-night`). Do not introduce raw hex values in
  components. The direction (cinematic marketing site, quiet app) and
  the measured contrast ratios live in docs/decisions/0005.
- Marketing imagery goes through the `Photo` component and IMAGERY.md:
  files land in `public/images/`, absent files render a branded
  placeholder, and no image slot may carry text without a scrim measured
  for AA (worst-case math in ADR 0005). No AI-generated human faces,
  ever.
- Accessibility is not optional: focus-visible styles are global, forms
  have real labels, feedback uses `role="status"` / `role="alert"`, and
  reduced motion is respected globally.

## Local ports

This repo's local Supabase runs on ports 54330-54339 (see
`supabase/config.toml`), one block above the defaults, so it can run next
to other local Supabase projects. API: 54331, DB: 54332, Studio: 54333,
mail catcher: 54334.

## Testing philosophy

Tests where they earn their place, currently the RLS suite in `tests/rls/`,
which runs against a real local Supabase and proves user isolation, email
privacy, and the invite gate. When briefs ship, citation integrity gets the
same treatment. No coverage theater.
