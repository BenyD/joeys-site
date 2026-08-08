"use client";

import Image from "next/image";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";
import { MarkBatch, MarkVeg } from "./marks";
import { TLink } from "./ViewTransitions";

/**
 * Desktop mega menu for the pack range.
 *
 * A three-item list does not need a mega menu on information-density grounds;
 * it needs one because the packs are the product. Showing the actual bags,
 * on their own flavour colour, does more selling in one hover than a text list
 * ever will.
 *
 * It spans the nav container rather than hanging off the trigger, and grows
 * from top centre so the motion still points back at the word you hovered.
 */
export function PacksMegaMenu({
  state,
  onOpen,
  onClose,
}: {
  state: "closed" | "open" | "closing";
  onOpen: () => void;
  onClose: () => void;
}) {
  if (state === "closed") return null;

  return (
    <div
      className="absolute inset-x-0 top-full hidden lg:block"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-[1240px] px-6 pt-2.5">
        <div
          data-origin="top-center"
          className={`t-dropdown overflow-hidden rounded-[20px] bg-cream p-4 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.6)] ${
            state === "open" ? "is-open" : "is-closing"
          }`}
        >
          <div className="grid grid-cols-3 gap-3">
            {flavours.map((f) => (
              <TLink
                key={f.slug}
                href={`/flavours/${f.slug}`}
                onClick={onClose}
                className="group flex items-center gap-4 rounded-[15px] p-3 transition-colors duration-[180ms] hover:bg-ink/[0.05]"
              >
                {/* Same device as the flavour rail on the home page: the
                    flavour's ring colour as a circular frame, its dish
                    gradient behind, the chips-and-dish art inside. One
                    vocabulary for "a flavour" everywhere it appears. */}
                <span
                  className="block shrink-0 rounded-full p-[5px] transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1"
                  style={{ background: f.ring }}
                >
                  <span
                    className="flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full"
                    style={{ background: f.dishBg }}
                  >
                    <Image
                      src={f.dish}
                      alt=""
                      aria-hidden
                      width={500}
                      height={500}
                      className="h-[88px] w-[88px] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)] transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                    />
                  </span>
                </span>

                <span className="min-w-0">
                  <span className="head flex items-center gap-1.5 text-[15px] text-ink">
                    {f.name}
                    <ArrowRight
                      weight="bold"
                      className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-coral opacity-0 transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-ink/50">
                    {f.strap}
                  </span>
                  <span
                    className="eyebrow mt-3 inline-block rounded-[5px] px-2 py-1 uppercase"
                    style={{ background: f.band, color: f.bandInk }}
                  >
                    {site.pack.weight} for {site.pack.mrp}
                  </span>
                </span>
              </TLink>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 border-t-2 border-ink/10 px-3 pt-3.5">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[12.5px] text-ink/55">
                <MarkVeg className="h-5 w-5 shrink-0" />
                Every flavour certified 100% vegetarian
              </span>
              <span className="flex items-center gap-2 text-[12.5px] text-ink/55">
                <MarkBatch className="h-5 w-5 shrink-0" />
                Traceable to the batch
              </span>
            </div>
            <TLink
              href="/made"
              onClick={onClose}
              className="head group/all inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.05em] text-coral transition-colors duration-[180ms] hover:text-coral-dark"
            >
              How it&rsquo;s made
              <ArrowRight
                weight="bold"
                className="h-3.5 w-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/all:translate-x-1"
              />
            </TLink>
          </div>
        </div>
      </div>
    </div>
  );
}
