import type { Metadata } from "next";
import Image from "next/image";
import { Doodles } from "@/components/Doodles";
import { Rail } from "@/components/Rail";
import { ArrowButton, Accent, Pill } from "@/components/ui";
import { TLink } from "@/components/ViewTransitions";
import { flavours } from "@/lib/flavours";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * A dead end is the one page where a visitor arrives already mildly annoyed, so
 * it carries the three flavours rather than an apology and a home button. The
 * fastest route out of a wrong URL on a three product site is the products.
 */
export default function NotFound() {
  return (
    <>
      <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="relative overflow-hidden rounded-[14px] bg-gold px-5 py-16 text-center sm:px-10 sm:py-24">
          <Doodles color="#3b0d14" opacity={0.2} clearCentre />
          <div className="relative mx-auto max-w-[720px]">
            <Pill tone="ink">Error 404</Pill>
            <h1 className="display mt-5 text-[clamp(2.3rem,7vw,4.2rem)] text-ink">
              You&rsquo;ve reached the <Accent>bottom of the bag</Accent>
            </h1>
            <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
              There&rsquo;s no page at this address. It may have moved, or the link that
              sent you here may have a typo in it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-3.5">
              <ArrowButton href="/" tone="coral">
                Back to the start
              </ArrowButton>
              <ArrowButton href="/contact" tone="cream">
                Tell us what broke
              </ArrowButton>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink">
        <Doodles color="#fbf3e4" opacity={0.09} scale={1.1} clearCentre />
        <div className="relative py-14 sm:py-20">
          <div className="px-5 text-center">
            <h2 className="head inline-block text-[clamp(1.5rem,5vw,2.3rem)] text-cream">
              While you&rsquo;re here
              <span className="mt-2 block h-[5px] w-full rounded-full bg-coral" />
            </h2>
          </div>
          <Rail
            label="Joey's flavours"
            className="mt-10 flex gap-6 overflow-x-auto px-5 sm:gap-10 sm:px-8 lg:justify-center"
          >
            {flavours.map((f) => (
              <TLink
                key={f.slug}
                href={`/flavours/${f.slug}`}
                className="pressable group flex w-[170px] shrink-0 flex-col items-center text-center sm:w-[220px]"
              >
                <span
                  className="block rounded-full p-[7px] transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5"
                  style={{ background: f.ring }}
                >
                  <Image
                    src={f.disc}
                    alt={`Joey's ${f.name} crisps`}
                    width={500}
                    height={500}
                    className="h-[156px] w-[156px] rounded-full object-cover sm:h-[206px] sm:w-[206px]"
                  />
                </span>
                <span className="head mt-5 text-[15px] text-cream transition-colors duration-[180ms] group-hover:text-gold sm:text-[16px]">
                  {f.name}
                </span>
                <span className="mt-1.5 text-[12.5px] text-cream/45">{f.strap}</span>
              </TLink>
            ))}
          </Rail>
        </div>
      </section>
    </>
  );
}
