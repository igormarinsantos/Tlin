import { renderToStaticMarkup } from "react-dom/server";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import ArticlePage, { generateMetadata } from "@/app/blog/[slug]/page";
import { GET as getRss } from "@/app/blog/rss.xml/route";
import sitemap from "@/app/sitemap";
import { editorialAuthors } from "@/content/editorial/authors";
import { createEditorialRss } from "@/lib/editorial/feed";
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

    const xmlFromUnsortedInput = createEditorialRss([...published].reverse());
    const canonicalPositions = published.map((article) =>
      xmlFromUnsortedInput.indexOf(`<guid isPermaLink="true">${absoluteUrl(`/blog/${article.slug}`)}</guid>`),
    );
    expect(canonicalPositions.every((position) => position >= 0)).toBe(true);
    expect(canonicalPositions).toEqual([...canonicalPositions].sort((left, right) => left - right));

    const response = getRss();
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    expect(await response.text()).toBe(createEditorialRss(published));

    const adversarial = {
      ...published[0],
      id: "article:adversarial",
      slug: "adversarial",
      title: "IA & vendas <script>alert(1)</script> 🚀",
      summary: "Qualificação > volume, com aspas \"duplas\" e 'simples'.",
    } as const;
    const adversarialXml = createEditorialRss([adversarial]);
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
    const filteredXml = createEditorialRss(getPublishedArticles(now, candidates));
    expect(filteredXml).toContain(`/blog/${published[0].slug}`);
    expect(filteredXml).not.toContain("/blog/draft");
    expect(filteredXml).not.toContain("/blog/future");
  });

  it("publishes a short experimental LLM index from safe published projections", async () => {
    const llmsModule = await import("@/lib/editorial/llms").catch(() => undefined);
    expect(llmsModule?.createLlmsIndex).toBeTypeOf("function");
    if (!llmsModule?.createLlmsIndex) return;

    const published = getPublishedArticles(now);
    const adversarial = {
      ...published[0],
      id: "article:adversarial",
      slug: "adversarial",
      title: "IA <script>alert(1)</script> & vendas",
      summary: "Resumo com ](javascript:alert(1)) e conteúdo aprovado.",
    } as const;
    const candidates = [
      adversarial,
      { ...published[0], id: "article:draft-llms", slug: "draft-llms", status: "draft" },
      {
        ...published[0],
        id: "article:future-llms",
        slug: "future-llms",
        publishedAt: "2026-10-01T12:00:00-03:00",
        modifiedAt: "2026-10-01T12:00:00-03:00",
      },
      {
        ...published[0],
        id: "article:unsafe-url",
        slug: "unsafe?preview=true",
      },
    ] as EditorialArticle[];
    const safeArticles = getPublishedArticles(now, candidates);
    const safeClusters = getPublishedClusters(now, candidates);
    const output = llmsModule.createLlmsIndex(safeArticles, safeClusters);

    expect(output).toContain("complementar e experimental");
    expect(output).toContain("não garante ranking, inclusão ou citação");
    expect(output).toContain(absoluteUrl(`/blog/${adversarial.slug}`));
    expect(output).toContain("IA &lt;script&gt;alert(1)&lt;/script&gt; &amp; vendas");
    expect(output).not.toContain("<script>");
    expect(output).not.toContain("javascript:");
    expect(output).not.toContain("/blog/draft-llms");
    expect(output).not.toContain("/blog/future-llms");
    expect(output).not.toContain("?preview=true");
    expect(safeClusters.every((cluster) => output.includes(absoluteUrl(cluster.hubPath)))).toBe(true);
  });

  it("serves the short LLM index as UTF-8 plain text without a competing static file", async () => {
    const routeModule = await import("@/app/llms.txt/route").catch(() => undefined);
    const llmsModule = await import("@/lib/editorial/llms").catch(() => undefined);

    expect(routeModule?.GET).toBeTypeOf("function");
    expect(llmsModule?.createLlmsIndex).toBeTypeOf("function");
    if (!routeModule?.GET || !llmsModule?.createLlmsIndex) return;

    const response = routeModule.GET();
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe(
      llmsModule.createLlmsIndex(getPublishedArticles(), getPublishedClusters()),
    );
    expect(existsSync("public/llms.txt")).toBe(false);
  });

  it("expands the same published LLM projection with approved structured content", async () => {
    const llmsModule = await import("@/lib/editorial/llms");
    expect(llmsModule.createLlmsFull).toBeTypeOf("function");
    if (!llmsModule.createLlmsFull) return;

    const published = getPublishedArticles(now);
    const adversarial = {
      ...published[0],
      id: "article:adversarial-full",
      slug: "adversarial-full",
      title: "Projeção expandida segura",
      blocks: [
        { type: "heading", level: 2, id: "adversarial", text: "Seção <script>alert(1)</script>" },
        { type: "paragraph", text: "Linha um\n# heading injetado com javascript:alert(1)" },
        { type: "list", items: ["Item <b>um</b>", "Item dois"] },
        { type: "quote", text: "Citação </textarea><script>alert(2)</script>", attribution: "Fonte segura" },
        { type: "image", src: "/test.png", alt: "Imagem <svg onload=alert(3)>", decorative: false },
      ],
      sources: [
        ...published[0].sources,
        {
          id: "source:unsafe-protocol",
          title: "Fonte insegura",
          url: "javascript:alert(4)",
          accessedAt: "2026-09-23T12:00:00-03:00",
        },
      ],
    } as EditorialArticle;
    const candidates = [
      adversarial,
      { ...published[0], id: "article:draft-full", slug: "draft-full", status: "draft" },
      {
        ...published[0],
        id: "article:future-full",
        slug: "future-full",
        publishedAt: "2026-10-01T12:00:00-03:00",
        modifiedAt: "2026-10-01T12:00:00-03:00",
      },
    ] as EditorialArticle[];
    const safeArticles = getPublishedArticles(now, candidates);
    const safeClusters = getPublishedClusters(now, candidates);
    const shortOutput = llmsModule.createLlmsIndex(safeArticles, safeClusters);
    const fullOutput = llmsModule.createLlmsFull(safeArticles, safeClusters, editorialAuthors);

    expect(editorialUrls(fullOutput)).toEqual(editorialUrls(shortOutput));
    expect(fullOutput).toContain(`- Publicado em: ${adversarial.publishedAt}`);
    expect(fullOutput).toContain(`- Atualizado em: ${adversarial.modifiedAt}`);
    expect(fullOutput).toContain(`- Autor: ${editorialAuthors[adversarial.authorId].name}`);
    expect(fullOutput).toContain(published[0].sources[0].url);
    expect(fullOutput).toContain("Seção &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(fullOutput).toContain("Imagem &lt;svg onload=alert(3)&gt;");
    expect(fullOutput).not.toContain("<script>");
    expect(fullOutput).not.toContain("javascript:");
    expect(fullOutput).not.toContain("/blog/draft-full");
    expect(fullOutput).not.toContain("/blog/future-full");
  });

  it("serves the expanded LLM projection as UTF-8 plain text without a static duplicate", async () => {
    const routeModule = await import("@/app/llms-full.txt/route").catch(() => undefined);
    const llmsModule = await import("@/lib/editorial/llms");

    expect(routeModule?.GET).toBeTypeOf("function");
    expect(llmsModule.createLlmsFull).toBeTypeOf("function");
    if (!routeModule?.GET || !llmsModule.createLlmsFull) return;

    const response = routeModule.GET();
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toBe(
      llmsModule.createLlmsFull(
        getPublishedArticles(),
        getPublishedClusters(),
        editorialAuthors,
      ),
    );
    expect(existsSync("public/llms-full.txt")).toBe(false);
  });

  it("keeps both LLM URL sets aligned with the canonical sitemap and RSS projections", async () => {
    const llmsModule = await import("@/lib/editorial/llms");
    const published = getPublishedArticles(now);
    const clusters = getPublishedClusters(now);
    const shortOutput = llmsModule.createLlmsIndex(published, clusters);
    const fullOutput = llmsModule.createLlmsFull(published, clusters, editorialAuthors);
    const expectedEditorialUrls = [
      ...clusters.map((cluster) => absoluteUrl(cluster.hubPath)),
      ...published.map((article) => absoluteUrl(`/blog/${article.slug}`)),
    ].sort();
    const sitemapEditorialUrls = sitemap()
      .map((entry) => entry.url)
      .filter((url) => expectedEditorialUrls.includes(url))
      .sort();
    const rssXml = await getRss().text();
    const rssArticleUrls = [...rssXml.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/g)]
      .map((match) => match[1])
      .sort();

    expect(editorialUrls(shortOutput)).toEqual(
      expectedEditorialUrls.map((url) => `- URL: ${url}`).sort(),
    );
    expect(editorialUrls(fullOutput)).toEqual(editorialUrls(shortOutput));
    expect(sitemapEditorialUrls).toEqual(expectedEditorialUrls);
    expect(rssArticleUrls).toEqual(
      published.map((article) => absoluteUrl(`/blog/${article.slug}`)).sort(),
    );
  });
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function editorialUrls(value: string) {
  return value
    .split("\n")
    .filter((line) => line.startsWith("- URL: "))
    .sort();
}
