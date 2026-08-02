import Image from "next/image";
import { TLink } from "./ViewTransitions";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";
import { ContactLink } from "./ContactLink";
import { CaretDoubleUp } from "./icons";

const columns = [
  {
    title: "Flavours",
    links: flavours.map((f) => ({ label: f.name, href: `/flavours/${f.slug}` })),
  },
  {
    title: "The pack",
    links: [
      { label: "What's inside", href: "/#inside" },
      { label: "Nutrition", href: "/#inside" },
      { label: "How it's made", href: "/made" },
      { label: "Batch traceability", href: "/made#batch" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/#story" },
      { label: "Our standards", href: "/made#standards" },
      { label: "Contact", href: "/contact" },
      { label: "Stockist enquiries", href: "/contact#stockists" },
    ],
  },
];

/*
 * Three link columns, maximum. A fourth pushed Social onto its own row and left
 * the footer with a hole in it. Terms and Privacy already sit in the bottom bar
 * where people look for them, and "Manufacturing" was a second name for
 * "How it's made", so the Legal column was repetition rather than navigation.
 */

const linkCls =
  "text-[13.5px] text-cream/55 transition-colors duration-[180ms] hover:text-gold sm:text-[13px]";

export function Footer() {
  return (
    <>
      {/* ── main footer ── */}
      <footer className="border-t border-cream/10 bg-ink">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/joeys-logo.png"
              alt="Joey's"
              width={900}
              height={688}
              className="h-14 w-auto"
            />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-cream/55">
              Three unmistakable flavours on a crisp that earns its keep.{" "}
              <span className="text-gold">{site.tagline}</span>
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="head mb-4 text-[13px] uppercase tracking-[0.07em] text-cream">
                {col.title}
              </h3>
              <ul className="space-y-3 sm:space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <TLink href={l.href} className={linkCls}>
                      {l.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="head mb-4 text-[13px] uppercase tracking-[0.07em] text-cream">
              Social
            </h3>
            <ul className="space-y-3 sm:space-y-2.5">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className={linkCls}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*
          A compact version of the pack declarations only. The full facility
          record, FSSAI licence and batch key live on /made, which is the page
          built for them; repeating all of it here made the footer the longest
          block of text on the site for information nobody reads standing up.
        */}
        <div className="border-t border-cream/10">
          <div className="mx-auto max-w-[1240px] px-5 py-7 text-[11.5px] leading-relaxed text-cream/40 sm:px-8">
            <p>
              <span className="text-cream/65">Manufactured by:</span>{" "}
              {site.manufacturer.name}, {site.manufacturer.locality}.{" "}
              <span className="text-cream/65">FSSAI Lic. No.</span>{" "}
              {site.manufacturer.fssai}.{" "}
              <TLink href="/made" className="text-gold/70 hover:text-gold">
                Full manufacturing details
              </TLink>
            </p>
            <p className="mt-2">
              <span className="text-cream/65">Marketed by:</span> {site.legalName}.{" "}
              Images shown are indicative only and do not reflect the contents of the pack.
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-5 py-5 text-[11.5px] text-cream/40 sm:flex-row sm:px-8">
            <div className="flex gap-5">
              <TLink href="/legal/terms" className="hover:text-gold">
                Terms of Use
              </TLink>
              <TLink href="/legal/privacy" className="hover:text-gold">
                Privacy Policy
              </TLink>
            </div>
            <p className="order-last text-center sm:order-none">
              © {new Date().getFullYear()} {site.legalName}.
            </p>
            <a href="#top" className="group/t flex items-center gap-1.5 hover:text-gold">
              Back to top
              <CaretDoubleUp
                weight="bold"
                className="h-3.5 w-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/t:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
