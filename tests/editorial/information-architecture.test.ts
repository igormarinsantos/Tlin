import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AuthorPage, {
  generateMetadata as generateAuthorMetadata,
  generateStaticParams as generateAuthorStaticParams,
} from "@/app/blog/autores/[author]/page";
import ClusterPage, {
  generateMetadata as generateClusterMetadata,
  generateStaticParams as generateClusterStaticParams,
} from "@/app/blog/temas/[cluster]/page";
import { editorialAuthors } from "@/content/editorial/authors";
import { editorialClusters } from "@/content/editorial/taxonomy";
import {
  getPublishedAuthorBySlug,
  getPublishedAuthors,
  getPublishedClusterBySlug,
  getPublishedClusters,
} from "@/lib/editorial/queries";
import { editorialArticles } from "@/lib/editorial/registry";
import {
  createEditorialAuthorStructuredData,
  createEditorialBreadcrumbData,
} from "@/lib/editorial/structured-data";
import type { EditorialArticle, EditorialAuthor } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

const now = new Date("2026-09-23T12:00:00-03:00");

describe("editorial information architecture", () => {
  it("derives public cluster params only from published articles", () => {
    const published = editorialArticles[0];
    const candidates = [
      published,
      {
        ...published,
        id: "article:draft-follow-up",
        slug: "draft-follow-up",
        status: "draft",
        clusterId: "cluster:follow-up",
      },
      {
        ...published,
        id: "article:future-crm",
        slug: "future-crm",
        clusterId: "cluster:crm-nativo",
        publishedAt: "2026-10-01T12:00:00-03:00",
        modifiedAt: "2026-10-01T12:00:00-03:00",
      },
    ] as EditorialArticle[];

    expect(getPublishedClusters(now, candidates).map(({ id }) => id)).toEqual([
      "cluster:ia-comercial",
    ]);
    expect(getPublishedClusterBySlug("follow-up", now, candidates)).toBeUndefined();
    expect(generateClusterStaticParams()).toEqual([
      { cluster: "ia-comercial" },
      { cluster: "qualificacao-de-leads" },
    ]);
  });

  it("derives public author params only from authors with published articles", () => {
    const authors = {
      ...editorialAuthors,
      "author:sem-publicacao": {
        id: "author:sem-publicacao",
        name: "Autor sem publicação",
        role: "Perfil de teste",
        profileUrl: "/blog",
        approved: true,
      },
    } satisfies Record<string, EditorialAuthor>;
    const publishedAuthors = getPublishedAuthors(now, editorialArticles, authors);

    expect(publishedAuthors.map(({ slug }) => slug)).toEqual(["igor-marin"]);
    expect(publishedAuthors[0]).toMatchObject({
      name: "Igor Marin",
      role: "Fundador da Tlin",
      profilePath: "/blog/autores/igor-marin",
    });
    expect(publishedAuthors[0].bio).toBeUndefined();
    expect(getPublishedAuthorBySlug("desconhecido", now, editorialArticles)).toBeUndefined();
    expect(generateAuthorStaticParams()).toEqual([{ author: "igor-marin" }]);
  });

  it("keeps cluster metadata, visible breadcrumb and BreadcrumbList on the same hub URL", async () => {
    for (const { cluster } of generateClusterStaticParams()) {
      const publishedCluster = getPublishedClusterBySlug(cluster, now);
      expect(publishedCluster).toBeDefined();
      if (!publishedCluster) continue;

      const metadata = await generateClusterMetadata({ params: Promise.resolve({ cluster }) });
      const canonical = absoluteUrl(publishedCluster.hubPath);
      const html = renderToStaticMarkup(
        await ClusterPage({ params: Promise.resolve({ cluster }) }),
      );
      const graph = readJsonLdGraph(html);
      const breadcrumb = graph.find((entity) => entity["@type"] === "BreadcrumbList");

      expect(metadata.alternates?.canonical).toBe(canonical);
      expect(canonical).not.toBe(absoluteUrl(publishedCluster.intentOwner));
      expect(html).toContain("<h1");
      expect(html).toContain(publishedCluster.label);
      expect(html).toContain('href="/blog"');
      expect(html).toContain(`href="/blog/${publishedCluster.articles[0].slug}"`);
      expect(breadcrumb).toEqual(
        createEditorialBreadcrumbData(publishedCluster.hubPath, [
          { name: siteConfig.name, path: "/" },
          { name: "Conteúdos", path: "/blog" },
          { name: publishedCluster.label, path: publishedCluster.hubPath },
        ]),
      );
    }
  });

  it("renders the approved author identity without inventing a biography", async () => {
    const author = getPublishedAuthorBySlug("igor-marin", now);
    expect(author).toBeDefined();
    if (!author) return;

    const metadata = await generateAuthorMetadata({
      params: Promise.resolve({ author: author.slug }),
    });
    const html = renderToStaticMarkup(
      await AuthorPage({ params: Promise.resolve({ author: author.slug }) }),
    );
    const graph = readJsonLdGraph(html);
    const person = graph.find((entity) => entity["@type"] === "Person");
    const breadcrumb = graph.find((entity) => entity["@type"] === "BreadcrumbList");
    const canonical = absoluteUrl(author.profilePath);

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(html).toContain(author.name);
    expect(html).toContain(author.role);
    expect(html).not.toContain("credencial");
    expect(person).toMatchObject({
      name: author.name,
      jobTitle: author.role,
      url: canonical,
    });
    expect(person).not.toHaveProperty("description");
    expect(breadcrumb).toEqual(
      createEditorialAuthorStructuredData(author)["@graph"][2],
    );
    expect(author.articles.every((article) => html.includes(`/blog/${article.slug}`))).toBe(true);
  });

  it("returns empty metadata and notFound for unknown or non-public profiles", async () => {
    await expect(
      generateClusterMetadata({ params: Promise.resolve({ cluster: "follow-up" }) }),
    ).resolves.toEqual({});
    await expect(
      generateAuthorMetadata({ params: Promise.resolve({ author: "desconhecido" }) }),
    ).resolves.toEqual({});
    await expect(
      ClusterPage({ params: Promise.resolve({ cluster: "follow-up" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
    await expect(
      AuthorPage({ params: Promise.resolve({ author: "desconhecido" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });

  it("keeps IA comercial as the pillar and support capabilities as related owners", () => {
    expect(editorialClusters["cluster:ia-comercial"]).toMatchObject({
      label: "IA comercial",
      intentOwner: "/",
    });
    expect(editorialClusters["cluster:follow-up"].intentOwner).toBe("/recuperacao-de-leads");
    expect(editorialClusters["cluster:agendamento"].intentOwner).toBe("/demo");
    expect(editorialClusters["cluster:crm-nativo"].intentOwner).toBe("/crm-com-ia");
  });
});

function readJsonLdGraph(html: string) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(match?.[1]).toBeTruthy();
  return JSON.parse(match?.[1] ?? "{}")["@graph"] as Array<Record<string, unknown>>;
}
