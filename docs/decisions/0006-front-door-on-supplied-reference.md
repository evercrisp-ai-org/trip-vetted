# ADR 0006: the front door follows the supplied reference layout

Date: 2026-09-02. Status: accepted. Supersedes the layout half of 0005.

## Context

Dave supplied a reference landing page (a full-bleed photograph with the sharp
frame inset inside a blurred copy of itself, nav pill inside the frame) and a
second reference showing a row of photo tiles arranged as an arc. He also
supplied eleven real photographs: eight street frames from New York, Bangkok,
Tokyo and Yokohama, and three food shots.

The brief was explicit about why: photographs are core to this product.

## Decision

1. The hero is modelled on the reference. A blurred, enlarged copy of the
   photograph bleeds to the window edge; the sharp frame is inset on top with
   a large radius; the nav pill sits inside the frame; a three-line headline
   is anchored bottom-left against the paragraph and buttons bottom-right.
2. The destinations rail is replaced by the arc row: six stamps stepping down
   toward the middle and back up. Below lg the arc flattens to a rail, since
   an arc inside a 390px viewport reads as misalignment.
3. Ask the Hub is added, built from the food photographs: one question and
   three attributed answers. It demonstrates the product's actual mechanic.
4. Generated imagery is dropped in favour of the real photographs. IMAGERY.md
   is now an inventory rather than a generation brief.
5. The waitlist band carries no photograph. Every image on the page belongs to
   a member's stamp, and a decorative one there would be the only picture
   belonging to nobody. The band uses the accent gradient: white on
   --color-accent is 6.05:1.

## Scrim consequence

The flat night/65 from 0005 flattened these photographs badly. Replaced with a
night/45 base plus a bottom gradient to night/90. Every text zone in the hero
sits inside that gradient, where the composited floor is at least night/67:
white 6.08:1, accent-wash 4.97:1. The base alone is only 2.97:1, so any text
added to the hero must stay inside the gradient or carry its own wash. The nav
and kicker pills carry their own.

## Bugs this surfaced

- The card row overlapped the hero and clipped the third headline line plus
  both calls to action. The overlap is removed; the reference has nothing over
  its hero.
- The nav wrapped onto three lines at 390px. The sign-in link is now hidden
  below sm (it is in the footer too) and nothing wraps.
- Rails lost their left padding on phones: scroll-snap-align:start snaps to
  the snapport edge, which sat inside the container padding. Fixed with
  scroll-padding-left on .rail.
- The social card had a hard seam down it. satori does not honour
  backgroundSize:cover (a CSS background photograph tiles) and ignores the
  inset shorthand, and percentage widths there resolve against the wrong box.
  The card now uses a positioned <img> with explicit pixel sizes throughout.

## Open, not decided here

Several photographs contain identifiable people photographed in public. Using
a stranger's recognisable face to market a product often needs a release.
Flagged in IMAGERY.md for the owner to confirm before launch.
