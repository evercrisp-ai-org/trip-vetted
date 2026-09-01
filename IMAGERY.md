# Imagery

Every image slot on the marketing site, with its exact generation prompt,
aspect ratio, and target filename. Drop the generated file into
`public/images/` with the exact filename and it appears on the next build
or dev reload. Zero code changes. Until a file exists, its slot renders
the branded placeholder (teal-to-deep-blue gradient with grain), so the
site is never broken while imagery is in progress.

Two hard rules from BUILD-SPEC section 7:

1. **No AI-generated human faces, anywhere.** If a person appears at all,
   they must be distant, silhouetted, or facing away, and unrecognizable.
   Prompts below say this explicitly. If a generation produces a
   recognizable face, discard it and rerun.
2. No text, logos, watermarks, or UI elements inside images. Add
   "no text, no watermarks" to every run.

Style constants for every prompt: photographic and cinematic, natural
light, muted film-like color grade with teal-leaning shadows, no HDR
crunch, no oversaturation, no illustration or 3D render look.

| # | File | Where it appears | Aspect | Minimum size |
|---|------|------------------|--------|--------------|
| 1 | `hero-vista.jpg` | Homepage hero, full bleed | 16:9 | 2560x1440 |
| 2 | `circle-planning.jpg` | "Your travel circle" section | 4:3 | 1600x1200 |
| 3 | `dest-tokyo.jpg` | Destinations rail, card 1 | 4:5 | 1200x1500 |
| 4 | `dest-kyoto.jpg` | Destinations rail, card 2 | 4:5 | 1200x1500 |
| 5 | `dest-lisbon.jpg` | Destinations rail, card 3 | 4:5 | 1200x1500 |
| 6 | `dest-oaxaca.jpg` | Destinations rail, card 4 | 4:5 | 1200x1500 |
| 7 | `band-coast.jpg` | Waitlist band background | 3:1 | 2400x800 |

Export as quality-80 JPG. The filename must match the table exactly,
including the .jpg extension, or the slot will keep showing the
placeholder.

A dark scrim is layered over slots 1 and 7 in code, and over the caption
zone of slots 3 to 6. Images can therefore be naturally bright; contrast
for text is guaranteed by the scrim, not by the image.

## Prompts

**1. hero-vista.jpg**
> Cinematic aerial photograph of a Mediterranean coastal town at dusk,
> terracotta rooftops stepping down to a small harbor, lights just coming
> on along the waterfront, calm sea holding the last blue of the sky,
> shot from high above at a gentle angle, 35mm film grade, teal-leaning
> shadows, soft natural light, no people, no text, no watermarks.

**2. circle-planning.jpg**
> Overhead photograph of a wooden table mid trip-planning: an unfolded
> paper map, a worn passport, printed film photos of landscapes, a
> handwritten notebook, two espresso cups, warm window light from one
> side, shallow depth of field, film grade, hands may appear at frame
> edge but no faces, no visible readable text on any item, no watermarks.

**3. dest-tokyo.jpg**
> Photograph of a narrow Tokyo side alley at night, paper lanterns and
> small izakaya facades, wet pavement reflecting warm and teal light,
> steam drifting from a doorway, one distant silhouetted figure walking
> away from camera, unrecognizable, vertical composition, cinematic film
> grade, no readable signage, no text, no watermarks.

**4. dest-kyoto.jpg**
> Photograph of vermilion torii gates over a forested stone path at
> dawn, soft mist between the gates, early light, completely empty of
> people, vertical composition, muted film grade with teal shadows, no
> text, no watermarks.

**5. dest-lisbon.jpg**
> Photograph of a steep Lisbon street in late afternoon, azulejo-tiled
> facades, laundry lines high above, a yellow tram small in the distance,
> long shadows, any pedestrians distant and facing away, unrecognizable,
> vertical composition, film grade, no readable text, no watermarks.

**6. dest-oaxaca.jpg**
> Photograph of agave fields outside Oaxaca under a dramatic late-day
> sky, dirt road leading toward distant blue mountains, golden side
> light, no people, vertical composition, cinematic film grade, no text,
> no watermarks.

**7. band-coast.jpg**
> Very wide photograph of a dark coastline at night, a lighthouse beam
> sweeping over black water, faint stars, deep blue-teal palette, almost
> abstract, strong horizontal composition, no people, no text, no
> watermarks.

## Adding or changing a slot

1. Add the row and prompt here.
2. Add alt text to `src/content/site.ts`.
3. Use the `Photo` component (`src/features/marketing/photo.tsx`) with the
   new filename. It handles the placeholder automatically.
