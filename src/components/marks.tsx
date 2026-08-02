import type { SVGProps } from "react";

/**
 * Joey's illustration set.
 *
 * Hand-drawn rather than pulled from an icon library, because the reference's
 * marks are two-tone line illustrations: one flat colour shape, a heavy ink
 * outline over it, rounded joins, and the occasional motion tick. No icon pack
 * ships that look, and the emoji we started with read as a placeholder.
 *
 * House rules, so anything added later still matches:
 *   - 48x48 viewBox, stroke 2.6, round caps and joins
 *   - exactly one fill colour per mark, always under the ink outline
 *   - outline is --color-ink, never black
 *   - motion ticks (heat, steam, sparkle) sit outside the silhouette
 *
 * Phosphor still handles pure UI chrome (arrows, carets, envelope); this set is
 * only for the brand marks.
 */

const INK = "#3b0d14";

export type MarkProps = SVGProps<SVGSVGElement> & {
  title?: string;
  /**
   * Outline colour. Defaults to the brand ink, which is correct on cream but
   * disappears on the dark bands: ink on maroon is barely a value change, so
   * the line work vanishes and the mark collapses into a flat blob of fill.
   * Pass the cream on anything dark.
   */
  ink?: string;
};

function Svg({ title, children, ink = INK, ...rest }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke={ink}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {children}
      </g>
    </svg>
  );
}

/* ── Flame: the barbecue mark ── */
export function MarkFlame(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M24 44.5c-8.7 0-15-5.8-15-13.6 0-9.6 8.2-14 9.6-25.4 4.6 4.2 7.4 8.4 8.4 12.6 1.7-3 3.6-5.4 3.6-5.4 3.4 6.6 8.4 11.2 8.4 18.2 0 7.8-6.3 13.6-15 13.6Z"
        fill="#e0532e"
      />
      <path
        d="M24 44.5c-4.5 0-7.8-3.2-7.8-7.5 0-5.3 4.3-7.7 5.1-13.3 2.7 2.6 4.4 4.9 5.1 7.4.9-1.6 1.8-2.9 1.8-2.9 1.9 3.5 3.6 5.6 3.6 8.8 0 4.3-3.3 7.5-7.8 7.5Z"
        fill="#f5b921"
      />
    </Svg>
  );
}

/* ── Leaf in a bowl: certified vegetarian ── */
export function MarkVeg(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M7 25h34v4a13 13 0 0 1-13 13h-8A13 13 0 0 1 7 29v-4Z" fill="#3f8f52" />
      <path d="M5 25h38" />
      <path d="M24 22c0-7 5.5-12 13-12 0 7-5.5 12-13 12Z" fill="#3f8f52" />
      <path d="M24 22c-1.5-4.5-4.5-7-9-7.5" />
    </Svg>
  );
}

/* ── Fryer with heat ticks: potato, oil, and not much else ── */
export function MarkFryer(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M9 22h30v9a10 10 0 0 1-10 10H19A10 10 0 0 1 9 31v-9Z" fill="#f5b921" />
      <path d="M6 22h36" />
      <path d="M39 26h4a3 3 0 0 1 0 6h-4" />
      <path d="M17 15V9M24 13V6M31 15V9" />
    </Svg>
  );
}

/* ── Coded pack: batch traceability ── */
export function MarkBatch(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M12 14h24l-2 27H14L12 14Z" fill="#e0532e" />
      <path d="M12 14l-3-6h30l-3 6" />
      <path d="M19 24v9M24 24v9M29 24v9M33 24v9" />
    </Svg>
  );
}

/* ── Potato ── */
export function MarkPotato(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M6.5 25.5c0-8 8-14.5 18-15.5 9.5-1 17 3.5 17 11 0 9-9 16.5-19.5 16.5C13 37.5 6.5 32.5 6.5 25.5Z"
        fill="#c98a4b"
      />
      <path d="M16 21h.02M25 16.5h.02M32 24h.02M21 29h.02" strokeWidth={3.6} />
    </Svg>
  );
}

/* ── Oil drop ── */
export function MarkOil(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M24 6.5c8.4 10.4 13.5 15.7 13.5 22.6A13.5 13.5 0 0 1 24 42.5 13.5 13.5 0 0 1 10.5 29.1C10.5 22.2 15.6 16.9 24 6.5Z"
        fill="#f5b921"
      />
      <path d="M18 29a6 6 0 0 0 4.5 5.8" />
    </Svg>
  );
}

/* ── Salt shaker with a coastal wave ── */
export function MarkSalt(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M15 22h18l2 20H13l2-20Z" fill="#8fb8d8" />
      <path d="M15 22v-3.5a9 9 0 0 1 18 0V22Z" fill="#8fb8d8" />
      <path d="M15 22h18" />
      <path d="M20 15h.02M24 13.5h.02M28 15h.02" strokeWidth={3.6} />
      <path d="M13.8 32h20.4" />
    </Svg>
  );
}

/* ── Seasoning: chilli with a sparkle ── */
export function MarkSeasoning(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M11 30.5c0-8.6 7-15.5 15.5-15.5H34v4c0 10.5-8.5 19-19 19h-4v-7.5Z"
        fill="#c8104c"
      />
      <path d="M28 15c1.5-3.5 4-5.5 7.5-6" />
      <path d="M35.5 9h5" />
    </Svg>
  );
}

/*
 * The Indian vegetarian mark: a green dot inside a green square outline.
 * Regulated, printed on every Joey's pack, and instantly read by the people
 * this site is for. Drawn to that spec rather than styled to ours, so the ink
 * outline and house fill rules do not apply here.
 */
export function MarkVegSymbol({ ink: _ink, title, ...rest }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <rect x="5" y="5" width="38" height="38" rx="4" stroke="#0d7a3c" strokeWidth={3.4} />
      <circle cx="24" cy="24" r="10" fill="#0d7a3c" />
    </svg>
  );
}

/* ── Plate with fork and knife ── */
export function MarkPlate(props: MarkProps) {
  return (
    <Svg {...props}>
      <circle cx="24" cy="26" r="13" fill="#f5b921" />
      <circle cx="24" cy="26" r="7.5" />
      {/* fork: tines meet a collar, then one stem, so it reads at 16px */}
      <path d="M5 7v6.5a3.5 3.5 0 0 0 3.5 3.5A3.5 3.5 0 0 0 12 13.5V7" />
      <path d="M8.5 7v6M8.5 17v24" />
      {/* knife: blade tapers into the handle */}
      <path d="M40 7c-2.4 0-4 2.9-4 7s1.6 6.5 4 6.5" />
      <path d="M40 7v34" />
    </Svg>
  );
}

/* ── Certificate: FSSAI licence ── */
export function MarkCertificate(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M9 8h30v22H9V8Z" fill="#f5b921" />
      <path d="M15 15h18M15 21h11" />
      <circle cx="31" cy="33" r="7" fill="#e0532e" />
      <path d="M27 38.5V44l4-2.5 4 2.5v-5.5" />
    </Svg>
  );
}

/* ── Crisp ── */
export function MarkCrisp(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M10 30c-3.5-8 2.5-18 12.5-21C31 6.4 39 11 39 19.5 39 30 29 41 19.5 41 14.5 41 11.6 37 10 30Z"
        fill="#f5b921"
      />
      <path d="M18 20c3-2.5 7-2.5 10 .5" />
    </Svg>
  );
}

/* ── Pack ── */
export function MarkPack(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M13 13h22l-2 29H15L13 13Z" fill="#5b1220" />
      <path d="M13 13l-3-6h28l-3 6M15 42l-2 4h22l-2-4" />
      <ellipse cx="24" cy="24" rx="7" ry="5" stroke="#fbf3e4" />
    </Svg>
  );
}

/* ── Star ── */
export function MarkStar(props: MarkProps) {
  return (
    <Svg {...props}>
      <path
        d="M24 6l5.4 11.6L42 19.2l-9 8.8 2.2 12.6L24 34.6 12.8 40.6 15 28 6 19.2l12.6-1.6L24 6Z"
        fill="#f5b921"
      />
    </Svg>
  );
}

/* ── Rings: the neon pack device ── */
export function MarkRings(props: MarkProps) {
  return (
    <Svg {...props}>
      <ellipse cx="24" cy="24" rx="18" ry="13" fill="#e0532e" />
      <ellipse cx="24" cy="24" rx="12" ry="8" stroke="#fbf3e4" />
      <ellipse cx="24" cy="24" rx="6" ry="3.5" stroke="#fbf3e4" />
    </Svg>
  );
}

/* ── Martini: prawn cocktail ── */
export function MarkMartini(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M9 12h30L24 29 9 12Z" fill="#6e2350" />
      <path d="M24 29v11M16 40h16" />
    </Svg>
  );
}

/* ── Envelope, for the notify strip ── */
export function MarkMail(props: MarkProps) {
  return (
    <Svg {...props}>
      <path d="M7 12h34v24H7V12Z" fill="#e0532e" />
      <path d="M7 12l17 13 17-13" />
    </Svg>
  );
}

export type Mark = React.ComponentType<MarkProps>;
