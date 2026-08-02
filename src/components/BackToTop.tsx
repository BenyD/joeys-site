"use client";

import { CaretDoubleUp } from "./icons";
import { scrollToTop } from "@/lib/scroll";

/**
 * Footer "Back to top".
 *
 * Stays an `<a href="#top">` so it keeps the affordances of a link (middle
 * click, keyboard, and a working control before JS loads), but does the scroll
 * itself. Left to the browser it does nothing on a second click, since the URL
 * already ends in #top by then and same-URL fragment navigation is a no-op.
 */
export function BackToTop({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        scrollToTop();
        // Keep the address bar honest without going through the router: a hash
        // is not a route change, and pushing one re-runs the page's transition.
        history.replaceState(null, "", "#top");
      }}
    >
      Back to top
      <CaretDoubleUp
        weight="bold"
        className="h-3.5 w-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/t:-translate-y-0.5"
      />
    </a>
  );
}
