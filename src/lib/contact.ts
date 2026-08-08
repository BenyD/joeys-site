import { z } from "zod";

/*
 * One schema, both sides of the wire. The client form validates with a pick
 * of this before submitting, and the API route validates the full payload
 * again on arrival - the server never trusts that the browser ran anything.
 * Messages keep the house voice because the client surfaces them directly.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "We need an address to reply to.")
    .email("That address looks incomplete.")
    .max(200),
  topic: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10, "A little more detail would help.").max(5000),
  batch: z.string().trim().max(60).optional(),
  /* optional, so empty is fine; anything typed has to look like a number */
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || /^[+0-9][0-9 ()-]{6,}$/.test(v), "That number looks incomplete.")
    .optional(),

  /*
   * Testimonial fields. Only the "Share your experience" topic sends these,
   * and none of them is required - a review with no stars and no city is
   * still worth reading. `consent` is the one that decides publishability:
   * nothing goes on the site without it, so the notification email flags it
   * loudly either way.
   */
  city: z.string().trim().max(80).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  consent: z.boolean().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
