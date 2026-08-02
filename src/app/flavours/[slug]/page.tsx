import type { Metadata } from "next";
import Image from "next/image";
import { TLink } from "@/components/ViewTransitions";
import { MorphHero } from "@/components/MorphHero";
import { notFound } from "next/navigation";
import { Doodles } from "@/components/Doodles";
import { Marquee } from "@/components/Marquee";
import { Rail } from "@/components/Rail";
import { Reveal } from "@/components/Reveal";
import { StatRow } from "@/components/StatRow";
import { ArrowButton, Pill } from "@/components/ui";
import { CaretLeft } from "@/components/icons";
import { flavours, getFlavour } from "@/lib/flavours";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return flavours.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const flavour = getFlavour(slug);
  if (!flavour) return {};
  return {
    title: flavour.name,
    description: `${flavour.strap} ${flavour.name} flavoured potato crisps from Joey's. ${site.pack.weight}, ${site.pack.mrp}, 100% vegetarian.`,
  };
}

export default async function FlavourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const flavour = getFlavour(slug);
  if (!flavour) notFound();

  const others = flavours.filter((f) => f.slug !== flavour.slug);
  const [beatOne, ...restBeats] = flavour.strap.split(" ");

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
          <div
            className="ripple relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[14px] px-8 py-10 sm:min-h-[520px]"
            style={{
              background: `radial-gradient(ellipse at 50% 32%, ${lighten(flavour.base)} 0%, ${flavour.base} 48%, #16060c 100%)`,
            }}
          >
            <span className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 sm:left-5 sm:top-5">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-[2px] border-[1.5px] border-[#0d7a3c]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0d7a3c]" />
              </span>
              <span className="head text-[11px] uppercase tracking-[0.05em] text-ink">
                {site.pack.vegetarian}
              </span>
            </span>
            {/* Destination of the morph: whatever you clicked flies into this. */}
            <MorphHero targetId="flavour-hero-pack" />
            <Image
              id="flavour-hero-pack"
              src={flavour.pack}
              alt={`Joey's ${flavour.name} flavoured potato crisps, ${site.pack.weight} pack`}
              width={751}
              height={1000}
              priority
              className="relative w-[62vw] max-w-[380px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)] lg:w-[68%]"
            />
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden rounded-[14px] bg-gold px-5 py-9 sm:px-10 sm:py-14">
            <Doodles color="#3b0d14" opacity={0.12} scale={0.85} className="left-1/4" />
            <div className="relative">
              <Reveal>
                <TLink
                  href="/#flavours"
                  className="eyebrow group/b inline-flex min-h-[36px] items-center gap-1.5 uppercase text-ink/55 transition-colors duration-[180ms] hover:text-ink"
                >
                  <CaretLeft
                    weight="bold"
                    className="h-3 w-3 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/b:-translate-x-0.5"
                  />
                  All flavours
                </TLink>
              </Reveal>

              <Reveal
                as="h1"
                delay={70}
                className="display mt-3 text-[clamp(2.3rem,9vw,4.2rem)] text-ink"
              >
                {flavour.name}
              </Reveal>

              <Reveal
                as="p"
                delay={140}
                className="head mt-4 text-[clamp(1.05rem,4vw,1.45rem)] text-coral"
              >
                <span className="text-ink">{beatOne}</span> {restBeats.join(" ")}
              </Reveal>

              <Reveal delay={210}>
                <span
                  className="head mt-7 inline-block rounded-[7px] px-4 py-2 text-[13px] uppercase tracking-[0.06em]"
                  style={{ background: flavour.band, color: flavour.bandInk }}
                >
                  Flavoured Potato Crisps
                </span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WRITE-UP + DECLARATIONS ═══ */}
      <section className="px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[820px]">
          <Reveal>
            <Pill>The write-up</Pill>
          </Reveal>
          <Reveal
            as="p"
            delay={80}
            className="mt-6 text-[clamp(1rem,4vw,1.3rem)] leading-[1.7] text-ink/80"
          >
            {flavour.copy}
          </Reveal>
          {/* the on-pack declarations, in our own type rather than lifted off the artwork */}
          <Reveal delay={140}>
            <StatRow className="mt-10 sm:mt-12" />
          </Reveal>
          <Reveal as="p" delay={180} className="mt-4 text-[12px] text-ink/40">
            Per serve ({site.pack.serve}): {site.pack.energy}, {site.pack.rda} of an
            adult&rsquo;s RDA. Images shown are indicative only and do not reflect the
            contents of the pack.
          </Reveal>
        </div>
      </section>

      <Marquee
        tone="gold"
        duration={36}
        items={[
          { icon: "flame", label: flavour.strap.replace(/\.$/, "") },
          { icon: "leaf", label: site.pack.vegetarian },
          { icon: "crisp", label: `${site.pack.weight} Pack` },
          { icon: "star", label: `${site.pack.mrp} MRP` },
          { icon: "ring", label: site.tagline.replace(/\.$/, "") },
          { icon: "pack", label: "Made In India" },
        ]}
      />

      {/* ═══ THE OTHER TWO ═══ */}
      <section className="relative overflow-hidden bg-ink">
        <Doodles color="#fbf3e4" opacity={0.09} scale={1.1} clearCentre />
        <div className="relative px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="text-center">
            <h2 className="head inline-block text-[clamp(1.6rem,5.5vw,2.5rem)] text-cream">
              Try the other two
              <span className="mt-2 block h-[5px] w-full rounded-full bg-coral" />
            </h2>
          </Reveal>
          <Rail label="Other flavours" className="mt-10 flex justify-start gap-6 overflow-x-auto sm:mt-11 sm:justify-center sm:gap-14">
            {others.map((f, i) => (
              <Reveal key={f.slug} delay={i * 90} className="shrink-0">
                <TLink
                  href={`/flavours/${f.slug}`}
                  morph
                  className="pressable group flex w-[190px] flex-col items-center text-center sm:w-[250px]"
                >
                  <span
                    className="block rounded-full p-[7px] transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5"
                    style={{ background: f.ring }}
                  >
                    <Image
                      data-morph
                      src={f.disc}
                      alt={`Joey's ${f.name} crisps`}
                      width={500}
                      height={500}
                      className="h-[176px] w-[176px] rounded-full object-cover sm:h-[236px] sm:w-[236px]"
                    />
                  </span>
                  <span className="head mt-5 border-b-2 border-transparent pb-1 text-[15px] text-cream transition-colors duration-[180ms] group-hover:border-gold group-hover:text-gold sm:text-[16px]">
                    {f.name}
                  </span>
                  <span className="mt-1.5 text-[12.5px] text-cream/45">{f.strap}</span>
                </TLink>
              </Reveal>
            ))}
          </Rail>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden bg-gold">
        <Doodles color="#3b0d14" opacity={0.2} clearCentre />
        <div className="relative mx-auto max-w-[720px] px-5 py-14 text-center sm:px-8 sm:py-20">
          <Reveal>
            <Pill tone="cream">Where to find us</Pill>
          </Reveal>
          <Reveal as="h2" delay={70} className="head mt-5 text-[clamp(1.6rem,5.6vw,2.7rem)] text-ink">
            Want a bag of {flavour.name}?
          </Reveal>
          <Reveal
            as="p"
            delay={130}
            className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink/70"
          >
            Joey&rsquo;s is rolling out across India right now. For stockist and
            distribution enquiries, get in touch.
          </Reveal>
          <Reveal delay={190} className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-3.5">
            <ArrowButton href="/contact" tone="coral">
              Get in touch
            </ArrowButton>
            <ArrowButton href="/made" tone="cream">
              Where it&rsquo;s made
            </ArrowButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Nudge a pack base colour toward its lit centre for the radial hero wash. */
function lighten(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.22));
  return `rgb(${mix((n >> 16) & 255)} ${mix((n >> 8) & 255)} ${mix(n & 255)})`;
}
