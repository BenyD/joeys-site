/**
 * Renders a schema.org entity as a JSON-LD script tag.
 *
 * JSON-LD is what answer engines (Google AI Overviews, ChatGPT, Perplexity)
 * parse to confirm entities before they trust a page enough to cite it, so
 * every graph here should describe only what is verifiably true on the page.
 *
 * `JSON.stringify` output is safe against `</script>` breakout as long as no
 * value contains that literal string; the `<` replace closes even that door.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
