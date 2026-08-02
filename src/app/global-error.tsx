"use client";

/**
 * Last resort: the root layout itself failed.
 *
 * This replaces the layout entirely, so it has to supply its own html and body,
 * and it cannot assume the stylesheet or the webfonts ever loaded. Everything
 * here is inline and uses system fonts on purpose. It should never be seen; if
 * it is, the job is to give the visitor a way out and support a reference,
 * nothing more.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#3b0d14",
          color: "#fbf3e4",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f5b921",
            }}
          >
            Joey&rsquo;s
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
              lineHeight: 1.15,
              fontWeight: 800,
            }}
          >
            The site failed to load.
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(251,243,228,0.65)",
            }}
          >
            Something went wrong before the page could start. Reloading usually clears it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "28px",
              minHeight: "54px",
              padding: "0 28px",
              border: 0,
              borderRadius: "11px",
              background: "#e0532e",
              color: "#fbf3e4",
              font: "inherit",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error.digest && (
            <p
              style={{
                margin: "26px 0 0",
                fontSize: "12.5px",
                color: "rgba(251,243,228,0.4)",
              }}
            >
              Reference <code>{error.digest}</code>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
