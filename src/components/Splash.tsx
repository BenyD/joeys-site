"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";
import { Doodles } from "./Doodles";
import { Marquee, type MarqueeItem } from "./Marquee";
import {
  MarkCrisp,
  MarkFlame,
  MarkMartini,
  MarkOil,
  MarkPotato,
  MarkSalt,
  MarkSeasoning,
  MarkStar,
  type Mark,
} from "./marks";

/*
 * First-visit splash: the full opening number. A rain of crisps in the flavour
 * colours tumbles down the screen, two tilted marquee bands slide in carrying
 * the flavour names and the pack facts, the neon logo flickers itself on like
 * a real sign warming up, and the tagline follows. Then the whole curtain
 * lifts away to reveal the page.
 *
 * Shown once per tab session, and on that first showing it doubles as the
 * site's loading screen: the curtain holds until the page behind it has
 * finished loading (bounded by a ceiling), so the reveal always lands on a
 * complete hero. Three layers of defence keep it from getting in the way on
 * any visit after the first:
 *
 *   1. A pre-paint script in the layout head reads sessionStorage and sets
 *      `data-splash-seen` on <html>; CSS hides the splash before first paint,
 *      so repeat visits never see a flash of it.
 *   2. This component checks the same key on mount and unmounts immediately.
 *   3. Without JS the layout's <noscript> style hides it entirely, so the
 *      overlay can never trap the page behind itself.
 *
 * The overlay is server-rendered so the first visit is covered from the very
 * first paint rather than popping in after hydration. It is aria-hidden and
 * purely decorative: the nav underneath carries the real logo and landmarks,
 * and any click or key skips straight to the exit.
 */

/*
 * Once per tab session. To watch the splash again while working on it, clear
 * this key in devtools (sessionStorage.removeItem) or open a fresh tab.
 */
const KEY = "joeys-splash-seen";

/** The minimum show: the choreography gets to play out even on a fast cache. */
const HOLD = 2600;
const HOLD_REDUCED = 900;
/** Never hold the curtain longer than this waiting on the network. */
const CEILING = 6500;
/** Matches the exit transition in globals.css, plus a beat for safety. */
const EXIT = 700;

const CREAM = "#fbf3e4";

/*
 * The recipe rain. Not just crisps: the whole pantry falls — potatoes, oil
 * drops, the salt shaker, the chilli, the barbecue flame, the prawn-cocktail
 * martini — each in its own baked mark colour, with crisps in the flavour
 * ring colours threaded between them. Hand-authored, not generated: SSR
 * renders this too, so the scatter has to be deterministic, and a dozen
 * values tuned by eye beat a seeded RNG for reading as pleasantly
 * accidental. Negative delays start everything mid-fall, so the screen is
 * already alive on the first frame. `back` items are smaller, dimmer and
 * blurred: a cheap depth-of-field.
 *
 * Lane discipline: no sharp foreground item crosses the logo. The straight
 * front lanes live in the outer thirds; the back layer may drift behind the
 * sign because it reads as the far plane. The only front items aimed at the
 * middle are the two `deflect` lanes - always crisps, the product bounces
 * off its own sign - which hit and ricochet: squash on contact, a rebound
 * arc that pops up and outward (`deflect` is the kick direction, -1 left or
 * 1 right; the magnitude lives in the CSS), faster spin after, and a
 * shockwave ping. Post-impact they layer in FRONT of the sign, knocked
 * toward the camera. Their timing is load-bearing: with impact at 52% of
 * the cycle, lane A (4.6s, -1.5s) connects at ~0.89s and lane B (5.2s,
 * -0.4s) at ~2.30s, which is what the sign's knock animation is
 * choreographed against. Touch a duration or delay here and
 * joeys-splash-knock needs retuning.
 */
const RINGS = [flavours[0].ring, flavours[1].ring, flavours[2].ring];
type RainDrop = {
  left: string;
  size: number;
  dur: number;
  delay: number;
  spin: 1 | -1;
  back: boolean;
  deflect: -1 | 1 | null;
  mark: Mark;
  /** Only crisps take a fill; every other mark wears its baked colour. */
  fill?: string;
};
const rain: RainDrop[] = [
  { left: "4%", size: 34, dur: 6.2, delay: -4.1, spin: 1, back: true, deflect: null, mark: MarkOil },
  { left: "11%", size: 52, dur: 4.6, delay: -1.3, spin: -1, back: false, deflect: null, mark: MarkCrisp, fill: RINGS[0] },
  { left: "19%", size: 30, dur: 7.1, delay: -5.6, spin: -1, back: true, deflect: null, mark: MarkMartini },
  { left: "27%", size: 44, dur: 5.0, delay: -2.8, spin: 1, back: false, deflect: null, mark: MarkPotato },
  { left: "36%", size: 26, dur: 6.6, delay: -0.9, spin: 1, back: true, deflect: null, mark: MarkCrisp, fill: RINGS[1] },
  { left: "46%", size: 56, dur: 4.6, delay: -1.5, spin: -1, back: false, deflect: -1, mark: MarkCrisp, fill: RINGS[2] },
  { left: "52.5%", size: 48, dur: 5.2, delay: -0.4, spin: 1, back: false, deflect: 1, mark: MarkCrisp, fill: RINGS[0] },
  { left: "58%", size: 30, dur: 7.4, delay: -2.2, spin: 1, back: true, deflect: null, mark: MarkFlame },
  { left: "72%", size: 34, dur: 6.0, delay: -4.8, spin: -1, back: true, deflect: null, mark: MarkSalt },
  { left: "80%", size: 42, dur: 5.4, delay: -1.7, spin: -1, back: false, deflect: null, mark: MarkSeasoning },
  { left: "88%", size: 28, dur: 6.9, delay: -3.0, spin: 1, back: true, deflect: null, mark: MarkCrisp, fill: RINGS[2] },
  { left: "95%", size: 50, dur: 4.4, delay: -2.4, spin: -1, back: false, deflect: null, mark: MarkFlame },
];

/*
 * The landed trio in the foreground, one crisp per flavour in that flavour's
 * ring colour. Positions and tumbles are hand-placed around the logo: the
 * scatter has to look accidental while staying balanced.
 */
const trio = [
  { ring: RINGS[0], cls: "-left-20 -top-10 h-16 w-16 sm:-left-32 sm:-top-12 sm:h-20 sm:w-20", tumble: "-22deg", delay: "160ms" },
  { ring: RINGS[1], cls: "-right-14 -top-16 h-12 w-12 sm:-right-24 sm:-top-20 sm:h-16 sm:w-16", tumble: "26deg", delay: "320ms" },
  { ring: RINGS[2], cls: "-bottom-8 -right-20 h-14 w-14 sm:-bottom-10 sm:-right-32 sm:h-[72px] sm:w-[72px]", tumble: "-9deg", delay: "470ms" },
];

/* Neon-sign sparkle ticks, twinkling on a stagger around the logo. */
const sparks = [
  { cls: "-left-24 top-0 h-7 w-7 sm:-left-44 sm:-top-4", delay: "700ms" },
  { cls: "-right-24 -top-24 h-5 w-5 sm:-right-40 sm:-top-28", delay: "1250ms" },
  { cls: "-left-16 -bottom-16 h-5 w-5 sm:-left-28 sm:-bottom-20", delay: "1800ms" },
];

/*
 * Marquee runs. Each list is repeated so the two copies the Marquee renders
 * are both wider than any viewport; a short run would leave a visible gap in
 * the loop.
 */
const flavourItems: MarqueeItem[] = Array.from({ length: 3 }).flatMap(() =>
  flavours.map((f) => ({ icon: "crisp" as const, label: f.name })),
);
const packItems: MarqueeItem[] = Array.from({ length: 3 }).flatMap(() => [
  { icon: "leaf" as const, label: site.pack.vegetarian },
  { icon: "pack" as const, label: `${site.pack.weight} pack` },
  { icon: "star" as const, label: `MRP ${site.pack.mrp}` },
  { icon: "flame" as const, label: "Made in India" },
]);

export function Splash() {
  const [phase, setPhase] = useState<"showing" | "exiting" | "done">("showing");
  const exiting = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLDivElement>(null);

  /*
   * The collision lanes aim at wherever the sign actually is. The contact
   * altitude used to be a per-breakpoint vh constant, which only hit on the
   * viewport it was tuned against; instead the sign's box is measured here
   * and published as --sign-top, and each bouncer derives its own contact
   * offset from it. Measuring the glow wrapper, not the img, keeps the knock
   * and ignition transforms out of the reading, and a resize re-measures so
   * a rotated phone still connects.
   */
  useEffect(() => {
    const measure = () => {
      const sign = signRef.current;
      const root = rootRef.current;
      if (sign && root) {
        root.style.setProperty("--sign-top", `${sign.getBoundingClientRect().top}px`);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const beginExit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    // Written at exit start, not exit end, so a reload mid-lift still counts
    // as seen rather than replaying the whole show.
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: the splash simply replays next load */
    }
    delete document.documentElement.dataset.splashOpen;
    setPhase("exiting");
    window.setTimeout(() => setPhase("done"), EXIT);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* unreadable storage: treat as unseen */
    }
    if (seen) {
      // The pre-paint gate in the layout head has already hidden the splash
      // via CSS, so unmounting can wait a tick; deferring keeps this effect
      // from setting state synchronously and cascading a render.
      exiting.current = true;
      const t = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(t);
    }

    // Scroll lock for the length of the show; released when the exit begins so
    // the page is live the moment the curtain starts to lift.
    document.documentElement.dataset.splashOpen = "1";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * The splash doubles as the site's loading screen. The curtain lifts only
     * once BOTH the minimum show has played AND the page behind it has
     * finished loading (window load: pack shots, dish art, the lot). On a
     * fast connection the load wins the race and the timing feels identical;
     * on a slow first visit the show simply keeps running - the rain and the
     * marquees loop - instead of lifting onto a half-loaded hero. The ceiling
     * guarantees one broken resource can never trap the visitor behind the
     * curtain, and a click or key still skips everything at any moment.
     */
    let minDone = false;
    let loaded = document.readyState === "complete";
    const maybeExit = () => {
      if (minDone && loaded) beginExit();
    };
    const min = window.setTimeout(() => {
      minDone = true;
      maybeExit();
    }, reduce ? HOLD_REDUCED : HOLD);
    const onLoad = () => {
      loaded = true;
      maybeExit();
    };
    window.addEventListener("load", onLoad);
    const ceiling = window.setTimeout(beginExit, CEILING);

    // Keyboard skip. Pointer skip lives on the overlay itself.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") beginExit();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(ceiling);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.splashOpen;
    };
  }, [beginExit]);

  if (phase === "done") return null;

  return (
    <div
      id="splash"
      ref={rootRef}
      aria-hidden="true"
      onPointerDown={beginExit}
      className={phase === "exiting" ? "splash-exit" : undefined}
    >
      {/* The concentric pack device, barely there, so the dark is not flat. */}
      <div className="ripple pointer-events-none absolute inset-0 opacity-70" />
      {/* The brand's doodle wallpaper, pushed to the edges like the gold band. */}
      <Doodles color={CREAM} opacity={0.055} clearCentre />

      {/* Recipe rain, behind everything that has to be read. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {rain.map((r, i) => (
          <div
            key={i}
            className={`splash-rain absolute ${r.back ? "splash-rain-back" : ""} ${
              r.deflect ? "splash-rain-bounce" : ""
            }`}
            style={
              {
                left: r.left,
                width: r.size,
                height: r.size,
                "--rain-dur": `${r.dur}s`,
                "--rain-delay": `${r.delay}s`,
                "--spin": r.spin,
                ...(r.deflect
                  ? {
                      "--dir": r.deflect,
                      /* Where this crisp's top edge sits when its lower edge
                         meets the sign's measured top. */
                      "--contact-y": `calc(var(--sign-top, 31vh) - ${r.size}px)`,
                    }
                  : null),
              } as React.CSSProperties
            }
          >
            {r.fill ? (
              <MarkCrisp fill={r.fill} ink={CREAM} className="h-full w-full" />
            ) : (
              <r.mark ink={CREAM} className="h-full w-full" />
            )}
            {/* Shockwave ring, keyed to the same clock so it fires on contact. */}
            {r.deflect ? <span className="splash-ping" /> : null}
          </div>
        ))}
      </div>

      {/* Marquee bands, tilted opposite ways like the reference's pill labels. */}
      <div
        className="splash-band"
        style={
          {
            top: "7%",
            "--band-tilt": "-2deg",
            "--band-from": "-180%",
            "--band-delay": "260ms",
          } as React.CSSProperties
        }
      >
        <Marquee items={flavourItems} tone="gold" duration={16} />
      </div>
      <div
        className="splash-band"
        style={
          {
            bottom: "7%",
            "--band-tilt": "2.2deg",
            "--band-from": "180%",
            "--band-delay": "420ms",
          } as React.CSSProperties
        }
      >
        <Marquee items={packItems} tone="coral" reverse duration={18} />
      </div>

      <div className="relative flex flex-col items-center">
        {trio.map((c) => (
          <MarkCrisp
            key={c.ring}
            fill={c.ring}
            ink={CREAM}
            className={`splash-crisp absolute ${c.cls}`}
            style={{ "--tumble": c.tumble, "--splash-delay": c.delay } as React.CSSProperties}
          />
        ))}

        {sparks.map((s, i) => (
          <MarkStar
            key={i}
            ink={CREAM}
            className={`splash-spark absolute ${s.cls}`}
            style={{ "--spark-delay": s.delay } as React.CSSProperties}
          />
        ))}

        {/* Glow on the outer wrapper, ignition on the image, and the knock on
            its own layer between them: each animates a different property, and
            an element can only carry one animation shorthand at a time. The
            knock is the sign reacting to the two deflect-lane crisps hitting
            it; its keyframe times are choreographed against their impact
            moments, documented on the rain table above. */}
        <div
          ref={signRef}
          className="neon-flicker"
          style={{
            filter:
              "drop-shadow(0 0 30px rgba(245,185,33,0.28)) drop-shadow(0 0 10px rgba(224,83,46,0.4))",
          }}
        >
          <div className="splash-knock">
            <Image
              src="/joeys-logo.png"
              alt=""
              width={900}
              height={688}
              priority
              className="splash-ignite w-[168px] sm:w-[216px]"
            />
          </div>
        </div>

        <p className="eyebrow splash-fade mt-6 uppercase text-gold">{site.tagline}</p>
      </div>
    </div>
  );
}
