"use client";

import * as React from "react";

/**
 * Scroll reveal. Marks an element `data-reveal="in"` the first time it enters
 * the viewport; the CSS in globals.css does the rest.
 *
 * The resting state is always visible. The hidden state is applied only under
 * `html.motion-ok`, a class a tiny inline script in layout.tsx adds before
 * first paint when JavaScript runs and the visitor has not asked for reduced
 * motion. So: no JavaScript, or reduced motion, or a slow script, and every
 * element is simply there. Nothing on the page depends on this to appear.
 *
 * `group` staggers the element's direct children instead of moving the
 * element itself (see the nth-child rules in globals.css). `as` exists so a
 * list can be the observed element without wrapping it in a div, which would
 * put the stagger on the wrong node.
 */
type Tag = "div" | "ul" | "ol" | "dl" | "section" | "figure" | "header";

export function Reveal<T extends Tag = "div">({
  as,
  group = false,
  blur = false,
  delay = 0,
  className,
  children,
  ref: outerRef,
  ...rest
}: {
  as?: T;
  /** Forwarded to the rendered element, alongside the observer's own ref. */
  ref?: React.Ref<HTMLElement>;
  group?: boolean;
  blur?: boolean;
  /** Milliseconds before the transition starts once in view. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">) {
  const ref = React.useRef<HTMLElement>(null);
  const [inView, setInView] = React.useState(false);

  // One element, two refs: ours for the observer, the caller's if given.
  const setRefs = React.useCallback(
    (el: HTMLElement | null) => {
      ref.current = el;
      if (typeof outerRef === "function") outerRef(el);
      else if (outerRef) outerRef.current = el;
    },
    [outerRef]
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    // Without motion-ok the CSS hides nothing, so there is nothing to reveal.
    if (!document.documentElement.classList.contains("motion-ok")) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      // The root extends far above the viewport on purpose. "In view" here
      // means "at or above the reveal line", so anything the visitor skips
      // past (a fast scroll, a link to #privacy) still counts as revealed
      // instead of staying invisible forever.
      { threshold: 0, rootMargin: "20000px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  const Comp = (as ?? "div") as React.ElementType;
  return (
    <Comp
      ref={setRefs}
      className={className}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      {...(group ? { "data-reveal-group": inView ? "in" : "" } : { "data-reveal": inView ? "in" : "" })}
      {...(blur ? { "data-reveal-blur": "" } : {})}
      {...rest}
    >
      {children}
    </Comp>
  );
}
