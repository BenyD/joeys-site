"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight } from "./icons";
import { MarkMail, MarkStar } from "./marks";
import { ArrowButton } from "./ui";
import { contactSchema } from "@/lib/contact";
import { scrollToHashSettling } from "@/lib/scroll";
import { contactReady, site } from "@/lib/site";

/*
 * Contact form.
 *
 * Posts to /api/contact, which relays through Resend. If
 * `site.contact.endpoint` is ever set back to null the same submit falls back
 * to composing a pre-filled email in the visitor's mail client, so the form
 * still works rather than silently swallowing messages.
 *
 * The "share" topic turns this into a review form: stars, city and a consent
 * checkbox appear, and the API route sends a different email template. That
 * is deliberately the same form rather than a separate page - one pipeline,
 * one set of validation, one inbox.
 */

const TOPICS = [
  { value: "pack", label: "About a pack", anchor: "consumer" },
  { value: "share", label: "Share your experience", anchor: "share" },
  { value: "stockist", label: "Stockist and distribution", anchor: "stockists" },
  { value: "press", label: "Press and partnerships", anchor: "press" },
  { value: "other", label: "Something else", anchor: "" },
] as const;

/* How a route card upstairs tells the form which topic the visitor picked. */
const TOPIC_EVENT = "joeys:contact-topic";

/**
 * The CTA on each route card: scrolls to the form (the #send anchor, which the
 * browser smooth-scrolls natively) and preselects the matching topic. The
 * cards used to be mailto links, but the form already composes that email
 * itself, so sending the visitor to their mail client was a second, worse
 * path to the same place.
 */
export function TopicButton({ topic, children }: { topic: string; children: ReactNode }) {
  return (
    <ArrowButton
      href="#send"
      tone="coral"
      onClick={() => window.dispatchEvent(new CustomEvent(TOPIC_EVENT, { detail: topic }))}
    >
      {children}
    </ArrowButton>
  );
}

/*
 * Validation is the shared schema from lib/contact, minus the topic (that
 * comes from the chips, not a free field). The API route runs the full
 * schema again on arrival - the server never trusts that the browser ran
 * anything. The honeypot stays outside it - an empty string is exactly what
 * it should be.
 */
const clientSchema = contactSchema.omit({ topic: true });

type Errors = Partial<Record<"name" | "email" | "message" | "phone", string>>;
type Status = "idle" | "sending" | "composed" | "sent" | "error" | "unconfigured";

export function ContactForm() {
  const uid = useId();
  const [topic, setTopic] = useState<string>("pack");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  /* 0 means unrated, which is allowed: a review with no stars still counts. */
  const [rating, setRating] = useState(0);
  const sharing = topic === "share";

  // Arriving from a deep link, e.g. /contact#stockists, should preselect the
  // matching topic rather than making the visitor pick it a second time.
  useEffect(() => {
    /* Deferred a tick so the state write is not synchronous in the effect
       body (react-hooks/set-state-in-effect). A timeout rather than a frame:
       requestAnimationFrame is throttled to nothing while a tab is in the
       background, so a link opened in a new tab arrived with the topic
       unset until the visitor happened to look at it. */
    const t = window.setTimeout(() => {
      const hash = window.location.hash.replace("#", "");
      const match = TOPICS.find((t) => t.anchor && t.anchor === hash);
      if (!match) return;
      setTopic(match.value);
      /*
       * Land on the form, not on the route card the fragment names.
       *
       * A deep link like /contact#share - a QR code on a pack, say - means
       * "I want to write this kind of message", and the useful destination
       * is the form with the topic already chosen. The browser's own jump
       * aims at the card, which is one more tap before anything can be
       * typed, and in practice it did not even manage that: the fragment
       * resolves before the page has painted, so the visitor was left at
       * the top of the page wondering what the link had done.
       */
      scrollToHashSettling("send");
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // A route card's TopicButton announces its topic while the page scrolls
  // down to the form; adopt it so the select is already right on arrival.
  useEffect(() => {
    const onTopic = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (TOPICS.some((t) => t.value === value)) setTopic(value);
    };
    window.addEventListener(TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(TOPIC_EVENT, onTopic);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    // Bots fill hidden fields; people do not.
    if (get("company")) return;

    const parsed = clientSchema.safeParse({
      name: get("name"),
      email: get("email"),
      message: get("message"),
      batch: get("batch"),
      phone: get("phone"),
      city: get("city"),
      ...(sharing && rating ? { rating } : null),
      ...(sharing ? { consent: data.get("consent") === "on" } : null),
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          (key === "name" || key === "email" || key === "message" || key === "phone") &&
          !next[key]
        ) {
          next[key] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const { name, email, message, batch, phone, city, consent } = parsed.data;

    const label = TOPICS.find((t) => t.value === topic)?.label ?? "Enquiry";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      city ? `City: ${city}` : null,
      batch ? `Batch code: ${batch}` : null,
      sharing && rating ? `Rating: ${rating} out of 5` : null,
      sharing ? `Consent to publish: ${consent ? "yes" : "no"}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    setStatus("sending");

    // No endpoint and no address to fall back to: say so rather than appearing
    // to send. This clears itself the moment either one is filled in.
    if (!site.contact.endpoint && !contactReady) {
      setStatus("unconfigured");
      return;
    }

    if (!site.contact.endpoint) {
      window.location.href = `mailto:${site.supportEmail}?subject=${encodeURIComponent(
        label,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("composed");
      return;
    }

    fetch(site.contact.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        topic: label,
        batch,
        message,
        city,
        ...(sharing ? { rating: rating || undefined, consent: !!consent } : null),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        /* the success card replaces the form, so unmounting is the reset */
        setStatus("sent");
      })
      .catch(() => setStatus("error"));
  };

  const field =
    "h-[52px] w-full rounded-[10px] border-2 border-ink/10 bg-white/70 px-4 text-[16px] text-ink outline-none transition-colors duration-[180ms] placeholder:text-ink/35 focus-visible:border-coral sm:text-[15px]";
  const labelCls = "eyebrow mb-2 block uppercase text-ink/45";
  const errCls = "mt-1.5 text-[12.5px] text-coral";
  /* The red asterisk convention: marked means required, unmarked means
     optional. aria-hidden because the inputs carry aria-required - a screen
     reader should hear "required", not "star". */
  const req = (
    <span aria-hidden className="text-coral">
      {" "}*
    </span>
  );

  /*
   * A real send earns a real confirmation: the form gives way to a card
   * rather than mumbling a status line beside the button. Unmounting the
   * form is also what clears it, so "write another" starts fresh.
   */
  if (status === "sent") {
    return (
      <div className="rounded-[18px] border-2 border-ink/10 bg-white/55 px-6 py-10 text-center sm:px-10 sm:py-14">
        {sharing ? (
          <MarkStar className="mx-auto h-12 w-12" />
        ) : (
          <MarkMail className="mx-auto h-12 w-12" />
        )}
        <h3 className="display mt-5 text-[clamp(1.6rem,5vw,2.4rem)] text-ink">
          {sharing ? "Thank you, genuinely." : "Consider it heard."}
        </h3>
        <p className="mx-auto mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-ink/60">
          {sharing
            ? "Someone here is going to read that and grin. If we ever feature it, it will be your first name and city only."
            : "Your message is on its way to the support desk. We read everything, and we come back within a working day or two."}
        </p>
        <button
          type="button"
          onClick={() => {
            setRating(0);
            setStatus("idle");
          }}
          className="pressable head mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-[11px] border-2 border-ink/15 px-6 text-[13px] uppercase tracking-[0.03em] text-ink transition-colors duration-[180ms] hover:border-ink/40"
        >
          {sharing ? "Write another" : "Write another message"}
        </button>
      </div>
    );
  }

  /*
   * The layout is a stack of full rows: topic chips, then the short fields,
   * then the message across the whole measure. The short fields share one
   * row that RESIZES with the topic: name, email and phone in three columns,
   * four when "about a pack" adds the batch code, so the row is always
   * exactly full and there is never a stub field with dead space trailing
   * it. The topic select became chips because a row of pills is the house
   * language, shows every option at once, and makes the preselection from a
   * route card visible instead of buried in a dropdown.
   */
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`grid gap-5 sm:grid-cols-2 ${
        topic === "pack" || sharing ? "lg:grid-cols-4" : "lg:grid-cols-3"
      }`}
    >
      <fieldset className="sm:col-span-full">
        <legend className={labelCls}>What is it about</legend>
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((t) => (
            <label
              key={t.value}
              className={`head inline-flex min-h-[44px] cursor-pointer select-none items-center rounded-full border-2 px-4 text-[13px] uppercase tracking-[0.03em] transition-colors duration-[180ms] has-[:focus-visible]:border-coral ${
                topic === t.value
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-white/40 text-ink/60 hover:border-ink/35 hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={t.value}
                checked={topic === t.value}
                onChange={() => setTopic(t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Stars lead the review: it is the question people answer fastest, and
          seeing it first frames everything below as "tell us how it was".
          Radios under the hood, so arrow keys and screen readers work; the
          stars are just the skin. Staying unrated is allowed. */}
      {sharing && (
        <fieldset className="sm:col-span-full">
          <legend className={labelCls}>
            How was it <span className="normal-case text-ink/30">(optional)</span>
          </legend>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                title={`${n} out of 5`}
                className="cursor-pointer p-1 transition-transform duration-[140ms] hover:scale-110 has-[:focus-visible]:scale-110"
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="sr-only"
                />
                <MarkStar
                  aria-hidden
                  className={`h-8 w-8 transition-opacity duration-[140ms] ${
                    n <= rating ? "opacity-100" : "opacity-25"
                  }`}
                />
                <span className="sr-only">{n} out of 5</span>
              </label>
            ))}
            {rating > 0 && (
              <button
                type="button"
                onClick={() => setRating(0)}
                className="ml-2 text-[12.5px] text-ink/40 underline underline-offset-2 hover:text-ink/70"
              >
                Clear
              </button>
            )}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={`${uid}-name`} className={labelCls}>
          Your name{req}
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          autoComplete="name"
          aria-required="true"
          className={field}
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${uid}-name-err` : undefined}
        />
        {errors.name && (
          <p id={`${uid}-name-err`} className={errCls}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${uid}-email`} className={labelCls}>
          Email{req}
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-required="true"
          className={field}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${uid}-email-err` : undefined}
        />
        {errors.email && (
          <p id={`${uid}-email-err`} className={errCls}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={topic === "pack" || sharing ? "" : "sm:col-span-2 lg:col-span-1"}>
        <label htmlFor={`${uid}-phone`} className={labelCls}>
          Phone <span className="normal-case text-ink/30">(optional)</span>
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={field}
          placeholder="If calls are easier"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
        />
        {errors.phone && (
          <p id={`${uid}-phone-err`} className={errCls}>
            {errors.phone}
          </p>
        )}
      </div>

      {/* Both of these only appear when they are actually useful, and both
          take the same fourth column (the grid grows with them), pairing with
          the phone on the two-column tablet width, so the rows stay exactly
          full either way. */}
      {topic === "pack" && (
        <div>
          <label htmlFor={`${uid}-batch`} className={labelCls}>
            Batch code <span className="normal-case text-ink/30">(optional)</span>
          </label>
          <input
            id={`${uid}-batch`}
            name="batch"
            className={field}
            placeholder="Printed on the back"
          />
        </div>
      )}

      {/* A quote reads as a real person with a place attached: "Asha, from
          Coimbatore" beats a bare first name. */}
      {sharing && (
        <div>
          <label htmlFor={`${uid}-city`} className={labelCls}>
            City <span className="normal-case text-ink/30">(optional)</span>
          </label>
          <input
            id={`${uid}-city`}
            name="city"
            autoComplete="address-level2"
            className={field}
            placeholder="Where you are"
          />
        </div>
      )}

      <div className="sm:col-span-full">
        <label htmlFor={`${uid}-message`} className={labelCls}>
          {sharing ? "Your review" : "Message"}
          {req}
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={6}
          aria-required="true"
          className={`${field} h-auto py-3.5 leading-relaxed`}
          placeholder={
            sharing
              ? "Which flavour, and what did you make of it?"
              : "Tell us what is on your mind."
          }
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
        />
        {errors.message && (
          <p id={`${uid}-message-err`} className={errCls}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Consent, and only for reviews. Publishing someone's name and words
          needs them to have said yes, and the notification email flags the
          answer either way so nothing reaches the site without it. Unticked
          by default on purpose: a pre-ticked box is not consent. */}
      {sharing && (
        <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border-2 border-ink/10 bg-white/40 px-4 py-3.5 transition-colors duration-[180ms] hover:border-ink/25 has-[:focus-visible]:border-coral sm:col-span-full">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-coral"
          />
          <span className="text-[14px] leading-relaxed text-ink/70">
            Happy for Joey&rsquo;s to feature this on the website, with my first name
            {" "}and city. We will never publish your email or phone number.
          </span>
        </label>
      )}

      {/* Honeypot. Hidden from people and from screen readers, visible to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-full sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="pressable head group/s inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-[11px] bg-coral px-7 text-[14px] uppercase tracking-[0.03em] text-cream hover:bg-coral-dark disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : sharing ? "Send review" : "Send message"}
          <ArrowRight
            weight="bold"
            className="h-4 w-4 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/s:translate-x-1"
          />
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`text-[13.5px] leading-relaxed ${
            status === "error" ? "text-coral" : "text-ink/55"
          }`}
        >
          {status === "composed" &&
            "Your email app should have opened with the message ready. Press send there and it reaches us."}
          {status === "unconfigured" &&
            "This form is not connected yet, and there is no contact address on file for it to fall back to. Set site.contact.endpoint or site.supportEmail."}
          {status === "error" &&
            (contactReady
              ? `Something went wrong sending that. Please try again in a moment, or write to us directly at ${site.supportEmail}.`
              : "Something went wrong sending that. Please try again in a moment.")}
        </p>
      </div>
    </form>
  );
}
