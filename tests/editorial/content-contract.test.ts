import { describe, expect, it } from "vitest";
import { editorialAuthors } from "@/content/editorial/authors";
import { editorialClusters } from "@/content/editorial/taxonomy";
import { editorialArticles } from "@/lib/editorial/registry";
import { getPublishedArticles } from "@/lib/editorial/queries";
import { validateEditorialArticles } from "@/lib/editorial/validate";

const publishedAt = "2026-07-21T12:00:00-03:00";
const modifiedAt = "2026-07-22T12:00:00-03:00";

function approval() {
  return {
    status: "approved",
    approvedBy: "author:igor-marin",
    approvedAt: "2026-07-20T12:00:00-03:00",
  };
}

function publishedArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: "article:agentes-de-ia-no-whatsapp-para-vendas",
    slug: "agentes-de-ia-no-whatsapp-para-vendas",
    title: "Agentes de IA no WhatsApp: onde eles realmente ajudam vendas",
    summary: "Uma visão prática de como agentes de IA ajudam uma operação comercial.",
    status: "published",
    authorId: "author:igor-marin",
    publishedAt,
    modifiedAt,
    readingTimeMinutes: 6,
    intent: "informational",
    clusterId: "cluster:ia-comercial",
    blocks: [
      { type: "heading", level: 2, id: "onde-a-ia-ajuda", text: "Onde a IA ajuda" },
      { type: "paragraph", text: "A IA assume tarefas repetitivas com supervisão humana." },
    ],
    sources: [
      {
        id: "source:google-helpful-content",
        title: "Creating helpful, reliable, people-first content",
        url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
        accessedAt: "2026-07-20T12:00:00-03:00",
      },
    ],
    internalLinks: [
      { href: "/ia-whatsapp", label: "Conheça a IA comercial para WhatsApp" },
    ],
    cta: { id: "cta:demo", label: "Agendar demonstração", href: "/demo" },
    review: {
      originalContribution: "Aplica a orientação ao fluxo comercial no WhatsApp da Tlin.",
      factual: approval(),
      commercial: approval(),
    },
    ...overrides,
  };
}

function issueCodes(articles: unknown[]) {
  return validateEditorialArticles(articles as never, {
    now: new Date("2026-09-23T12:00:00-03:00"),
  }).map((issue) => issue.code);
}

describe("editorial content contract", () => {
  it("registers only the approved real author profile and editorial territory", () => {
    expect(editorialAuthors["author:igor-marin"]).toMatchObject({
      name: "Igor Marin",
      role: "Fundador da Tlin",
      profileUrl: "/como-funciona",
    });
    expect(editorialClusters["cluster:ia-comercial"]).toMatchObject({
      label: "IA comercial",
      intentOwner: "/",
    });
  });

  it("accepts a complete approved published article", () => {
    expect(validateEditorialArticles([publishedArticle()] as never)).toEqual([]);
  });

  it("rejects duplicate slugs before publication", () => {
    expect(issueCodes([publishedArticle(), publishedArticle({ id: "article:duplicate" })])).toContain(
      "slug.duplicate",
    );
  });

  it("rejects future publication dates and modification dates before publication", () => {
    expect(
      issueCodes([
        publishedArticle({ publishedAt: "2026-10-01T12:00:00-03:00" }),
        publishedArticle({
          id: "article:older-modified",
          slug: "older-modified",
          modifiedAt: "2026-07-20T12:00:00-03:00",
        }),
      ]),
    ).toEqual(expect.arrayContaining(["publishedAt.future", "modifiedAt.beforePublishedAt"]));
  });

  it("rejects unknown author and cluster references", () => {
    expect(
      issueCodes([
        publishedArticle({ authorId: "author:unknown", clusterId: "cluster:unknown" }),
      ]),
    ).toEqual(expect.arrayContaining(["author.unknown", "cluster.unknown"]));
  });

  it("rejects intents outside the cluster territory and unresolved internal routes", () => {
    expect(
      issueCodes([
        publishedArticle({
          intent: "conversion-support",
          internalLinks: [{ href: "/rota-editorial-inexistente", label: "Rota inexistente" }],
        }),
      ]),
    ).toEqual(expect.arrayContaining(["intent.cluster", "internalLink.unresolved"]));
  });

  it("rejects unsafe external and internal URLs", () => {
    expect(
      issueCodes([
        publishedArticle({
          sources: [
            {
              id: "source:unsafe",
              title: "Unsafe",
              url: "http://example.com/source",
              accessedAt: publishedAt,
            },
          ],
          cta: { id: "cta:unsafe", label: "Unsafe", href: "javascript:alert(1)" },
        }),
      ]),
    ).toEqual(expect.arrayContaining(["source.url", "cta.url"]));
  });

  it("requires unique stable heading IDs", () => {
    expect(
      issueCodes([
        publishedArticle({
          blocks: [
            { type: "heading", level: 2, id: "Heading Inválido", text: "Primeiro" },
            { type: "heading", level: 2, id: "Heading Inválido", text: "Segundo" },
          ],
        }),
      ]),
    ).toEqual(expect.arrayContaining(["heading.id", "heading.duplicate"]));
  });

  it("requires alt text and approval for informative media", () => {
    expect(
      issueCodes([
        publishedArticle({
          blocks: [
            {
              type: "image",
              src: "/blog/example.png",
              alt: "",
              decorative: false,
            },
          ],
        }),
      ]),
    ).toEqual(expect.arrayContaining(["media.alt", "media.approval"]));
  });

  it("requires factual and commercial approval without inventing evidence", () => {
    expect(
      issueCodes([
        publishedArticle({
          review: {
            originalContribution: "",
            factual: approval(),
          },
        }),
      ]),
    ).toEqual(expect.arrayContaining(["review.originalContribution", "review.commercial"]));
  });

  it("allows an incomplete draft but never treats it as publishable", () => {
    const draft = {
      id: "article:draft",
      slug: "draft",
      title: "Rascunho",
      status: "draft",
      blocks: [],
    };

    expect(validateEditorialArticles([draft] as never)).toEqual([]);
    expect(issueCodes([{ ...draft, status: "published" }])).toEqual(
      expect.arrayContaining([
        "author.required",
        "cluster.required",
        "publishedAt.required",
        "review.factual",
      ]),
    );
  });

  it("registers the WhatsApp service pricing article as a non-public draft", () => {
    const slug = "whatsapp-api-cobranca-mensagens-servico-outubro-2026";
    const draft = editorialArticles.find((article) => article.slug === slug);

    expect(draft).toMatchObject({ status: "draft", clusterId: "cluster:vendas-whatsapp" });
    expect(getPublishedArticles(new Date("2026-10-02T12:00:00-03:00"))).not.toContainEqual(
      expect.objectContaining({ slug }),
    );
  });
});
