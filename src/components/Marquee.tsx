import {
  Asterisk,
  Barcode,
  Flame,
  Leaf,
  Package,
  Star,
  type Icon,
} from "./icons";
import { MarkCrisp } from "./marks";

/* The crisp is the one brand-drawn mark in the set: Phosphor's Cookie read as
   a chocolate-chip cookie next to the word "crisps". It renders through the
   hand-drawn MarkCrisp instead, coloured per tone below. */
const marks = {
  leaf: Leaf,
  flame: Flame,
  star: Star,
  ring: Asterisk,
  pack: Package,
  batch: Barcode,
} satisfies Record<string, Icon>;

export type MarqueeItem = { icon: keyof typeof marks | "crisp"; label: string };

export function Marquee({
  items,
  tone = "gold",
  reverse = false,
  duration = 34,
}: {
  items: MarqueeItem[];
  tone?: "gold" | "coral" | "cream" | "ink";
  reverse?: boolean;
  duration?: number;
}) {
  const tones = {
    gold: "bg-gold text-ink",
    coral: "bg-coral text-cream",
    cream: "bg-cream-deep text-ink",
    ink: "bg-ink text-cream",
  };

  /* MarkCrisp needs real colours, not currentColor: the outline matches the
     tone's text, and the fill is whichever of cream or gold is not already
     the band's own background. */
  const crispColours = {
    gold: { ink: "#3b0d14", fill: "#fbf3e4" },
    coral: { ink: "#fbf3e4", fill: "#f5b921" },
    cream: { ink: "#3b0d14", fill: "#f5b921" },
    ink: { ink: "#fbf3e4", fill: "#f5b921" },
  }[tone];

  const run = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item, i) => {
        const iconCls = "h-[18px] w-[18px] shrink-0";
        const Mark = item.icon === "crisp" ? null : marks[item.icon];
        return (
          <span
            key={i}
            className="head flex items-center gap-2.5 px-5 py-3 text-[13px] uppercase tracking-[0.02em] sm:px-7 sm:text-[15px]"
          >
            {Mark ? (
              <Mark weight="duotone" className={iconCls} />
            ) : (
              <MarkCrisp className={iconCls} ink={crispColours.ink} fill={crispColours.fill} />
            )}
            {item.label}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${tones[tone]}`}>
      {/* constant motion, so linear easing: any curve would read as a stutter */}
      <div
        className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {run}
        {run}
      </div>
      <span className="sr-only">{items.map((i) => i.label).join(". ")}</span>
    </div>
  );
}
