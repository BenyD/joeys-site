import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Doodles } from "@/components/Doodles";
import { Reveal } from "@/components/Reveal";
import { Accent, ArrowButton, Pill } from "@/components/ui";
import { MarkBatch, MarkMail, MarkPack, MarkStar, type Mark } from "@/components/marks";
import { ContactLink } from "@/components/ContactLink";
import { contactReady, site } from "@/lib/site";

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
 * Every link is a mailto with the subject pre-filled. There is no form because
 * there is no backend to receive one, and a form that silently goes nowhere is
 * worse than an email client that opens. Swap these for a real form once there
 * is somewhere for it to post.
 */
const routes: {
  id: string;
  icon: Mark;
  title: string;
  body: string;
  subject: string;
  cta: string;
}[] = [
  {
    id: "consumer",
    icon: MarkMail,
    title: "About a pack",
    body: "Something to tell us about a bag you bought, good or bad. If it is about a specific pack, send the batch code printed on the back and we can trace it to the exact run.",
    subject: "Query about a pack",
    cta: "Email us",
  },
  {
    id: "stockists",
    icon: MarkPack,
    title: "Stockist and distribution",
    body: "Retailers, distributors and food service. Tell us where you are and what you cover, and we will come back with trade terms and availability in your region.",
    subject: "Stockist enquiry",
    cta: "Enquire about stocking",
  },
  {
    id: "press",
    icon: MarkStar,
    title: "Press and partnerships",
    body: "Journalists, photographers and anyone who wants to work with the brand. Product shots and brand assets are available on request.",
    subject: "Press enquiry",
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
              Send us a message and we will come back to you, or write straight to the
              inbox that fits.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section id="send" className="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
        {/* Same 1120px measure as the cards below, so both sections share an edge. */}
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

      {/* ═══ ROUTES ═══ */}
      <section className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-9">
            <Pill>Or go direct</Pill>
            <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.9rem,6vw,3rem)] text-ink">
              Straight to the <Accent>right inbox</Accent>
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
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
                  {/* Falls back to the form above while the address is a placeholder. */}
                  <ArrowButton
                    href={
                      contactReady
                        ? `mailto:${site.supportEmail}?subject=${encodeURIComponent(r.subject)}`
                        : "#send"
                    }
                    tone="coral"
                  >
                    {contactReady ? r.cta : "Use the form"}
                  </ArrowButton>
                </div>
              </Reveal>
            );
          })}
          </div>
        </div>
      </section>

      {/* ═══ DIRECT DETAILS ═══ */}
      <section className="relative overflow-hidden bg-ink">
        <Doodles color="#fbf3e4" opacity={0.09} scale={1.1} clearCentre />
        <div className="relative mx-auto max-w-[1000px] px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow uppercase text-cream/40">Direct</p>
              <ContactLink
                kind="email"
                className="head mt-3 block text-[clamp(1.15rem,3.4vw,1.5rem)] text-gold transition-colors duration-[180ms] hover:text-cream"
              />
              <ContactLink
                kind="phone"
                className="head mt-2 block text-[clamp(1.15rem,3.4vw,1.5rem)] text-gold transition-colors duration-[180ms] hover:text-cream"
              />
              {/*
                The hours belong to the phone, not the email, so they sit under
                the number and are worded as such. Without this, someone rings at
                nine at night and reads the silence as the brand ignoring them.
              */}
              <p className="mt-2.5 text-[13px] text-cream/45">
                Calls answered {site.supportHours}
              </p>
            </div>
            <div>
              <p className="eyebrow uppercase text-cream/40">Marketed by</p>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/70">
                {site.legalName}
                <br />
                <span className="text-cream/45">Brand: {site.brandLine}</span>
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="mt-10 flex flex-col gap-4 border-t-2 border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3.5">
              <MarkBatch ink="rgba(251,243,228,0.62)" className="h-9 w-9 shrink-0" />
              <p className="max-w-[46ch] text-[14px] leading-relaxed text-cream/55">
                Asking about a specific pack? The batch code on the back tells us the
                facility, the date and the run.
              </p>
            </div>
            <ArrowButton href="/made#batch" tone="gold" className="shrink-0">
              How to read it
            </ArrowButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
