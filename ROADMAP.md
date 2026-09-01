# Roadmap

What is built, what is not, and honest effort bands for what remains.
Slices are defined in `BUILD-SPEC.md` section 6.

## Built

- S0 Foundations: scaffold, design tokens, schema with RLS from the first
  migration, seed data, CI (typecheck, lint, RLS tests, build), docs.
  Note: hosted accounts (GitHub org, Supabase, Vercel) do not exist yet;
  the repo is ready for them with env vars only.
- S1 Marketing site: hero, travel circle, how it works, stamps and briefs,
  privacy, waitlist capture. All copy in `src/content/site.ts`.
- S2 Identity and trust graph: magic-link auth, invite-gated membership
  enforced in Postgres, onboarding (name, avatar, home city, taste tags),
  profile pages showing the invitation chain both directions, member home
  with circle and invite management, RLS test suite.

## Not built yet

| Slice | What                                            | Effort band |
| ----- | ----------------------------------------------- | ----------- |
| S3    | Stamps: quick add, photo upload, location search, stamp detail, passport page | 1-2 weeks |
| S4    | Network: feed, destination view ("who has been to Paris") | about 1 week |
| S5    | Trip briefs: taste-matched retrieval, citation-bound assembly, shareable brief | 1-2 weeks, the hard one |
| S6    | Ask the Hub: questions, answers, promote to stamp | about 1 week |
| S7    | Handover: demo identity with a full circle, walkthrough, access removal | 2-3 days |

## Deliberately deferred (documented, not dead UI)

- Stamp entry via drop-a-pin and paste-a-booking-email (BUILD-SPEC S3).
- Native apps, payments, public SEO pages, booking integrations, ranking
  beyond taste-tag matching (BUILD-SPEC section 9).

## Open questions

- Custom domain: exists or needs registering, in the owner's name.
- Production SMTP provider choice for magic links.
- The owner's tweak comments from Ben, to fold in as product input.
