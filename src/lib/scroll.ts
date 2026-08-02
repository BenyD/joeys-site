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

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: behavior() });
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
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");

  // "top" addresses the document, not an element - see the note in layout.tsx.
  if (!id || id.toLowerCase() === "top") {
    scrollToTop();
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: behavior(), block: "start" });
  return true;
}
