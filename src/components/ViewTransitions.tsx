"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";
import { scrollToHash, scrollToHashSettling } from "@/lib/scroll";

/*
 * View transitions against the native browser API.
 *
 * React's <ViewTransition> is not in the React that Next 16.2 resolves, so this
 * drives document.startViewTransition directly. The one hard part is that the
 * App Router renders asynchronously: startViewTransition snapshots the DOM when
 * its callback settles, so the callback has to wait for the new route to
 * actually paint. `pendingNav` is that handshake.
 *
 * Everything degrades cleanly: browsers without the API just navigate.
 */

let pendingNav: (() => void) | null = null;
/**
 * Where the pending navigation should land on the new page: at the top, or on
 * a fragment. Landing has to happen here, inside the transition, because
 * `html { scroll-behavior: smooth }` turns every browser-initiated scroll
 * reset into an animation, and the view transition freezes rendering before
 * that animation gets anywhere - the new page was being captured still
 * scrolled partway down wherever the old page happened to be.
 */
let pendingScroll: { top: true } | { hash: string } | null = null;

/*
 * There is no click-time shared-element machinery here any more. The flavour
 * hero pack carries a permanent `flavour-hero` view-transition-name instead -
 * exactly one per page, so uniqueness within a captured state holds by
 * construction. Entrances, exits and the flavour-to-flavour pack morph are all
 * styled in globals.css off that one name. The old approach morphed whatever
 * disc was clicked into the hero pack, and a small circle of chips becoming a
 * huge bag never read as one object.
 */

/** Mounted once in the layout. Releases the transition when the route lands. */
export function NavigationTransitions() {
  const pathname = usePathname();

  useEffect(() => {
    /*
     * Land the navigation before the incoming snapshot is captured: plain
     * route changes at the top, fragment navigations on their anchor (with
     * the top as the fallback for a fragment that matches nothing). Instant
     * on purpose - see the note on `pendingScroll`.
     *
     * Fragment landings need aftercare. At commit time the new document is
     * still growing - images decoding, fonts swapping - so a jump to a deep
     * anchor clamps against the short document and strands the visitor
     * partway down. Timed retries lose that race on slow loads, so instead a
     * ResizeObserver re-asserts the anchor every time the document's height
     * actually changes, for a bounded window. The moment the visitor scrolls
     * themselves the position is theirs: the first observation after that
     * sees the mismatch and disconnects without touching anything.
     */
    if (pendingNav && pendingScroll) {
      const ps = pendingScroll;
      /* A fragment landing has to hold its target while the new document
         grows, which is what scrollToHashSettling does; the top needs no
         such care, and is also the fallback for a fragment matching
         nothing. */
      if ("top" in ps || !scrollToHashSettling(ps.hash)) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
    pendingScroll = null;
    // Release the moment React commits, and nothing clever after it.
    //
    // Do NOT wait for requestAnimationFrame here. Rendering is suspended for the
    // duration of a view transition's update callback, so a rAF scheduled inside
    // it never fires; the callback then hangs until the browser's own timeout
    // gives up and aborts the whole transition with InvalidStateError. The page
    // sits frozen on the old snapshot for seconds and then snaps to the new one.
    //
    // Waiting is unnecessary anyway: the browser updates style and layout itself
    // before capturing the new snapshot, once this promise settles.
    pendingNav?.();
    pendingNav = null;
  }, [pathname]);

  // Never leave a direction flag behind for the next transition to inherit.
  useEffect(() => {
    const clear = () => delete document.documentElement.dataset.vt;
    window.addEventListener("pageshow", clear);
    return () => window.removeEventListener("pageshow", clear);
  }, []);

  return null;
}

const depth = (p: string) => p.split("/").filter(Boolean).length;

/**
 * Internal link that runs its navigation inside a view transition.
 *
 * Direction comes from route depth. Going deeper slides forward, coming back up
 * slides back, and moving between siblings at the same depth (one flavour to
 * another) only cross-fades: a slide there would claim a hierarchy that does
 * not exist, and the direction it picked would be arbitrary.
 */
export function TLink({
  href,
  onClick,
  children,
  ...rest
}: ComponentProps<typeof Link> & {
  href: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // next/link prefetches on viewport entry; this covers the case where the
  // pointer reaches a link before that has happened, so the freeze window
  // between click and paint stays near zero.
  const warm = () => {
    if (href.startsWith("/")) router.prefetch(href);
  };

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Leave modified clicks, new tabs and in-page anchors to the browser.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    // mailto:, tel: and anything off-site are not route changes.
    if (!href.startsWith("/") && !href.startsWith("#")) return;

    const [path, hash] = [href.split("#")[0], href.split("#")[1]];
    const target = path || pathname;

    /*
     * Anchor on the page you are already on, pointing at the hash the URL
     * already carries. Nothing downstream will move: the router sees the same
     * URL and skips the navigation, and no hashchange fires for the browser to
     * act on. So scroll it here.
     *
     * Deliberately narrow. When the hash actually changes the existing path
     * already works, and taking that over too would mean owning scroll
     * restoration and history for every anchor on the site.
     */
    if (hash !== undefined && target === pathname && window.location.hash === `#${hash}`) {
      e.preventDefault();
      scrollToHash(hash);
      return;
    }

    if (target === pathname) return;
    if (!document.startViewTransition) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    e.preventDefault();
    const from = depth(pathname);
    const to = depth(target);
    document.documentElement.dataset.vt =
      to > from ? "forward" : to < from ? "back" : "lateral";
    /* A plain route change lands at the top of the new page; a cross-page
       anchor ("/#flavours" from a flavour page) lands on its fragment. */
    pendingScroll = hash === undefined ? { top: true } : { hash };

    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          pendingNav = resolve;
          router.push(href);
          // Never strand the transition if the route never resolves. Kept short:
          // the whole page is frozen on the old snapshot until this settles, so a
          // long ceiling reads as the site having hung. Every route here is
          // static and prefetched, so this should almost never fire.
          setTimeout(() => {
            if (pendingNav === resolve) {
              pendingNav = null;
              resolve();
            }
          }, 500);
        }),
    );

    // Clear the direction flag once the transition settles, so the next
    // navigation starts from a known state no matter which way it went.
    //
    // The trailing catch is not defensive fluff: `finished` REJECTS whenever a
    // transition aborts, which happens legitimately (a navigation fired while
    // another transition was still running, the document going hidden
    // mid-flight), and an unhandled rejection logs a console error for what is
    // normal behaviour. The cleanup in `finally` runs either way.
    transition.finished
      .finally(() => {
        delete document.documentElement.dataset.vt;
      })
      .catch(() => {});
  };

  return (
    <Link
      href={href}
      onClick={handle}
      onMouseEnter={warm}
      onTouchStart={warm}
      onFocus={warm}
      {...rest}
    >
      {children}
    </Link>
  );
}
