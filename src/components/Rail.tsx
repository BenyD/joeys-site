"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal scroller with a scroll indicator underneath.
 *
 * An edge fade was the first attempt and it read as a rendering fault: these
 * rails hold solid blocks of colour, so a mask cuts a card in half rather than
 * suggesting depth. A short progress bar says the same thing without touching
 * the content, and it says more of it: the thumb's width is how much of the row
 * you can see, and its position is where you are in it.
 *
 * It only exists when the row actually overflows, so nothing appears on desktop
 * where everything already fits.
 */
export function Rail({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Names the region for screen readers, since it is a keyboard-scrollable area. */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [thumb, setThumb] = useState(1); // fraction of the row that is visible
  const [progress, setProgress] = useState(0); // 0 at the start, 1 at the end

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const scrollable = el.scrollWidth - el.clientWidth;
    // 2px of slack: sub-pixel layout means these rarely land on exact values.
    setOverflows(scrollable > 2);
    setThumb(Math.min(1, el.clientWidth / el.scrollWidth));
    setProgress(scrollable > 2 ? Math.min(1, Math.max(0, el.scrollLeft / scrollable)) : 0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    // Fires on breakpoint changes and on late-loading images resizing the track.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const thumbPct = thumb * 100;

  return (
    <>
      <div
        ref={ref}
        className={`rail ${className}`}
        // A scrollable region needs to be reachable by keyboard, but only when it
        // actually scrolls; a stray tab stop on a static row is just noise.
        tabIndex={overflows ? 0 : undefined}
        role={overflows ? "region" : undefined}
        aria-label={overflows ? label : undefined}
      >
        {children}
      </div>

      {overflows && (
        <div className="mx-auto mt-6 h-[4px] w-[104px] overflow-hidden rounded-full bg-current/15">
          <div
            className="h-full rounded-full bg-coral"
            style={{
              width: `${thumbPct}%`,
              // Percentage margin is relative to the track, so the thumb travels
              // exactly the space it does not occupy.
              marginLeft: `${(100 - thumbPct) * progress}%`,
            }}
          />
        </div>
      )}
    </>
  );
}
