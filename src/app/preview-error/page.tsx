import { notFound } from "next/navigation";

/**
 * Throws on purpose, so the error boundary in app/error.tsx can be looked at.
 *
 * Gated behind an env flag rather than deleted after use, because the error page
 * is the one screen nobody sees until it matters and it should stay reviewable.
 * Without the flag this route 404s, so it cannot fire in a normal build.
 *
 *   NEXT_PUBLIC_PREVIEW_ERRORS=1 pnpm build && pnpm start
 *   then open /preview-error
 *
 * force-dynamic keeps it out of the static export (a throw at build time would
 * fail the build) and makes it fail on the server at request time, which is what
 * produces the digest reference the error page shows. A client-side throw has no
 * digest, so it would only exercise half the page.
 */
export const dynamic = "force-dynamic";

export default function PreviewError() {
  if (process.env.NEXT_PUBLIC_PREVIEW_ERRORS !== "1") notFound();
  throw new Error("Deliberate error, triggered from /preview-error");
}
