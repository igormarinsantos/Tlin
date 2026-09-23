// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArticlePage, {
  generateMetadata as generateArticleMetadata,
  generateStaticParams as generateArticleParams,
} from "@/app/blog/[slug]/page";
import ClusterPage, {
  generateMetadata as generateClusterMetadata,
  generateStaticParams as generateClusterParams,
} from "@/app/blog/temas/[cluster]/page";
import { GET as getRss } from "@/app/blog/rss.xml/route";
import sitemap from "@/app/sitemap";
import { agentesDeIaNoWhatsappParaVendas as article } from "@/content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas";
import { EditorialCta } from "@/components/blog/EditorialCta";
import { serializeRssFeed } from "@/lib/editorial/feed";
import {
  getPublishedArticleBySlug,
  getPublishedArticles,
  getPublishedClusters,
} from "@/lib/editorial/queries";
import { editorialArticles } from "@/lib/editorial/registry";
import {
  createArticleStructuredData,
  serializeStructuredData,
} from "@/lib/editorial/structured-data";
import type { EditorialArticle } from "@/lib/editorial/types";
import { absoluteUrl } from "@/lib/siteConfig";
import { legacyArticles } from "@/tests/editorial/fixtures/legacy-articles";

const analytics = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock("@/lib/utm", () => ({ trackFunnelEvent: analytics.track }));

afterEach(() => {
  cleanup();
  analytics.track.mockReset();
});

const now = new Date("2026-09-23T12:00:00-03:00");
const tracerSlug = "agentes-de-ia-no-whatsapp-para-vendas";

describe("editorial production tracer", () => {
  it("proves the tracer across article, query, metadata, schema, hub and CTA", async () => {
    const legacy = legacyArticles.find(({ slug }) => slug === tracerSlug);
    const published = getPublishedArticleBySlug(tracerSlug, now);

    expect(legacy).toBeDefined();
    expect(legacyArticles).toHaveLength(3);
    expect(editorialArticles).toContain(article);
    expect(published).toBe(article);
    expect(published).toMatchObject({
      slug: legacy?.slug,
      title: legacy?.title,
      summary: legacy?.description,
      publishedAt: expect.stringMatching(/^2026-07-21T/),
      authorId: "author:igor-marin",
      clusterId: "cluster:ia-comercial",
    });

    const metadata = await generateArticleMetadata({
      params: Promise.resolve({ slug: tracerSlug }),
    });
    const articleHtml = renderToStaticMarkup(
      await ArticlePage({ params: Promise.resolve({ slug: tracerSlug }) }),
    );
    const structuredData = createArticleStructuredData(article);
    const serializedStructuredData = serializeStructuredData(structuredData);

    expect(generateArticleParams()).toContainEqual({ slug: tracerSlug });
    expect(metadata).toMatchObject({
      title: article.title,
      description: article.summary,
      alternates: { canonical: legacy?.surfaces.canonical },
      openGraph: {
        type: "article",
        url: legacy?.surfaces.canonical,
        publishedTime: article.publishedAt,
        modifiedTime: article.modifiedAt,
      },
    });
    expect(serializedStructuredData).not.toContain("<");
    expect(structuredData["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "Article",
          mainEntityOfPage: legacy?.surfaces.canonical,
          datePublished: article.publishedAt,
          dateModified: article.modifiedAt,
        }),
        expect.objectContaining({ "@type": "BreadcrumbList" }),
      ]),
    );
    expect(articleHtml).toContain(article.title);
    expect(articleHtml).toContain(article.summary);
    expect(articleHtml).toContain("Igor Marin");
    expect(articleHtml).toContain("Neste artigo");
    expect(articleHtml).toContain(serializedStructuredData);
    expect(articleHtml).not.toContain("dangerouslySetInnerHTML");

    const clusterMetadata = await generateClusterMetadata({
      params: Promise.resolve({ cluster: "ia-comercial" }),
    });
    const clusterHtml = renderToStaticMarkup(
      await ClusterPage({ params: Promise.resolve({ cluster: "ia-comercial" }) }),
    );

    expect(generateClusterParams()).toContainEqual({ cluster: "ia-comercial" });
    expect(clusterMetadata).toMatchObject({
      alternates: { canonical: absoluteUrl("/blog/temas/ia-comercial") },
    });
    expect(clusterHtml).toContain("IA comercial");
    expect(clusterHtml).toContain(`/blog/${tracerSlug}`);

    const qualificationEvents: CustomEvent[] = [];
    const receiveQualification = (event: Event) => qualificationEvents.push(event as CustomEvent);
    window.addEventListener("open-qualification", receiveQualification);

    render(createElement(EditorialCta, {
      articleSlug: article.slug,
      clusterId: article.clusterId,
      intent: article.intent,
      cta: article.cta,
      location: "article-end",
    }));
    fireEvent.click(screen.getByRole("button", { name: article.cta.label }));

    expect(analytics.track).toHaveBeenCalledWith("article_cta_click", {
      article_slug: article.slug,
      content_cluster: article.clusterId,
      content_group: "editorial",
      content_intent: article.intent,
      cta_id: article.cta.id,
      cta_source: "editorial_article",
      cta_location: "article-end",
      plan_name: "TLIN",
    });
    expect(qualificationEvents).toHaveLength(1);
    expect(qualificationEvents[0].detail).toMatchObject({
      plan: "TLIN",
      source: "editorial_article",
      articleSlug: article.slug,
      clusterId: article.clusterId,
      ctaId: article.cta.id,
      location: "article-end",
    });

    window.removeEventListener("open-qualification", receiveQualification);
  });

  it("keeps every unpublished or future article out of the public projection", () => {
    const candidates = [
      article,
      { ...article, id: "article:draft", slug: "draft", status: "draft" },
      { ...article, id: "article:review", slug: "review", status: "review" },
      { ...article, id: "article:archived", slug: "archived", status: "archived" },
      {
        ...article,
        id: "article:future",
        slug: "future",
        publishedAt: "2026-10-01T12:00:00-03:00",
        modifiedAt: "2026-10-01T12:00:00-03:00",
      },
    ] as EditorialArticle[];

    expect(getPublishedArticles(now, candidates)).toEqual([article]);
    expect(getPublishedArticleBySlug("draft", now, candidates)).toBeUndefined();
    expect(getPublishedArticleBySlug("future", now, candidates)).toBeUndefined();
    expect(getPublishedClusters(now, candidates)).toEqual([
      expect.objectContaining({
        id: "cluster:ia-comercial",
        slug: "ia-comercial",
        articles: [article],
      }),
    ]);
  });

  it("projects the same published identity and dates into sitemap and RSS", async () => {
    const published = getPublishedArticles(now);
    const canonical = absoluteUrl(`/blog/${article.slug}`);
    const sitemapEntries = sitemap();
    const editorialSitemapEntries = sitemapEntries.filter((entry) =>
      published.some((candidate) => entry.url === absoluteUrl(`/blog/${candidate.slug}`)),
    );
    const response = getRss();
    const xml = await response.text();

    expect(editorialSitemapEntries).toEqual(
      published.map((candidate) =>
        expect.objectContaining({
          url: absoluteUrl(`/blog/${candidate.slug}`),
          lastModified: new Date(candidate.modifiedAt),
        }),
      ),
    );
    expect(
      sitemapEntries
        .filter((entry) => entry.url.startsWith(`${absoluteUrl("/blog")}/`))
        .map((entry) => entry.url),
    ).toEqual(published.map((candidate) => absoluteUrl(`/blog/${candidate.slug}`)));
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    expect(xml).toBe(serializeRssFeed(published));
    expect(xml).toContain(`<link>${canonical}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${canonical}</guid>`);

    const adversarialXml = serializeRssFeed([
      {
        ...article,
        title: "IA & vendas <script>alert(1)</script> 🚀",
        summary: "Qualificação > volume, com aspas \"duplas\" e 'simples'.",
      },
    ]);
    expect(adversarialXml).toContain("IA &amp; vendas &lt;script&gt;alert(1)&lt;/script&gt; 🚀");
    expect(adversarialXml).toContain("aspas &quot;duplas&quot; e &apos;simples&apos;");
    expect(adversarialXml).not.toContain("<script>");
  });
});
