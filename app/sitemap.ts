import type { MetadataRoute } from "next";
import { ENCYCLOPEDIA_DATA } from "@/lib/encyclopediaData";
import { getPublishedArticles, getPublishedClusters } from "@/lib/editorial/queries";
import { absoluteUrl } from "@/lib/siteConfig";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const legalArticles = ENCYCLOPEDIA_DATA.map((article) => ({
    url: absoluteUrl(`/legal/${article.id}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const blogArticles = getPublishedArticles().map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(article.modifiedAt),
  }));
  const blogClusters = getPublishedClusters().map((cluster) => ({
    url: absoluteUrl(cluster.hubPath),
    lastModified: new Date(
      Math.max(...cluster.articles.map((article) => Date.parse(article.modifiedAt))),
    ),
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
      url: absoluteUrl("/como-funciona"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/ia-whatsapp"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/recuperacao-de-leads"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/crm-com-ia"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/infoprodutores"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/agentes-de-ia"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...["/ia-para-clinicas", "/ia-para-escolas", "/ia-para-assessorias", "/ia-para-advocacia"].map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...legalArticles,
    ...blogClusters,
    ...blogArticles,
  ];
}
