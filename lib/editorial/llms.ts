import type { PublishedEditorialCluster } from "@/lib/editorial/queries";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UNSAFE_INLINE_PROTOCOL = /\b(?:data|javascript|vbscript)\s*:/gi;

export function createLlmsIndex(
  articles: readonly EditorialPublishedArticle[],
  clusters: readonly PublishedEditorialCluster[],
) {
  const clusterSections = clusters.flatMap((cluster) => {
    const canonical = safeCanonicalUrl(cluster.hubPath);
    if (!canonical) return [];

    return [
      `### ${escapeLlmsText(cluster.label)}`,
      escapeLlmsText(cluster.description),
      `- URL: ${canonical}`,
    ].join("\n");
  });
  const articleSections = articles.flatMap((article) => {
    if (!SAFE_SLUG.test(article.slug)) return [];
    const canonical = safeCanonicalUrl(`/blog/${article.slug}`);
    if (!canonical) return [];

    return [
      `### ${escapeLlmsText(article.title)}`,
      escapeLlmsText(article.summary),
      `- URL: ${canonical}`,
    ].join("\n");
  });

  return [
    `# ${escapeLlmsText(siteConfig.name)}`,
    "",
    "> Esta superfície é complementar e experimental. Ela não é requisito de mecanismos de busca e não garante ranking, inclusão ou citação.",
    "",
    escapeLlmsText(siteConfig.description),
    "",
    "## Recursos oficiais",
    "",
    `- Site: ${siteConfig.url}`,
    `- Sistema: ${siteConfig.appUrl}`,
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `- Conteúdo editorial expandido: ${absoluteUrl("/llms-full.txt")}`,
    "",
    "## Temas editoriais publicados",
    "",
    ...joinSections(clusterSections),
    "## Artigos publicados",
    "",
    ...joinSections(articleSections),
  ].join("\n").trimEnd() + "\n";
}

function escapeLlmsText(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(UNSAFE_INLINE_PROTOCOL, "[protocolo removido]")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeCanonicalUrl(path: string) {
  if (!path.startsWith("/") || path.includes("?") || path.includes("#") || path.includes("\\")) {
    return undefined;
  }

  const canonical = new URL(absoluteUrl(path));
  const approvedOrigin = new URL(siteConfig.url).origin;
  if (canonical.protocol !== "https:" || canonical.origin !== approvedOrigin) return undefined;

  return canonical.toString();
}

function joinSections(sections: readonly string[]) {
  return sections.flatMap((section) => [section, ""]);
}
