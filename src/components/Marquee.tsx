import {
  Asterisk,
  Barcode,
  Cookie,
  Flame,
  Leaf,
  Package,
  Star,
  type Icon,
} from "./icons";

const marks = {
  crisp: Cookie,
  leaf: Leaf,
  flame: Flame,
  star: Star,
  ring: Asterisk,
  pack: Package,
  batch: Barcode,
} satisfies Record<string, Icon>;

export type MarqueeItem = { icon: keyof typeof marks; label: string };

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

  const run = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item, i) => {
        const Mark = marks[item.icon];
        return (
          <span
            key={i}
            className="head flex items-center gap-2.5 px-5 py-3 text-[13px] uppercase tracking-[0.02em] sm:px-7 sm:text-[15px]"
          >
            <Mark weight="duotone" className="h-[18px] w-[18px] shrink-0" />
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
