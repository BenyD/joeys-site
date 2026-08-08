import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { ContactMessage } from "../../../../emails/contact-message";
import { Testimonial } from "../../../../emails/testimonial";
import { contactSchema } from "@/lib/contact";
import { site } from "@/lib/site";

/*
 * The contact form's real destination. Validates the payload against the same
 * schema the client used, then relays it to the support inbox through Resend.
 *
 * Configuration lives in env, never in the repo:
 *   RESEND_API_KEY  required. Without it this responds 503 and the form tells
 *                   the visitor to email directly instead of pretending.
 *   CONTACT_FROM    optional. Defaults to Resend's sandbox sender, which only
 *                   delivers to the Resend account owner's own address - fine
 *                   for testing, wrong for launch. Verify ritaandjosfoods.com
 *                   in Resend and set something like
 *                   "Joey's Website <website@ritaandjosfoods.com>".
 *   CONTACT_TO      optional. Overrides the support inbox as the recipient.
 *                   Needed while testing on the sandbox sender, because Resend
 *                   will only deliver sandbox mail to the account owner's own
 *                   address; remove it at launch and mail flows to
 *                   site.supportEmail.
 *
 * This is the one non-static route on the site; on Vercel it deploys as a
 * serverless function and everything else stays static.
 */

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  /* Honeypot: bots fill hidden fields, people do not. Pretend success so the
     bot moves on happy, and send nothing. */
  if (typeof body === "object" && body !== null && "company" in body && body.company) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }

  const { name, email, phone, topic, batch, message, city, rating, consent } = parsed.data;

  /* Reviews get their own template: stars, the quote set large, and the
     consent answer as a banner nobody can skim past. Everything else gets
     the standard message layout. Both live in emails/ and are previewable
     with `pnpm email`. The plain-text twin rides along for clients that want
     it and for deliverability. */
  const isReview = rating !== undefined || consent !== undefined;
  const html = await render(
    isReview
      ? Testimonial({ name, email, phone, city, rating, consent, message })
      : ContactMessage({ name, email, phone, topic, batch, message }),
  );
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    city ? `City: ${city}` : null,
    batch ? `Batch code: ${batch}` : null,
    rating ? `Rating: ${rating} out of 5` : null,
    isReview ? `Consent to publish: ${consent ? "yes" : "NO - do not publish"}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Joey's Website <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? site.supportEmail],
      /* replies from the support desk go straight back to the visitor */
      reply_to: email,
      subject: isReview
        ? `${rating ? `${rating}★ ` : ""}Review from ${[name, city].filter(Boolean).join(", ")}`
        : `${topic}: ${name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Send failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
