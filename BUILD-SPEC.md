# Trip Vetted, Build Spec

**Status:** approved to build, 2026-09-01
**Builder:** Dwight (Fable agent)
**Owner of record:** Ben's client (referred to here as "the owner")
**Predecessor:** concept demo at app-ochre-delta-46.vercel.app (reference only, no code reused)

---

## 1. The product in one paragraph

Trip Vetted is an invite-only travel network where every recommendation is attached to a real person
you actually know. Members log trips as "stamps": a dated, signed record of a place, what they liked,
what they didn't, and photos. When you plan a trip, Trip Vetted assembles a brief from the stamps of
people in your network who have been there, filtered to your tastes, with every single line attributed
to the friend it came from. Tagline: "Real Experiences. Trusted Advice."

Source of the vision: two voice transcripts from Ben, 2026-09-01. The line that defines the core
feature: *"it might take one bit from one friend, and a little bit from another friend, and a little bit
from another friend, and then that would round everything out."*

## 2. Non-negotiable product rules

1. **Briefs are assembled, not generated.** Retrieve stamps from the user's network for the destination,
   filter by taste tags, then let the model sequence and write connective prose only. Every item in a
   brief carries the `stamp_id` it came from and renders whose stamp it was. The model must never
   introduce a place, restaurant, hotel, or activity that is not present in a retrieved stamp. If the
   network has no coverage, say so plainly instead of filling the gap.
2. **Invitation is a record, not an email.** The site promises "every member was invited by someone you
   can see." The invitation chain is a first-class table and is displayed on profiles.
3. **Emails are never exposed.** Enforced at the database layer, not in the UI.
4. **Row-level security exists from the first migration.** Never retrofitted.
5. **Mobile first.** This gets demoed on a phone and used on the road.
6. **Ships with a populated demo identity.** A visitor must be able to see the payoff in ten seconds
   without inviting anyone. The predecessor demo's weakness was an empty network.

## 3. Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase: Postgres, Auth (magic link), Storage (stamp media), RLS
- Vercel hosting
- Claude for brief assembly prose

Chosen for hireability, not novelty. Any competent Next developer must be productive in this repo the
same afternoon. That is the selection criterion.

## 4. Accounts: built in the owner's name from day one

There is no transfer phase. Before the first commit:

- GitHub organization created and owned by the owner. Dwight added as a collaborator.
- Supabase project created in the owner's account.
- Vercel project created in the owner's account, connected to that repo.
- Secrets live in one password manager vault the owner controls, shared with Dwight, rotated at the end.
- Collaborator access removed at handover. Nothing else changes hands, because nothing else needs to.

## 5. Data model

- `profiles` id (fk auth.users), display_name, avatar_url, home_city, taste_tags[], bio, invited_by
- `invites` id, inviter_id, code, email_hash, accepted_by, accepted_at, revoked_at
- `connections` user_a, user_b, established_via_invite, status
- `places` id, name, admin_area, country, lat, lng, external_ref, slug
- `stamps` id, author_id, place_id, visited_from, visited_to, headline, loved, avoided,
  taste_tags[], rating, visibility ('network' | 'private' | 'community')
- `stamp_media` id, stamp_id, storage_path, kind, caption, sort_order
- `questions` id, asker_id, place_id, body, scope
- `answers` id, question_id, author_id, body, promoted_to_stamp_id
- `briefs` id, requester_id, place_id, date_from, date_to, taste_tags[], generated_at, model, content_json
- `brief_citations` id, brief_id, stamp_id, item_ref

`content_json` items must each reference a row in `brief_citations`. A brief that fails citation
validation is not saved.

## 6. Build slices

Each slice ends deployed to production and demoable. No slice is "done" without its docs updated.

**S0, Foundations.** Accounts per section 4. Next + TS + Tailwind scaffold. Supabase project, first
migration, RLS baseline. CI running typecheck, lint, tests on every PR. Doc skeleton per section 8.
Design tokens per section 7. Deploy a holding page.

**S1, Marketing site.** The sharpened Trip Vetted public site: hero, your travel circle, how it works
(document, stamp, share), stamps and trip briefs, privacy and trust. All copy in a single content
module the owner can edit without touching components. Waitlist capture.

**S2, Identity and the trust graph.** Magic-link auth. Invite code redemption. Onboarding: name,
avatar, home city, taste tags. Profile pages showing who invited whom. RLS policies with tests proving
user A cannot read user B's private stamp.

**S3, Stamps.** Create a stamp. Ship three of the five entry paths first: quick add (three fields),
photo upload, and search location. Defer drop-a-pin and paste-a-booking-email to the roadmap, and say
so in the docs rather than leaving them as dead UI. Media upload to Storage. Place resolution. Stamp
detail view. Your own passport page.

**S4, Network.** Connections. A feed of your circle's stamps. Destination view: "who in my circle has
been to Paris," which is the moment the product justifies itself.

**S5, Trip briefs.** The centerpiece. Taste-matched retrieval, citation-bound assembly, day-by-day
itinerary, visible attribution on every line, shareable brief. Reference example from the predecessor
demo: Tokyo to Kyoto.

**S6, Ask the Hub.** Post a question scoped to your network. Answers. Promote a good answer into a stamp.

**S7, Handover.** Seeded demo identity with a full circle. The four docs finalized. Plain-English
handover page for the owner. Walkthrough recording script. Access removed.

## 7. Design direction

Revised 2026-09-01 after Dave supplied six UI references (Voyare, three Foxico frames,
Malvora, tourex). These decisions supersede the original section 7 entirely. The earlier
"ink on paper, warm paper ground" direction is withdrawn.

**Scope.** The photo-forward cinematic treatment applies to the MARKETING SITE ONLY. The
logged-in app (feed, stamps, briefs, hub) is quieter, denser, and content-first. A tool used
weekly has different needs than a page seen once, and the app must never depend on a perfect
hero photograph, because its real content is members' phone photos.

**Structure.** Revised again 2026-09-02 (ADR 0008): the marketing site is dark throughout,
with an editorial serif for headlines, and it does not use card grids. The earlier "light
ground below the hero" direction is withdrawn. The original pattern note follows for history.
Dark cinematic photographic hero, then a light ground for everything below
(the tourex and Malvora pattern). Glass nav floating over the hero. Generous rounded corners.
Horizontal card rails for grouped content. Soft depth, cards may overlap section boundaries.

**Palette.** Ocean teal through deep blue as the accent range, taken from Voyare and Foxico.
Light neutral ground for the body. Near-black text. One accent, used with restraint.

**Type.** Geometric sans for headlines (Outfit or equivalent), at large sizes with tight
leading. A readable text face for body. Monospace survives ONLY for stamp dates and
coordinates, where it does real work.

**The stamp motif.** Kept at the component level, not as the site's skin. The site looks
modern and photographic; an individual stamp renders as a real credential object, dated and
signed and ink-marked. The metaphor lives where the product's meaning is. Trip Vetted is
named around this vocabulary, so it must be visible somewhere concrete.

**Hero behavior.** One static cinematic image. No slider, no carousel pagination, no
background video. Nothing to maintain and correct on every device.

**Imagery.** AI-generated, per Dave's decision. Two hard constraints:
- NO AI-generated human faces anywhere. Not as member avatars, not in testimonials. This
  product's entire claim is that these are real people you know, and a synthetic face is the
  one tell that would poison it. Use initials, monograms, or abstract treatments until real
  members exist.
- Every image slot is documented in `IMAGERY.md` with its exact generation prompt, aspect
  ratio, and target filename, and every slot has a branded placeholder fallback (teal
  gradient with grain) so the site is never broken while images are missing. Dropping in a
  generated file must require zero code changes.

**Do not import from the references:** they are all travel agencies selling trips to
strangers, so their heroes carry booking furniture (Book Now, destination, check-in,
check-out, guests, Reserve). Trip Vetted sells and books nothing. Reproducing that furniture
would misrepresent the product on sight.

**Contrast is not optional.** Look closely at the Voyare reference: its body paragraph sits
on the plane's fuselage and is barely readable. Every text-over-photograph pass needs a scrim
or gradient sufficient for WCAG AA at that text's size. Get the look without the flaw.

**Resilience to real photographs (applies to the app).** Fixed aspect ratios, object-fit
cover, skeleton or blur placeholders while loading. Every photographic layout must still look
deliberate when fed one badly-cropped, badly-lit phone photo, because it will be.

Accessibility remains part of the design, not a later pass: WCAG AA contrast, real focus
states, keyboard paths through every flow, respects reduced motion.

## 8. Handover doctrine

The next developer is a stranger. Every rule below exists to serve that person and the owner.

1. **Boring code.** Conventional patterns. No clever abstractions. No exotic dependencies. Every package
   must be one a random Next developer already knows.
2. **Organized by feature, not by file type.** The first question is always "where do I change this."
   The directory names are the answer.
3. **All user-facing copy in one content module.** The owner changes words without touching components.
4. **Four docs, maintained per slice, not written at the end:**
   - `README.md`, cloned and running locally in five minutes
   - `ARCHITECTURE.md`, how it works and why, including the citation rule and the RLS model
   - `OPERATIONS.md`, accounts, monthly cost now and at 1,000 users, deploying, rotating a key,
     restoring a backup, what to do when it breaks and who to call
   - `ROADMAP.md`, what is built, what is not, and honest effort bands for what remains
   Plus `HANDOVER.md`, written for the owner, assuming zero technical knowledge.
5. **`.env.example`** listing every variable, what it does, and where to get it.
6. **Tests where they earn their place:** RLS policies and brief citation integrity. No coverage theater.
7. **Readable commit history and an ADR log** in `docs/decisions/`, so the next developer does not
   re-argue settled choices.
8. **No secrets in the repo, ever.** Seed data clearly labeled as seed.
9. **`CLAUDE.md` in the repo** carrying these rules, so they survive across sessions and agents.

## 9. Deliberately out of scope for v1

Native apps. Payments or subscriptions. Public/SEO destination pages. Recommendation ranking beyond
taste-tag matching. Booking integrations. Drop-a-pin and booking-email parsing (roadmap, documented).

## 10. Open inputs

- The owner's tweak comments from Ben, folded in as product input rather than a punch list.
- Whether a custom domain exists or needs registering, in the owner's name.
- Ben's referral candidates, to be evaluated against `ROADMAP.md` once the honest build list is real.
