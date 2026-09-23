import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { editorialArticles } from "@/lib/editorial/registry";
import { getPublishedArticles, getPublishedClusters } from "@/lib/editorial/queries";

const now = new Date("2026-09-23T12:00:00-03:00");

describe("editorial information architecture", () => {
  it("keeps empty, draft-only and future-only clusters out of public params", () => {
    const published = getPublishedArticles(now);
    const clusters = getPublishedClusters(now);

    expect(clusters.map(({ id }) => id)).toEqual([
      "cluster:ia-comercial",
      "cluster:qualificacao",
    ]);
    expect(clusters.every((cluster) => cluster.articles.length > 0)).toBe(true);
    expect(clusters.flatMap((cluster) => cluster.articles)).toEqual(
      expect.arrayContaining(published),
    );
  });

  it("publishes a dedicated author profile only for authors with public articles", () => {
    const publishedAuthorIds = new Set(
      getPublishedArticles(now, editorialArticles).map(({ authorId }) => authorId),
    );
    const queriesSource = readFileSync("lib/editorial/queries.ts", "utf8");

    expect(publishedAuthorIds).toEqual(new Set(["author:igor-marin"]));
    expect(existsSync("app/blog/autores/[author]/page.tsx")).toBe(true);
    expect(queriesSource).toContain("getPublishedAuthors");
    expect(queriesSource).toContain("getPublishedAuthorBySlug");
  });

  it("centralizes coherent editorial breadcrumbs for public hubs and authors", () => {
    const structuredDataSource = readFileSync("lib/editorial/structured-data.ts", "utf8");
    const clusterPageSource = readFileSync("app/blog/temas/[cluster]/page.tsx", "utf8");

    expect(structuredDataSource).toContain("createEditorialBreadcrumbData");
    expect(clusterPageSource).toContain("createEditorialBreadcrumbData");
    expect(clusterPageSource).toContain("application/ld+json");
  });
});
