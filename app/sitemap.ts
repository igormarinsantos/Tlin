import type { MetadataRoute } from "next";
import { ENCYCLOPEDIA_DATA } from "@/lib/encyclopediaData";
import { BLOG_ARTICLES } from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const legalArticles = ENCYCLOPEDIA_DATA.map((article) => ({
    url: absoluteUrl(`/legal/${article.id}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const blogArticles = BLOG_ARTICLES.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(`${article.publishedAt}T12:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
      url: absoluteUrl("/demo"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...legalArticles,
    ...blogArticles,
  ];
}
