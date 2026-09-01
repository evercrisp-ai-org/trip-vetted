# ADR 0005: cinematic photographic direction replaces ink-on-paper

Date: 2026-09-01. Status: accepted.

## Context

Dave supplied six UI references (Voyare, three Foxico frames, Malvora,
tourex) and locked a new design direction; BUILD-SPEC section 7 was
rewritten to match. The original "ink on paper, warm paper ground"
treatment is withdrawn.

## Decision

- Marketing site: dark cinematic photographic hero with a glass nav, light
  neutral ground below, ocean teal (#0b6c80) through deep blue (#123c5e)
  as the single accent range, Outfit for headlines, Inter for body,
  rounded corners, horizontal card rails, cards overlapping section
  boundaries. Static hero image, no slider, no video.
- Logged-in app: same tokens, quiet and content-first. Not cinematic.
- Monospace (IBM Plex Mono) survives only where fixed-width does real
  work: stamp dates and coordinates, plus invite codes. Nowhere else.
- The stamp motif lives at component level (StampSpecimen renders a
  credential object); the site skin does not carry the metaphor.
- Imagery is AI-generated externally per IMAGERY.md. No AI-generated
  human faces anywhere. Every slot has a branded placeholder (teal
  gradient with grain) via the Photo component, so a missing file never
  breaks the page. No booking furniture anywhere: Trip Vetted sells and
  books nothing.

## Contrast, measured not eyeballed

Light-ground pairs (WCAG ratio vs #f4f6f7 ground / #ffffff surface):
ink 16.7/18.1, ink-soft 7.7/8.4, ink-faint 5.8/6.3, accent as text
5.6/6.05, white on accent 6.05, ok 5.9/6.4, error 6.0/6.5.

Text over photographs can sit on ANY pixel, so scrims are sized for the
worst case (pure white underneath). With night #071820 at alpha a, white
text measures: a=0.65 -> 5.65:1, a=0.70 -> 6.75:1, a=0.75 -> 8.10:1.
Floors used: hero and glass nav 0.65, waitlist band 0.70, destination
card caption zone 0.75. All pass AA for body-size text, not just large.
Hero emphasis color accent-wash #d8ecf0 over the 0.65 scrim worst case:
4.63:1, and it is headline-scale (3:1 required).

If any of these values change, recompute. The math is four lines of
Python (relative luminance per WCAG 2.x); keep the results in this file.

## Consequences

Token names are direction-neutral now (ground, surface, ink, accent,
night) so a future re-skin is a values change, not a rename. The old
warm-paper values are gone; ADRs 0001-0004 are unaffected.
