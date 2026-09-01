import { stampsAndBriefs } from "@/content/site";

/**
 * A stamp rendered as a credential object: dated, signed, ink-marked.
 * This component is where the passport metaphor lives (BUILD-SPEC section
 * 7); the rest of the site stays modern and photographic. Monospace here
 * is deliberate and allowed: dates and coordinates only.
 */
export function StampSpecimen({ rotate = "-rotate-1" }: { rotate?: string }) {
  const s = stampsAndBriefs.exampleStamp;
  return (
    <figure
      className={`${rotate} relative mx-auto w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl shadow-accent-deep/10`}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-line pb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Trip Vetted
        </span>
        <span className="font-mono text-[11px] text-ink-faint">No. 0042</span>
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-ink">
        {s.place}
      </p>
      <p className="mt-1 font-mono text-xs text-ink-faint">{s.coords}</p>
      <p className="font-mono text-xs text-ink-faint">{s.dates}</p>
      <dl className="mt-4 space-y-3 text-sm leading-snug text-ink">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ok">
            {s.lovedLabel}
          </dt>
          <dd className="mt-1">{s.loved}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-error">
            {s.avoidedLabel}
          </dt>
          <dd className="mt-1">{s.avoided}</dd>
        </div>
      </dl>
      <div className="mt-5 flex items-center justify-between border-t border-dashed border-line pt-3">
        <span className="text-xs text-ink-soft">signed, {s.author}</span>
        <span className="inline-block -rotate-6 rounded-md border-2 border-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
          Vetted
        </span>
      </div>
    </figure>
  );
}
