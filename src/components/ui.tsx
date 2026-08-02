import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";
import { TLink } from "./ViewTransitions";

/* ── The little tilted tag that sits above every section heading ── */
export function Pill({
  children,
  tone = "gold",
  className = "",
}: {
  children: ReactNode;
  tone?: "gold" | "coral" | "cream" | "ink";
  className?: string;
}) {
  const tones = {
    gold: "bg-gold text-ink",
    coral: "bg-coral text-cream",
    cream: "bg-cream text-ink",
    ink: "bg-ink text-gold",
  };
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`eyebrow inline-block rounded-[5px] px-2.5 py-1 uppercase ${tones[tone]}`}
      >
        {children}
      </span>
      {/* the tiny cursor arrow from the reference */}
      <svg
        aria-hidden
        viewBox="0 0 12 14"
        className="absolute -left-2 -top-2.5 h-3 w-2.5 fill-ink"
      >
        <path d="M0 0l11 6.2-4.6 1.1L4.1 13z" />
      </svg>
    </span>
  );
}

const btnBase =
  "pressable head group/btn inline-flex items-center justify-center gap-2.5 rounded-[11px] uppercase tracking-[0.03em]";

/*
 * Buttons are set by height, not by vertical padding.
 *
 * The reference runs its buttons at roughly 55-65px with type around 15px; the
 * first pass here was ~42px with 13px type, which read as a link in a box next
 * to headlines this heavy. Height also clears the 44px touch minimum on mobile
 * without needing a separate rule.
 */
const btnSizes = {
  md: "min-h-[54px] px-7 text-[14px]",
  lg: "min-h-[58px] px-7 text-[15px] sm:min-h-[62px] sm:px-8 sm:text-[16px]",
} as const;

const btnTones = {
  coral: "bg-coral text-cream hover:bg-coral-dark",
  gold: "bg-gold text-ink hover:bg-gold-deep",
  cream: "bg-cream text-ink hover:bg-white",
  ink: "bg-ink text-cream hover:bg-[#25070c]",
} as const;

export function ArrowButton({
  href,
  children,
  tone = "coral",
  size = "md",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof btnTones;
  size?: keyof typeof btnSizes;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <TLink
      href={href}
      className={`${btnBase} ${btnSizes[size]} ${btnTones[tone]} ${className}`}
      {...rest}
    >
      {children}
      {/* the arrow nudges forward on hover, which is the whole point of an arrow */}
      <ArrowRight
        weight="bold"
        className={`shrink-0 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/btn:translate-x-1 ${
          size === "lg" ? "h-[18px] w-[18px]" : "h-4 w-4"
        }`}
      />
    </TLink>
  );
}

/* ── Two-tone display heading: "PLAIN <em>ACCENT</em> PLAIN" ── */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-coral">{children}</span>;
}
