import { site } from "./site";

/**
 * Legal page content.
 *
 * ⚠ THESE ARE DRAFTS, NOT REVIEWED LEGAL TEXT. They follow the structure a
 * brand-only site in India is expected to have (Information Technology
 * (Intermediary Guidelines) rules for the terms, the Digital Personal Data
 * Protection Act 2023 for the privacy policy, including the grievance officer
 * that Act requires), and they are written against how this site actually
 * behaves today: no accounts, no payments, no cart, one contact email.
 *
 * They still need a lawyer to read them before launch, and they need revisiting
 * the moment the site starts taking orders, running analytics, or collecting
 * anything beyond an email. The banner on the page says as much to the reader;
 * remove it once the text has been signed off.
 */

export type LegalSection = {
  id: string;
  heading: string;
  /** Plain paragraphs. Strings only, so the content stays reviewable as prose. */
  body: string[];
  list?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  /** Fixed, not generated: a date that moves every build is worse than none. */
  updated: string;
  reviewed: boolean;
  sections: LegalSection[];
};

const UPDATED = "2 August 2026";

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Use",
  eyebrow: "Legal",
  intro: `These terms govern your use of the ${site.name} website. Please read them before using the site.`,
  updated: UPDATED,
  reviewed: false,
  sections: [
    {
      id: "about",
      heading: "About these terms",
      body: [
        `This website is published by ${site.legalName}, which markets the ${site.brandLine} range. By browsing the site you agree to these terms. If you do not agree with them, please stop using the site.`,
        "We may update these terms from time to time. The date at the top of this page shows when they last changed, and continuing to use the site after a change means you accept the updated version.",
      ],
    },
    {
      id: "site",
      heading: "Using this site",
      body: [
        "This site exists to tell you about our products. It does not sell anything, take payment, or hold an account for you.",
        "You agree not to use the site in any way that is unlawful, that interferes with anyone else's use of it, or that attempts to gain access to systems or data you have no right to.",
      ],
    },
    {
      id: "product-information",
      heading: "Product information and pack declarations",
      body: [
        "We take care to describe our products accurately, but the pack itself is the authoritative source. Net weight, maximum retail price, ingredients, allergen information, nutritional values, batch code and date markings are printed on every pack, and those printed declarations prevail over anything stated here if the two ever differ.",
        "Product photography and serving suggestions on this site are indicative. They do not show the actual contents of a pack.",
        "Prices shown are the maximum retail price printed on the pack, inclusive of all taxes. Individual retailers set their own selling price and may charge less.",
        "Recipes and specifications can change. If you have an allergy or a dietary requirement, read the pack in front of you rather than relying on this site.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      body: [
        `The ${site.name} name, logo, pack designs, photography and the text on this site belong to ${site.legalName} or are used with permission. You may not reproduce them commercially without our written consent.`,
        "You are welcome to link to this site, and to share our pages as they are.",
      ],
    },
    {
      id: "third-party-links",
      heading: "Links to other sites",
      body: [
        "Where we link out, for example to the Food Safety and Standards Authority of India licence register, we do so because the destination is useful. We do not control those sites and are not responsible for their content or their privacy practices.",
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      body: [
        "We work to keep this site accurate and available, but we do not guarantee that it will be uninterrupted or free of errors.",
        "To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of this site. Nothing here limits liability that cannot be limited under Indian law, including liability relating to the safety of the products themselves.",
      ],
    },
    {
      id: "governing-law",
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of India, and the courts of India have exclusive jurisdiction over any dispute arising from them.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: [
        `For any question about these terms, or about a specific pack, write to ${site.supportEmail} or call ${site.supportPhone}. If you are asking about a pack, please include the batch code printed on the back so we can trace it.`,
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  eyebrow: "Legal",
  intro: `How ${site.legalName} handles personal data collected through this website.`,
  updated: UPDATED,
  reviewed: false,
  sections: [
    {
      id: "about",
      heading: "About this policy",
      body: [
        `${site.legalName} is the data fiduciary for personal data collected through this site, within the meaning of the Digital Personal Data Protection Act 2023.`,
        "This policy covers the website only. It does not cover data you give a retailer, a delivery platform, or a social media service you reach us through, since those are handled under their own policies.",
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: [
        "This site has no accounts, no cart and no payment. We collect very little.",
      ],
      list: [
        "If you email or call us, whatever you choose to tell us: your name, your contact details, and the content of your message.",
        "Standard technical information your browser sends to our hosting provider when a page loads, such as your IP address, device type and the pages you visited. This is used to keep the site running and secure.",
      ],
    },
    {
      id: "how-we-use-it",
      heading: "How we use it",
      body: [
        "We use what you send us to answer you, and to investigate any product query you raise. If you give us a batch code, we use it to trace that batch with our manufacturing partner.",
        "We use technical information in aggregate to understand whether the site is working and to protect it from abuse. We do not use it to build a profile of you.",
        "We do not sell personal data, and we do not use it for advertising.",
      ],
    },
    {
      id: "legal-basis",
      heading: "Consent and lawful use",
      body: [
        "Where you contact us, we process your data on the basis of the consent you give by getting in touch for that purpose. You may withdraw that consent at any time, and we will stop using your data except where we are required to keep it.",
      ],
    },
    {
      id: "sharing",
      heading: "Who we share it with",
      body: [
        "We share personal data only where it is needed to answer you or where the law requires it.",
      ],
      list: [
        "Our manufacturing partner, where a query concerns a specific batch and needs to be traced at the facility.",
        "Service providers who host this site and carry our email, acting on our instructions.",
        "Regulators or authorities, where we are legally obliged to respond.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body: [
        "We keep correspondence for as long as it takes to resolve your query, and for a reasonable period afterwards in case you come back to us about the same thing. Records connected to a food safety query are kept for as long as food safety law requires.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: [
        "Under the Digital Personal Data Protection Act 2023 you have the right to ask what personal data of yours we hold, to have it corrected or completed, to have it erased, to withdraw consent, and to nominate someone to exercise these rights on your behalf if you are unable to.",
        `To exercise any of these, write to ${site.supportEmail}.`,
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      body: [
        "This site does not set advertising or tracking cookies. If that changes, this policy will be updated first and you will be asked for consent where the law requires it.",
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: [
        "This site is not directed at children, and we do not knowingly collect personal data from anyone under 18 without verifiable parental consent. If you believe we hold such data, tell us and we will delete it.",
      ],
    },
    {
      id: "grievance-officer",
      heading: "Grievance officer",
      body: [
        "If you are unhappy with how we have handled your personal data, you can raise it with our grievance officer, who is required to respond within the period set by law.",
        // PLACEHOLDER - the Act requires a named individual, not a generic inbox.
        `Name and designation to be confirmed. Reachable at ${site.supportEmail}, or by post at ${site.legalName}.`,
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        "If this policy changes, the revised version will appear here with a new date at the top of the page.",
      ],
    },
  ],
};

export const legalDocs = [terms, privacy];
export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);
