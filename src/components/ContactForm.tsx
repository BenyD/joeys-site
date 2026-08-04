"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { ArrowRight } from "./icons";
import { contactReady, site } from "@/lib/site";

/*
 * Contact form.
 *
 * Not wired to a backend yet, and deliberately not pretending to be. Until
 * `site.contact.endpoint` is set, submitting composes a pre-filled email and
 * hands it to the visitor's mail client; the message still reaches you, and
 * nothing is silently dropped. Point `endpoint` at a route handler or a form
 * service and the same submit starts POSTing JSON instead. Nothing else here
 * needs to change.
 */

const TOPICS = [
  { value: "pack", label: "About a pack", anchor: "consumer" },
  { value: "stockist", label: "Stockist and distribution", anchor: "stockists" },
  { value: "press", label: "Press and partnerships", anchor: "press" },
  { value: "other", label: "Something else", anchor: "" },
] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "composed" | "sent" | "error" | "unconfigured";

export function ContactForm() {
  const uid = useId();
  const [topic, setTopic] = useState<string>("pack");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Arriving from a route card, e.g. /contact#stockists, should preselect the
  // matching topic rather than making the visitor pick it a second time.
  useEffect(() => {
    /* deferred a frame so the state write is not synchronous in the effect
       body (react-hooks/set-state-in-effect); paint has not happened yet */
    const raf = requestAnimationFrame(() => {
      const hash = window.location.hash.replace("#", "");
      const match = TOPICS.find((t) => t.anchor && t.anchor === hash);
      if (match) setTopic(match.value);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    // Bots fill hidden fields; people do not.
    if (get("company")) return;

    const name = get("name");
    const email = get("email");
    const message = get("message");
    const batch = get("batch");

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "We need an address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That address looks incomplete.";
    if (message.length < 10) next.message = "A little more detail would help.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const label = TOPICS.find((t) => t.value === topic)?.label ?? "Enquiry";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      batch ? `Batch code: ${batch}` : null,
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
      body: JSON.stringify({ name, email, topic: label, batch, message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        setStatus("sent");
        e.currentTarget?.reset?.();
      })
      .catch(() => setStatus("error"));
  };

  const field =
    "h-[52px] w-full rounded-[10px] border-2 border-ink/10 bg-white/70 px-4 text-[16px] text-ink outline-none transition-colors duration-[180ms] placeholder:text-ink/35 focus-visible:border-coral sm:text-[15px]";
  const labelCls = "eyebrow mb-2 block uppercase text-ink/45";
  const errCls = "mt-1.5 text-[12.5px] text-coral";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label htmlFor={`${uid}-name`} className={labelCls}>
          Your name
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          autoComplete="name"
          className={field}
          placeholder="Jane Mathew"
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
          Email
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
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

      <div className={topic === "pack" ? "" : "sm:col-span-2 lg:col-span-1"}>
        <label htmlFor={`${uid}-topic`} className={labelCls}>
          What is it about
        </label>
        <select
          id={`${uid}-topic`}
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6" fill="%233b0d14"><path d="M0 0h10L5 6z"/></svg>')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat pr-10`}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Only worth asking when it is actually useful. */}
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

      {/* Fills the row beside the batch field when that is showing, otherwise
          takes the full measure. Without this the second row has a hole in it. */}
      <div
        className={`sm:col-span-2 ${topic === "pack" ? "lg:col-span-2" : "lg:col-span-3"}`}
      >
        <label htmlFor={`${uid}-message`} className={labelCls}>
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          className={`${field} h-auto py-3.5 leading-relaxed`}
          placeholder="Tell us what is on your mind."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
        />
        {errors.message && (
          <p id={`${uid}-message-err`} className={errCls}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from people and from screen readers, visible to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center lg:col-span-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="pressable head group/s inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-[11px] bg-coral px-7 text-[14px] uppercase tracking-[0.03em] text-cream hover:bg-coral-dark disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : "Send message"}
          <ArrowRight
            weight="bold"
            className="h-4 w-4 transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/s:translate-x-1"
          />
        </button>

        <p role="status" aria-live="polite" className="text-[13.5px] leading-relaxed text-ink/55">
          {status === "composed" &&
            "Your email app should have opened with the message ready. Press send there and it reaches us."}
          {status === "sent" && "Thanks, that has reached us. We will come back to you."}
          {status === "unconfigured" &&
            "This form is not connected yet, and there is no contact address on file for it to fall back to. Set site.contact.endpoint or site.supportEmail."}
          {status === "error" &&
            "Something went wrong sending that. Please try again in a moment."}
        </p>
      </div>
    </form>
  );
}
