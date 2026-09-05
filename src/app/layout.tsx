import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, Figtree } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { NavigationTransitions } from "@/components/ViewTransitions";
import { site } from "@/lib/site";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

/* Search-tuned copy, kept apart from `site.description` (which reads as prose
   on the page): title under 60 chars with the product keyword front-loaded,
   description ~150 chars with the payload inside the first 110 for mobile. */
const seoTitle = `${site.brandLine} | 100% Vegetarian, Made in India`;
const seoDescription =
  "100% vegetarian potato crisps in three legendary flavours — Barbecue Chicken, " +
  `Smokey Bacon and Prawn Cocktail. Made in India. ${site.pack.weight} pack, ${site.pack.mrp}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seoTitle,
    template: `%s | ${site.name}`,
  },
  description: seoDescription,
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} neon logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/og.png"],
  },
};

/* The entity graph answer engines resolve the brand against. Organization and
   WebSite live on every page; each flavour page adds its Product node. */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  logo: `${site.url}/joeys-logo.png`,
  sameAs: site.social.enabled ? site.social.links.map((s) => s.href) : undefined,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: site.supportEmail,
    telephone: site.supportPhone.replace(/\s/g, ""),
    areaServed: "IN",
    availableLanguage: "en",
  },
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.brandLine,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // No id="top" on <html> on purpose. With one, "#top" resolves to an element
    // - and that element is the root, whose box already encloses the viewport,
    // so scrolling it into view is ambiguous at best. Without one, the HTML
    // spec's own rule applies: a "top" fragment matching nothing means the top
    // of the document. Well defined everywhere, and it is what the footer link
    // falls back to before JS loads.
    <html
      lang="en"
      className={`${anton.variable} ${bricolage.variable} ${figtree.variable} h-full antialiased`}
    >
      <head>
        {/* Without JS the scroll reveals would never fire, so show everything
            up front. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full bg-frame">
        <JsonLd data={organizationLd} />
        <JsonLd data={webSiteLd} />
        {/*
          The reference frames the whole page as an inset card on its darkest
          colour. Padding has to be even on all four sides: with no top padding
          the card's rounded corners clip the nav right at the viewport edge and
          read as a stray arc.
        */}
        <div className="mx-auto max-w-[1560px] sm:p-4">
          {/*
            Two things to leave alone here:

            1. overflow-clip, not -hidden. -hidden would make this a scroll
               container and the sticky nav would stop sticking.
            2. No background on this element. A rounded clip antialiases its
               curve, and whatever the *clipping* element paints bleeds through
               that seam on top of the child inside it. With bg-cream here you
               get a pale hairline arc tracing the corner over the dark nav.
               The cream lives on <main> instead, so the only thing behind the
               nav and footer corners is the body, which is the same ink they
               are, and the seam has nothing to reveal.
          */}
          <div className="overflow-clip sm:rounded-[18px]">
            <NavigationTransitions />
            <Nav />
            <main className="bg-cream">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
