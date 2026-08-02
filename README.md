# joey's

Brand site for **Joey's**, a range of 100% vegetarian flavoured potato crisps
marketed by Rita and Jo's Foods Private Limited: Barbecue Chicken, Smokey Bacon
and Prawn Cocktail.

Brand only. No cart, no accounts, no payments.

## Stack

Next.js 16 (App Router), React 19, Tailwind v4, TypeScript. Every route is
static, so it deploys anywhere; Vercel is the target.

```bash
pnpm install
pnpm dev                  # http://localhost:3000
pnpm build && pnpm start
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero, brand pillars, flavour rail, ingredients, closing CTA |
| `/flavours/[slug]` | One page per flavour, with the on-pack declarations |
| `/made` | Manufacturing facility, FSSAI licence, how to read a batch code |
| `/contact` | Contact form, three enquiry routes, direct details |
| `/legal/terms`, `/legal/privacy` | Legal pages with a sticky contents rail |
| `not-found`, `error`, `global-error` | Custom 404 and error boundaries |

## Where things live

```
src/lib/site.ts        brand facts, contact details, feature switches
src/lib/flavours.ts    the three flavours: copy, colours, artwork
src/lib/legal.ts       legal page content as structured data
src/components/        marks.tsx holds the hand-drawn brand illustrations
public/packs/          pack shots, background removed, plus circular crops
public/ingredients/    ingredient photography (CC0, see CREDITS.md)
```

The design language is a deliberate 1:1 of a reference layout the client
supplied. Section order, the inset dark page frame, the marquee strips and the
tilted pill labels are all intentional.

House rules worth knowing before editing:

- **No em dashes** anywhere in copy, including the client's own write-ups.
- **No emoji.** Brand marks are hand-drawn SVGs in `src/components/marks.tsx`;
  Phosphor is only for UI chrome like arrows and carets. The house rules are
  documented at the top of that file.
- **View transitions run against the native browser API**, not React's
  `<ViewTransition>`, which is absent from the React that Next 16.2 resolves.
  See `src/components/ViewTransitions.tsx` for the shared-element approach and
  why names are claimed at click time rather than written into markup.

## Outstanding

Everything below is marked `PLACEHOLDER` at its use site.

| Item | Where | Note |
| --- | --- | --- |
| Support email and phone | `src/lib/site.ts` | `[EMAIL]` and `[PHONE]`. `contactReady` stops them rendering as dead links |
| Domain | `src/lib/site.ts` | `url` is a `.example` placeholder |
| Retail links | `src/lib/site.ts` | `buy.enabled` is `false`, so every "where to buy" resolves to contact |
| Contact form endpoint | `src/lib/site.ts` | `contact.endpoint` is `null`; the form composes an email until it is set |
| Ingredient declaration | `src/app/page.tsx` | "Sunflower Oil" and "Sea Salt" are **unverified assumptions**, not from any client source. Check the back of a pack before launch |
| Legal review | `src/lib/legal.ts` | Drafts. Flip `reviewed: true` to drop the banner |
| Customer testimonials | `src/app/page.tsx` | The quote carousel runs on flavour copy, not real reviews |
| Social links | `src/lib/site.ts` | All `#` |

## Previewing the error page

The error boundary needs a thrown error, so `/preview-error` exists behind a
flag. Without it the route 404s and cannot fire in a normal build.

```bash
NEXT_PUBLIC_PREVIEW_ERRORS=1 pnpm build && pnpm start
# then open /preview-error
```

`pnpm dev` shows Next's own overlay on top, so use the production build.
