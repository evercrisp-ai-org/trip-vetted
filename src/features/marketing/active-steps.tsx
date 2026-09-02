"use client";

import * as React from "react";
import { Reveal } from "./reveal";

/**
 * The How it works list. Whichever step is crossing the middle band of the
 * viewport gets `data-active`, and the CSS lights its numeral. Written to the
 * DOM directly rather than through state: it fires on every scroll and there
 * is nothing to re-render.
 */
export function ActiveSteps({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.setAttribute("data-active", "");
          else e.target.removeAttribute("data-active");
        }
      },
      // A thin band across the middle of the viewport (10% of its height),
      // narrower than any gap between steps, so only one can be active.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    steps.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Reveal as="ol" group className={className} ref={ref}>
      {children}
    </Reveal>
  );
}
