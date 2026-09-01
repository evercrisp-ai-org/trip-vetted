import { stampsAndBriefs } from "@/content/site";

/**
 * A passport-stamp rendering of a real seed stamp. Pure CSS, no imagery.
 * Used decoratively in the hero and as the worked example in the stamps
 * section, so it is aria-hidden where the surrounding text already explains it.
 */
export function StampSpecimen({ rotate = "-rotate-2" }: { rotate?: string }) {
  const s = stampsAndBriefs.exampleStamp;
  return (
    <figure
      className={`${rotate} relative mx-auto w-full max-w-sm border-2 border-stamp bg-paper-raised p-1 text-stamp shadow-[4px_4px_0_0_var(--color-line-strong)]`}
    >
      <div className="border border-stamp/60 p-5">
        <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-stamp/50 pb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
            Trip Vetted
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
            Stamp No. 0042
          </span>
        </div>
        <p className="mt-4 font-display text-2xl text-ink">{s.place}</p>
        <p className="mt-1 font-mono text-xs text-ink-soft">{s.coords}</p>
        <p className="font-mono text-xs text-ink-soft">{s.dates}</p>
        <dl className="mt-4 space-y-3 text-sm leading-snug text-ink">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ok">
              {stampsAndBriefs.exampleStamp.lovedLabel}
            </dt>
            <dd className="mt-1">{s.loved}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-error">
              {stampsAndBriefs.exampleStamp.avoidedLabel}
            </dt>
            <dd className="mt-1">{s.avoided}</dd>
          </div>
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-dashed border-stamp/50 pt-3">
          <span className="font-mono text-xs text-ink-soft">
            signed, {s.author}
          </span>
          <span className="inline-block -rotate-6 border-2 border-stamp px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-stamp">
            Vetted
          </span>
        </div>
      </div>
    </figure>
  );
}
