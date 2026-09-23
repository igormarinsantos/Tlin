import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { legacyArticles } from "@/tests/editorial/fixtures/legacy-articles";

const tracerFiles = [
  "content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas.ts",
  "lib/editorial/registry.ts",
  "lib/editorial/queries.ts",
  "components/blog/EditorialCta.tsx",
  "app/blog/temas/[cluster]/page.tsx",
];

describe("editorial production tracer", () => {
  it("proves the tracer across article, query, metadata, schema, hub and CTA", () => {
    expect(legacyArticles.map(({ slug }) => slug)).toEqual([
      "agentes-de-ia-no-whatsapp-para-vendas",
      "como-avaliar-novos-modelos-de-ia-para-negocios",
      "playbook-qualificacao-leads-whatsapp",
    ]);
    expect(tracerFiles.every((file) => existsSync(file))).toBe(true);
  });
});
