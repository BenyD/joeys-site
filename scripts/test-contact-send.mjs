#!/usr/bin/env node
/**
 * Live send probe for the contact form.
 *
 * Hits POST /api/contact on a running Next server so the real React Email
 * templates go out through Resend. Start the app first (`pnpm dev`).
 *
 *   pnpm test:contact
 */

const BASE = process.env.CONTACT_TEST_URL ?? "http://localhost:3000";

const invalid = await fetch(`${BASE}/api/contact`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "", email: "not-an-email", topic: "", message: "short" }),
});
const invalidBody = await invalid.json();
if (invalid.status !== 422) {
  console.error("Validation test failed. Expected 422, got", invalid.status, invalidBody);
  process.exit(1);
}
console.log("Validation test passed (422).");

const payload = {
  name: "Local setup test",
  email: "benydishon@gmail.com",
  phone: "+91 96006 16019",
  topic: "About a pack",
  batch: "TEST 250905 1",
  message:
    "This is a local setup test of the Joey's contact form. Safe to ignore. Confirming Resend + React Email delivery.",
};

const res = await fetch(`${BASE}/api/contact`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const body = await res.text();
let json;
try {
  json = JSON.parse(body);
} catch {
  json = { raw: body };
}

console.log(JSON.stringify({ status: res.status, ok: res.ok, body: json }, null, 2));

if (!res.ok || json.ok !== true) {
  console.error("\nContact send failed.");
  process.exit(1);
}

console.log("\nContact send passed. Check customer.support@ritaandjosfoods.com for the Joey's template.");
