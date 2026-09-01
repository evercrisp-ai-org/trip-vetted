# ADR 0003: no email columns in public, insert-only waitlist

Date: 2026-09-01. Status: accepted.

## Decision

No table in the `public` schema stores a raw email except
`waitlist_signups`, which no client role can read (no SELECT policy).
Invites carry an optional `email_hash` only. The waitlist form reports
duplicate emails as success so it cannot be used to test whether an
address is on the list.

## Consequences

Anything needing an email (sending invites by mail, digests) must run
server-side with the service role, never through the client. Tests in
tests/rls/emails.test.ts hold the line.
