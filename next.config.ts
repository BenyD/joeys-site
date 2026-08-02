import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: `experimental.viewTransition` is deliberately NOT set. It depends on
  // React's <ViewTransition>, which the React that Next 16.2 resolves does not
  // export. Transitions are driven against the native browser API instead,
  // in src/components/ViewTransitions.tsx.
};

export default nextConfig;
