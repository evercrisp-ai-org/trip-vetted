# ADR 0001: Next.js + Supabase + Vercel

Date: 2026-09-01. Status: accepted.

## Decision

Next.js App Router with TypeScript and Tailwind, Supabase for Postgres,
auth, storage, and RLS, Vercel for hosting, Claude for brief prose.

## Why

Hireability, not novelty (BUILD-SPEC section 3). The owner must be able to
hire any competent Next developer and have them productive the same
afternoon. Supabase gives database-enforced security (RLS) and magic-link
auth without running servers. Every piece is mainstream.

## Consequences

No exotic dependencies get added without a new ADR. The anon key is public
by design; RLS carries the security load, so policy tests are mandatory.
