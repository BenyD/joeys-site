"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll entrance. Sections are seen roughly once per visit, so an entrance is
 * warranted here in a way it would not be on a control someone hits all day.
 *
 * Only opacity/transform/filter move, all of it compositor-friendly, and the
 * element unobserves itself once revealed so nothing animates twice.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  amount = 0.15,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger offset in ms. Keep steps small: 60-90ms reads as one gesture. */
  delay?: number;
  className?: string;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount should just be there, not fly in.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "revealed" : ""}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
