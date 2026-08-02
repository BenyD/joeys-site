"use client";

import { useLayoutEffect } from "react";
import { claimMorph } from "./ViewTransitions";

/**
 * Marks the destination of a shared element morph. Renders nothing.
 *
 * Timing is the whole point of using a layout effect. The new route mounts
 * inside the view transition's update callback, and layout effects run before
 * the passive effect that releases that callback, so the name lands on the hero
 * before the browser captures the incoming state. A passive effect would be one
 * step too late and the hero would just fade in.
 *
 * The name is only claimed when a morph is actually in flight, so a page you
 * arrived at directly holds no name. That is what makes flavour-to-flavour safe:
 * the outgoing hero is not a second holder. Releasing is handled by the
 * transition itself in ViewTransitions.tsx, not here.
 */
export function MorphHero({ targetId }: { targetId: string }) {
  useLayoutEffect(() => {
    claimMorph(document.getElementById(targetId));
  }, [targetId]);

  return null;
}
