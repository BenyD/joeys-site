import { contactReady, site } from "@/lib/site";

/**
 * Renders the support email or phone as a link once real values are in, and as
 * plain text while they are still placeholders. `mailto:[EMAIL]` is a dead link
 * that looks live, which is the one outcome worth avoiding.
 */
export function ContactLink({
  kind,
  className = "",
  subject,
}: {
  kind: "email" | "phone";
  className?: string;
  subject?: string;
}) {
  const value = kind === "email" ? site.supportEmail : site.supportPhone;

  if (!contactReady) {
    // Keep the layout classes, drop the ones that make it look clickable. A
    // placeholder that reads as a live link is the thing this guard exists to
    // prevent, and colour alone is enough of a tell without the hover underline.
    const inert = className.replace(/hover:underline|underline-offset-\S+/g, "").trim();
    return (
      <span className={`${inert} cursor-default opacity-70`} title="Awaiting the real details">
        {value}
      </span>
    );
  }

  const href =
    kind === "email"
      ? `mailto:${site.supportEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
      : `tel:${site.supportPhone.replace(/\s/g, "")}`;

  return (
    <a href={href} className={className}>
      {value}
    </a>
  );
}
