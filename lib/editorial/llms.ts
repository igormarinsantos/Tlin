import type { PublishedEditorialCluster } from "@/lib/editorial/queries";
import type {
  ContentBlock,
  EditorialAuthor,
  EditorialPublishedArticle,
  EditorialSource,
} from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UNSAFE_INLINE_PROTOCOL = /\b(?:data|javascript|vbscript)\s*:/gi;

export function createLlmsIndex(
  articles: readonly EditorialPublishedArticle[],
  clusters: readonly PublishedEditorialCluster[],
) {
  const clusterSections = projectClusters(clusters).map(({ cluster, canonical }) => {
    return [
      `### ${escapeLlmsText(cluster.label)}`,
      escapeLlmsText(cluster.description),
      `- URL: ${canonical}`,
    ].join("\n");
  });
  const articleSections = projectArticles(articles).map(({ article, canonical }) => {
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

export function createLlmsFull(
  articles: readonly EditorialPublishedArticle[],
  clusters: readonly PublishedEditorialCluster[],
  authors: Readonly<Record<string, EditorialAuthor>>,
) {
  const safeClusters = projectClusters(clusters);
  const clusterSections = safeClusters.map(({ cluster, canonical }) => [
    `### ${escapeLlmsText(cluster.label)}`,
    escapeLlmsText(cluster.description),
    `- URL: ${canonical}`,
  ].join("\n"));
  const articleSections = projectArticles(articles).map(({ article, canonical }) => {
    const author = authors[article.authorId];
    const cluster = safeClusters.find(({ cluster: candidate }) => candidate.id === article.clusterId);
    const details = [
      `- URL: ${canonical}`,
      cluster ? `- Tema: ${escapeLlmsText(cluster.cluster.label)}` : undefined,
      author ? `- Autor: ${escapeLlmsText(author.name)}` : undefined,
      `- Publicado em: ${article.publishedAt}`,
      `- Atualizado em: ${article.modifiedAt}`,
    ].filter((line): line is string => Boolean(line));
    const content = article.blocks.flatMap(serializeContentBlock);
    const sources = article.sources.flatMap(serializeSource);

    return [
      `### ${escapeLlmsText(article.title)}`,
      escapeLlmsText(article.summary),
      ...details,
      "",
      "#### Conteúdo",
      "",
      ...content,
      ...(sources.length > 0 ? ["#### Fontes", "", ...sources] : []),
    ].join("\n").trimEnd();
  });

  return [
    `# ${escapeLlmsText(siteConfig.name)} — conteúdo editorial publicado`,
    "",
    "> Esta superfície é complementar e experimental. Ela não é requisito de mecanismos de busca e não garante ranking, inclusão ou citação.",
    "",
    "## Informações institucionais",
    "",
    `- Nome: ${escapeLlmsText(siteConfig.name)}`,
    `- Site: ${siteConfig.url}`,
    `- Sistema: ${siteConfig.appUrl}`,
    `- Descrição: ${escapeLlmsText(siteConfig.description)}`,
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

function safeSourceUrl(value: string) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

function projectClusters(clusters: readonly PublishedEditorialCluster[]) {
  return clusters.flatMap((cluster) => {
    const canonical = safeCanonicalUrl(cluster.hubPath);
    return canonical ? [{ cluster, canonical }] : [];
  });
}

function projectArticles(articles: readonly EditorialPublishedArticle[]) {
  return articles.flatMap((article) => {
    if (!SAFE_SLUG.test(article.slug)) return [];
    const canonical = safeCanonicalUrl(`/blog/${article.slug}`);
    return canonical ? [{ article, canonical }] : [];
  });
}

function serializeContentBlock(block: ContentBlock): string[] {
  switch (block.type) {
    case "heading":
      return [`${"#".repeat(block.level + 2)} ${escapeLlmsText(block.text)}`, ""];
    case "paragraph":
      return [escapeLlmsText(block.text), ""];
    case "list":
      return [
        ...block.items.map((item, index) =>
          `${block.ordered ? `${index + 1}.` : "-"} ${escapeLlmsText(item)}`,
        ),
        "",
      ];
    case "quote": {
      const attribution = block.attribution
        ? ` — ${escapeLlmsText(block.attribution)}`
        : "";
      return [`> ${escapeLlmsText(block.text)}${attribution}`, ""];
    }
    case "image":
      return block.decorative || !block.alt
        ? []
        : [`- Imagem: ${escapeLlmsText(block.alt)}`, ""];
  }
}

function serializeSource(source: EditorialSource) {
  const url = safeSourceUrl(source.url);
  if (!url) return [];
  const publisher = source.publisher ? ` — ${escapeLlmsText(source.publisher)}` : "";
  return [`- ${escapeLlmsText(source.title)}${publisher}: ${url}`];
}

function joinSections(sections: readonly string[]) {
  return sections.flatMap((section) => [section, ""]);
}
