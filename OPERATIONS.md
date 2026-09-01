# Operations

Running Trip Vetted in the real world. Written for whoever holds the keys.

## Accounts (per BUILD-SPEC section 4)

Everything is created in the owner's name from day one. As of the current
slice the hosted accounts do not exist yet; the repo is ready to point at
them with env vars alone.

| Service  | Purpose                          | Status                       |
| -------- | -------------------------------- | ---------------------------- |
| GitHub   | Code, CI                         | Not yet created (owner org)  |
| Supabase | Database, auth, storage          | Not yet created (owner acct) |
| Vercel   | Hosting, deploys from GitHub     | Not yet created (owner acct) |

When they exist, record project names and dashboard URLs here.

## Going live checklist

1. Create the Supabase project in the owner's account.
2. Push migrations: `npx supabase link --project-ref <ref>` then
   `npx supabase db push`. Do NOT run `supabase/seed.sql` in production;
   it is demo data.
3. Create the founding member: insert their profile row manually with
   `invited_by = null` (SQL editor, once). Everyone else joins by invite.
4. In Supabase Auth settings: set the site URL to the production domain,
   add it to redirect URLs, and configure an SMTP provider for magic links
   (the built-in mailer is rate-limited to a trickle).
5. Create the Vercel project from the GitHub repo. Set env vars from
   `.env.example`: the two NEXT_PUBLIC Supabase values and
   NEXT_PUBLIC_SITE_URL. The service role key is NOT needed by the app;
   never set it in Vercel.
6. Deploy. CI must be green first.

## Monthly cost

Now (no users): Supabase free tier, Vercel Hobby, GitHub free. $0.
At about 1,000 members: Supabase Pro $25/mo (storage for stamp photos is
the variable to watch), Vercel Pro $20/mo if the Hobby limits pinch,
domain about $15/yr. Realistic ceiling around $50/mo. Claude API costs for
brief assembly land in S5 and scale with usage, budget order-of-magnitude
$10-50/mo early on.

## Deploying

Merges to `main` deploy via Vercel automatically once connected. CI runs
typecheck, lint, the RLS suite against a disposable local Supabase, and a
production build on every PR.

## Rotating a key

Supabase dashboard > Project Settings > API. Generate a new anon key,
update the Vercel env var, redeploy. If the service role key ever leaks,
rotate it there immediately; nothing in the deployed app uses it, so only
CI/local tooling needs the new value.

## Backups

Supabase Pro takes daily automatic backups (7-day retention). Restore from
the dashboard: Database > Backups > Restore. Before risky migrations run
`npx supabase db dump -f backup.sql` for a local copy.

## When it breaks

1. Site down: check https://www.vercel-status.com and the Vercel deploy
   logs. Roll back to the previous deployment from the Vercel dashboard
   (one click, instant).
2. Sign-in links not arriving: check SMTP provider status and the Supabase
   Auth logs. Rate limits are the usual suspect.
3. Database errors: Supabase dashboard > Logs. Check
   https://status.supabase.com.
4. Who to call: the developer of record for the current engagement, or any
   Next.js/Supabase developer; the repo is deliberately boring and the
   docs assume a stranger.
