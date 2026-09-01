import Link from "next/link";
import {
  site,
  nav,
  hero,
  circle,
  howItWorks,
  stampsAndBriefs,
  privacy,
  waitlist,
  footer,
} from "@/content/site";
import { StampSpecimen } from "./stamp-specimen";
import { WaitlistForm } from "./waitlist-form";

function SectionMark({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-stamp">
      <span aria-hidden="true">{n}</span>
      <span aria-hidden="true" className="h-px w-8 bg-stamp" />
      {label}
    </p>
  );
}

export function SiteNav() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Site" className="flex items-center gap-5">
          <a
            href="#how-it-works"
            className="hidden font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink sm:block"
          >
            {nav.howItWorks}
          </a>
          <a
            href="#privacy"
            className="hidden font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink sm:block"
          >
            {nav.privacy}
          </a>
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
          >
            {nav.memberSignIn}
          </Link>
          <Link
            href="/join"
            className="border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-paper"
          >
            {nav.haveAnInvite}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-stamp">
            {hero.kicker}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {hero.headline}{" "}
            <em className="text-stamp">{hero.headlineEmphasis}</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {hero.sub}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#waitlist"
              className="border-2 border-stamp bg-stamp px-6 py-3 text-center font-mono text-sm font-medium uppercase tracking-wider text-paper-raised hover:border-stamp-deep hover:bg-stamp-deep"
            >
              {hero.primaryCta}
            </a>
            <Link
              href="/join"
              className="border-2 border-ink px-6 py-3 text-center font-mono text-sm uppercase tracking-wider hover:bg-ink hover:text-paper"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="hidden lg:block">
          <StampSpecimen />
        </div>
      </div>
    </section>
  );
}

export function Circle() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <SectionMark n="01" label={circle.kicker} />
        <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          {circle.headline}
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">
          {circle.body}
        </p>
        <dl className="mt-10 grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
          {circle.points.map((p) => (
            <div key={p.title} className="bg-paper-raised p-6">
              <dt className="font-display text-lg">{p.title}</dt>
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <SectionMark n="02" label={howItWorks.kicker} />
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {howItWorks.headline}
        </h2>
        <ol className="mt-10 space-y-0 border-t-2 border-ink">
          {howItWorks.steps.map((step, i) => (
            <li
              key={step.name}
              className="grid gap-2 border-b border-line py-8 sm:grid-cols-[8rem_1fr] sm:gap-8"
            >
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-stamp">
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")} </span>
                {step.name}
              </div>
              <div>
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function StampsAndBriefs() {
  return (
    <section id="stamps" className="border-b border-line bg-paper-sunk">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionMark n="03" label={stampsAndBriefs.kicker} />
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {stampsAndBriefs.headline}
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            {stampsAndBriefs.body}
          </p>
          <p className="mt-6 border-l-4 border-stamp pl-4 font-mono text-sm leading-relaxed text-ink">
            {stampsAndBriefs.briefNote}
          </p>
        </div>
        <div>
          <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.25em] text-ink-faint lg:hidden">
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
    <section id="privacy" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <SectionMark n="04" label={privacy.kicker} />
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {privacy.headline}
        </h2>
        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
          {privacy.points.map((p) => (
            <div key={p.title} className="border-t-2 border-ink pt-4">
              <dt className="font-display text-lg">{p.title}</dt>
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
    <section id="waitlist" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {waitlist.headline}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-soft">{waitlist.body}</p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-paper-sunk">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl">{site.name}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-stamp">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {footer.blurb}
          </p>
        </div>
        <nav aria-label="Product">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            {footer.colProduct}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#how-it-works" className="hover:text-stamp">
                {footer.linkHowItWorks}
              </a>
            </li>
            <li>
              <a href="#stamps" className="hover:text-stamp">
                {footer.linkStamps}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="Trust">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            {footer.colTrust}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#privacy" className="hover:text-stamp">
                {footer.linkPrivacy}
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-stamp">
                {footer.linkSignIn}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line-strong">
        <p className="mx-auto max-w-5xl px-5 py-4 font-mono text-xs text-ink-faint">
          {footer.fineprint}
        </p>
      </div>
    </footer>
  );
}
