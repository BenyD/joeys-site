import Image from "next/image";
import { TLink } from "@/components/ViewTransitions";
import { Doodles } from "@/components/Doodles";
import { Marquee } from "@/components/Marquee";
import { PackLanding } from "@/components/PackLanding";
import { Rail } from "@/components/Rail";
import { Reveal } from "@/components/Reveal";
import { StatRow } from "@/components/StatRow";
import { Accent, ArrowButton, Pill } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import {
  MarkBatch,
  MarkFlame,
  MarkFryer,
  MarkOil,
  MarkPlate,
  MarkPotato,
  MarkSalt,
  MarkSeasoning,
  MarkVeg,
  MarkVegSymbol,
  type Mark,
} from "@/components/marks";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";

const pillars: { icon: Mark; title: string; body: string }[] = [
  {
    icon: MarkFlame,
    title: "Real flavour, no shortcuts",
    body: "Barbecue that tastes like open fire. Bacon that tastes oak-smoked. We chase the actual experience, not an approximation of it.",
  },
  {
    icon: MarkVeg,
    title: "100% vegetarian",
    body: "Every Joey's crisp is certified vegetarian. No animal derivatives, no hidden ingredients. The flavour is all in the seasoning.",
  },
  {
    icon: MarkFryer,
    title: "Potato, and not much else",
    body: "A short ingredient list, a proper fry, and a crisp with enough structure to survive the whole bag.",
  },
  {
    icon: MarkBatch,
    title: "Traceable to the batch",
    body: "The code on the back of the pack tells you the facility, the date and the run. You always know where your crisps came from.",
  },
];

/*
 * Ingredient cards.
 *
 * ⚠ ONE UNVERIFIED CLAIM LEFT - "Sea Salt". Nothing the client supplied (the
 * flavour write-ups, the pack artwork, the manufacturing page) contains an
 * ingredient declaration, and the words "sea salt" appear nowhere in any of it;
 * it was assumed while building this row and could easily be plain iodised
 * salt. Ingredient declarations are regulated, so that label needs confirming
 * or correcting before this page goes anywhere near production.
 *
 * Verified and safe: "Potatoes" (pack reads "Potato Chips"), "Refined Palmolein
 * Oil" (confirmed by the client, correcting an earlier assumption of sunflower
 * oil), "Seasoning" (the manufacturing page states the flavour is all in the
 * seasoning), and "100% Vegetarian" (stated on pack, in the write-ups, and on
 * the manufacturing page).
 *
 * `image` is the slot for photography. Drop a square shot into
 * /public/ingredients and set the path; the illustration is the fallback and
 * disappears on its own. The five need to be lit the same way or the row falls
 * apart.
 */
const ingredients: { icon: Mark; label: string; image?: string }[] = [
  { icon: MarkPotato, label: "Potatoes", image: "/ingredients/potatoes.jpg" },
  { icon: MarkOil, label: "Refined Palmolein Oil", image: "/ingredients/oil.jpg" },
  { icon: MarkSalt, label: "Sea Salt", image: "/ingredients/salt.jpg" },
  { icon: MarkSeasoning, label: "Seasoning", image: "/ingredients/seasoning.jpg" },
  // Closes the row on the certification rather than a prohibition sign. Same
  // fact, stated as what the crisp is instead of what it is not, and it is the
  // mark already printed on the pack. No photograph, so it stays a mark.
  { icon: MarkVegSymbol, label: "100% Vegetarian" },
];

/**
 * PLACEHOLDER - the brand has no customer reviews yet, so this carousel runs on
 * the flavour manifestos rather than invented quotes. Swap the array for real
 * testimonials (quote + name) when they exist; the markup needs no changes.
 */
const quotes = [
  {
    quote: "Think open fire. Char on the edges. A marinade that's had hours to do its work.",
    by: "Barbecue Chicken",
    tint: "bg-tint-gold",
  },
  {
    quote:
      "That unmistakable hit of smoke and salt, without compromise, without shortcuts, and without a trace of meat.",
    by: "Smokey Bacon",
    tint: "bg-tint-pink",
  },
  {
    quote:
      "Tangy, briny, subtly sweet. It works on a potato crisp better than it has any right to.",
    by: "Prawn Cocktail",
    tint: "bg-tint-coral",
  },
  {
    quote: "This is the one you savour. The one you don't want to end.",
    by: "Smokey Bacon",
    tint: "bg-tint-plum",
  },
  {
    quote: "Crisp, clean, sharp on the tongue, and gone before you're ready.",
    by: "Prawn Cocktail",
    tint: "bg-tint-gold",
  },
];

const marqueeA = [
  { icon: "leaf" as const, label: "100% Vegetarian" },
  { icon: "crisp" as const, label: "42.5g Pack" },
  { icon: "star" as const, label: "₹25 MRP" },
  { icon: "flame" as const, label: "Three Flavours" },
  { icon: "ring" as const, label: "FSSAI Licensed" },
  { icon: "pack" as const, label: "Made In India" },
];

const marqueeB = [
  { icon: "flame" as const, label: "Grilled" },
  { icon: "crisp" as const, label: "Oak-Smoked" },
  { icon: "star" as const, label: "Coastal" },
  { icon: "ring" as const, label: "Showtime For One" },
  { icon: "leaf" as const, label: "No Meat, All Flavour" },
  { icon: "batch" as const, label: "Fully Traceable" },
];

export default function Home() {
  const [bbq, bacon, prawn] = flavours;

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
          {/* pack tile */}
          <div
            className="ripple relative flex min-h-[320px] flex-col items-center justify-between overflow-hidden rounded-[14px] sm:min-h-[440px]"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, #7a1a2c 0%, ${bbq.base} 45%, #2c0810 100%)`,
            }}
          >
            <span className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 sm:left-5 sm:top-5">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-[2px] border-[1.5px] border-[#0d7a3c]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0d7a3c]" />
              </span>
              <span className="head text-[11px] uppercase tracking-[0.05em] text-ink">
                100% Veg
              </span>
            </span>

            <Image
              src="/joeys-logo.png"
              alt="Joey's"
              width={900}
              height={642}
              priority
              className="neon-flicker relative mt-12 w-[112px] drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:mt-10 sm:w-[150px]"
            />

            <div className="relative -mb-4 flex w-full items-end justify-center pt-4">
              {[prawn, bbq, bacon].map((f, i) => (
                <Image
                  key={f.slug}
                  /* the pack that PackLanding detaches and flies down the page */
                  id={i === 1 ? "hero-pack" : undefined}
                  src={f.pack}
                  alt={`Joey's ${f.name} crisps`}
                  width={612}
                  height={853}
                  priority={i === 1}
                  className={
                      i === 1
                        ? "relative z-10 w-[41vw] max-w-[285px] drop-shadow-[0_24px_44px_rgba(0,0,0,0.65)] lg:w-[41%]"
                        : `w-[31vw] max-w-[215px] lg:w-[31%] ${
                            i === 0
                              ? "translate-x-6 rotate-[-9deg] sm:translate-x-8"
                              : "-translate-x-6 rotate-[9deg] sm:-translate-x-8"
                          } drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]`
                  }
                />
              ))}
            </div>
          </div>

          {/* headline tile */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-[14px] bg-gold px-5 py-9 sm:px-10 sm:py-14">
            <Doodles color="#3b0d14" opacity={0.13} scale={0.85} className="left-1/3" />
            <div className="relative">
              <Reveal className="mb-5 flex items-center gap-2.5 sm:mb-6">
                <div className="flex -space-x-2">
                  {flavours.map((f) => (
                    <span
                      key={f.slug}
                      className="h-8 w-8 rounded-full border-[2.5px] border-gold"
                      style={{ background: f.base }}
                    />
                  ))}
                </div>
                <span className="head grid h-8 place-items-center rounded-full bg-cream px-3 text-[11px] uppercase tracking-[0.05em] text-ink">
                  3 Flavours
                </span>
              </Reveal>

              <Reveal as="h1" delay={70} className="display max-w-[10ch] text-[clamp(2.5rem,10vw,4.4rem)] text-ink">
                Legendary flavours.
                <br />
                Now <Accent>100%</Accent>
                <br />
                vegetarian.
              </Reveal>

              <Reveal as="p" delay={140} className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-ink/70">
                Barbecue Chicken. Smokey Bacon. Prawn Cocktail. The flavours you grew up
                hearing about, on a crisp with nothing to hide.
              </Reveal>

              <Reveal delay={210} className="mt-7 sm:mt-8">
                <ArrowButton href="#flavours" size="lg">
                  Meet the flavours
                </ArrowButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STORY / PILLARS ═══ */}
      <section id="story" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <Reveal>
              <Pill>The Joey&rsquo;s way</Pill>
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="display mx-auto mt-5 max-w-[18ch] text-[clamp(2rem,7vw,3.6rem)] text-ink"
            >
              Made for the moment you <Accent>reach for the bag</Accent>
            </Reveal>
          </div>

          <div className="mt-10 grid items-center gap-8 sm:mt-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-1 lg:gap-14">
              {pillars.slice(0, 2).map((p, i) => (
                <Pillar key={p.title} {...p} delay={i * 80} />
              ))}
            </div>

            <PackLanding />

            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-1 lg:gap-14">
              {pillars.slice(2).map((p, i) => (
                <Pillar key={p.title} {...p} delay={i * 80} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FLAVOUR RAIL ═══ */}
      <section id="flavours" className="relative scroll-mt-16 overflow-hidden bg-ink">
        <Doodles color="#fbf3e4" opacity={0.09} scale={1.1} clearCentre />
        <div className="relative py-12 sm:py-20">
          <Reveal className="px-5 text-center">
            <span className="mb-2 block text-xl text-gold" aria-hidden>
              ✦
            </span>
            <h2 className="head inline-block text-[clamp(1.8rem,6vw,2.9rem)] text-cream">
              Our Three Flavours
              <span className="mt-2 block h-[5px] w-full rounded-full bg-coral" />
            </h2>
          </Reveal>

          <Rail label="Joey's flavours" className="mt-10 flex gap-6 overflow-x-auto px-5 sm:mt-12 sm:gap-10 sm:px-8 lg:justify-center">
            {flavours.map((f, i) => (
              <Reveal key={f.slug} delay={i * 90} className="shrink-0">
                <TLink
                  href={`/flavours/${f.slug}`}
                  morph
                  className="pressable group flex w-[190px] flex-col items-center text-center sm:w-[260px]"
                >
                  <span
                    className="block rounded-full p-[7px] transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5"
                    style={{ background: f.ring }}
                  >
                    <span
                      className="flex h-[176px] w-[176px] items-center justify-center overflow-hidden rounded-full sm:h-[246px] sm:w-[246px]"
                      style={{ background: f.dishBg }}
                    >
                      <Image
                        data-morph
                        src={f.dish}
                        alt={`Joey's ${f.name} crisps`}
                        width={500}
                        height={500}
                        className="h-[148px] w-[148px] object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.5)] transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04] sm:h-[206px] sm:w-[206px]"
                      />
                    </span>
                  </span>
                  <span className="head mt-5 flex items-center gap-1.5 border-b-2 border-transparent pb-1 text-[15px] text-cream transition-colors duration-[180ms] group-hover:border-gold group-hover:text-gold sm:text-[17px]">
                    {f.name}
                    <ArrowRight
                      weight="bold"
                      className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1.5 text-[12.5px] text-cream/45">{f.strap}</span>
                </TLink>
              </Reveal>
            ))}
          </Rail>
        </div>
      </section>

      <Marquee items={marqueeA} tone="gold" duration={38} />

      {/* ═══ WHAT'S INSIDE ═══ */}
      <section id="inside" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <Pill>What&rsquo;s inside</Pill>
          </Reveal>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-16">
            <Reveal
              as="h2"
              delay={60}
              className="display max-w-[16ch] text-[clamp(2rem,7vw,3.4rem)] text-ink"
            >
              Simple things, <Accent>done properly</Accent>
            </Reveal>
            <Reveal delay={120} className="flex gap-3.5">
              <MarkPlate className="h-8 w-8 shrink-0" />
              <p className="text-[14.5px] leading-relaxed text-ink/65">
                Potatoes, oil, salt and seasoning. Every Joey&rsquo;s crisp is certified
                vegetarian, and the flavour comes entirely from the seasoning, never from
                the thing it&rsquo;s named after.
              </p>
            </Reveal>
          </div>

          <Rail label="What goes into a pack" className="mt-10 flex gap-3.5 overflow-x-auto sm:mt-12 sm:gap-5">
            {ingredients.map((ing, i) => {
              const Mark = ing.icon;
              return (
                <Reveal
                  key={ing.label}
                  delay={i * 70}
                  className="flex w-[132px] shrink-0 flex-col items-center gap-3.5 sm:w-auto sm:flex-1"
                >
                  <div
                    className={`group grid aspect-square w-full place-items-center overflow-hidden rounded-[22px] border-2 border-ink/10 transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 ${
                      ing.image ? "bg-ink/5" : "bg-[#0d7a3c]/10"
                    }`}
                  >
                    {ing.image ? (
                      <Image
                        src={ing.image}
                        alt={ing.label}
                        width={720}
                        height={720}
                        sizes="(min-width: 640px) 20vw, 150px"
                        className="h-full w-full object-cover transition-transform duration-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                      />
                    ) : (
                      <Mark className="h-14 w-14 transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 sm:h-16 sm:w-16" />
                    )}
                  </div>
                  <span className="head text-center text-[13px] text-ink sm:text-[14px]">
                    {ing.label}
                  </span>
                </Reveal>
              );
            })}
          </Rail>

          <Reveal delay={80}>
            <StatRow className="mt-10 sm:mt-12" />
          </Reveal>
        </div>
      </section>

      {/* ═══ STATEMENT BAND ═══ */}
      <section className="relative" style={{ background: bacon.base }}>
        {/* pattern crowds the edges, type sits on flat navy */}
        <Doodles color="#f5b921" opacity={0.2} scale={1.15} clearCentre />
        {/* a bag leaning into the band from outside it, the way the reference
            lets a prop break the edge instead of sitting politely inside */}
        <Image
          src={bacon.pack}
          alt=""
          aria-hidden
          width={612}
          height={853}
          /* breaks the left edge only. Letting it drop past the bottom put a
             pack across the marquee strip below, which reads as a mistake. */
          className="pointer-events-none absolute -left-10 bottom-4 hidden w-[150px] -rotate-[14deg] drop-shadow-[0_20px_36px_rgba(0,0,0,0.5)] lg:block xl:w-[172px]"
        />
        <div className="relative mx-auto max-w-[980px] px-5 py-14 text-center sm:px-8 sm:py-24">
          <Reveal
            as="h2"
            className="head text-[clamp(1.5rem,5.6vw,2.9rem)] leading-[1.25] text-gold"
          >
            Deep, slow, oak-smoked flavour <InlineDisc src={bacon.dish} /> on a crisp that
            earns its keep <InlineDisc src={bbq.dish} /> long after the first bite.
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9 sm:gap-3.5">
            <ArrowButton
              href="/flavours/smokey-bacon"
              tone="gold"
            >
              Read the write-up
            </ArrowButton>
            <ArrowButton href="/made" tone="coral">
              How it&rsquo;s made
            </ArrowButton>
          </Reveal>
        </div>
      </section>

      <Marquee items={marqueeB} tone="coral" duration={42} reverse />

      {/* ═══ QUOTES ═══ */}
      <section className="px-5 py-14 sm:py-24">
        <div className="mx-auto max-w-[1120px] text-center">
          <Reveal>
            <Pill>Straight from the pack</Pill>
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="display mt-5 text-[clamp(1.9rem,7vw,3.4rem)] text-ink"
          >
            What every bag <Accent>promises</Accent>
          </Reveal>
        </div>

        <Rail label="What every bag promises" className="mx-auto mt-10 flex max-w-[1240px] gap-4 overflow-x-auto sm:mt-12 sm:gap-5">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 70} className="shrink-0">
              <figure
                className={`flex h-full w-[250px] flex-col justify-between rounded-[14px] px-5 py-6 sm:w-[290px] sm:px-6 sm:py-7 ${q.tint}`}
              >
                <blockquote className="head text-[15px] leading-[1.35] text-ink sm:text-[16px]">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t-2 border-ink/15 pt-3.5">
                  <span className="eyebrow uppercase text-ink/70">{q.by}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </Rail>
      </section>

      {/* ═══ CLOSING CTA BAND ═══ */}
      {/* No overflow clipping here on purpose: the badge and the packs are meant
          to break the band's edges. The page frame still clips them, so nothing
          escapes the card. */}
      <section className="relative bg-gold">
        <Doodles color="#3b0d14" opacity={0.2} scale={1} clearCentre />

        {/* badge straddling the top edge, half on the cream above, half on the gold */}
        <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <Pill tone="ink">Where to find us</Pill>
        </span>

        <Image
          src={prawn.pack}
          alt=""
          aria-hidden
          width={612}
          height={853}
          /* breaks the left edge, not the bottom one: dropping it into the dark
             notify strip below made the pack look like it had fallen out of the
             layout. The page frame clips the side, which is the intended read. */
          className="pointer-events-none absolute -left-10 bottom-6 z-10 hidden w-[140px] rotate-[-14deg] drop-shadow-[0_18px_34px_rgba(59,13,20,0.45)] lg:block xl:w-[160px]"
        />
        <Image
          src={bacon.pack}
          alt=""
          aria-hidden
          width={612}
          height={853}
          className="pointer-events-none absolute -top-14 right-[4%] z-10 hidden w-[150px] rotate-[12deg] drop-shadow-[0_18px_34px_rgba(59,13,20,0.45)] lg:block xl:w-[172px]"
        />

        <div className="relative mx-auto max-w-[720px] px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24">
          <Reveal as="h2" className="head text-[clamp(1.7rem,6vw,2.9rem)] text-ink">
            Meet the three-pack.
          </Reveal>
          <Reveal
            as="p"
            delay={130}
            className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink/70"
          >
            {site.buy.enabled
              ? "Grab a bag from any of our retail partners."
              : "Joey's is rolling out across India right now. For stockist and distribution enquiries, get in touch."}
          </Reveal>
          <Reveal delay={190} className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-3.5">
            {site.buy.enabled ? (
              site.buy.links.map((l) => (
                <ArrowButton key={l.href} href={l.href} tone="coral">
                  {l.label}
                </ArrowButton>
              ))
            ) : (
              <ArrowButton href="/contact" tone="coral">
                Get in touch
              </ArrowButton>
            )}
            <ArrowButton href="/made" tone="cream">
              Where it&rsquo;s made
            </ArrowButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Pillar({
  icon: Mark,
  title,
  body,
  delay,
}: {
  icon: Mark;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <Mark className="mb-3 h-9 w-9" />
      <h3 className="head text-[16px] text-ink sm:text-[17px]">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{body}</p>
    </Reveal>
  );
}

function InlineDisc({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={500}
      height={500}
      /* the chips-and-dish art is a transparent cut-out, so it sits inline
         uncropped - a circle mask would clip the chips */
      className="inline-block h-[1.3em] w-[1.3em] -translate-y-[0.08em] object-contain align-middle drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
    />
  );
}
