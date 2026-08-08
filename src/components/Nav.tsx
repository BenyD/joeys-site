"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flavours } from "@/lib/flavours";
import { ArrowRight, CaretDown } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { PacksMegaMenu } from "./PacksMegaMenu";
import { TLink } from "./ViewTransitions";

const left = [
  { label: "Flavours", href: "/#flavours" },
  { label: "What's inside", href: "/#inside" },
];
/* No plain "Contact" link here: the CTA button IS the contact entry point,
   and listing both sent two links to the same place from the same cluster.
   The mobile menu keeps its own "Get in touch" button for the same job. */
const right = [
  { label: "How it's made", href: "/made" },
  { label: "Our story", href: "/#story" },
];

// Scaled with the bar: 11px links under a 42px button in a 70px bar read as an
// afterthought. Tracking eases off slightly as the size goes up.
const linkCls =
  "head text-[13px] uppercase tracking-[0.055em] text-cream/85 transition-colors duration-[180ms] hover:text-gold";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [packs, setPacks] = useState<"closed" | "open" | "closing">("closed");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPacks = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPacks("open");
  };
  const closePacks = () => {
    setPacks((s) => (s === "open" ? "closing" : s));
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPacks("closed"), 140);
  };
  useEffect(() => () => void (closeTimer.current && clearTimeout(closeTimer.current)), []);

  // Escape closes the mega menu, same as any other transient surface.
  useEffect(() => {
    if (packs !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePacks();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [packs]);

  return (
    // pulled out of the page snapshot so it holds still while routes slide underneath
    <header
      className="sticky top-0 z-50 bg-ink"
      style={{ viewTransitionName: "persistent-nav" }}
    >
      <nav className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* left cluster, desktop */}
        <div className="hidden flex-1 items-center gap-6 lg:flex">
          {left.map((l) => (
            <TLink key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </TLink>
          ))}
          <button
            className={`${linkCls} flex h-[70px] items-center gap-1.5`}
            type="button"
            aria-expanded={packs === "open"}
            onMouseEnter={openPacks}
            onMouseLeave={closePacks}
            onFocus={openPacks}
            onClick={() => (packs === "open" ? closePacks() : openPacks())}
          >
            Our packs
            <CaretDown
              weight="bold"
              className={`h-3 w-3 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                packs === "open" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* wordmark */}
        <TLink
          href="/"
          className="pressable flex shrink-0 items-center"
          aria-label="Joey's, home"
        >
          <Image
            src="/joeys-logo.png"
            alt="Joey's"
            width={900}
            height={688}
            priority
            className="h-11 w-auto sm:h-[52px]"
          />
        </TLink>

        {/* right cluster, desktop */}
        <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
          {right.map((l) => (
            <TLink key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </TLink>
          ))}
          <TLink
            href="/contact"
            className="pressable head group/cta inline-flex min-h-[42px] items-center gap-2 rounded-[10px] border-2 border-gold px-5 text-[13px] uppercase tracking-[0.05em] text-gold hover:bg-gold hover:text-ink"
          >
            Contact
            <ArrowRight
              weight="bold"
              className="h-3.5 w-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cta:translate-x-0.5"
            />
          </TLink>
        </div>

        {/* burger, mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-[2px] w-5 bg-cream transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-5 bg-cream transition-opacity duration-[140ms] ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-5 bg-cream transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <PacksMegaMenu state={packs} onOpen={openPacks} onClose={closePacks} />

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={[...left, ...right]}
        pathname={pathname}
      />
    </header>
  );
}
