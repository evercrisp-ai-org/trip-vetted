# Trip Vetted

Real Experiences. Trusted Advice.

An invite-only travel network where every recommendation is attached to a
person you actually know. Members log trips as stamps; trip planning
assembles briefs from the stamps of friends who have been there, with every
line attributed. The full product definition is in `BUILD-SPEC.md`.

## Running locally in five minutes

Prerequisites: Node 20+, Docker running.

```bash
git clone <repo-url> && cd trip-vetted
npm install

# Start the local Supabase stack (applies migrations and seed data)
npx supabase start

# Create your env file from the values supabase start printed
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY
# from that output. The URL is http://127.0.0.1:54331 (note: this repo
# uses ports 54330-54339 to avoid colliding with other local projects).

npm run dev
```

Open http://localhost:3000. The marketing site is at `/`.

To try the member flow: go to `/join`, use the seeded invite code
`TV-DEMOFRIEND`, enter any email, then open the magic link from the local
mail catcher at http://127.0.0.1:54334.

Seeded demo members (see `supabase/seed.sql`): maya, jonah, priya, sam,
all `@demo.tripvetted.local`, password `demo-password` (used by tests;
the app itself signs in by magic link only).

## Commands

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server on :3000                             |
| `npm run build`     | Production build                                |
| `npm run typecheck` | TypeScript, no emit                             |
| `npm run lint`      | ESLint                                          |
| `npm test`          | Full test suite (needs local Supabase running)  |
| `npm run test:rls`  | Just the row-level security suite               |

## Where things live

```
src/content/site.ts        every user-facing word, edit copy here
src/app/                   routes (marketing, join, login, onboarding, home, people)
src/features/<feature>/    components and server actions, grouped by feature
src/lib/supabase/          client/server/middleware Supabase helpers
supabase/migrations/       schema, RLS policies, functions
supabase/seed.sql          local demo data, clearly fictional
tests/rls/                 proof that the security policies hold
docs/                      ARCHITECTURE, OPERATIONS, ROADMAP, decisions/
```

Read `ARCHITECTURE.md` before touching the database or auth.
Read `CLAUDE.md` for the working rules that govern this repo.
