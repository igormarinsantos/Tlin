import { agentesDeIaNoWhatsappParaVendas } from "@/content/editorial/articles/agentes-de-ia-no-whatsapp-para-vendas";
import { comoAvaliarNovosModelosArticle } from "@/content/editorial/articles/como-avaliar-novos-modelos-de-ia-para-negocios";
import type { EditorialArticle } from "@/lib/editorial/types";
import { validateEditorialArticles } from "@/lib/editorial/validate";

export const editorialArticles = [
  agentesDeIaNoWhatsappParaVendas,
  comoAvaliarNovosModelosArticle,
] satisfies readonly EditorialArticle[];

const registryIssues = validateEditorialArticles(editorialArticles);

if (registryIssues.length > 0) {
  const diagnostics = registryIssues
    .map((issue) => `${issue.articleSlug ?? "unknown"}:${issue.path}:${issue.code}`)
    .join(", ");
  throw new Error(`Invalid editorial registry: ${diagnostics}`);
}
