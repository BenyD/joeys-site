"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";
import { ArrowRight, EnvelopeSimple } from "./icons";
import { TLink } from "./ViewTransitions";

type Item = { label: string; href: string };

/**
 * Full-height mobile sheet.
 *
 * Spatial consistency: it comes down from the nav and leaves the same way, so
 * the burger always reads as the thing it is attached to. Rows stagger in at
 * 45ms steps, which lands as one gesture rather than a queue.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  links: Item[];
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Lock the page behind the sheet, and give Escape back to the user.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const depth = (p: string) => p.split("/").filter(Boolean).length;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
      inert={!open ? true : undefined}
      /*
       * Named only while open, and that name is load-bearing.
       *
       * This sheet lives inside <header>, which is itself named
       * `persistent-nav` and told not to animate so the bar holds still while
       * pages slide underneath. Without its own name the open sheet is part
       * of that frozen snapshot, so tapping a link left the whole menu
       * hanging over the incoming page as a still image until the transition
       * ended, then blinking out.
       *
       * A named descendant is captured as its own group instead. By the time
       * the transition commits, this has closed and given the name up, so the
       * group is old-only: an exit animation, styled in globals.css.
       */
      style={{ viewTransitionName: open ? "mobile-menu" : undefined }}
      className={`fixed inset-x-0 bottom-0 top-[70px] z-40 overflow-y-auto overscroll-contain bg-ink transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <h2 id={titleId} className="sr-only">
        Menu
      </h2>

      <div className="flex min-h-full flex-col px-5 pb-10 pt-6">
        {/* flavours, as real cards rather than a text list */}
        <p className="eyebrow mb-3 uppercase text-cream/40">Our three flavours</p>
        <ul className="space-y-2.5">
          {flavours.map((f, i) => (
            <li
              key={f.slug}
              className="transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                transitionDelay: open ? `${90 + i * 45}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(10px)",
              }}
            >
              <TLink
                href={`/flavours/${f.slug}`}
                onClick={onClose}
                className="pressable flex items-center gap-4 rounded-2xl p-3"
                style={{ background: f.base }}
              >
                <span
                  className="block shrink-0 rounded-full p-[3px]"
                  style={{ background: f.ring }}
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full"
                    style={{ background: f.dishBg }}
                  >
                    <Image
                      src={f.dish}
                      alt=""
                      aria-hidden
                      width={500}
                      height={500}
                      className="h-12 w-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
                    />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="head block text-[16px] text-cream">{f.name}</span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-cream/50">
                    {f.strap}
                  </span>
                </span>
                <ArrowRight weight="bold" className="h-4 w-4 shrink-0 text-cream/40" />
              </TLink>
            </li>
          ))}
        </ul>

        {/* sections */}
        <p className="eyebrow mb-1 mt-8 uppercase text-cream/40">Explore</p>
        <ul>
          {links.map((l, i) => (
            <li
              key={l.href}
              className="transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                transitionDelay: open ? `${225 + i * 45}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(10px)",
              }}
            >
              <TLink
                href={l.href}
                onClick={onClose}
                className="head flex min-h-[56px] items-center justify-between border-b border-cream/10 text-[17px] text-cream"
              >
                {l.label}
                <ArrowRight weight="bold" className="h-4 w-4 text-cream/30" />
              </TLink>
            </li>
          ))}
        </ul>

        <div
          className="mt-auto pt-10 transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transitionDelay: open ? "420ms" : "0ms",
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateY(10px)",
          }}
        >
          <TLink
            href="/contact"
            onClick={onClose}
            className="pressable head flex min-h-[54px] items-center justify-center gap-2.5 rounded-[12px] bg-coral text-[14px] uppercase tracking-[0.04em] text-cream"
          >
            Get in touch
            <ArrowRight weight="bold" className="h-4 w-4" />
          </TLink>
          <a
            href={`mailto:${site.supportEmail}`}
            className="mt-4 flex items-center justify-center gap-2 text-[13px] text-cream/45"
          >
            <EnvelopeSimple weight="duotone" className="h-4 w-4" />
            {site.supportEmail}
          </a>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-cream/25">
            {site.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
