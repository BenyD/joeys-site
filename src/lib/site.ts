/**
 * Single source of truth for brand facts and the bits still awaiting client input.
 *
 * Everything marked PLACEHOLDER is safe to swap without touching a component.
 */

export const site = {
  name: "Joey's",
  legalName: "Rita and Jo's Foods Private Limited",
  brandLine: "Joey's Potato Crisps",
  tagline: "Showtime for one.",
  description:
    "Joey's is a range of 100% vegetarian flavoured potato crisps: Barbecue Chicken, Smokey Bacon and Prawn Cocktail, made in Tamil Nadu, India.",

  /*
   * Supplied by the client. Filling these flips `contactReady` below to true on
   * its own, which turns every support address and number on the site from inert
   * text into a real mailto:/tel: link. Nothing else needed changing.
   *
   * The email is stored lowercase; it was given in caps, and while mail servers
   * treat the domain case-insensitively (and every real-world local part too),
   * lowercase is what reads as an address rather than as shouting.
   *
   * The number is a 10-digit Indian mobile, written with the +91 country code so
   * it dials from outside India as well. `tel:` strips the spaces, so the link
   * resolves to +919600616019.
   */
  supportEmail: "customer.support@ritaandjosfoods.com",
  supportPhone: "+91 96006 16019",
  supportHours: "9.00 am to 6.00 pm",
  url: "https://joeys.example",

  /*
   * PLACEHOLDER - the contact form has nowhere to POST yet.
   *
   * While `endpoint` is null the form composes a pre-filled email instead of
   * submitting, so it works today rather than silently swallowing messages.
   * Set this to a route handler or a form service and the same form starts
   * POSTing JSON; nothing else needs to change.
   */
  contact: {
    endpoint: null as string | null,
  },

  // PLACEHOLDER - no e-commerce yet. Set `enabled: true` once retail links exist and
  // every "Where to buy" CTA switches from the notify form to real destinations.
  buy: {
    enabled: false,
    links: [] as { label: string; href: string }[],
  },

  /*
   * Hidden for now - the accounts do not exist yet, so the footer column was
   * four links to "#". Set `enabled: true` and fill in the hrefs and the column
   * comes back on its own; the footer grid adapts to it. Same pattern as `buy`.
   */
  social: {
    enabled: false,
    links: [
      { label: "Instagram", href: "#" }, // PLACEHOLDER
      { label: "Facebook", href: "#" }, // PLACEHOLDER
      { label: "X", href: "#" }, // PLACEHOLDER
      { label: "LinkedIn", href: "#" }, // PLACEHOLDER
    ],
  },

  manufacturer: {
    /*
     * The "A - " prefix is the facility letter, not part of the company name.
     * It exists so a second manufacturer can join as "B - ..." without every
     * reference to this one having to be rewritten to disambiguate. Kept inside
     * the name because every place the facility is shown wants it: the footer
     * declaration, the facility card, and the batch key on /made all read from
     * this single value.
     */
    name: "A - Podaran Snacks",
    locality: "Kangayam, Tirupur District",
    region: "Tamil Nadu, India",
    address: [
      "D. No. 6/307-1, Aruvankattu Thottam,",
      "Mulvadipalayam, Palayakottai Village,",
      "Kangayam – 638 701,",
      "Tirupur District, Tamil Nadu.",
    ],
    fssai: "10020042006892",
    fssaiVerifyUrl: "https://foscos.fssai.gov.in",
    batchChar: "★",
  },

  pack: {
    weight: "42.5g",
    mrp: "₹25",
    vegetarian: "100% Veg",
    serve: "22g",
    energy: "103 Kcal",
    rda: "5%",
  },
} as const;

/**
 * False while the contact details are still placeholders. Anything that would
 * otherwise render `mailto:[EMAIL]` checks this and falls back to plain text or
 * to the contact form instead of shipping a dead link.
 *
 * Now true - the real address and number are in. The guard stays because it costs
 * nothing and catches a regression if either value is ever blanked back out.
 */
export const contactReady =
  !site.supportEmail.startsWith("[") && !site.supportPhone.startsWith("[");

export const nav = [
  { label: "Flavours", href: "/#flavours" },
  { label: "What's inside", href: "/#inside" },
  { label: "How it's made", href: "/made" },
  { label: "Our story", href: "/#story" },
  { label: "Contact", href: "/contact" },
];
