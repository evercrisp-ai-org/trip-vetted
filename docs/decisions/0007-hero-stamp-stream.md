# ADR 0007: the hero is a corridor of stamps

Date: 2026-09-02. Status: accepted. Supersedes the hero half of 0006.

## Context

Dave saw a hero built on a "corridor" effect (two rails of cards riding out
of a vanishing point toward the viewer, in CSS 3D) and asked for the same
motion here, with one change that matters: the cards are not bare pictures.
Each one is a stamp, showing the photograph, who posted it, and what they
said. A centred header sits on top. The motion itself should explain the
product: this is a stream of real advice from real people.

## Decision

1. The corridor geometry is adopted verbatim from the reference component
   (`src/features/marketing/stamp-stream.tsx`, `Corridor`). Its card contents
   are delegated to a render function so the rails carry a `StampCard`
   (photo, place pill, one-line quote, "signed, Name") instead of an image.
2. The stamp card is sized entirely in `cqw`, the unit the corridor is built
   in, so type and padding scale with the card as it approaches. Cards are
   unreadable in the far distance and legible for the last stretch before
   they leave. That is the intended experience.
3. The header is centred at the top, the paragraph and buttons at the base,
   and the corridor runs between them. The cards are not dimmed. Contrast
   comes from three scrims: a light radial fog at the vanishing point, a top
   band under the header, and a bottom band under the buttons. Composited
   floors against a worst-case white card: about night/83 under the header
   (white 10:1), at least night/72 under the buttons (white 7.5:1).
4. Two corridors are rendered, one per breakpoint, because the geometry is
   in container-width units and the desktop path is a thin strip on a phone.
   The small-screen path is `exitHeight: 95, railExit: 26` over 11 cards.
   `display: none` stops the hidden one from animating.
5. The cards use 720px variants in `public/images/stream/`. Up to 22 animate
   at once and must not each pull a 1600px file.

## Things learned, so nobody re-learns them

- A render function cannot cross from a Server Component to a Client
  Component. `StampStream` exists so the hero (server) passes plain data and
  the function stays on the client side of the boundary.
- The tallest a card ever appears on screen is set by `railExit`, not
  `exitHeight`. A card leaves when its inner edge crosses the frame, so with
  rails at `r` and card width `w`, it is last visible at scale
  `f = 50 / (r - w/2)` and height `25f`. Rails at 44 cap a card near 36cqw;
  rails at 26 let it reach about 73cqw. Raising `exitHeight` alone makes the
  cards bigger only after they are already gone.
- Keep `(exitHeight / birthHeight) ^ (1 / cards)` near the default 1.39, or
  consecutive cards stop overlapping near the exit and the ribbon tears.

## Not adopted

The reference ships as a shadcn `components/ui` file importing `cn` from
`@/lib/utils`. This repo organises by feature (CLAUDE.md rule 2) and has no
shadcn setup, so the component lives with the rest of the front door and
`cn` is a three-line helper in `src/lib/cn.ts`, not two new dependencies.

## Accessibility

The corridor is `aria-hidden` as a whole and pauses (rather than stopping)
under `prefers-reduced-motion`, so it freezes as a finished still instead of
collapsing to the axis. The same stamps appear in accessible form further
down the page (arc row, Ask the Hub).
