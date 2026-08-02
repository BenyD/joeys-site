"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";
import { scrollToHash } from "@/lib/scroll";

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

/*
 * ── Shared element morph ──
 *
 * One fixed name, claimed for the length of a single navigation, never declared
 * statically anywhere.
 *
 * The earlier attempt gave every pack its own permanent `pack-<slug>` name. That
 * is the obvious design and it is the wrong one: a name has to be unique within
 * each captured state, and with names baked into the markup you cannot reason
 * about how many holders exist at capture time. Going flavour to flavour, the
 * outgoing hero and the incoming hero would both want the same name.
 *
 * Instead: the element you actually clicked claims MORPH on the way out, the
 * destination hero claims it on the way in, and both release when the transition
 * finishes. Exactly one holder per captured state, by construction, and the
 * morph animates the thing the visitor pointed at rather than an unrelated pack.
 */
export const MORPH = "flavour-morph";

/** Set between the click and the destination hero claiming the name. */
let morphPending = false;
/** Whoever currently holds the name, so the transition can hand it all back. */
let morphHolders: HTMLElement[] = [];

function releaseMorph() {
  for (const el of morphHolders) el.style.viewTransitionName = "";
  morphHolders = [];
  morphPending = false;
}

/**
 * Called by the destination hero. Claims the name once, then disarms.
 *
 * Hands the name off rather than adding a second holder. The outgoing snapshot
 * was captured before the update callback ran, so the source has already done
 * its job by the time this fires and can safely give the name up. Measured
 * without this, the old route was still mounted at capture time and the
 * document briefly carried two `flavour-morph` elements: it happened to survive,
 * but duplicate names are exactly what aborts a transition, and "happened to"
 * is not a guarantee.
 */
export function claimMorph(el: HTMLElement | null) {
  if (!morphPending || !el) return false;
  morphPending = false;
  for (const prev of morphHolders) prev.style.viewTransitionName = "";
  morphHolders = [];
  el.style.viewTransitionName = MORPH;
  morphHolders.push(el);
  return true;
}

/** Mounted once in the layout. Releases the transition when the route lands. */
export function NavigationTransitions() {
  const pathname = usePathname();

  useEffect(() => {
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
  morph = false,
  ...rest
}: ComponentProps<typeof Link> & {
  href: string;
  /**
   * Fly this link's image into the destination hero. The named element is the
   * `[data-morph]` descendant if there is one, otherwise the link itself.
   */
  morph?: boolean;
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

    // Claim the morph name on the clicked image before the outgoing snapshot is
    // taken. Released on `finished` so a settled page never holds the name.
    if (morph) {
      const source =
        e.currentTarget.querySelector<HTMLElement>("[data-morph]") ?? e.currentTarget;
      source.style.viewTransitionName = MORPH;
      morphHolders.push(source);
      morphPending = true;
    }

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

    // One owner for cleanup: whatever claimed the name, on either side, hands it
    // back here. A settled page never holds it, so the next navigation starts
    // from a known state no matter which way it went.
    transition.finished.finally(() => {
      delete document.documentElement.dataset.vt;
      releaseMorph();
    });
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
