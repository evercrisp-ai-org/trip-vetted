import Link from "next/link";
import type { CSSProperties } from "react";
import {
  site,
  nav,
  heroStream,
  circle,
  howItWorks,
  stampArc,
  stampsAndBriefs,
  askTheHub,
  privacy,
  waitlist,
  footer,
} from "@/content/site";
import { Photo } from "./photo";
import { StampStream } from "./stamp-stream";
import { Reveal } from "./reveal";
import { StampSpecimen } from "./stamp-specimen";
import { WaitlistForm } from "./waitlist-form";

/*
 * Scrim discipline (BUILD-SPEC section 7): every text-over-photograph pass
 * sits on a night overlay measured for WCAG AA against a worst-case pure
 * white pixel underneath. Floors used here:
 *   hero: no base wash, so the stamps stay vivid. Contrast comes from a
 *     radial fog at the vanishing point plus top and bottom bands; the
 *     header and the calls to action both sit where those composite to at
 *     least night/80 against a worst-case white card (white >= 9:1). Text
 *     added to the hero must sit inside a band or carry its own wash.
 *   nav pill, kicker pill and secondary button carry their own night wash
 *   white on --color-accent -> 6.05:1 (waitlist band, no photograph)
 * Arc tiles and hub answers caption on the light ground, so they need no
 * scrim at all. Numbers in docs/decisions/0005-cinematic-redesign.md.
 */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
      {children}
    </p>
  );
}

/** Section headline. Serif, light weight: the editorial voice of the page. */
function Headline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={
        "mt-4 text-balance font-serif text-4xl font-normal leading-[1.05] tracking-tight text-ink sm:text-5xl " +
        (className ?? "")
      }
    >
      {children}
    </h2>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

/**
 * The nav pill. Rendered inside the hero frame rather than over the page,
 * so it sits on the photograph the way the reference layout does.
 */
export function SiteNav() {
  return (
    <header className="relative z-20">
      <div className="flex items-center justify-between gap-4 rounded-full bg-night/65 px-4 py-2.5 text-white backdrop-blur-md sm:px-5 sm:py-3">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-base font-semibold tracking-tight sm:text-lg"
        >
          {site.name}
        </Link>
        <nav aria-label="Site" className="flex items-center gap-4 sm:gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.howItWorks}
          </a>
          <a
            href="#stamps"
            className="hidden text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.stamps}
          </a>
          <a
            href="#privacy"
            className="hidden text-sm text-white hover:text-accent-wash lg:block"
          >
            {nav.privacy}
          </a>
          <Link
            href="/login"
            className="hidden whitespace-nowrap text-sm text-white hover:text-accent-wash sm:block"
          >
            {nav.memberSignIn}
          </Link>
          <Link
            href="/join"
            className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-night hover:bg-accent-wash"
          >
            {nav.haveAnInvite}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * The hero: a centred header over a corridor of stamps that stream out of
 * the vanishing point toward the viewer. Each card is a real stamp (photo,
 * author, one line of advice), so the motion itself explains the product.
 *
 * Contrast is carried by three scrims, not by dimming the cards: a radial
 * fog at the vanishing point (which also reads as depth), a top band under
 * the header, and a bottom band under the calls to action. Where the header
 * sits the composited floor is about night/83 against a worst-case white
 * card (white 10:1); under the calls to action it is at least night/72
 * (white 7.5:1). The fog alone is deliberately too light to carry text. The cards at the frame edges stay vivid.
 */
export function Hero() {
  return (
    <section className="on-night relative isolate bg-night p-2 sm:p-4 lg:p-6">
      <div className="relative flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[1.5rem] bg-night sm:min-h-[calc(100svh-2rem)] sm:rounded-[2rem]">
        <div className="hero-corridor absolute inset-0">
        {/* Two corridors, one per breakpoint. The geometry is in container
            width units, so on a phone the desktop path is a thin strip in a
            tall frame. The small-screen path grows cards taller and holds
            the rails tighter so the band fills the space between header and
            buttons. display:none stops the hidden one from animating. */}
        <StampStream
          stamps={heroStream.stamps}
          cards={9}
          speed={26}
          axis={58}
          className="absolute inset-0 hidden lg:block"
        />
        <StampStream
          stamps={heroStream.stamps}
          // The tallest a card gets on screen is set by when its inner edge
          // crosses the frame, which railExit controls: solving
          // (rail - cardWidth/2) * f = 50 gives f, and height is 25f. Rails
          // at 26 let a card reach ~73cqw before it leaves; the default 44
          // caps it at ~36cqw, a thin strip on a phone. exitHeight over 11
          // cards keeps the per-card growth ratio at the default 1.39, so
          // the ribbon stays solid.
          cards={11}
          speed={24}
          axis={48}
          path={{ exitHeight: 95, railExit: 26 }}
          className="absolute inset-0 lg:hidden"
        />
        </div>

        {/* Fog at the vanishing point. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 58% at 50% 54%, rgba(7,24,32,0.62) 0%, rgba(7,24,32,0.42) 30%, rgba(7,24,32,0.18) 60%, rgba(7,24,32,0) 80%)",
          }}
        />
        {/* Header band. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-night/95 via-night/65 to-transparent"
        />
        {/* Call-to-action band. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night/95 via-night/70 to-transparent"
        />

        <div className="relative flex flex-1 flex-col p-3 pb-6 sm:p-5 sm:pb-8 lg:p-7 lg:pb-10">
          <SiteNav />

          <Reveal blur delay={250} className="mx-auto mt-10 max-w-3xl text-center sm:mt-14 lg:mt-16">
            <p className="inline-flex items-center rounded-full border border-white/40 bg-night/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              {heroStream.kicker}
            </p>
            <h1 className="mt-6 text-balance font-serif text-5xl font-normal leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {heroStream.headline}
            </h1>
          </Reveal>

          <Reveal delay={800} className="mx-auto mt-auto max-w-xl pt-40 text-center sm:pt-48">
            <p className="text-balance text-base leading-relaxed text-white sm:text-lg">
              {heroStream.sub}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-semibold text-night hover:bg-accent-wash"
              >
                {heroStream.primaryCta}
              </a>
              <Link
                href="/join"
                className="rounded-full border border-white/70 bg-night/30 px-7 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
              >
                {heroStream.secondaryCta}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Circle() {
  const [front, back] = circle.images;
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
      <div>
        <Reveal blur>
          <Kicker>{circle.kicker}</Kicker>
          <Headline>{circle.headline}</Headline>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {circle.body}
          </p>
        </Reveal>
        {/* Three points as a ruled list, not three cards. */}
        <Reveal as="dl" group className="mt-10 divide-y divide-line border-y border-line">
          {circle.points.map((p) => (
            <div
              key={p.title}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8"
            >
              <dt className="font-display text-base font-semibold text-ink">
                {p.title}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-soft">
                {p.body}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Two prints on a desk: the back one tilted, the front one square. */}
      <Reveal delay={150} className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none">
        <div className="absolute inset-0 -rotate-3 translate-x-3 translate-y-3 overflow-hidden rounded-3xl bg-night opacity-90 shadow-2xl shadow-black/40">
          <Photo
            file={back.file}
            alt={back.alt}
            sizes="(min-width: 1024px) 45vw, 100vw"
            position={back.position}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-3xl bg-night shadow-2xl shadow-black/50 outline outline-1 outline-white/10">
          <Photo
            file={front.file}
            alt={front.alt}
            sizes="(min-width: 1024px) 45vw, 100vw"
            position={front.position}
          />
        </div>
      </Reveal>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-surface-sunk/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal blur className="lg:sticky lg:top-24 lg:self-start">
          <Kicker>{howItWorks.kicker}</Kicker>
          <Headline>{howItWorks.headline}</Headline>
        </Reveal>
        {/* Numbered rows with hairlines. Reads as one sequence, not a grid. */}
        <Reveal as="ol" group className="divide-y divide-line">
          {howItWorks.steps.map((step, i) => (
            <li
              key={step.name}
              className="grid gap-4 py-8 first:pt-0 last:pb-0 sm:grid-cols-[5rem_1fr] sm:gap-8"
            >
              <p className="font-serif text-5xl leading-none text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
                  {step.name}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The arc row: six stamps stepping down toward the middle and back up, so
 * the photographs read as one curve. Below lg it flattens to a rail.
 */
export function StampArc() {
  return (
    <section aria-label={stampArc.railLabel} className="overflow-hidden">
      <Reveal blur className="mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6 sm:pt-28">
        <Kicker>{stampArc.kicker}</Kicker>
        <Headline>{stampArc.headline}</Headline>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
          {stampArc.sub}
        </p>
      </Reveal>

      {/* Observed as one element; the arc CSS staggers the cards outside in. */}
      <Reveal as="ul" className="arc rail mx-auto flex max-w-6xl snap-x gap-4 overflow-x-auto px-4 pb-20 pt-12 sm:gap-5 sm:px-6 lg:justify-center lg:overflow-visible lg:pb-48 lg:pt-16">
        {stampArc.items.map((item) => (
          <li
            key={item.image}
            style={{ "--arc": item.arc } as CSSProperties}
            className="w-[44vw] max-w-[190px] shrink-0 sm:w-[170px] lg:w-[156px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-night shadow-xl shadow-black/40 outline outline-1 outline-white/10">
              <Photo
                file={item.image}
                alt={item.alt}
                sizes="200px"
                position={item.position}
              />
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-ink">
              {item.place}
              <span className="font-sans font-normal text-ink-faint">
                {", "}
                {item.region}
              </span>
            </p>
            <p className="mt-1 text-xs leading-snug text-ink-soft">
              {item.note}
            </p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

export function StampsAndBriefs() {
  return (
    <section id="stamps" className="border-y border-line bg-surface-sunk/60">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal blur>
          <Kicker>{stampsAndBriefs.kicker}</Kicker>
          <Headline>{stampsAndBriefs.headline}</Headline>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {stampsAndBriefs.body}
          </p>
          <p className="mt-8 border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink">
            {stampsAndBriefs.briefNote}
          </p>
        </Reveal>
        <div>
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint lg:hidden">
            {stampsAndBriefs.stampCardLabel}
          </p>
          {/* A stamp is paper. It keeps the light tokens inside a dark page.
              The card drops in, then the VETTED mark lands (.stamp-mark). */}
          <Reveal className="theme-paper">
            <StampSpecimen rotate="-rotate-2" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/*
 * The fan. Three cards, the outer two tilted and tucked behind the middle
 * one, like photographs dropped on a table. The geometry is the reference
 * layout Dave supplied (38 / 42 / 38 widths, 6 degree tilt, negative
 * margins for the overlap). CSS only; no animation library.
 */
const FAN = [
  // `caption` pads the side tucked under the middle card, so no text runs
  // beneath the overlap.
  { width: "w-[38%]", layout: "-mr-8 z-10 -rotate-6 translate-y-6", caption: "pr-12 sm:pr-16" },
  { width: "w-[42%]", layout: "z-20 -translate-y-2", caption: "" },
  { width: "w-[38%]", layout: "-ml-8 z-10 rotate-6 translate-y-6", caption: "pl-12 sm:pl-16" },
] as const;

export function AskTheHub() {
  return (
    <section id="hub" className="overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal blur className="mx-auto max-w-2xl text-center">
          <Kicker>{askTheHub.kicker}</Kicker>
          <Headline>{askTheHub.headline}</Headline>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {askTheHub.body}
          </p>
        </Reveal>

        <figure className="mt-14">
          <Reveal as="figure" className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
              {askTheHub.questionLabel}
            </p>
            <p className="mt-3 font-serif text-3xl leading-snug text-ink sm:text-4xl">
              {askTheHub.question}
            </p>
          </Reveal>

          {/* data-fan: the deal animation in globals.css. */}
          <Reveal data-fan="" className="mx-auto mt-12 flex w-full max-w-3xl items-center justify-center">
            {askTheHub.answers.slice(0, 3).map((answer, i) => {
              const slot = FAN[i];
              return (
                <div
                  key={answer.image}
                  className={
                    "relative aspect-[4/5] shrink-0 overflow-hidden rounded-2xl bg-night shadow-2xl shadow-black/50 outline outline-1 outline-white/10 " +
                    slot.width +
                    " " +
                    slot.layout
                  }
                >
                  <Photo
                    file={answer.image}
                    alt={answer.alt}
                    sizes="(min-width: 768px) 20rem, 40vw"
                  />
                  {/* Caption floor night/90 at the base: white 15:1 worst case. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-night/95 via-night/70 to-transparent"
                  />
                  <div
                    className={
                      "absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 " +
                      slot.caption
                    }
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-wash sm:text-xs">
                      {answer.who}
                    </p>
                    <p className="mt-1.5 hidden text-xs leading-snug sm:block sm:text-sm">
                      {answer.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </figure>
      </div>
    </section>
  );
}

/**
 * Four tinted tiles, the reference 2x2: status pill, big title, body, arrow
 * link. Each gradient was measured for white text at its light end.
 */
export function Privacy() {
  return (
    <section id="privacy" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal blur className="max-w-2xl">
          <Kicker>{privacy.kicker}</Kicker>
          <Headline>{privacy.headline}</Headline>
        </Reveal>
        <Reveal as="ul" group className="mt-12 grid gap-5 sm:grid-cols-2">
          {privacy.tiles.map((t) => (
            <li
              key={t.title}
              className={`tile-${t.tone} relative flex min-h-[19rem] flex-col rounded-[1.75rem] p-7 text-white sm:p-9`}
            >
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-night/40 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent-wash"
                />
                {t.pill}
              </p>
              <h3 className="mt-6 font-display text-2xl font-semibold leading-tight sm:text-3xl">
                {t.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-white/85">
                {t.body}
              </p>
              <Link
                href={t.href}
                className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-white"
              >
                {t.linkLabel}
                <Arrow />
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The footer opens with the waitlist, beside a stacked photograph, then the
 * link columns. It replaces the separate waitlist band, so the page ends on
 * one composed piece rather than two stacked boxes.
 */
export function SiteFooter() {
  return (
    <footer id="waitlist" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Reveal blur>
          <Headline className="!mt-0">{waitlist.headline}</Headline>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {waitlist.body}
          </p>
          <div className="mt-8 max-w-xl">
            <WaitlistForm />
          </div>
        </Reveal>
        {/* One frame, with a tilted ghost behind it. */}
        <Reveal delay={150} className="relative mx-auto aspect-[4/3] w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -rotate-3 translate-x-2 translate-y-2 rounded-3xl bg-surface"
          />
          <div className="absolute inset-0 overflow-hidden rounded-3xl bg-night shadow-2xl shadow-black/50 outline outline-1 outline-white/10">
            <Photo
              file={footer.ctaImage}
              alt={footer.ctaImageAlt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              position="50% 45%"
            />
          </div>
        </Reveal>
      </div>

      <Reveal group className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-8 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6 lg:gap-16">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{site.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {footer.blurb}
          </p>
        </div>
        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="font-display text-base font-semibold text-ink">
              {col.title}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Reveal>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-faint sm:px-6">
          {footer.fineprint}
        </p>
      </div>
    </footer>
  );
}
