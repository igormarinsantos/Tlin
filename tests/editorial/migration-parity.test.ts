// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import BlogHomePage from "@/app/blog/page";
import { BlogSearchAndGrid } from "@/components/blog/BlogSearchAndGrid";
import { BLOG_ARTICLES } from "@/lib/blog";
import { serializeRssFeed } from "@/lib/editorial/feed";
import { editorialArticles } from "@/lib/editorial/registry";
import {
  createArticleStructuredData,
  serializeStructuredData,
} from "@/lib/editorial/structured-data";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl } from "@/lib/siteConfig";
import { legacyArticles } from "@/tests/editorial/fixtures/legacy-articles";

afterEach(cleanup);

function editorialArticle(overrides: Partial<EditorialPublishedArticle> = {}): EditorialPublishedArticle {
  return {
    id: "article:adversarial",
    slug: "adversarial",
    title: "IA & vendas <script>alert(1)</script> 🚀",
    summary: "Qualificação > volume, com aspas \"duplas\" e 'simples'.",
    status: "published",
    authorId: "author:igor-marin",
    publishedAt: "2026-07-21T12:00:00-03:00",
    modifiedAt: "2026-07-22T12:00:00-03:00",
    readingTimeMinutes: 6,
    intent: "informational",
    clusterId: "cluster:ia-comercial",
    blocks: [{ type: "paragraph", text: "Conteúdo seguro" }],
    sources: [
      {
        id: "source:official",
        title: "Fonte oficial",
        url: "https://example.com/source?one=1&two=2",
        accessedAt: "2026-07-20T12:00:00-03:00",
      },
    ],
    internalLinks: [{ href: "/ia-whatsapp", label: "IA no WhatsApp" }],
    cta: { id: "cta:demo", label: "Agendar demonstração", href: "/demo" },
    review: {
      originalContribution: "Aplicação editorial testável.",
      factual: {
        status: "approved",
        approvedBy: "author:igor-marin",
        approvedAt: "2026-07-20T12:00:00-03:00",
      },
      commercial: {
        status: "approved",
        approvedBy: "author:igor-marin",
        approvedAt: "2026-07-20T12:00:00-03:00",
      },
    },
    ...overrides,
  };
}

describe("legacy article migration parity", () => {
  it("freezes an independent baseline for exactly the three public slugs", () => {
    expect(Object.isFrozen(legacyArticles)).toBe(true);
    expect(legacyArticles.map(({ slug }) => slug)).toEqual([
      "agentes-de-ia-no-whatsapp-para-vendas",
      "como-avaliar-novos-modelos-de-ia-para-negocios",
      "playbook-qualificacao-leads-whatsapp",
    ]);
  });

  it("matches current titles, dates, canonical surfaces and essential content", () => {
    const current = BLOG_ARTICLES.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      author: article.author,
      featured: Boolean(article.featured),
      content: article.content,
    }));
    const baseline = legacyArticles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      author: article.author,
      featured: article.featured,
      content: article.content,
    }));

    expect(current).toEqual(baseline);
    for (const article of legacyArticles) {
      const canonical = absoluteUrl(`/blog/${article.slug}`);
      expect(article.surfaces).toEqual({
        url: `/blog/${article.slug}`,
        canonical,
        sitemap: canonical,
        rss: canonical,
        navigation: `/blog/${article.slug}`,
        sharing: canonical,
      });
      expect(article.content.flatMap((section) => section.paragraphs).length).toBeGreaterThan(0);
    }
  });

  it("keeps legacy and migrated state explicit for every slug", () => {
    expect(legacyArticles.map(({ slug, migration }) => ({ slug, ...migration }))).toEqual([
      {
        slug: "agentes-de-ia-no-whatsapp-para-vendas",
        legacy: "captured",
        migrated: "pending",
      },
      {
        slug: "como-avaliar-novos-modelos-de-ia-para-negocios",
        legacy: "captured",
        migrated: "pending",
      },
      {
        slug: "playbook-qualificacao-leads-whatsapp",
        legacy: "captured",
        migrated: "pending",
      },
    ]);
  });

  it("migrates the model evaluation article without changing its public contract", () => {
    const legacy = legacyArticles.find(
      (article) => article.slug === "como-avaliar-novos-modelos-de-ia-para-negocios",
    );
    const migrated = editorialArticles.find((article) => article.slug === legacy?.slug);

    expect(legacy).toBeDefined();
    expect(migrated).toMatchObject({
      id: `article:${legacy?.slug}`,
      slug: legacy?.slug,
      title: legacy?.title,
      summary: legacy?.description,
      status: "published",
      publishedAt: "2026-07-18T12:00:00-03:00",
      modifiedAt: "2026-07-18T12:00:00-03:00",
      readingTimeMinutes: 5,
      intent: "informational",
      clusterId: "cluster:ia-comercial",
      featured: true,
    });
    expect(migrated?.blocks).toEqual([
      { type: "heading", level: 2, id: "novidade-nao-e-necessariamente-vantagem", text: legacy?.content[0].heading },
      ...legacy!.content[0].paragraphs.map((text) => ({ type: "paragraph", text })),
      { type: "heading", level: 2, id: "um-filtro-de-quatro-perguntas", text: legacy?.content[1].heading },
      ...legacy!.content[1].paragraphs.map((text) => ({ type: "paragraph", text })),
    ]);
    expect(migrated?.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
        }),
      ]),
    );
    expect(migrated?.review).toMatchObject({
      factual: { status: "approved", approvedBy: "author:igor-marin" },
      commercial: { status: "approved", approvedBy: "author:igor-marin" },
    });
  });

  it("closes the canonical registry with each legacy article exactly once", () => {
    const registeredSlugs = editorialArticles.map((article) => article.slug);
    const legacySlugs = legacyArticles.map((article) => article.slug);

    expect(registeredSlugs).toEqual(legacySlugs);
    expect(new Set(registeredSlugs).size).toBe(legacySlugs.length);

    for (const legacy of legacyArticles) {
      const migrated = editorialArticles.find((article) => article.slug === legacy.slug);
      const headings = migrated?.blocks.filter((block) => block.type === "heading") ?? [];
      const paragraphs = migrated?.blocks.filter((block) => block.type === "paragraph") ?? [];

      expect(migrated).toMatchObject({
        id: `article:${legacy.slug}`,
        slug: legacy.slug,
        title: legacy.title,
        summary: legacy.description,
        status: "published",
        publishedAt: `${legacy.publishedAt}T12:00:00-03:00`,
        readingTimeMinutes: Number.parseInt(legacy.readingTime, 10),
        featured: legacy.featured,
      });
      expect(headings.map(({ text }) => text)).toEqual(
        expect.arrayContaining(legacy.content.map(({ heading }) => heading)),
      );
      expect(paragraphs.map(({ text }) => text)).toEqual(
        expect.arrayContaining(
          legacy.content.flatMap(({ paragraphs: sectionParagraphs }) => sectionParagraphs),
        ),
      );
      expect(migrated?.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(migrated?.review).toMatchObject({
        factual: { status: "approved", approvedBy: "author:igor-marin" },
        commercial: { status: "approved", approvedBy: "author:igor-marin" },
      });
    }
  });

  it("renders every published slug in the server HTML with navigation and summary links", async () => {
    const html = renderToStaticMarkup(await BlogHomePage());

    for (const article of legacyArticles) {
      expect(html).toContain(`href="/blog/${article.slug}"`);
      expect(html).toContain(article.title);
    }

    expect(html).toContain("rounded-3xl");
    expect(html).toContain("Resumir com IA");
    expect(html).toContain("https://chatgpt.com/?q=");
  });

  it("searches the serializable article topic as well as title and summary", () => {
    const article = {
      id: "article:search-contract",
      slug: "search-contract",
      title: "Título sem o termo",
      summary: "Resumo sem o termo",
      description: "Resumo sem o termo",
      clusterId: "cluster:ia-comercial",
      topic: "Tema canônico exclusivo",
      category: "Vendas com IA",
      publishedAt: "2026-07-21",
      readingTimeMinutes: 6,
      readingTime: "6 min de leitura",
      featured: true,
    };

    render(createElement(BlogSearchAndGrid, {
      articles: [article],
      categories: [article.category],
    } as never));
    fireEvent.change(screen.getByPlaceholderText("Buscar por título ou tema..."), {
      target: { value: "tema canônico" },
    });

    expect(screen.getByRole("link", { name: article.title }).getAttribute("href")).toBe(
      `/blog/${article.slug}`,
    );
  });

  it("keeps the server query as the only source delivered to client blog components", () => {
    const pageSource = readFileSync("app/blog/page.tsx", "utf8");
    const componentSources = [
      "components/blog/ArticleCard.tsx",
      "components/blog/BlogSearchAndGrid.tsx",
      "components/blog/FeaturedCarousel.tsx",
    ].map((path) => readFileSync(path, "utf8"));

    expect(pageSource).toContain("getPublishedArticles");
    expect(pageSource).not.toContain("@/lib/blog");
    expect(componentSources.join("\n")).toContain("EditorialArticleSummary");
    expect(componentSources.join("\n")).not.toContain("@/lib/blog");
  });
});

describe("safe editorial serializers", () => {
  it("derives Article and BreadcrumbList identity from the editorial contract", () => {
    const article = editorialArticle();
    const canonical = absoluteUrl(`/blog/${article.slug}`);
    const graph = createArticleStructuredData(article)["@graph"];

    expect(graph.map((entity) => entity["@type"])).toEqual(["Article", "BreadcrumbList"]);
    expect(graph[0]).toMatchObject({
      headline: article.title,
      datePublished: article.publishedAt,
      dateModified: article.modifiedAt,
      mainEntityOfPage: canonical,
      author: {
        "@type": "Person",
        name: "Igor Marin",
        url: absoluteUrl("/como-funciona"),
      },
      publisher: { "@id": absoluteUrl("/#organization") },
    });
  });

  it("serializes JSON-LD without executable markup", () => {
    const serialized = serializeStructuredData(createArticleStructuredData(editorialArticle()));

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003cscript>");
    expect(JSON.parse(serialized)["@graph"][0].headline).toContain("🚀");
  });

  it("escapes XML fields while preserving canonical link, GUID and Unicode", () => {
    const article = editorialArticle();
    const canonical = absoluteUrl(`/blog/${article.slug}`);
    const feed = serializeRssFeed([article]);

    expect(feed).toContain("IA &amp; vendas &lt;script&gt;alert(1)&lt;/script&gt; 🚀");
    expect(feed).toContain("Qualificação &gt; volume, com aspas &quot;duplas&quot; e &apos;simples&apos;.");
    expect(feed).toContain(`<link>${canonical}</link>`);
    expect(feed).toContain(`<guid isPermaLink="true">${canonical}</guid>`);
    expect(feed).not.toContain("<script>");
  });
});
