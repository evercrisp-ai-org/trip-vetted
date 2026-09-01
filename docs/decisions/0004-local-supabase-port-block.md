# ADR 0004: local Supabase runs on ports 54330-54339

Date: 2026-09-01. Status: accepted.

## Context

The Supabase CLI defaults (54321-54329) collide when two projects run
locally at once, and this machine already runs another project's stack.

## Decision

Trip Vetted's supabase/config.toml maps every service one block up:
API 54331, DB 54332, Studio 54333, mail catcher 54334, analytics 54337.

## Consequences

.env.example and README point at 54331. If you see connection refused on a
default port, you are on the wrong block.
