import type { MetadataRoute } from "next";
import { ENCYCLOPEDIA_DATA } from "@/lib/encyclopediaData";
import { absoluteAppUrl, absoluteUrl } from "@/lib/siteConfig";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const legalArticles = ENCYCLOPEDIA_DATA.map((article) => ({
    url: absoluteUrl(`/legal/${article.id}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/legal"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteAppUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...legalArticles,
  ];
}
