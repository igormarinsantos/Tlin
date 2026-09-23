import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export type RssFeedOptions = {
  title?: string;
  description?: string;
  language?: string;
};

export function escapeXmlText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function serializeRssFeed(
  articles: readonly EditorialPublishedArticle[],
  options: RssFeedOptions = {},
) {
  const channelUrl = absoluteUrl("/blog");
  const title = options.title ?? `${siteConfig.name} | IA, vendas e WhatsApp`;
  const description =
    options.description ?? "Inteligência artificial aplicada ao crescimento de negócios.";
  const language = options.language ?? "pt-BR";
  const items = articles.map(serializeRssItem).join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${escapeXmlText(title)}</title>`,
    `<link>${escapeXmlText(channelUrl)}</link>`,
    `<description>${escapeXmlText(description)}</description>`,
    `<language>${escapeXmlText(language)}</language>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");
}

function serializeRssItem(article: EditorialPublishedArticle) {
  const canonical = absoluteUrl(`/blog/${article.slug}`);
  const publishedAt = new Date(article.publishedAt);
  if (!Number.isFinite(publishedAt.getTime())) {
    throw new Error(`Invalid publication date for RSS: ${article.slug}`);
  }

  return [
    "<item>",
    `<title>${escapeXmlText(article.title)}</title>`,
    `<link>${escapeXmlText(canonical)}</link>`,
    `<guid isPermaLink="true">${escapeXmlText(canonical)}</guid>`,
    `<description>${escapeXmlText(article.summary)}</description>`,
    `<pubDate>${publishedAt.toUTCString()}</pubDate>`,
    "</item>",
  ].join("");
}
