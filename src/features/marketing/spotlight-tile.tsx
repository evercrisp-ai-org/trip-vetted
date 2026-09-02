"use client";

import * as React from "react";

/**
 * A tile whose surface carries a soft highlight that follows the pointer.
 * The pointer position is written straight to two custom properties on the
 * element; the gradient in globals.css reads them. No state, no re-render.
 */
export function SpotlightTile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLLIElement>(null);

  function onMove(e: React.PointerEvent<HTMLLIElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <li ref={ref} onPointerMove={onMove} className={`spotlight ${className ?? ""}`}>
      {children}
    </li>
  );
}
