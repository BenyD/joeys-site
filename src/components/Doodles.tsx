/**
 * Line-art wallpaper used behind the dark and gold bands - the reference's
 * scattered food doodles, redrawn around Joey's own vocabulary: crisps,
 * potatoes, flame, the concentric ring mark, a prawn, a martini glass.
 *
 * `clearCentre` masks the middle out so the pattern crowds the edges and leaves
 * the type sitting on flat colour. An even tile behind a headline reads as
 * noise; pushed to the perimeter the same pattern frames the words instead,
 * which is what it is there to do. It also buys back enough contrast to run the
 * pattern denser at the edges than a full-bleed tile could afford.
 */
export function Doodles({
  className = "",
  color = "currentColor",
  opacity = 0.16,
  scale = 1,
  clearCentre = false,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  scale?: number;
  clearCentre?: boolean;
}) {
  const centreMask =
    "radial-gradient(ellipse 46% 58% at 50% 50%, transparent 0%, transparent 42%, #000 92%)";
  const id = `doodle-${Math.round(scale * 1000)}-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        opacity,
        ...(clearCentre
          ? { WebkitMaskImage: centreMask, maskImage: centreMask }
          : null),
      }}
    >
      <defs>
        <pattern
          id={id}
          width={320 * scale}
          height={280 * scale}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(-4)`}
        >
          <g
            fill="none"
            stroke={color}
            strokeWidth={2.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`scale(${scale})`}
          >
            {/* crisp */}
            <path d="M22 42c-8-10-6-22 5-26s24 3 27 13-4 19-14 19c-7 0-13-1-18-6z" />
            <path d="M30 28c4-3 10-3 14 1" />
            {/* concentric rings mark */}
            <ellipse cx="140" cy="34" rx="30" ry="21" />
            <ellipse cx="140" cy="34" rx="21" ry="14" />
            <ellipse cx="140" cy="34" rx="12" ry="7" />
            {/* flame */}
            <path d="M248 48c-9 0-15-6-15-14 0-9 9-13 11-24 6 6 13 10 15 18 1 5 0 9-2 12" />
            <path d="M248 48c5-2 8-6 8-11" />
            {/* potato */}
            <path d="M60 128c-14 4-22-6-19-18 3-13 20-22 33-18s15 18 8 26-14 7-22 10z" />
            <path d="M70 118c1.5 0 2 1 2 2M80 108c1.5 0 2 1 2 2M62 106c1.5 0 2 1 2 2" />
            {/* martini / prawn cocktail glass */}
            <path d="M172 104h44l-22 24z" />
            <path d="M194 128v22M182 152h24" />
            {/* prawn */}
            <path d="M264 118c14-4 26 4 26 16 0 9-7 16-16 16-8 0-13-4-16-10" />
            <path d="M258 140c6 0 10 4 10 10M290 128l8-6M284 122l4-8" />
            {/* bacon rasher */}
            <path d="M30 212c14-10 28 2 42-8s26 2 40-8" />
            <path d="M34 226c14-10 28 2 42-8s26 2 40-8" />
            <path d="M30 212l4 14M112 202l4 14" />
            {/* pack silhouette */}
            <path d="M196 196h44l-4 60h-36z" />
            <path d="M196 196l-6-10h56l-6 10M200 256l-4 8h44l-4-8" />
            <path d="M206 216h24" />
            {/* star */}
            <path d="M286 200l4 10 11 1-8 8 2 11-9-6-9 6 2-11-8-8 11-1z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
