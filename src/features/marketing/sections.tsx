import Link from "next/link";
import {
  site,
  nav,
  hero,
  circle,
  howItWorks,
  destinations,
  stampsAndBriefs,
  privacy,
  waitlist,
  footer,
} from "@/content/site";
import { Photo } from "./photo";
import { StampSpecimen } from "./stamp-specimen";
import { WaitlistForm } from "./waitlist-form";

/*
 * Scrim discipline (BUILD-SPEC section 7): every text-over-photograph pass
 * sits on a night overlay measured for WCAG AA against a worst-case pure
 * white pixel underneath. Floors used here:
 *   night/65 -> 5.65:1 for white text (hero, nav)
 *   night/70 -> 6.75:1 (waitlist band)
 *   night/75 -> 8.10:1 (destination card captions)
 * Numbers from docs/decisions/0005-cinematic-redesign.md.
 */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
      {children}
    </p>
  );
}

export function SiteNav() {
  return (
    <header className="on-night absolute inset-x-0 top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-between rounded-full bg-night/65 px-5 py-3 text-white backdrop-blur-md">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            {site.name}
          </Link>
          <nav aria-label="Site" className="flex items-center gap-5">
            <a
              href="#how-it-works"
              className="hidden text-sm text-white hover:text-accent-wash sm:block"
            >
              {nav.howItWorks}
            </a>
            <a
              href="#privacy"
              className="hidden text-sm text-white hover:text-accent-wash sm:block"
            >
              {nav.privacy}
            </a>
            <Link
              href="/login"
              className="text-sm text-white hover:text-accent-wash"
            >
              {nav.memberSignIn}
            </Link>
            <Link
              href="/join"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-deep"
            >
              {nav.haveAnInvite}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="on-night relative isolate bg-night">
      <Photo file="hero-vista.jpg" alt={hero.imageAlt} sizes="100vw" priority />
      {/* Text scrim: night/65 everywhere text can sit (5.65:1 worst case),
          deepening toward the base so the overlap cards land cleanly. */}
      <div aria-hidden="true" className="absolute inset-0 bg-night/65" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night to-transparent"
      />
      <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-4 pb-36 pt-36 sm:px-6 sm:pb-44">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white">
          {hero.kicker}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {hero.headline}{" "}
          <em className="not-italic text-accent-wash">{hero.headlineEmphasis}</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white">
          {hero.sub}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#waitlist"
            className="rounded-full bg-accent px-7 py-3.5 text-center text-sm font-semibold text-white hover:bg-accent-deep"
          >
            {hero.primaryCta}
          </a>
          <Link
            href="/join"
            className="rounded-full border border-white/70 px-7 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10"
          >
            {hero.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Circle() {
  return (
    <section className="relative">
      {/* Card row overlapping the hero boundary */}
      <div className="mx-auto -mt-24 max-w-6xl px-4 sm:px-6">
        <dl className="relative z-10 grid gap-4 sm:grid-cols-3">
          {circle.points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-surface p-6 shadow-lg shadow-night/10"
            >
              <dt className="font-display text-lg font-semibold">{p.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker>{circle.kicker}</Kicker>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {circle.headline}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
            {circle.body}
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Photo
            file="circle-planning.jpg"
            alt={circle.imageAlt}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-sunk/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Kicker>{howItWorks.kicker}</Kicker>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {howItWorks.headline}
        </h2>
        <ol className="rail mt-10 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {howItWorks.steps.map((step, i) => (
            <li
              key={step.name}
              className="min-w-[80%] rounded-2xl bg-surface p-7 shadow-sm sm:min-w-[55%] lg:min-w-0"
            >
              <p className="font-display text-4xl font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
                {step.name}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DestinationsRail() {
  return (
    <section aria-label={destinations.railLabel}>
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <Kicker>{destinations.kicker}</Kicker>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {destinations.headline}
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
          {destinations.sub}
        </p>
      </div>
      <div className="rail on-night mx-auto flex max-w-6xl snap-x gap-4 overflow-x-auto px-4 pb-16 pt-8 sm:px-6 sm:pb-24">
        {destinations.items.map((d) => (
          <article
            key={d.name}
            className="relative aspect-[4/5] w-64 shrink-0 overflow-hidden rounded-3xl bg-night sm:w-72"
          >
            <Photo file={d.image} alt={d.alt} sizes="(min-width: 640px) 18rem, 16rem" />
            {/* Caption scrim floor night/75 in the text zone: 8.10:1 */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night/90 via-night/75 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="font-display text-xl font-semibold">
                {d.name}, {d.country}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-white">
                {d.coords}
              </p>
              <p className="mt-2 text-sm leading-snug text-white">{d.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StampsAndBriefs() {
  return (
    <section id="stamps" className="bg-surface-sunk/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Kicker>{stampsAndBriefs.kicker}</Kicker>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {stampsAndBriefs.headline}
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            {stampsAndBriefs.body}
          </p>
          <p className="mt-6 rounded-2xl bg-accent-wash p-5 text-sm font-medium leading-relaxed text-accent-deep">
            {stampsAndBriefs.briefNote}
          </p>
        </div>
        <div>
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint lg:hidden">
            {stampsAndBriefs.stampCardLabel}
          </p>
          <StampSpecimen rotate="rotate-1" />
        </div>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section id="privacy">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Kicker>{privacy.kicker}</Kicker>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {privacy.headline}
        </h2>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          {privacy.points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <dt className="font-display text-lg font-semibold">{p.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Waitlist() {
  return (
    <section id="waitlist" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="on-night relative overflow-hidden rounded-3xl bg-night">
        <Photo file="band-coast.jpg" alt={waitlist.imageAlt} sizes="100vw" />
        {/* Band scrim night/70: 6.75:1 for white text worst case */}
        <div aria-hidden="true" className="absolute inset-0 bg-night/70" />
        <div className="relative px-6 py-14 sm:px-12 sm:py-16">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {waitlist.headline}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white">
            {waitlist.body}
          </p>
          <div className="mt-8 max-w-xl">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-[2fr_1fr_1fr] sm:px-6">
        <div>
          <p className="font-display text-xl font-semibold">{site.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {footer.blurb}
          </p>
        </div>
        <nav aria-label="Product">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
            {footer.colProduct}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#how-it-works" className="hover:text-accent">
                {footer.linkHowItWorks}
              </a>
            </li>
            <li>
              <a href="#stamps" className="hover:text-accent">
                {footer.linkStamps}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="Trust">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
            {footer.colTrust}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#privacy" className="hover:text-accent">
                {footer.linkPrivacy}
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-accent">
                {footer.linkSignIn}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-faint sm:px-6">
          {footer.fineprint}
        </p>
      </div>
    </footer>
  );
}
