"use client";

import { useCallback, useEffect, useState } from "react";
import type { LegalSection } from "@/lib/legal";

/**
 * Sticky contents rail with scroll spy.
 *
 * Position-based rather than IntersectionObserver-based, deliberately. An
 * observer only fires when a heading crosses its band, so a jump, a hash
 * landing or a restored scroll position leaves the highlight stuck wherever it
 * was last set. Reading positions directly answers "which section am I in"
 * from any starting state.
 *
 * Throttled to one calculation per frame, and the headings are measured live
 * so reflow from a font swap or a resize cannot desync it.
 */
export function LegalToc({ sections }: { sections: LegalSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const measure = useCallback(() => {
    // The line the reader's eye sits on, a third of the way down the viewport.
    const line = window.innerHeight * 0.33;
    let current = sections[0]?.id ?? "";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= line) current = s.id;
    }
    // Bottom of the page: the last section is the one being read, whatever the
    // maths says, otherwise short trailing sections can never light up.
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1]?.id ?? current;
    }
    setActive(current);
  }, [sections]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-[94px]">
      <p className="eyebrow mb-4 uppercase text-ink/40">On this page</p>
      <ol className="space-y-0.5 border-l-2 border-ink/10">
        {sections.map((s, i) => {
          const current = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? "true" : undefined}
                className={`-ml-[2px] flex gap-2.5 border-l-2 py-2 pl-4 pr-2 text-[13.5px] leading-snug transition-colors duration-[180ms] ${
                  current
                    ? "border-coral font-semibold text-ink"
                    : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                <span className={current ? "text-coral" : "text-ink/25"}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
