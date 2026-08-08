"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { flavours } from "@/lib/flavours";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* client-mount gate for the portal; nothing to subscribe to, the snapshot is
   simply "which environment rendered me" */
const subscribeNever = () => () => {};
const useMounted = () => useSyncExternalStore(subscribeNever, () => true, () => false);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The story section's solo pack, plus the journey that delivers it.
 *
 * On scroll, the hero's centre pack (`#hero-pack`) detaches and glides down
 * into this slot: a fixed-position clone interpolates between the two rects
 * while both originals hide. The clone does not track the scrub directly - it
 * chases the scroll-derived target through an exponential follower, so motion
 * eases in and out of every gesture instead of freezing the instant a finger
 * lifts, and mobile viewport jumps (the URL bar collapsing) are absorbed
 * rather than teleported through.
 *
 * The swap to the real element happens only once landed AND converged, so the
 * handoff stays pixel-identical; that is why the slot's opacity is set
 * imperatively with no transition. Once landed, the slot cycles through all
 * three flavours on a slow crossfade, and scrolling back up reverses the
 * flight with the cycle reset to Barbecue Chicken - the pack that flies back
 * must be the one that left.
 *
 * Reduced motion skips the flight entirely and keeps the opacity-only cycle.
 */
export function PackLanding() {
  const slotRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  /* reduced motion skips the flight, so the slot starts life already landed.
     `landed` never appears in server markup, so the SSR false is harmless. */
  const [landed, setLanded] = useState(prefersReducedMotion);
  const landedRef = useRef(landed);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!mounted || prefersReducedMotion()) return;
    const hero = document.getElementById("hero-pack");
    const slot = slotRef.current;
    const fly = flyRef.current;
    if (!hero || !slot || !fly) return;

    /* A rAF loop rather than scroll/resize listeners: the slot also moves when
       layout settles around it (fonts, reveals, viewport chrome), and none of
       that fires a scroll event. Reads are two rects against clean layout, and
       writes only happen while something is actually moving. */
    let raf = 0;
    let prev = 0;
    let shown = false;
    let settled = false;
    /* which endpoint the pack is RESTING in: 0 the hero, 1 the slot. Takeoff
       used to guess this from `p > 0.5`, which broke on fast scrolls - a fling
       upward un-lands with p already deep below 0.5, so the clone spawned AT
       the hero instead of leaving the slot, and the return read as the pack
       snapping into the card. The resting end is a fact we already know;
       track it instead of inferring it. */
    let restAt: 0 | 1 = 0;
    /* last frame's scroll position, for telling a scrolled journey from a
       jump (navigation to /#story, a hash link, a Home key). null means no
       frame has run yet, which is itself a jump: arriving on the page deep
       enough to land counts. */
    let lastY: number | null = null;
    const cur = { x: 0, y: 0, k: 1, r: 0 };

    /*
     * Entrances for jump arrivals. When the visitor scrolls, the pack's
     * flight from the hero IS the story; but when they arrive by navigation
     * the same hero flight replayed every time reads as a canned loop. So a
     * jump arrival enters from the wings instead: stage left, stage right,
     * or up from below, picked at random per arrival. Offsets are fractions
     * of the viewport, applied around the slot target.
     */
    const WINGS = [
      { dx: -0.7, dy: 0.12, r: -18 },
      { dx: 0.7, dy: 0.12, r: 18 },
      { dx: 0, dy: 0.85, r: -10 },
    ];

    /* the slot starts empty - its pack arrives by flight. Done here rather
       than in the loop so the very first frame cannot show it twice. */
    slot.style.opacity = "0";

    const update = (now: number) => {
      raf = requestAnimationFrame(update);
      const dt = prev ? Math.min(now - prev, 64) : 16;
      prev = now;
      const vh = window.innerHeight;
      /* a detached or zero-sized viewport reports vh 0, which would poison the
         progress maths and hide the slot; leave the static render alone */
      if (!vh) return;
      const t = slot.getBoundingClientRect();
      const s = hero.getBoundingClientRect();
      /* touchdown once the slot's centre climbs to 60% of the viewport - a
         natural stopping point - rather than demanding it reach dead centre,
         which left the pack hanging mid-flight on screens where people stop
         scrolling a touch early */
      const d = t.top + t.height / 2 - vh * 0.6;
      const slotP = clamp01(1 - d / (vh * 0.85));
      /* the flight is also gated on the hero pack actually leaving: on tall
         viewports the slot is "close" while the hero is still fully on screen,
         and without the gate the pack would hang out of its card at rest */
      const gate = clamp01((vh * 0.3 - s.top) / (vh * 0.25));
      const p = Math.min(slotP, gate);

      /* more than one and a half viewports between frames is not scrolling,
         it is a navigation. Tracked before any early return so the next
         takeoff always has a fresh answer. */
      const yNow = window.scrollY;
      const jumped = lastY === null || Math.abs(yNow - lastY) > vh * 1.5;
      lastY = yNow;

      /* hysteresis: once down, stay down until the slot clearly retreats, so
         scroll jitter cannot flick the pack back into the air */
      const isLanded = landedRef.current ? p > 0.9 : p >= 1;
      if (isLanded !== landedRef.current) {
        landedRef.current = isLanded;
        setLanded(isLanded);
        /* the pack that flies back up must be the one that left */
        if (!isLanded) setActive(0);
      }

      /* parked: the real slot element owns the pixels now, and it scrolls with
         the page on its own. Chasing its viewport rect from here would re-enter
         flight on every scrolled frame and flicker the clone over the cycling
         stack - nothing to do until the un-land threshold is crossed. */
      if (isLanded && settled) return;

      /* docking is landing's mirror: when the scrub returns to zero the clone
         is NOT hidden where it happens to be - it keeps gliding home to the
         hero rect and only swaps for the original once it has arrived. Hiding
         at p=0 directly is what made the return read as an abrupt snap: the
         hero-side gate collapses fast on the way up, and the eased follower is
         still well behind the cliff when the cutoff hits.

         The rest check matters: skipping the frame is only right when the pack
         is already home. An instant jump to the top (Home key, anchor click)
         can put p at 0 while the pack still rests in the slot, and bailing
         here would strand it there with the hero left empty. */
      const docking = !isLanded && p <= 0;
      if (docking && !shown && restAt === 0) return;

      /* the scroll-derived target in DOCUMENT coordinates: scroll applies to
         the clone 1:1 (no swimming against fast scrolls), easing shapes only
         the actual travel along the page, and convergence is
         scroll-independent. Landed pins the target to the slot; docking pins
         it to the hero. */
      const sx = window.scrollX;
      const sy = window.scrollY;
      const at = (qq: number) => ({
        x: s.left + (t.left + (t.width - s.width) / 2 - s.left) * qq + sx,
        y: s.top + (t.top + (t.height - s.height) / 2 - s.top) * qq + sy,
        k: 1 + (t.width / s.width - 1) * qq,
      });
      const tgt = at(easeInOut(isLanded ? 1 : docking ? 0 : p));
      /* a lean into the travel, gone again at either end */
      const tr = isLanded || docking ? 0 : Math.sin(p * Math.PI) * -7;

      if (!shown) {
        if (jumped && isLanded) {
          /* arrival by navigation: enter from a random wing near the slot
             rather than replaying the hero flight, slightly small so the
             pack grows into its landing */
          const wing = WINGS[Math.floor(Math.random() * WINGS.length)];
          Object.assign(cur, {
            x: tgt.x + wing.dx * window.innerWidth,
            y: tgt.y + wing.dy * vh,
            k: tgt.k * 0.82,
            r: wing.r,
          });
        } else {
          /* taking off mid-scroll: start from the endpoint the pack is
             actually resting in, so it visibly leaves it no matter how
             violently the scroll position moved since the last frame */
          const start = at(restAt);
          Object.assign(cur, { x: start.x, y: start.y, k: start.k, r: 0 });
        }
        shown = true;
      } else {
        /* exponential follower: frame-rate independent, eases every gesture.
           The docking approach runs on a slower constant - the return is not
           scroll-scrubbed like the descent, it is a release, and the extra
           glide is what makes the arrival read as a landing instead of the
           pack teleporting the last stretch. */
        const a = 1 - Math.exp(-dt / (docking ? 150 : 90));
        cur.x += (tgt.x - cur.x) * a;
        cur.y += (tgt.y - cur.y) * a;
        cur.k += (tgt.k - cur.k) * a;
        cur.r += (tr - cur.r) * a;
      }

      const converged =
        Math.abs(cur.x - tgt.x) < 0.5 &&
        Math.abs(cur.y - tgt.y) < 0.5 &&
        Math.abs(cur.k - tgt.k) < 0.004;

      /* touchdown cushion: the swap is pixel-identical, so the receiving
         element can afford a small settle right after it takes over - the
         pack drops the last few pixels into place instead of stopping dead.
         Runs only in this effect, which reduced motion never enters. */
      const cushion = (el: HTMLElement) =>
        el.animate(
          [
            { transform: "translateY(-6px)" },
            { transform: "translateY(1.5px)", offset: 0.72 },
            { transform: "translateY(0px)" },
          ],
          { duration: 300, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
        );

      if (converged && isLanded) {
        if (!settled) {
          settled = true;
          shown = false;
          restAt = 1;
          fly.style.opacity = "0";
          slot.style.opacity = "";
          cushion(slot);
          /* while landed the hero pack stays gone - it lives downstairs now,
             and the hero tile's bottom sliver can still peek into the viewport
             at the landing threshold, which would otherwise show the pack
             twice */
          hero.style.opacity = "0";
        }
        return;
      }

      if (converged && docking) {
        /* home again: swap the clone for the original, pixel-identical */
        shown = false;
        restAt = 0;
        fly.style.opacity = "0";
        hero.style.opacity = "";
        slot.style.opacity = "0";
        cushion(hero);
        return;
      }

      settled = false;
      hero.style.opacity = "0";
      slot.style.opacity = "0";
      fly.style.width = `${s.width}px`;
      fly.style.transform = `translate3d(${cur.x - sx}px, ${cur.y - sy}px, 0) rotate(${cur.r}deg) scale(${cur.k})`;
      fly.style.opacity = "1";
    };
    raf = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf);
      hero.style.opacity = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (!landed) return;
    const id = setInterval(() => setActive((i) => (i + 1) % flavours.length), 2800);
    return () => clearInterval(id);
  }, [landed]);

  return (
    <div className="relative mx-auto w-[220px] shrink-0 sm:w-[300px]">
      {/* soft warm glow so the cut-out pack sits on the cream rather than floating.
          Deliberately outside the slot: while the pack is in flight this is the
          empty, lit stage it lands on. */}
      <div
        className="absolute -inset-x-20 -inset-y-6"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(224,83,46,0.22) 0%, rgba(91,18,32,0.10) 55%, transparent 72%)",
        }}
      />
      <div ref={slotRef} className="relative">
        {flavours.map((f, i) => (
          <Image
            key={f.slug}
            src={f.pack}
            alt={`Joey's ${f.name} crisps pack`}
            width={612}
            height={853}
            className={`${i === 0 ? "relative" : "absolute inset-0"} w-full drop-shadow-[0_22px_36px_rgba(59,13,20,0.4)] transition-[opacity,scale] duration-[520ms] ease-[cubic-bezier(0.2,0,0,1)] ${
              i === active ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
            }`}
          />
        ))}
      </div>

      {mounted &&
        createPortal(
          <div
            ref={flyRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 will-change-transform"
          >
            <Image
              src={flavours[0].pack}
              alt=""
              width={612}
              height={853}
              className="w-full drop-shadow-[0_24px_44px_rgba(0,0,0,0.5)]"
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
