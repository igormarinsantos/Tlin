import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
