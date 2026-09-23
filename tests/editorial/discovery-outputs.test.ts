import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ArticlePage, { generateMetadata } from "@/app/blog/[slug]/page";
import { GET as getRss } from "@/app/blog/rss.xml/route";
import sitemap from "@/app/sitemap";
import { editorialAuthors } from "@/content/editorial/authors";
import { serializeRssFeed } from "@/lib/editorial/feed";
import { getPublishedArticles, getPublishedClusters } from "@/lib/editorial/queries";
import {
  createArticleStructuredData,
  serializeStructuredData,
} from "@/lib/editorial/structured-data";
import type { EditorialArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

const now = new Date("2026-09-23T12:00:00-03:00");

describe("editorial discovery outputs", () => {
  it("projects coherent metadata and structured data for every published article", async () => {
    const published = getPublishedArticles(now);
    const metadataTitles = new Set<string>();
    const socialImages = new Set<string>();

    expect(published).toHaveLength(3);

    for (const article of published) {
      const author = editorialAuthors[article.authorId];
      const canonical = absoluteUrl(`/blog/${article.slug}`);
      const authorUrl = absoluteUrl(author.profileUrl);
      const imageUrl = absoluteUrl(`/blog/${article.slug}/opengraph-image`);
      const imageAlt = `Capa do artigo ${article.title}`;
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: article.slug }),
      });
      const graph = createArticleStructuredData(article)["@graph"];
      const articleEntity = graph.find((entity) => entity["@type"] === "Article");
      const breadcrumb = graph.find((entity) => entity["@type"] === "BreadcrumbList");

      expect(metadata).toMatchObject({
        title: article.title,
        description: article.summary,
        alternates: {
          canonical,
          languages: { "pt-BR": canonical },
        },
        robots: { index: true, follow: true },
        authors: [{ name: author.name, url: authorUrl }],
        openGraph: {
          type: "article",
          locale: siteConfig.locale,
          siteName: siteConfig.name,
          title: article.title,
          description: article.summary,
          url: canonical,
          publishedTime: article.publishedAt,
          modifiedTime: article.modifiedAt,
          authors: [authorUrl],
          images: [{
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: imageAlt,
          }],
        },
        twitter: {
          card: "summary_large_image",
          title: article.title,
          description: article.summary,
          images: [{ url: imageUrl, alt: imageAlt }],
        },
      });
      expect(articleEntity).toMatchObject({
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.summary,
        mainEntityOfPage: canonical,
        datePublished: article.publishedAt,
        dateModified: article.modifiedAt,
        image: [imageUrl],
        author: {
          "@type": "Person",
          name: author.name,
          url: authorUrl,
        },
        publisher: { "@id": absoluteUrl("/#organization") },
      });
      expect(breadcrumb).toMatchObject({
        "@id": `${canonical}#breadcrumb`,
        itemListElement: expect.arrayContaining([
          expect.objectContaining({ position: 3, name: article.title, item: canonical }),
        ]),
      });

      const serialized = serializeStructuredData({
        ...createArticleStructuredData(article),
        adversarial: "</script><script>alert('xss')</script>",
      });
      expect(serialized).not.toContain("<");
      expect(JSON.parse(serialized).adversarial).toContain("<script>");

      expect(Date.parse(article.modifiedAt)).toBeGreaterThanOrEqual(
        Date.parse(article.publishedAt),
      );
      expect(article.publishedAt).toMatch(/(?:Z|[+-]\d{2}:\d{2})$/);
      expect(article.modifiedAt).toMatch(/(?:Z|[+-]\d{2}:\d{2})$/);

      if (article.modifiedAt !== article.publishedAt) {
        const html = renderToStaticMarkup(
          await ArticlePage({ params: Promise.resolve({ slug: article.slug }) }),
        );
        expect(html).toContain(`Atualizado em ${formatDate(article.modifiedAt)}`);
      }

      metadataTitles.add(String(metadata.title));
      socialImages.add(imageUrl);
    }

    expect(metadataTitles.size).toBe(published.length);
    expect(socialImages.size).toBe(published.length);
  });

  it("projects deterministic published sitemap and RSS with safe escaping", async () => {
    const published = getPublishedArticles(now);
    const clusters = getPublishedClusters(now);
    const sitemapEntries = sitemap();
    const editorialEntries = sitemapEntries.filter((entry) =>
      entry.url.startsWith(`${absoluteUrl("/blog")}/`),
    );

    expect(editorialEntries).toEqual([
      ...clusters.map((cluster) => ({
        url: absoluteUrl(cluster.hubPath),
        lastModified: new Date(
          Math.max(...cluster.articles.map((article) => Date.parse(article.modifiedAt))),
        ),
      })),
      ...published.map((article) => ({
        url: absoluteUrl(`/blog/${article.slug}`),
        lastModified: new Date(article.modifiedAt),
      })),
    ]);

    const xmlFromUnsortedInput = serializeRssFeed([...published].reverse());
    const canonicalPositions = published.map((article) =>
      xmlFromUnsortedInput.indexOf(`<guid isPermaLink="true">${absoluteUrl(`/blog/${article.slug}`)}</guid>`),
    );
    expect(canonicalPositions.every((position) => position >= 0)).toBe(true);
    expect(canonicalPositions).toEqual([...canonicalPositions].sort((left, right) => left - right));

    const response = getRss();
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    expect(await response.text()).toBe(serializeRssFeed(published));

    const adversarial = {
      ...published[0],
      id: "article:adversarial",
      slug: "adversarial",
      title: "IA & vendas <script>alert(1)</script> 🚀",
      summary: "Qualificação > volume, com aspas \"duplas\" e 'simples'.",
    } as const;
    const adversarialXml = serializeRssFeed([adversarial]);
    expect(adversarialXml).toContain("IA &amp; vendas &lt;script&gt;alert(1)&lt;/script&gt; 🚀");
    expect(adversarialXml).toContain("aspas &quot;duplas&quot; e &apos;simples&apos;");
    expect(adversarialXml).not.toContain("<script>");

    const candidates = [
      published[0],
      { ...published[0], id: "article:draft", slug: "draft", status: "draft" },
      {
        ...published[0],
        id: "article:future",
        slug: "future",
        publishedAt: "2026-10-01T12:00:00-03:00",
        modifiedAt: "2026-10-01T12:00:00-03:00",
      },
    ] as EditorialArticle[];
    const filteredXml = serializeRssFeed(getPublishedArticles(now, candidates));
    expect(filteredXml).toContain(`/blog/${published[0].slug}`);
    expect(filteredXml).not.toContain("/blog/draft");
    expect(filteredXml).not.toContain("/blog/future");
  });
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
