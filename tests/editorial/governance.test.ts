import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { agentesDeIaNoWhatsappParaVendas as publishedArticle } from "@/content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas";
import { getPublishedArticles } from "@/lib/editorial/queries";
import type { EditorialArticle } from "@/lib/editorial/types";
import { validateEditorialArticles } from "@/lib/editorial/validate";

const editorialDocs = {
  workflow: "docs/editorial/README.md",
  brief: "docs/editorial/content-brief.md",
  checklist: "docs/editorial/quality-checklist.md",
  distribution: "docs/editorial/distribution.md",
} as const;

function readEditorialDoc(path: string) {
  const absolutePath = resolve(process.cwd(), path);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

describe("editorial governance documents", () => {
  it.each(Object.entries(editorialDocs))("versions the %s document at %s", (_name, path) => {
    expect(readEditorialDoc(path), `${path} precisa existir`).not.toBe("");
  });

  it("defines the technical operator workflow, evidence, owners and update triggers", () => {
    const workflow = readEditorialDoc(editorialDocs.workflow);

    expect(workflow).toContain("operador técnico");
    expect(workflow).toContain("Git/PR");
    expect(workflow).toContain("draft → review → published → archived");
    expect(workflow).toContain("Gatilhos de atualização");
    expect(workflow).toContain("modifiedAt");
    expect(workflow).toContain("evidência");
    expect(workflow).toContain("CMS headless");
    expect(workflow).toContain("publicação não técnica");
  });

  it("provides every mandatory content brief field", () => {
    const brief = readEditorialDoc(editorialDocs.brief);
    const requiredFields = [
      "Público",
      "Problema",
      "Estágio da jornada",
      "Intenção",
      "URL owner",
      "Cluster",
      "Fontes",
      "Contribuição original",
      "Claims",
      "Revisor factual",
      "Revisor comercial",
      "Links internos",
      "CTA",
      "Hipótese de medição",
    ];

    for (const field of requiredFields) expect(brief).toContain(field);
  });

  it("separates automated gates from human truth and originality approval", () => {
    const checklist = readEditorialDoc(editorialDocs.checklist);

    expect(checklist).toContain("Gates automatizados");
    expect(checklist).toContain("Gates humanos");
    expect(checklist).toContain("revisão factual");
    expect(checklist).toContain("revisão comercial");
    expect(checklist).toContain("anti-plágio");
    expect(checklist).toContain("identidade e perfil aprovados");
    expect(checklist).toContain("ativo local aprovado");
  });

  it("prohibits invented evidence, plagiarism, guarantees and mechanical SEO quotas", () => {
    const checklist = readEditorialDoc(editorialDocs.checklist);

    for (const prohibited of [
      "benchmark inventado",
      "cliente inventado",
      "resultado inventado",
      "experiência inventada",
      "integração inventada",
      "URL inventada",
      "plágio",
      "promessa de ranking",
      "promessa de citação",
      "keyword density",
      "word count",
      "cota de headings",
    ]) {
      expect(checklist).toContain(prohibited);
    }
  });

  it("keeps third-party distribution manual and traceable with deliberate UTMs", () => {
    const distribution = readEditorialDoc(editorialDocs.distribution);

    expect(distribution).toContain("distribuição manual");
    expect(distribution).toContain("utm_source");
    expect(distribution).toContain("utm_medium");
    expect(distribution).toContain("utm_campaign");
    expect(distribution).toContain("utm_content");
    expect(distribution).toContain("não autoriza automação");
    expect(distribution).toContain("não dispara");
  });
});

const validationNow = new Date("2026-09-23T18:00:00-03:00");

function validationCodes(article: unknown) {
  return validateEditorialArticles([article] as EditorialArticle[], {
    now: validationNow,
  }).map((issue) => issue.code);
}

describe("editorial publication governance", () => {
  it("accepts the evidence and human approvals of the current published record", () => {
    expect(validateEditorialArticles([publishedArticle], { now: validationNow })).toEqual([]);
  });

  it("rejects publication without the automated brief fields and an existing URL owner", () => {
    expect(validationCodes({
      ...publishedArticle,
      intent: undefined,
      clusterId: "cluster:unknown",
    })).toEqual(expect.arrayContaining([
      "brief.intent",
      "brief.urlOwner",
    ]));
  });

  it("rejects a claim that does not point to an existing source", () => {
    expect(validationCodes({
      ...publishedArticle,
      claims: [
        {
          id: "claim:unverified-result",
          text: "Afirmação sem prova no registro",
          sourceIds: ["source:not-registered"],
        },
      ],
    })).toContain("claim.source");
  });

  it("requires access date and scope for mutable claims", () => {
    expect(validationCodes({
      ...publishedArticle,
      claims: [
        {
          id: "claim:mutable-statistic",
          text: "Estatística que pode mudar",
          sourceIds: [publishedArticle.sources[0].id],
          mutable: true,
        },
      ],
    })).toEqual(expect.arrayContaining([
      "claim.accessedAt",
      "claim.scope",
    ]));
  });

  it("accepts a mutable claim only with registered source, access date and scope", () => {
    expect(validationCodes({
      ...publishedArticle,
      claims: [
        {
          id: "claim:documented-guidance",
          text: "Orientação documentada pela fonte primária",
          sourceIds: [publishedArticle.sources[0].id],
          mutable: true,
          accessedAt: publishedArticle.sources[0].accessedAt,
          scope: "Documentação oficial consultada na data registrada",
        },
      ],
    })).toEqual([]);
  });

  it("rejects missing approvals and reviews older than the substantive update", () => {
    const missingApproval = validationCodes({
      ...publishedArticle,
      review: {
        ...publishedArticle.review,
        commercial: undefined,
      },
    });
    const staleApproval = validationCodes({
      ...publishedArticle,
      review: {
        ...publishedArticle.review,
        factual: {
          ...publishedArticle.review.factual,
          approvedAt: "2026-09-22T09:00:00-03:00",
        },
      },
    });

    expect(missingApproval).toContain("review.commercial");
    expect(staleApproval).toContain("review.factual.stale");
  });

  it("allows an incomplete draft to remain internal and excludes it from public queries", () => {
    const draft = {
      id: "article:governance-draft",
      slug: "governance-draft",
      title: "Rascunho incompleto",
      status: "draft",
      blocks: [],
    } as EditorialArticle;

    expect(validateEditorialArticles([draft], { now: validationNow })).toEqual([]);
    expect(getPublishedArticles(validationNow, [draft])).toEqual([]);
  });
});
