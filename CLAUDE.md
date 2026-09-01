# Working rules for this repo

These rules come from BUILD-SPEC.md section 8 (the handover doctrine) and
bind every session, human or agent. The next developer is a stranger; every
rule exists for them.

## Product rules that shape code

1. Briefs are assembled, not generated. Every brief item cites a
   `brief_citations` row pointing at a real stamp. The model never invents
   a place. A brief failing citation validation is not saved. Nothing you
   build may make this rule hard to honor.
2. Invitation is a record. The chain (profiles.invited_by, invites) is
   displayed on profiles and is immutable.
3. Emails are never exposed, enforced in the database. No email column in
   public tables, no service role key in app code, ever.
4. RLS on every table from its first migration. Policy changes require
   matching tests in tests/rls/.
5. Mobile first. WCAG AA contrast, visible focus states, keyboard paths,
   reduced motion respected.

## Engineering rules

1. Boring code. Conventional patterns only. No clever abstractions. Every
   dependency must be one a random Next developer already knows.
2. Organized by feature (src/features/<name>), not by file type.
3. ALL user-facing copy goes in src/content/site.ts. Never hardcode a
   string in a component.
4. Design tokens live in src/app/globals.css under @theme. No raw hex
   values in components.
5. The four docs (README, ARCHITECTURE, OPERATIONS, ROADMAP) are updated
   in the same PR as the change they describe, not later. HANDOVER.md
   stays readable by a non-technical owner.
6. Tests where they earn their place: RLS and (from S5) citation
   integrity. No coverage theater.
7. Settled choices live in docs/decisions/. Read them before re-arguing.
8. No secrets in the repo, ever. Seed data clearly labeled as seed.
9. Conventional commits, one commit per meaningful unit.
10. No dead UI. A route either works or does not exist; deferred features
    are documented in ROADMAP.md instead of stubbed.

## Style rules (absolute)

- Never use the em dash character anywhere: not in code, comments, commit
  messages, docs, or UI copy. Use commas, parentheses, colons, or separate
  sentences.
- No AI-brochure language ("seamless", "robust", "leverage", "elevate",
  "unlock", "dive into", "crucial", "moreover", "furthermore" and kin) in
  any writing, especially site copy. Write like a sharp person.

## Local quirk

Local Supabase uses ports 54330-54339 (not the defaults) so it can run
beside other local projects. API 54331, DB 54332, Studio 54333, mail 54334.
