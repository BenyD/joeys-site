import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalToc } from "@/components/LegalToc";
import { Pill } from "@/components/ui";
import { getLegalDoc, legalDocs } from "@/lib/legal";
import { ContactLink } from "@/components/ContactLink";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.intro,
    // Legal boilerplate has no business competing with the product pages in search.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <div className="px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="mx-auto max-w-[1120px]">
        <header className="max-w-[62ch]">
          <Pill>{doc.eyebrow}</Pill>
          <h1 className="display mt-5 text-[clamp(2.2rem,7vw,3.6rem)] text-ink">{doc.title}</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink/65">{doc.intro}</p>
          <p className="eyebrow mt-5 uppercase text-ink/40">Last updated {doc.updated}</p>
        </header>

        {!doc.reviewed && (
          /* Comes off once a lawyer has signed the text off. Publishing unreviewed
             legal copy without saying so would be the actual problem here. */
          <p
            role="note"
            className="mt-8 max-w-[62ch] rounded-[12px] border-2 border-coral/30 bg-coral/10 px-5 py-4 text-[13.5px] leading-relaxed text-ink/75"
          >
            <strong className="head text-ink">Draft.</strong> This page has not been
            reviewed by a legal professional. It is structured correctly and written
            against how this site actually works, but it should not be relied on until
            it has been checked and signed off.
          </p>
        )}

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-16">
          <LegalToc sections={doc.sections} />

          <div className="max-w-[68ch]">
            {doc.sections.map((s, i) => (
              <section key={s.id} className="scroll-mt-[94px] border-t-2 border-ink/10 pt-8 [&:not(:first-child)]:mt-12">
                <h2 id={s.id} className="head flex gap-3 text-[clamp(1.15rem,3.4vw,1.4rem)] text-ink">
                  <span className="text-coral">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </h2>
                {s.body.map((para) => (
                  <p key={para} className="mt-4 text-[15.5px] leading-[1.75] text-ink/70">
                    {para}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((item) => (
                      <li
                        key={item}
                        className="relative pl-6 text-[15.5px] leading-[1.75] text-ink/70"
                      >
                        <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-coral" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <p className="mt-12 border-t-2 border-ink/10 pt-8 text-[13.5px] leading-relaxed text-ink/45">
              Questions about anything on this page? Write to{" "}
              <ContactLink kind="email" className="text-coral underline-offset-2 hover:underline" />
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
