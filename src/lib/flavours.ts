export type Flavour = {
  slug: string;
  name: string;
  short: string;
  /** The three-beat strapline from the brand write-ups. */
  strap: string;
  copy: string;
  /** Pack base colour. */
  base: string;
  /** Flavour banner colour on pack. */
  band: string;
  /** Ink that reads on `band`. */
  bandInk: string;
  pack: string;
  disc: string;
  ring: string;
};

export const flavours: Flavour[] = [
  {
    slug: "barbecue-chicken",
    name: "Barbecue Chicken",
    short: "Barbecue",
    strap: "Grilled. Stage-lit. Sizzling.",
    copy: "Think open fire. Char on the edges. A marinade that's had hours to do its work. That's the experience we've chased: the primal, smoky warmth of real barbecue chicken, captured on a crisp you can eat with one hand while the other holds a cold drink. The Headliner of the Joey's line-up, and the flavour that'll earn its place as your default reach-in-the-bag choice.",
    base: "#5b1220",
    band: "#c8104c",
    bandInk: "#ffffff",
    pack: "/packs/barbecue-chicken.png",
    disc: "/packs/disc-barbecue-chicken.png",
    ring: "#e0532e",
  },
  {
    slug: "smokey-bacon",
    name: "Smokey Bacon",
    short: "Bacon",
    strap: "Slow-cured. Oak-smoked. Deep.",
    copy: "Bacon crisps are a rite of passage in every pub. That first crinkled foil packet hanging behind the bar. That unmistakable hit of smoke and salt. We've brought that experience to India without compromise, without shortcuts, and without a trace of meat. Just deep, slow, oak-smoked flavour on a crisp that earns its keep long after the first bite. This is the one you savour. The one you don't want to end.",
    base: "#141c3a",
    band: "#cf1348",
    bandInk: "#ffffff",
    pack: "/packs/smokey-bacon.png",
    disc: "/packs/disc-smokey-bacon.png",
    ring: "#f5b921",
  },
  {
    slug: "prawn-cocktail",
    name: "Prawn Cocktail",
    short: "Prawn",
    strap: "Sharp. Cold. Coastal.",
    copy: "Prawn Cocktail is the flavour that turned pub snacking into a religion. It sounds unlikely until the first bite and after that, you get it completely. That tangy, briny, subtly sweet combination that somehow works on a potato crisp better than it has any right to. We've kept it true to its roots: crisp, clean, sharp on the tongue, and gone before you're ready. Perfect before a meal, between conversations, or whenever you need something that cuts through.",
    base: "#3d1030",
    band: "#f0a81c",
    bandInk: "#3b0d14",
    pack: "/packs/prawn-cocktail.png",
    disc: "/packs/disc-prawn-cocktail.png",
    ring: "#ef8fa6",
  },
];

export const getFlavour = (slug: string) => flavours.find((f) => f.slug === slug);
