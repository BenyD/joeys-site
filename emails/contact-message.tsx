import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { site } from "../src/lib/site";

/*
 * The email the contact form sends to the support desk: a visitor's message
 * dressed in the house style, so the inbox reads like the brand and replying
 * feels like part of the same conversation. This is also the house template
 * to copy from when the site grows more mail (testimonial thanks, stockist
 * follow-ups): the header, palette and footer are the reusable bones.
 *
 * Email-client rules apply here, not web rules: every style is inline (Gmail
 * strips stylesheets), the layout is tables via react-email's Section/Row,
 * the logo is an absolute URL to the live site, and fonts fall back to the
 * system stack because custom webfonts barely survive any inbox.
 */

const INK = "#3b0d14";
const CREAM = "#fbf3e4";
const GOLD = "#f5b921";
const CORAL = "#e0532e";
const SANS =
  "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

type ContactMessageProps = {
  name: string;
  email: string;
  topic: string;
  message: string;
  phone?: string;
  batch?: string;
};

export function ContactMessage({
  name,
  email,
  topic,
  message,
  phone,
  batch,
}: ContactMessageProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${topic} - ${name} wrote in from the website`}</Preview>
      <Body style={{ backgroundColor: CREAM, margin: 0, padding: "28px 12px", fontFamily: SANS }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          {/* ── header: the neon sign on the dark card ── */}
          <Section
            style={{
              backgroundColor: INK,
              borderRadius: "16px 16px 0 0",
              padding: "30px 0 24px",
              textAlign: "center" as const,
            }}
          >
            <Img
              src={`${site.url}/joeys-logo.png`}
              width="120"
              alt="Joey's"
              style={{ margin: "0 auto" }}
            />
            <Text
              style={{
                color: GOLD,
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase" as const,
                fontWeight: 700,
                margin: "18px 0 0",
              }}
            >
              New message from the website
            </Text>
          </Section>

          {/* ── body card ── */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "30px 34px 34px",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Heading
              as="h1"
              style={{ color: INK, fontSize: "24px", lineHeight: "1.2", margin: "0 0 4px" }}
            >
              {topic}
            </Heading>
            <Text style={{ color: "#8a6f66", fontSize: "14px", margin: "0 0 18px" }}>
              from {name}
            </Text>

            <Hr style={{ borderColor: "#eee2d4", margin: "0 0 22px" }} />

            {/* The message is the content, so it gets clean generous prose
                rather than a tinted pull-quote box: what someone actually
                wrote should read like a letter, not like a callout. The
                metadata below takes the tint instead - it is the reference
                material, and grouping it keeps the two apart at a glance. */}
            <Text
              style={{
                color: INK,
                fontSize: "16px",
                lineHeight: "1.7",
                margin: "0 0 26px",
                whiteSpace: "pre-wrap" as const,
              }}
            >
              {message}
            </Text>

            {/* sender details, one row per fact */}
            <Section
              style={{
                backgroundColor: CREAM,
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              {[
                ["Email", email],
                phone ? ["Phone", phone] : null,
                batch ? ["Batch code", batch] : null,
              ]
                .filter((row): row is [string, string] => row !== null)
                .map(([label, value], i, rows) => (
                  <Row key={label} style={{ marginBottom: i === rows.length - 1 ? 0 : "8px" }}>
                    <Column style={{ width: "104px", verticalAlign: "top" as const }}>
                      <Text
                        style={{
                          color: "#a58b80",
                          fontSize: "11px",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase" as const,
                          fontWeight: 700,
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        {label}
                      </Text>
                    </Column>
                    <Column>
                      <Text style={{ color: INK, fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                        {label === "Email" ? (
                          <Link href={`mailto:${value}`} style={{ color: CORAL }}>
                            {value}
                          </Link>
                        ) : (
                          value
                        )}
                      </Text>
                    </Column>
                  </Row>
                ))}
            </Section>

            {/* reply CTA */}
            <Section style={{ textAlign: "center" as const, marginTop: "26px" }}>
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${topic}`)}`}
                style={{
                  backgroundColor: CORAL,
                  color: "#fff7ec",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase" as const,
                  textDecoration: "none",
                  borderRadius: "11px",
                  padding: "14px 28px",
                  display: "inline-block",
                }}
              >
                Reply to {name.split(" ")[0]}
              </Link>
            </Section>
          </Section>

          {/* ── footer ──
              This email goes to the support desk, not to a customer, so the
              brand-and-legal-name boilerplate was noise: the reader works
              here. What is worth saying is the one thing that is not obvious
              - that hitting reply reaches the sender directly, because the
              route sets reply-to - and where the message came from. */}
          <Section style={{ textAlign: "center" as const, padding: "18px 10px 6px" }}>
            <Text style={{ color: "#a58b80", fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
              Hitting reply goes straight to {name.split(" ")[0]}.
              <br />
              Sent by the contact form on{" "}
              <Link href={site.url} style={{ color: "#a58b80", textDecoration: "underline" }}>
                {site.url.replace("https://www.", "").replace("https://", "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* What the react-email preview server renders. */
ContactMessage.PreviewProps = {
  name: "Asha Nair",
  email: "asha@example.com",
  phone: "+91 98765 43210",
  topic: "About a pack",
  batch: "A 240811 3",
  message:
    "Picked up the Smokey Bacon pack at a store in Coimbatore and it was the best crisp I have had in years.\n\nWhere else do you stock in the city? My local kirana has never heard of you.",
} satisfies ContactMessageProps;

export default ContactMessage;
