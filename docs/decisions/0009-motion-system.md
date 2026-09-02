# ADR 0009: motion explains, and it is CSS

Date: 2026-09-02. Status: accepted.

## Context

Dave: the page is good but "bland and stale, nothing happening". He asked for
animation across the site, subtle in places and pronounced in others.

## Rules

1. Motion should explain something. The corridor is the product (advice
   arriving). Every other animation earns its place the same way: the arc
   forms, the stamp lands, the fan deals. Decoration that explains nothing is
   what makes a site read as a template with sprinkles.
2. One pronounced effect per screenful. Everything else lives in the 200 to
   700ms range.
3. The resting state is always visible. Nothing depends on JavaScript or on
   an animation finishing in order to appear.
4. transform, opacity and filter only. Blur is expensive; it is opt-in
   (`data-reveal-blur`) and used on a handful of headline blocks, never on
   lists, because the corridor is already running on the compositor.

## Decision

A single `Reveal` client component (`src/features/marketing/reveal.tsx`) on
IntersectionObserver marks its element `data-reveal="in"` once. All motion is
CSS in globals.css, keyed off that attribute. Tier 1, shipped here:

- Reveal system everywhere: rise 14px, fade, optional blur-to-sharp, grouped
  children staggered by nth-child.
- Hero load: corridor fades up from black over 1.6s; kicker, headline and
  paragraph rise in behind it.
- The arc forms: cards enter flat and drop into their `--arc` offsets, outside
  in.
- The stamp lands: the VETTED mark scales from 1.7 with a quick overshoot and
  settles at its tilt, 550ms after the card has arrived.
- The fan deals: outer cards start stacked under the middle one and spread to
  their tilts.

Tier 2 (sticky detaching nav, active-step highlighting, print unstack, tile
cursor highlight, hover lifts) and Tier 3 (frame scale on scroll, corridor
rush-then-cruise, card bob, film grain) are documented in the conversation
that produced this ADR and are not built. Add them one at a time and look at
each before the next.

## Gating, and why it is an inline script

Hidden states apply only under `html.motion-ok`. A one-line inline script in
`layout.tsx` adds that class before first paint when JS runs and the visitor
has not set prefers-reduced-motion. This is the only way to avoid a flash:
setting the class from React runs after the server HTML has already painted.
Without the class (no JS, reduced motion, script blocked) the page is simply
static and complete. The reduced-motion media rule collapses all durations as
a second fence.

## A bug avoided

A once-only IntersectionObserver misses anything the visitor skips past (a
fast scroll, a link to #privacy), leaving it invisible forever. The observer
root is therefore extended 20000px upward: "in view" means "at or above the
reveal line", so skipped elements count as passed. Verified by jumping to the
foot of the page and checking for pending reveals: zero.

## Not adopted

`motion` (framer). It is the standard React animation library and a fine
choice in general, but nothing here needs springs or gesture physics, and it
would be the first dependency in this repo a new developer has to learn.
Revisit only if a cursor-tilt on the arc cards is wanted and CSS feels stiff.
