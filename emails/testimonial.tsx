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
 * What the support desk gets when someone sends a review through the
 * "Share your experience" topic on the contact form.
 *
 * Same bones as contact-message.tsx (header, palette, footer) because they
 * are the house email; what differs is what the desk needs at a glance:
 *
 *   1. The stars, rendered as stars.
 *   2. The quote, set large - it is the thing that might end up on the site.
 *   3. The consent answer, unmissable. Nothing gets published without a yes,
 *      so the banner is green for yes and red for no rather than a line of
 *      small print someone skims past.
 */

const INK = "#3b0d14";
const CREAM = "#fbf3e4";
const GOLD = "#f5b921";
const CORAL = "#e0532e";
const SANS =
  "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

type TestimonialProps = {
  name: string;
  email: string;
  message: string;
  rating?: number;
  city?: string;
  phone?: string;
  consent?: boolean;
};

export function Testimonial({
  name,
  email,
  message,
  rating,
  city,
  phone,
  consent,
}: TestimonialProps) {
  const who = [name, city].filter(Boolean).join(", ");

  return (
    <Html>
      <Head />
      <Preview>{`${rating ? `${rating} stars` : "A review"} from ${who}`}</Preview>
      <Body style={{ backgroundColor: CREAM, margin: 0, padding: "28px 12px", fontFamily: SANS }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          {/* ── header ── */}
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
              Someone reviewed the crisps
            </Text>
          </Section>

          {/* ── body ── */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "30px 34px 34px",
              borderRadius: "0 0 16px 16px",
            }}
          >
            {/* stars, as characters so every client renders them */}
            {rating ? (
              <Text
                style={{
                  fontSize: "26px",
                  letterSpacing: "3px",
                  lineHeight: "1.2",
                  margin: "0 0 12px",
                  color: GOLD,
                }}
              >
                {"★".repeat(rating)}
                <span style={{ color: "#e6dccb" }}>{"★".repeat(5 - rating)}</span>
                <span style={{ fontSize: "13px", color: "#a58b80", letterSpacing: "0" }}>
                  {"  "}
                  {rating} of 5
                </span>
              </Text>
            ) : (
              <Text style={{ fontSize: "13px", color: "#a58b80", margin: "0 0 12px" }}>
                No rating given
              </Text>
            )}

            <Heading
              as="h1"
              style={{ color: INK, fontSize: "20px", lineHeight: "1.3", margin: "0 0 18px" }}
            >
              {who}
            </Heading>

            <Hr style={{ borderColor: "#eee2d4", margin: "0 0 22px" }} />

            {/* the quote, set large: this is the candidate copy */}
            <Text
              style={{
                color: INK,
                fontSize: "18px",
                lineHeight: "1.65",
                margin: "0 0 26px",
                whiteSpace: "pre-wrap" as const,
              }}
            >
              {message}
            </Text>

            {/* consent, unmissable */}
            <Section
              style={{
                backgroundColor: consent ? "#eaf4ec" : "#fdeceb",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "18px",
              }}
            >
              <Text
                style={{
                  color: consent ? "#256b39" : "#a32b23",
                  fontSize: "14px",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                {consent
                  ? "Consented to being featured on the site."
                  : "Did NOT consent to being featured. Do not publish this."}
              </Text>
            </Section>

            {/* contact details */}
            <Section
              style={{ backgroundColor: CREAM, borderRadius: "12px", padding: "16px 20px" }}
            >
              {[["Email", email], phone ? ["Phone", phone] : null]
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

            <Section style={{ textAlign: "center" as const, marginTop: "26px" }}>
              <Link
                href={`mailto:${email}?subject=${encodeURIComponent("Thank you from Joey's")}`}
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
                Say thanks to {name.split(" ")[0]}
              </Link>
            </Section>
          </Section>

          {/* ── footer ── */}
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

Testimonial.PreviewProps = {
  name: "Asha Nair",
  email: "asha@example.com",
  city: "Coimbatore",
  phone: "+91 98765 43210",
  rating: 5,
  consent: true,
  message:
    "The Smokey Bacon is the closest thing to a proper pub crisp I have found in India, and I did not expect that from something vegetarian.\n\nMy husband finished the bag before I got a second handful. Buying three next time.",
} satisfies TestimonialProps;

export default Testimonial;
