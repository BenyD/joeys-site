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
   * PLACEHOLDER - awaiting client. Bracketed on purpose, matching the client's
   * own `[support email / phone to be added]` in the manufacturing document, so
   * these read as obviously unfilled rather than as a plausible address someone
   * might ship. `contactReady` below keeps them from becoming broken links.
   */
  supportEmail: "[EMAIL]",
  supportPhone: "[PHONE]",
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

  social: [
    { label: "Instagram", href: "#" }, // PLACEHOLDER
    { label: "Facebook", href: "#" }, // PLACEHOLDER
    { label: "X", href: "#" }, // PLACEHOLDER
    { label: "LinkedIn", href: "#" }, // PLACEHOLDER
  ],

  manufacturer: {
    name: "Podaran Snacks",
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
