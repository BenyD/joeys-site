import type { Metadata } from "next";
import { Doodles } from "@/components/Doodles";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { ArrowButton, Accent, Pill } from "@/components/ui";
import { MarkBatch, MarkCertificate, MarkVeg, type Mark } from "@/components/marks";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it's made",
  description:
    "Every pack of Joey's is manufactured at a licensed, audited food processing facility in Tamil Nadu. Facility details, FSSAI licence and how to read your batch code.",
};

const { manufacturer: mfr } = site;

const batchChars = [
  { char: mfr.batchChar, label: "Facility code", lit: true },
  { char: "2", label: "Year", lit: false },
  { char: "0", label: "", lit: false },
  { char: "8", label: "Month", lit: false },
  { char: "0", label: "", lit: false },
  { char: "1", label: "Day", lit: false },
  { char: "0", label: "", lit: false },
  { char: "1", label: "Batch seq.", lit: false },
];

const standards: { icon: Mark; title: string; body: string }[] = [
  {
    icon: MarkVeg,
    title: "100% Vegetarian",
    body: "Every Joey's crisp is certified vegetarian. No animal derivatives. No hidden ingredients. The flavour is all in the seasoning.",
  },
  {
    icon: MarkCertificate,
    title: "FSSAI Licensed",
    body: "Our manufacturing partner holds a valid FSSAI Central Licence. Every batch is produced under food safety regulations and subject to regular inspection.",
  },
  {
    icon: MarkBatch,
    title: "Full Traceability",
    body: "The batch code on the back of every pack links directly to the facility, the production date and the batch sequence. You always know where your crisps came from.",
  },
];

export default function MadePage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="relative overflow-hidden rounded-[14px] bg-gold px-5 py-14 text-center sm:px-10 sm:py-24">
          <Doodles color="#3b0d14" opacity={0.2} clearCentre />
          <div className="relative mx-auto max-w-[720px]">
            <Pill tone="cream">★ Transparency ★</Pill>
            <h1 className="display mt-5 text-[clamp(2.4rem,6.4vw,4.2rem)] text-ink">
              Where Joey&rsquo;s <Accent>is made</Accent>
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink/70">
              Every pack of Joey&rsquo;s is manufactured at a licensed, audited food
              processing facility. Here&rsquo;s exactly where your crisps come from, and
              how to trace the batch on the back of your pack.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FACILITY ═══ */}
      <section className="px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1000px]">
          <Pill>The facility</Pill>

          <div className="mt-6 overflow-hidden rounded-[16px] border-2 border-ink/10 bg-white/55">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b-2 border-ink/10 px-6 py-6 sm:px-9">
              <div>
                <p className="eyebrow uppercase text-ink/45">Manufacturing facility</p>
                <h2 className="head mt-1.5 text-[clamp(1.5rem,4vw,2.1rem)] text-ink">
                  {mfr.name}
                </h2>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="eyebrow uppercase text-ink/45">Batch code</span>
                <span className="display grid h-[52px] w-[52px] place-items-center rounded-[9px] bg-coral text-[26px] text-cream">
                  {mfr.batchChar}
                </span>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-9">
              <Field label="Facility name">
                <strong className="head block text-[17px] text-ink">{mfr.name}</strong>
              </Field>
              <Field label="Location">
                {mfr.locality}
                <br />
                {mfr.region}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Full address">
                  {mfr.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-ink px-6 py-5 sm:col-span-2">
                <div>
                  <p className="eyebrow uppercase text-cream/45">FSSAI licence number</p>
                  <p className="display mt-1 text-[26px] tracking-[0.06em] text-gold">
                    {mfr.fssai}
                  </p>
                </div>
                <p className="max-w-[300px] text-[12.5px] leading-relaxed text-cream/45">
                  Issued by the Food Safety and Standards Authority of India. Verifiable at{" "}
                  <a
                    href={mfr.fssaiVerifyUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-gold/80 underline-offset-2 hover:underline"
                  >
                    foscos.fssai.gov.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee
        tone="gold"
        duration={38}
        items={[
          { icon: "ring", label: "FSSAI Licensed" },
          { icon: "leaf", label: "100% Vegetarian" },
          { icon: "pack", label: "Fully Traceable" },
          { icon: "star", label: "Made In India" },
          { icon: "crisp", label: "Audited Facility" },
          { icon: "flame", label: "Batch Coded" },
        ]}
      />

      {/* ═══ BATCH ═══ */}
      <section id="batch" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1000px]">
          <Pill>Traceability</Pill>
          <h2 className="display mt-5 max-w-[20ch] text-[clamp(2rem,5.2vw,3.2rem)] text-ink">
            How to read your <Accent>batch number</Accent>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink/65">
            Every pack of Joey&rsquo;s carries a batch number printed on the back. The first
            character tells you exactly which facility made your crisps. Here&rsquo;s how to
            decode it.
          </p>

          <div className="mt-10 overflow-hidden rounded-[16px] border-2 border-ink/10 bg-white/55">
            <p className="eyebrow border-b-2 border-ink/10 px-6 py-4 uppercase text-ink/45 sm:px-8">
              Sample batch number, back of pack
            </p>
            <div className="flex flex-wrap items-start gap-2 px-6 py-8 sm:px-8">
              {batchChars.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span
                    className={`display grid h-[46px] w-[46px] place-items-center rounded-[9px] text-[20px] ${
                      c.lit
                        ? "bg-coral text-cream"
                        : "border-2 border-ink/10 bg-cream text-ink/35"
                    }`}
                  >
                    {c.char}
                  </span>
                  <span
                    className={`eyebrow max-w-[62px] text-center uppercase leading-tight ${
                      c.lit ? "text-coral" : "text-ink/35"
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[16px] border-2 border-ink/10">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-ink">
                  <th className="eyebrow px-6 py-4 uppercase text-cream/55">First char</th>
                  <th className="eyebrow px-6 py-4 uppercase text-cream/55">
                    Manufacturing facility
                  </th>
                  <th className="eyebrow hidden px-6 py-4 uppercase text-cream/55 sm:table-cell">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white/55">
                  <td className="px-6 py-6 align-top">
                    <span className="display grid h-[38px] w-[38px] place-items-center rounded-[8px] bg-coral text-[19px] text-cream">
                      {mfr.batchChar}
                    </span>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <strong className="head block text-[15px] text-ink">{mfr.name}</strong>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink/50">
                      {mfr.address.join(" ")}
                    </span>
                  </td>
                  <td className="hidden px-6 py-6 align-top text-[13px] text-ink/50 sm:table-cell">
                    {mfr.locality}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ STANDARDS ═══ */}
      <section
        id="standards"
        className="relative scroll-mt-20 overflow-hidden bg-ink"
      >
        <Doodles color="#fbf3e4" opacity={0.09} scale={1.1} clearCentre />
        <div className="relative mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-24">
          <div className="text-center">
            <Pill tone="gold">Our standards</Pill>
            <h2 className="display mx-auto mt-5 max-w-[22ch] text-[clamp(1.9rem,5vw,3rem)] text-cream">
              The crisp in your hand should be <span className="text-gold">exactly what
              the pack says it is</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {standards.map((item, i) => {
              const Mark = item.icon;
              return (
                <Reveal
                  key={item.title}
                  delay={i * 90}
                  className="rounded-[16px] border-2 border-cream/10 bg-[#4a121b] px-6 py-7 sm:px-7 sm:py-8"
                >
                  <Mark ink="rgba(251,243,228,0.62)" className="mb-4 h-10 w-10" />
                  <h3 className="head text-[16px] text-cream">{item.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream/50">
                    {item.body}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden bg-gold">
        <Doodles color="#3b0d14" opacity={0.2} clearCentre />
        <div className="relative mx-auto max-w-[720px] px-5 py-14 text-center sm:px-8 sm:py-20">
          <h2 className="head text-[clamp(1.8rem,4.8vw,2.7rem)] text-ink">
            Questions about a pack?
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
            Send us the batch code from the back and we&rsquo;ll trace it for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <ArrowButton href="/contact#consumer" tone="coral">
              Contact us
            </ArrowButton>
            <ArrowButton href="/#flavours" tone="cream">
              Back to the flavours
            </ArrowButton>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow border-b-2 border-ink/10 pb-2.5 uppercase text-ink/45">{label}</p>
      <div className="mt-3 text-[15px] leading-[1.75] text-ink/70">{children}</div>
    </div>
  );
}
