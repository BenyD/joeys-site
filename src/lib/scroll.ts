/**
 * Same-page scrolling for anchors.
 *
 * Both native fragment navigation and the App Router treat a click that
 * resolves to the URL you are already on as nothing to do: no history entry, no
 * hashchange, no scroll. That is right for a route change and wrong for an
 * anchor. Land on /#flavours, scroll away, click "Meet the flavours", and the
 * page sits there, because the URL it would take you to is the URL you have.
 *
 * These helpers do the scroll directly so the outcome does not depend on
 * whether the address bar happens to already agree.
 */

/** Honour the same reduced-motion preference the CSS smooth scroll does. */
function behavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/**
 * `instant` exists for scrolls that happen inside a view transition's update
 * callback: rendering is frozen there, so a smooth scroll gets captured
 * mid-animation and the new page appears scrolled partway to nowhere. A jump
 * is invisible inside the transition - the cross-fade covers it - so nothing
 * is lost by skipping the animation.
 */
type Opts = { instant?: boolean };

export function scrollToTop({ instant }: Opts = {}) {
  window.scrollTo({ top: 0, behavior: instant ? "instant" : behavior() });
}

/**
 * Scroll to a fragment. Returns false if nothing matched, so a caller can fall
 * back to letting the browser navigate.
 *
 * `scrollIntoView` is used rather than a computed offset because it honours
 * `scroll-margin-top`, which is how every section on the site clears the fixed
 * header. Reimplementing that maths here would mean two definitions of the
 * header height that have to agree forever.
 */
export function scrollToHash(hash: string, { instant }: Opts = {}) {
  const id = hash.replace(/^#/, "");

  // "top" addresses the document, not an element - see the note in layout.tsx.
  if (!id || id.toLowerCase() === "top") {
    scrollToTop({ instant });
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: instant ? "instant" : behavior(), block: "start" });
  return true;
}

/**
 * Scroll to a fragment and hold it there while the document settles.
 *
 * A landing scroll runs before the page has finished growing: images decode,
 * fonts swap, reveals expand, and every one of those pushes the target away
 * from where it was when we jumped. A single scroll therefore lands short.
 * This re-asserts the target each time the document's height actually
 * changes, for a bounded window, and gets out of the way the moment the
 * visitor scrolls themselves - the first observation after that sees the
 * mismatch and disconnects without touching anything.
 *
 * Returns false if the fragment matches nothing, so callers can fall back.
 */
export function scrollToHashSettling(hash: string, ms = 4000) {
  if (!scrollToHash(hash, { instant: true })) return false;

  let expected = window.scrollY;
  const stop = () => {
    ro.disconnect();
    window.clearTimeout(timer);
  };
  const ro = new ResizeObserver(() => {
    if (Math.abs(window.scrollY - expected) > 1) {
      stop();
      return;
    }
    scrollToHash(hash, { instant: true });
    expected = window.scrollY;
  });
  const timer = window.setTimeout(stop, ms);
  ro.observe(document.body);
  return true;
}
