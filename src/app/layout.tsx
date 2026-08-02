import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, Figtree } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { NavigationTransitions } from "@/components/ViewTransitions";
import { site } from "@/lib/site";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_IN",
  },
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
        {/* Without JS the scroll reveals would never fire, so show everything up front. */}
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full bg-frame">
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
