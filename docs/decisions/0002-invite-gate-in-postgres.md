# ADR 0002: membership is enforced in Postgres, not in app code

Date: 2026-09-01. Status: accepted.

## Context

The product promises invite-only membership and a visible invitation chain.
App-layer checks can be bypassed by anyone holding the (public) anon key.

## Decision

The gate lives in the database:

- `redeem_invite()` (SECURITY DEFINER) is the only path to marking an
  invite accepted, and it verifies validity inside the transaction.
- The `profiles` INSERT policy requires a redeemed invite for the caller
  and `invited_by` equal to that invite's inviter.
- A trigger creates the inviter connection; another makes `invited_by`
  immutable.
- `check_invite_code()` exposes only validity plus inviter display name,
  so the join page can validate codes with zero read access to invites.

Magic-link auth may create an `auth.users` row for anyone, but an auth
user without a profile is not a member and cannot read member data beyond
profiles' public fields. Blocking auth.users creation itself would need an
auth hook; not worth the coupling at this size.

## Consequences

Signup UX must route profile-less users to onboarding (middleware does).
The RLS suite tests the gate directly with hostile inserts.
