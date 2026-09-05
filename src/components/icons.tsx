/**
 * Icon vocabulary for the site.
 *
 * Phosphor Icons - the set with the widest reach among product designers, and
 * the only mainstream one shipping six weights from a single family, which is
 * what lets a chunky brand like this use `duotone` for feature marks and `bold`
 * for inline UI without mixing metaphors.
 *
 * Imported from the `/ssr` entry so these stay server components: the package
 * root is marked "use client" and would drag every page across the boundary.
 *
 * Swapping icon sets later means editing this file only.
 */
export {
  Flame,
  Leaf,
  Plant,
  Drop,
  Waves,
  Pepper,
  Prohibit,
  Package,
  Barcode,
  Certificate,
  CookingPot,
  ForkKnife,
  Cookie,
  Star,
  Asterisk,
  PaperPlaneTilt,
  EnvelopeSimple,
  ArrowRight,
  CaretDown,
  CaretLeft,
  ArrowUp,
  CaretDoubleUp,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";

import type { ComponentProps, ComponentType } from "react";
import type { ArrowRight as _Ref } from "@phosphor-icons/react/dist/ssr";

/** Shape shared by every Phosphor glyph, for typing icon lookup tables. */
export type Icon = ComponentType<ComponentProps<typeof _Ref>>;
