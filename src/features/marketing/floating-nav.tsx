"use client";

import * as React from "react";
import { SiteNav } from "./site-nav";

/**
 * The nav pill that floats once the hero has scrolled away. The pill inside
 * the hero frame is the real one at the top of the page; this copy slides
 * down from the top edge when that one is gone, and is `inert` and hidden
 * from assistive tech while it is not shown, so there is only ever one
 * usable nav.
 */
export function FloatingNav({ watch }: { watch: string }) {
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById(watch);
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      // Show once the hero's bottom edge is above the top of the viewport.
      { rootMargin: "0px 0px -100% 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [watch]);

  return (
    <div
      className="floating-nav on-night"
      data-shown={shown ? "" : undefined}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="mx-auto max-w-6xl px-3 pt-3 sm:px-5 lg:px-6">
        <SiteNav />
      </div>
    </div>
  );
}
