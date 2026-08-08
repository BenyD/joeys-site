import type { Metadata } from "next";
import { ContactForm, TopicButton } from "@/components/ContactForm";
import { ContactLink } from "@/components/ContactLink";
import { Doodles } from "@/components/Doodles";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { MarkMail, MarkPack, MarkPlate, MarkStar, type Mark } from "@/components/marks";
import { Accent, Pill } from "@/components/ui";
import { TLink } from "@/components/ViewTransitions";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.legalName} about a pack, about stocking ${site.name}, or about press and partnerships.`,
  alternates: { canonical: "/contact" },
};

/**
 * Routes are separate cards rather than one address, because the three audiences
 * want different things and a single inbox line makes a stockist read a page
 * written for someone complaining about a bag of crisps.
 *
 * The cards come FIRST and the form follows: the cards are how a visitor works
 * out which conversation they are in, so they do the sorting, and every CTA
 * lands on the same form below with the topic already selected. The form
 * composes the email itself, so sending people to their mail client from here
 * was a second, worse path to the same place.
 */
const routes: {
  id: string;
  icon: Mark;
  title: string;
  body: string;
  topic: string;
  cta: string;
}[] = [
  {
    id: "consumer",
    icon: MarkMail,
    title: "About a pack",
    body: "Something to tell us about a bag you bought, good or bad. If it is about a specific pack, send the batch code printed on the back and we can trace it to the exact run.",
    topic: "pack",
    cta: "Write about a pack",
  },
  {
    id: "share",
    icon: MarkStar,
    title: "Share your experience",
    body: "Eaten a bag and got something to say about it? Tell us which flavour and what you made of it. With your say-so, the good ones end up on this site.",
    topic: "share",
    cta: "Write a review",
  },
  {
    id: "stockists",
    icon: MarkPack,
    title: "Stockist and distribution",
    body: "Retailers, distributors and food service. Tell us where you are and what you cover, and we will come back with trade terms and availability in your region.",
    topic: "stockist",
    cta: "Enquire about stocking",
  },
  {
    id: "press",
    icon: MarkPlate,
    title: "Press and partnerships",
    body: "Journalists, photographers and anyone who wants to work with the brand. Product shots and brand assets are available on request.",
    topic: "press",
    cta: "Get in touch",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="relative overflow-hidden rounded-[14px] bg-gold px-5 py-14 text-center sm:px-10 sm:py-24">
          <Doodles color="#3b0d14" opacity={0.2} clearCentre />
          <div className="relative mx-auto max-w-[720px]">
            <Pill tone="ink">Contact</Pill>
            <h1 className="display mt-5 text-[clamp(2.4rem,7vw,4.2rem)] text-ink">
              Talk to <Accent>Joey&rsquo;s</Accent>
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink/70">
              Pick the conversation that fits and tell us what is on your mind. Every
              road leads to the same form below.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ROUTES ═══ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-9">
            <Pill>Who is writing</Pill>
            <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.9rem,6vw,3rem)] text-ink">
              Straight to the <Accent>right inbox</Accent>
            </h2>
          </Reveal>
          {/* Four routes: two-up on tablets, four across on desktop. A
              three-column grid left the fourth card stranded on its own row
              with two card-widths of dead space beside it. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal
                  key={r.id}
                  delay={i * 90}
                  className="flex scroll-mt-24 flex-col rounded-[18px] border-2 border-ink/10 bg-white/55 px-6 py-7 sm:px-7 sm:py-8"
                >
                  <div id={r.id} className="flex-1 scroll-mt-24">
                    <Icon className="mb-4 h-10 w-10" />
                    <h2 className="head text-[18px] text-ink">{r.title}</h2>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-ink/60">{r.body}</p>
                  </div>
                  <div className="mt-6 pt-1">
                    <TopicButton topic={r.topic}>{r.cta}</TopicButton>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section id="send" className="scroll-mt-24 px-5 pb-14 sm:px-8 sm:pb-20">
        {/* Same 1120px measure as the cards above, so both sections share an edge. */}
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <Pill>Send a message</Pill>
            <h2 className="display mt-5 max-w-[18ch] text-[clamp(1.9rem,6vw,3rem)] text-ink">
              Write to us <Accent>here</Accent>
            </h2>
          </Reveal>
          <Reveal delay={90} className="mt-9">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ═══ DIRECT DETAILS ═══
          A quiet closing panel in the same card language as the routes above.
          This used to be a full-bleed dark band, which read as a second hero
          shouting an email address; the details are reference material, not a
          headline, so they sit low-key on the cream. */}
      <section className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="rounded-[18px] border-2 border-ink/10 bg-white/55 px-6 py-7 sm:px-8 sm:py-9">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="eyebrow uppercase text-ink/40">Direct</p>
                <ContactLink
                  kind="email"
                  className="head mt-3 block break-all text-[15px] text-ink transition-colors duration-[180ms] hover:text-coral"
                />
                <ContactLink
                  kind="phone"
                  className="head mt-1.5 block text-[15px] text-ink transition-colors duration-[180ms] hover:text-coral"
                />
                {/*
                  The hours belong to the phone, not the email, so they sit under
                  the number and are worded as such. Without this, someone rings at
                  nine at night and reads the silence as the brand ignoring them.
                */}
                <p className="mt-2 text-[13px] text-ink/45">
                  Calls answered {site.supportHours}
                </p>
              </div>
              <div>
                <p className="eyebrow uppercase text-ink/40">Marketed by</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/60">
                  {site.legalName}
                  <br />
                  <span className="text-ink/40">Brand: {site.brandLine}</span>
                </p>
              </div>
              <div>
                <p className="eyebrow uppercase text-ink/40">Batch codes</p>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed text-ink/60">
                  Asking about a specific pack? The code on the back tells us the
                  facility, the date and the run.
                </p>
                <TLink
                  href="/made#batch"
                  className="head group/batch mt-3 inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.04em] text-coral transition-colors duration-[180ms] hover:text-coral-dark"
                >
                  How to read it
                  <ArrowRight
                    weight="bold"
                    className="h-3.5 w-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/batch:translate-x-0.5"
                  />
                </TLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
