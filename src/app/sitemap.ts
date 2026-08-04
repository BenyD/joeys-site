import type { MetadataRoute } from "next";
import { flavours } from "@/lib/flavours";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    ...flavours.map((f) => ({ path: `/flavours/${f.slug}`, priority: 0.9 })),
    { path: "/made", priority: 0.7 },
    { path: "/contact", priority: 0.5 },
    { path: "/legal/terms", priority: 0.2 },
    { path: "/legal/privacy", priority: 0.2 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
