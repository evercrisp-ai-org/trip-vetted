# Handover notes for the owner

Written for you, assuming no technical background. Updated as slices ship;
finalized at S7.

## What exists right now

- A public website for Trip Vetted: the pitch, how it works, privacy, and
  a waitlist form that stores emails safely.
- The membership system: people join only with an invite code from an
  existing member. They sign in with an email link (no passwords). New
  members set up a page with their name, photo, city, and travel tastes.
- Every member page shows who invited them, permanently. That chain is the
  backbone of trust in the product.
- The database is built so private things stay private. Nobody can see
  anyone's email address, ever, and a private trip note is visible to its
  author alone. These promises are enforced by the database itself and
  checked by automated tests every time the code changes.

## What does not exist yet

Logging trips (stamps), the friend feed, and the trip briefs that assemble
advice from your circle. Those are the next slices; `ROADMAP.md` lists them
with honest time estimates.

## Changing the words on the site

Every sentence a visitor or member sees lives in one file:
`src/content/site.ts`. Anyone (including you, with a developer on a call)
can change copy there without touching the workings.

## Your accounts

The plan (see BUILD-SPEC section 4) is that GitHub, Supabase, and Vercel
accounts are all created in your name and the builder works as a guest who
is removed at the end. Those accounts have not been created yet. Nothing in
this repo depends on the builder's accounts; it will connect to yours with
a handful of settings.
