import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://omniaitool.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url:             `${base}/tools/${tool.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  return [...staticRoutes, ...toolRoutes];
}
