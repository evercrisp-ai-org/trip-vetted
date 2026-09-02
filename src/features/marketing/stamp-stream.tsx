"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/*
 * The corridor.
 *
 * Two rails of cards ride from far behind the screen toward the viewer.
 * Perspective alone does the work that looks like two animations: as a
 * card's z grows it gets bigger AND its screen x sweeps outward from the
 * vanishing point, because the projection scales position and size by the
 * same factor.
 *
 * Three choices shape it, each fixing a specific artefact:
 *
 * 1. Depth is authored as apparent size, geometrically. Each card is a
 *    constant ratio bigger than the one behind it, all the way out. Spacing
 *    a straight z-range evenly instead makes the near cards tear apart from
 *    each other as the projection blows up.
 * 2. The rails open hard in the first stretch and then hold (`fan` > 1).
 *    That opening cancels the still-slow growth back there, so the ribbon
 *    leaves the centre as a flat band, bends once, and only then runs out
 *    on the diagonal. Parallel rails project to a straight cone, no bend.
 * 3. Neither end of the loop is ever on screen. A card dies with its inner
 *    edge past 50cqw, clear of the container. And it is born ACROSS the
 *    axis (`railBirth` is negative), so the newest card starts on the far
 *    side and sweeps back through the centre. That keeps the axis covered
 *    at every instant, and a newborn lands behind cards that already cover
 *    it, so it needs no fade in. Birthing on its own side leaves a hole at
 *    dead centre that blinks open once per cycle.
 *
 * Every length is `cqw`, a percentage of the container's width, so the
 * corridor keeps its proportions at any size.
 *
 * Adapted from a reference component: the geometry is kept verbatim, the
 * card contents are delegated to `renderCard` so the rails can carry a
 * stamp (photograph, author, quote) rather than a bare image.
 */

export type CorridorPath = {
  /** Strength of the projection. Lower is a wider-angle, more dramatic rush. @default 30 */
  perspective?: number;
  /** Card width in world units. @default 18 */
  cardWidth?: number;
  /** Card height in world units. @default 25 */
  cardHeight?: number;
  /** Corner radius applied to each card. @default 0.4 */
  cardRadius?: number;
  /** On-screen card height at the waist, where a card is born. @default 2.6 */
  birthHeight?: number;
  /** On-screen card height as a card leaves the frame. @default 46 */
  exitHeight?: number;
  /** Lateral offset at birth. Negative starts across the axis (note 3). @default -11 */
  railBirth?: number;
  /** Lateral offset once the rails have finished opening. @default 44 */
  railExit?: number;
  /** How front-loaded the opening is. >1 opens early then holds. @default 3.3 */
  fan?: number;
  /** Y-rotation at birth, degrees. @default 6 */
  turnBirth?: number;
  /** Y-rotation at exit, degrees. @default 28 */
  turnExit?: number;
  /** Keyframe stops used to trace the curve. Raise only if motion looks faceted. @default 24 */
  stops?: number;
};

const PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

/** Sample the path once so the CSS keyframes trace the real curve. */
function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops;
    // Geometric in apparent size, so consecutive cards keep a constant size
    // ratio and the ribbon stays solid at both ends.
    const scale =
      (p.birthHeight / p.cardHeight) *
      Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail =
      p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(
        2
      )}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`
    );
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export type CorridorProps<T> = {
  /** Items cycled onto the rails. Both rails run the same sequence. */
  items: T[];
  /** Renders the face of one card. Receives the item and its index. */
  renderCard: (item: T, index: number) => React.ReactNode;
  /**
   * Cards on each rail at once. More means denser, not faster. Far below
   * the default, consecutive cards grow too fast to stay overlapped near the
   * exit and the ribbon tears. @default 9
   */
  cards?: number;
  /** Seconds for one card to travel the whole corridor. @default 18 */
  speed?: number;
  /** Vertical placement of the corridor's axis, percent of height. @default 55 */
  axis?: number;
  /** Override any part of the geometry. Merged over the defaults. */
  path?: CorridorPath;
  className?: string;
  style?: React.CSSProperties;
};

export function Corridor<T>({
  items,
  renderCard,
  cards = 9,
  speed = 18,
  axis = 55,
  path,
  className,
  style,
}: CorridorProps<T>) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `tv-r-${id}`;
  const left = `tv-l-${id}`;
  const card = `tv-c-${id}`;

  const p = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  const css = React.useMemo(
    () =>
      `${keyframes(1, right, p)}${keyframes(-1, left, p)}` +
      // Pausing rather than disabling keeps the corridor whole: every card is
      // already dropped mid-flight by its negative delay, so it freezes as a
      // finished still instead of collapsing onto the axis.
      `@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`,
    [right, left, card, p]
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none overflow-hidden", className)}
      style={{ containerType: "inline-size", ...style }}
    >
      <style>{css}</style>
      <div
        className="absolute inset-0"
        style={{
          perspective: `${p.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[right, left].map((name) =>
            Array.from({ length: cards }, (_, i) => {
              const item = items[i % Math.max(items.length, 1)];
              return (
                <div
                  key={`${name}-${i}`}
                  className={cn(card, "absolute overflow-hidden")}
                  style={{
                    left: "50%",
                    top: `${axis}%`,
                    width: `${p.cardWidth}cqw`,
                    height: `${p.cardHeight}cqw`,
                    marginLeft: `${-p.cardWidth / 2}cqw`,
                    marginTop: `${-p.cardHeight / 2}cqw`,
                    borderRadius: `${p.cardRadius}cqw`,
                    animation: `${name} ${speed}s linear infinite`,
                    // Negative delay drops each card mid-flight, so the
                    // corridor is already full on the first frame.
                    animationDelay: `${-(i * speed) / cards}s`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {item === undefined ? null : renderCard(item, i)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── the stamp that rides the rails ────────────────────────────── */

export type StreamStamp = {
  image: string;
  place: string;
  who: string;
  quote: string;
};

/**
 * The face of one card. Sized entirely in `cqw`, the same unit the corridor
 * is built in, so type and padding scale with the card as it approaches:
 * unreadable in the far distance, legible for the last stretch before it
 * leaves the frame. That is the intended reading experience, not a defect.
 *
 * The corridor is aria-hidden as a whole, so nothing here is announced. The
 * same stamps appear in accessible form further down the page.
 */
export function StampCard({ stamp }: { stamp: StreamStamp }) {
  return (
    <div className="relative h-full w-full bg-night">
      {/* Plain img on purpose: these are decorative tiles inside a 3D
          transform, served from fixed 720px variants in public/images/stream.
          next/image's wrapper and srcset buy nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${stamp.image}`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
      {/* Caption floor: night/90 at the base fading out by 55% up the card. */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 via-night/70 to-transparent"
        style={{ height: "58%" }}
      />
      <div
        className="absolute left-0 top-0 rounded-full border border-white/50 font-semibold uppercase tracking-[0.18em] text-white"
        style={{
          margin: "1cqw",
          padding: "0.25cqw 0.75cqw",
          fontSize: "0.72cqw",
          lineHeight: 1.4,
        }}
      >
        {stamp.place}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 text-white"
        style={{ padding: "1.1cqw" }}
      >
        <p
          className="font-display font-semibold"
          style={{ fontSize: "1.18cqw", lineHeight: 1.22 }}
        >
          {stamp.quote}
        </p>
        <p
          className="text-accent-wash"
          style={{ fontSize: "0.78cqw", marginTop: "0.5cqw", lineHeight: 1.3 }}
        >
          signed, {stamp.who}
        </p>
      </div>
    </div>
  );
}

/**
 * The corridor with stamps on it. This wrapper exists because `renderCard`
 * is a function, and functions cannot cross from a Server Component into a
 * Client Component. Server-side callers (the hero) pass plain data here and
 * the render function stays on the client side of the boundary.
 */
export function StampStream({
  stamps,
  ...rest
}: { stamps: StreamStamp[] } & Omit<
  CorridorProps<StreamStamp>,
  "items" | "renderCard"
>) {
  return (
    <Corridor
      items={stamps}
      renderCard={(stamp) => <StampCard stamp={stamp} />}
      {...rest}
    />
  );
}
