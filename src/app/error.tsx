"use client";

import { useEffect } from "react";
import { Doodles } from "@/components/Doodles";
import { ArrowRight } from "@/components/icons";
import { MarkBatch } from "@/components/marks";
import { ArrowButton, Accent, Pill } from "@/components/ui";
import { ContactLink } from "@/components/ContactLink";
import { site } from "@/lib/site";

/**
 * Runtime error boundary for everything under the root layout.
 *
 * Says the fault is ours, because at this point it is: the visitor did nothing
 * but click. `reset()` re-renders the failed segment without a full reload, so
 * a transient failure costs one click rather than a page load.
 *
 * The digest is the only handle support has on which error actually happened,
 * so it is shown rather than swallowed. Next strips the real message in
 * production on purpose; this is what remains.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // PLACEHOLDER - point this at Sentry or whatever you end up using. Until
    // then the console is the only record that anything went wrong.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <section className="px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4">
      <div className="relative overflow-hidden rounded-[14px] bg-gold px-5 py-16 text-center sm:px-10 sm:py-24">
        <Doodles color="#3b0d14" opacity={0.2} clearCentre />
        <div className="relative mx-auto max-w-[720px]">
          <Pill tone="ink">Something broke</Pill>
          <h1 className="display mt-5 text-[clamp(2.2rem,6.5vw,3.8rem)] text-ink">
            That one&rsquo;s <Accent>on us</Accent>
          </h1>
          <p className="mx-auto mt-5 max-w-[48ch] text-[15px] leading-relaxed text-ink/70">
            This page failed to load properly. Nothing you did caused it. Try again, and
            if it keeps happening we would genuinely like to know.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-3.5">
            <button
              type="button"
              onClick={reset}
              className="pressable head group/r inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-[11px] bg-coral px-7 text-[14px] uppercase tracking-[0.03em] text-cream hover:bg-coral-dark"
            >
              Try again
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/r:translate-x-1"
              />
            </button>
            <ArrowButton href="/" tone="cream">
              Back to the start
            </ArrowButton>
          </div>

          {error.digest && (
            <p className="mx-auto mt-9 inline-flex items-center gap-2.5 rounded-[10px] bg-ink/10 px-4 py-2.5 text-[12.5px] text-ink/60">
              <MarkBatch className="h-5 w-5 shrink-0" />
              Reference <code className="font-mono text-ink">{error.digest}</code>
            </p>
          )}

          <p className="mt-6 text-[13px] text-ink/50">
            Still stuck? Write to{" "}
            <ContactLink
              kind="email"
              subject={`Site error${error.digest ? ` (${error.digest})` : ""}`}
              className="text-coral underline-offset-2 hover:underline"
            />
            .
          </p>
        </div>
      </div>
    </section>
  );
}
