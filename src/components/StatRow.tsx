import { site } from "@/lib/site";

/**
 * The on-pack declarations - net weight, MRP, veg status - rendered in the
 * site's own language rather than lifted off the artwork. Sits under each
 * variant write-up, and once on the home page.
 */
export function StatRow({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const stats = [
    { value: site.pack.weight, label: "Net weight" },
    { value: site.pack.mrp, label: "MRP (incl. taxes)" },
    { value: site.pack.vegetarian, label: "Certified vegetarian" },
  ];

  const isDark = tone === "dark";

  return (
    <dl
      className={`grid grid-cols-1 overflow-hidden rounded-2xl border-2 sm:grid-cols-3 ${
        isDark ? "border-cream/15 bg-white/5" : "border-ink/10 bg-white/60"
      } ${className}`}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-6 py-6 ${
            isDark ? "border-cream/15" : "border-ink/10"
          } ${i > 0 ? "border-t-2 sm:border-l-2 sm:border-t-0" : ""}`}
        >
          <dd className={`display text-[2.1rem] ${isDark ? "text-gold" : "text-coral"}`}>
            {s.value}
          </dd>
          <dt
            className={`eyebrow mt-2 uppercase ${isDark ? "text-cream/50" : "text-ink/45"}`}
          >
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
