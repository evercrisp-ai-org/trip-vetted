# Imagery

The marketing site uses real photographs supplied by the client, not
generated imagery. They live in `public/images/` and are referenced by
filename from `src/content/site.ts`.

This replaces the earlier AI-generation brief. The reason is editorial: Trip
Vetted's claim is that its recommendations come from real people who were
actually there, and real, imperfect, weather-beaten travel frames make that
claim where polished stock undermines it. Every photograph on the page is
presented as a member's stamp, which is also why the waitlist band carries no
photograph at all: a decorative image there would be the only one on the page
that belonged to nobody.

## Inventory

| File | Where it appears | Notes |
|---|---|---|
| `nyc-broadway-rain.jpg` | Hero, sharp frame and blurred backdrop | Wide, deep perspective, no dominant face |
| `nyc-umbrellas.jpg` | "Your travel circle" | Crowd under umbrellas |
| `tokyo-vending-night.jpg` | Arc row 1, Tokyo | Teal night palette, sits closest to the accent |
| `yokohama-chinatown.jpg` | Arc row 2, Yokohama | Red lanterns at night |
| `bangkok-popart-market.jpg` | Arc row 3, Bangkok | Wall of prints |
| `bangkok-striped-wall.jpg` | Arc row 4, Bangkok | Orange and white checks |
| `nyc-bodega.jpg` | Arc row 5, New York | Corner shop interior |
| `nyc-graffiti-wall.jpg` | Arc row 6, New York | Green graffitied wall |
| `food-thali.jpg` | Ask the hub, first answer | Portrait |
| `food-biryani.jpg` | Ask the hub, second answer | Portrait |
| `food-rasmalai.jpg` | Ask the hub, third answer | Portrait |

Exported as quality-82 JPEG: 2400px wide for the hero, 1600px for the street
frames, 900px for the portrait food shots. Total about 5.8 MB.

## Cropping

Files are stored at their own natural crop. The layout crops them with CSS
(`object-fit: cover`) and each slot names an `object-position` in
`src/content/site.ts`, because the arc tiles are 4:5 portrait and every source
frame is landscape. **Retune `position` rather than re-exporting a file.**
Values were set by looking at the rendered tiles, not calculated: the striped
wall needs `80% 58%` to keep the walker in frame, the graffiti wall needs
`60% 62%` to centre hers, and the corner shop needs `44% 44%` to hold both the
shelves and the shoppers.

## Adding or replacing a photograph

1. Export to `public/images/` at the sizes above.
2. Add the row to the table here.
3. Add the file, alt text, and `position` to `src/content/site.ts`.
4. Use the `Photo` component (`src/features/marketing/photo.tsx`).

`Photo` falls back to a branded teal placeholder when a file is missing, so a
half-finished swap degrades instead of breaking. `PhotoBackdrop` is the
blurred hero backdrop and renders nothing at all when its file is absent.

## Two things to settle before this goes public

1. **Rights.** Several frames contain identifiable people photographed in
   public. Street photography is one thing; using a stranger's recognisable
   face to market a product is another, and in many places it needs a release.
   Confirm the client owns these images and is comfortable with the people in
   them appearing on a commercial site. If any single frame is a problem,
   swapping it is a one-line change.
2. **Geography and copy.** The captions attribute each frame to a seeded demo
   member (Maya, Jonah, Priya, Sam) and name a plausible place. They are
   illustrative, and the footer says so. Before real launch either replace
   them with genuine member stamps or keep the disclaimer prominent.
