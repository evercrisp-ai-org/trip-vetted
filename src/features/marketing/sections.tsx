import Link from "next/link";
import type { CSSProperties } from "react";
import {
  site,
  nav,
  hero,
  circle,
  howItWorks,
  stampArc,
  stampsAndBriefs,
  askTheHub,
  privacy,
  waitlist,
  footer,
} from "@/content/site";
import { Photo, PhotoBackdrop } from "./photo";
import { StampSpecimen } from "./stamp-specimen";
import { WaitlistForm } from "./waitlist-form";

/*
 * Scrim discipline (BUILD-SPEC section 7): every text-over-photograph pass
 * sits on a night overlay measured for WCAG AA against a worst-case pure
 * white pixel underneath. Floors used here:
 *   hero: base night/45 (keeps the photograph alive) plus a bottom gradient
 *     to night/90. Every text zone in the frame sits inside that gradient,
 *     where the composited floor is >= night/67: white >= 6.08:1 and
 *     accent-wash >= 4.97:1. The base alone is NOT sufficient, so any new
 *     text added to the hero must stay inside the gradient or carry its own.
 *   nav pill and kicker pill carry their own night wash on top: >= 7.9:1
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
 * The hero: a blurred copy of the photograph bleeds to the window edge and
 * the sharp frame is inset on top of it, with the nav pill, a three-line
 * headline, and the supporting paragraph inside the frame.
 */
export function Hero() {
  return (
    <section className="on-night relative isolate bg-night p-2 sm:p-4 lg:p-6">
      <PhotoBackdrop file={hero.image} />
      <div aria-hidden="true" className="absolute inset-0 bg-night/45" />

      <div className="relative flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[1.5rem] bg-night sm:min-h-[calc(100svh-2rem)] sm:rounded-[2rem]">
        <Photo
          file={hero.image}
          alt={hero.imageAlt}
          sizes="100vw"
          priority
          position="50% 58%"
        />
        {/* Base wash. Deliberately light so the photograph reads. */}
        <div aria-hidden="true" className="absolute inset-0 bg-night/45" />
        {/* The gradient that actually carries contrast. Full height on small
            screens, where content starts much higher up the frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-night/90 via-night/55 to-transparent lg:h-3/4"
        />

        <div className="relative flex flex-1 flex-col p-3 pb-6 sm:p-5 sm:pb-8 lg:p-7 lg:pb-10">
          <SiteNav />

          <div className="mt-auto grid gap-8 pt-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
            <div>
              <p className="inline-flex w-fit items-center rounded-full border border-white/40 bg-night/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
                {hero.kicker}
              </p>
              <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {hero.lines.map((line, i) => (
                  <span key={line} className="block">
                    {i === hero.lines.length - 1 ? (
                      <span className="text-accent-wash">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>
            </div>

            <div className="lg:pb-3">
              <p className="max-w-md text-base leading-relaxed text-white sm:text-lg">
                {hero.sub}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#waitlist"
                  className="rounded-full bg-white px-7 py-3.5 text-center text-sm font-semibold text-night hover:bg-accent-wash"
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
          </div>
        </div>

        <a
          href="#how-it-works"
          aria-label={hero.scrollCue}
          className="absolute bottom-5 right-5 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-night/50 text-white backdrop-blur-md hover:bg-night/70 lg:flex"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

export function Circle() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <dl className="relative z-10 grid gap-4 sm:grid-cols-3">
          {circle.points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-surface p-6 shadow-sm"
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-night">
          <Photo
            file={circle.image}
            alt={circle.imageAlt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            position="50% 45%"
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

/**
 * The arc row. A line of stamps that steps down toward the middle and back
 * up, so the photographs read as one curve rather than a grid. Below lg the
 * arc flattens into a horizontal rail (see .arc in globals.css).
 */
export function StampArc() {
  return (
    <section aria-label={stampArc.railLabel} className="overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <Kicker>{stampArc.kicker}</Kicker>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {stampArc.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
          {stampArc.sub}
        </p>
      </div>

      <ul className="arc rail mx-auto flex max-w-6xl snap-x gap-4 overflow-x-auto px-4 pb-16 pt-12 sm:gap-5 sm:px-6 lg:justify-center lg:overflow-visible lg:pb-44 lg:pt-16">
        {stampArc.items.map((item) => (
          <li
            key={item.image}
            style={{ "--arc": item.arc } as CSSProperties}
            className="w-[44vw] max-w-[190px] shrink-0 sm:w-[170px] lg:w-[156px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-night shadow-lg shadow-night/15">
              <Photo
                file={item.image}
                alt={item.alt}
                sizes="200px"
                position={item.position}
              />
            </div>
            <p className="mt-3 font-display text-sm font-semibold">
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
      </ul>
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

/**
 * Ask the hub, shown as one question and the answers it got back. Every
 * answer carries a name, because attribution is the product.
 */
export function AskTheHub() {
  return (
    <section id="hub">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <Kicker>{askTheHub.kicker}</Kicker>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {askTheHub.headline}
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">{askTheHub.body}</p>
        </div>

        <figure className="mt-12">
          <figcaption className="rounded-2xl border border-line bg-surface p-6 sm:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-faint">
              {askTheHub.questionLabel}
            </p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug sm:text-2xl">
              {askTheHub.question}
            </p>
          </figcaption>

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {askTheHub.answers.map((answer) => (
              <li
                key={answer.image}
                className="overflow-hidden rounded-2xl bg-surface shadow-sm"
              >
                <div className="relative aspect-[4/5] bg-night">
                  <Photo
                    file={answer.image}
                    alt={answer.alt}
                    sizes="(min-width: 640px) 22rem, 100vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {answer.who}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {answer.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section id="privacy" className="bg-surface-sunk/60">
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

/**
 * The waitlist band. Deliberately not photographic: every photograph on this
 * page belongs to a member's stamp, and a decorative one here would dilute
 * that. White on --color-accent is 6.05:1, so no scrim is needed.
 */
export function Waitlist() {
  return (
    <section
      id="waitlist"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="on-night relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent-deep to-night">
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
