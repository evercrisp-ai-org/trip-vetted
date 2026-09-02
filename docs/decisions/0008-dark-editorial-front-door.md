# ADR 0008: the front door is dark and editorial, and stops using card grids

Date: 2026-09-02. Status: accepted. Supersedes the "light body" half of 0005
and the palette notes in 0006.

## Context

Dave reviewed the page and said it read as AI-built. He was specific: the
three-card (sometimes four-card) grid structure. He supplied three references:
a dark hero with a serif headline over a fan of three tilted photographs; a
2x2 of tinted gradient tiles with status pills and arrow links; and a dark
footer opening with a newsletter form beside a stacked, tilted photograph.

The diagnosis holds. The page repeated one pattern four times: kicker, heading,
then a row of equal white cards on a light grey band. Circle, How it works,
Ask the Hub and Privacy all did it. That is the template look, and it does not
matter how good the hero is if the scroll lands there.

## Decisions

1. **The marketing site runs dark.** A `.theme-night` scope on the front door
   re-points the same tokens (`ground`, `surface`, `ink`, `accent`, ...) so no
   component knows which theme it is in. The app pages are untouched and stay
   light. A `.theme-paper` scope restores the light values for the one object
   that should read as paper on a dark page: the stamp specimen. Every pair
   was measured: ink 16.9:1, ink-soft 10.4:1, ink-faint 6.7:1, accent 8.7:1
   on the dark ground.
2. **Headlines are serif.** Newsreader via next/font, on the marketing page
   only (`font-serif`). Outfit stays for the app and for sub-headings; Inter
   stays for body.
3. **No card grids.** Circle's three points are a ruled list beside a stacked
   pair of prints. How it works is a numbered sequence with hairlines and a
   sticky heading. Ask the Hub is the fan: three tilted, overlapping cards with
   the answer captioned on each. Privacy is the reference 2x2 of tinted tiles,
   each a real anchor (rule 10). The waitlist moves into the footer beside a
   stacked photograph, so the page ends on one composed piece.
4. **No new dependencies.** The references ship with motion, react-wrap-
   balancer, radix Slot and class-variance-authority. The fan is CSS
   rotation, balancing is `text-balance`, and the tiles are four gradients.

## The bug this surfaced

The `@theme` font tokens are declared on `:root` and reference
`var(--font-inter)` and friends, but next/font had placed those variables on
`<body>`. A custom property is resolved where it is declared, so at `:root`
every font token was invalid, and the whole site fell back to the system font.
**Outfit and Inter had never rendered.** Every screenshot before this ADR was
SF Pro. The variables now live on `<html>`, and `layout.tsx` says why in a
comment, because it will look like a harmless refactor to move them back.

## Consequences

- Adding a section means choosing a composition, not a card count. If a new
  section wants "three things", the answer is a ruled list, a sequence, a fan
  or a tile set, in that order of preference.
- Any new text on the dark ground uses the token colours; there are no raw
  hex values in components.
