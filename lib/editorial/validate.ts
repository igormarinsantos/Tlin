import { editorialAuthors } from "@/content/editorial/authors";
import { editorialClusters } from "@/content/editorial/taxonomy";
import type {
  ContentBlock,
  EditorialApproval,
  EditorialArticle,
  EditorialImage,
} from "@/lib/editorial/types";

export type EditorialValidationIssue = {
  code: string;
  articleSlug?: string;
  path: string;
  message: string;
};

export type EditorialValidationOptions = {
  now?: Date;
};

const ISO_WITH_TIMEZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const STABLE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoWithTimezone(value: unknown): value is string {
  return typeof value === "string" && ISO_WITH_TIMEZONE.test(value) && Number.isFinite(Date.parse(value));
}

function isSafeInternalUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
  );
}

function isSafeHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isSafeLink(value: unknown): value is string {
  return isSafeInternalUrl(value) || isSafeHttpsUrl(value);
}

function isResolvableInternalUrl(value: string) {
  const knownPaths = new Set<string>([
    "/blog",
    ...Object.values(editorialClusters).flatMap((cluster) => [
      cluster.hubPath,
      cluster.intentOwner,
    ]),
  ]);
  return knownPaths.has(value);
}

export function validateEditorialArticles(
  articles: readonly EditorialArticle[],
  options: EditorialValidationOptions = {},
): EditorialValidationIssue[] {
  const issues: EditorialValidationIssue[] = [];
  const now = options.now ?? new Date();
  const slugs = new Map<string, number>();
  const ids = new Map<string, number>();

  const add = (article: EditorialArticle, code: string, path: string, message: string) => {
    issues.push({ code, articleSlug: article.slug, path, message });
  };

  for (const article of articles) {
    slugs.set(article.slug, (slugs.get(article.slug) ?? 0) + 1);
    ids.set(article.id, (ids.get(article.id) ?? 0) + 1);

    if (!STABLE_ID.test(article.slug)) {
      add(article, "slug.invalid", "slug", "O slug deve usar somente letras minúsculas, números e hífens.");
    }

    validateReferences(article, add);
    validateDates(article, now, add);
    validateBlocks(article, add);
    validateLinksAndSources(article, add);
    validateMedia(article, add);

    if (article.status === "published") {
      validatePublicationGate(article, add);
    }
  }

  for (const article of articles) {
    if ((slugs.get(article.slug) ?? 0) > 1) {
      add(article, "slug.duplicate", "slug", `Slug duplicado: ${article.slug}`);
    }
    if ((ids.get(article.id) ?? 0) > 1) {
      add(article, "id.duplicate", "id", `ID editorial duplicado: ${article.id}`);
    }
  }

  return issues;
}

function validateReferences(
  article: EditorialArticle,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  if (article.authorId && !editorialAuthors[article.authorId as keyof typeof editorialAuthors]) {
    add(article, "author.unknown", "authorId", `Autor inexistente: ${article.authorId}`);
  }
  if (article.clusterId && !editorialClusters[article.clusterId as keyof typeof editorialClusters]) {
    add(article, "cluster.unknown", "clusterId", `Cluster inexistente: ${article.clusterId}`);
  }
  const cluster = article.clusterId
    ? editorialClusters[article.clusterId as keyof typeof editorialClusters]
    : undefined;
  if (
    article.intent &&
    cluster &&
    !cluster.allowedIntents.some((allowedIntent) => allowedIntent === article.intent)
  ) {
    add(
      article,
      "intent.cluster",
      "intent",
      `A intenção ${article.intent} não pertence ao território do cluster ${cluster.id}.`,
    );
  }
}

function validateDates(
  article: EditorialArticle,
  now: Date,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  if (article.publishedAt && !isIsoWithTimezone(article.publishedAt)) {
    add(article, "publishedAt.invalid", "publishedAt", "A data de publicação deve ser ISO 8601 com timezone.");
  }
  if (article.modifiedAt && !isIsoWithTimezone(article.modifiedAt)) {
    add(article, "modifiedAt.invalid", "modifiedAt", "A data de modificação deve ser ISO 8601 com timezone.");
  }
  if (isIsoWithTimezone(article.publishedAt) && Date.parse(article.publishedAt) > now.getTime()) {
    add(article, "publishedAt.future", "publishedAt", "Conteúdo publicado não pode ter data futura.");
  }
  if (
    isIsoWithTimezone(article.publishedAt) &&
    isIsoWithTimezone(article.modifiedAt) &&
    Date.parse(article.modifiedAt) < Date.parse(article.publishedAt)
  ) {
    add(article, "modifiedAt.beforePublishedAt", "modifiedAt", "A modificação não pode anteceder a publicação.");
  }
}

function validateBlocks(
  article: EditorialArticle,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  const headingIds = new Set<string>();

  article.blocks.forEach((block, index) => {
    if (!isRecord(block) || !["heading", "paragraph", "list", "quote", "image"].includes(String(block.type))) {
      add(article, "block.type", `blocks.${index}.type`, "O bloco deve usar um tipo editorial permitido.");
      return;
    }

    if (block.type !== "heading") return;
    const heading = block as Extract<ContentBlock, { type: "heading" }>;
    if (!STABLE_ID.test(heading.id)) {
      add(article, "heading.id", `blocks.${index}.id`, "O heading precisa de um ID estável em kebab-case.");
    }
    if (headingIds.has(heading.id)) {
      add(article, "heading.duplicate", `blocks.${index}.id`, `Heading ID duplicado: ${heading.id}`);
    }
    headingIds.add(heading.id);
  });
}

function validateLinksAndSources(
  article: EditorialArticle,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  article.sources?.forEach((source, index) => {
    if (!isSafeHttpsUrl(source.url)) {
      add(article, "source.url", `sources.${index}.url`, "Fontes externas devem usar HTTPS sem credenciais.");
    }
    if (!isIsoWithTimezone(source.accessedAt)) {
      add(article, "source.accessedAt", `sources.${index}.accessedAt`, "A data de acesso deve incluir timezone.");
    }
  });

  article.internalLinks?.forEach((link, index) => {
    if (!isSafeInternalUrl(link.href)) {
      add(article, "internalLink.url", `internalLinks.${index}.href`, "Links internos devem usar paths absolutos locais.");
    } else if (!isResolvableInternalUrl(link.href)) {
      add(article, "internalLink.unresolved", `internalLinks.${index}.href`, "O link interno deve apontar para uma rota editorial ou comercial registrada.");
    }
  });

  if (article.cta && !isSafeLink(article.cta.href)) {
    add(article, "cta.url", "cta.href", "O CTA deve usar um path interno ou HTTPS seguro.");
  } else if (
    article.cta &&
    isSafeInternalUrl(article.cta.href) &&
    !isResolvableInternalUrl(article.cta.href)
  ) {
    add(article, "cta.unresolved", "cta.href", "O CTA interno deve apontar para uma rota registrada.");
  }
}

function validateMedia(
  article: EditorialArticle,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  const media: Array<{ image: EditorialImage; path: string }> = [];
  if (article.heroImage) media.push({ image: article.heroImage, path: "heroImage" });
  article.blocks.forEach((block, index) => {
    if (block.type === "image") media.push({ image: block, path: `blocks.${index}` });
  });

  for (const { image, path } of media) {
    if (!isSafeLink(image.src)) {
      add(article, "media.url", `${path}.src`, "A mídia deve usar um path interno ou HTTPS seguro.");
    }
    if (!image.decorative && !image.alt.trim()) {
      add(article, "media.alt", `${path}.alt`, "Mídia informativa exige texto alternativo.");
    }
    if (!isApproved(image.approval)) {
      add(article, "media.approval", `${path}.approval`, "Mídia declarada exige aprovação editorial registrada.");
    }
  }
}

function validatePublicationGate(
  article: EditorialArticle,
  add: (article: EditorialArticle, code: string, path: string, message: string) => void,
) {
  if (!article.authorId) add(article, "author.required", "authorId", "Publicação exige autoria aprovada.");
  if (!article.clusterId) add(article, "cluster.required", "clusterId", "Publicação exige cluster editorial.");
  if (!article.intent) add(article, "intent.required", "intent", "Publicação exige intenção de busca.");
  if (!article.summary?.trim()) add(article, "summary.required", "summary", "Publicação exige resumo.");
  if (!article.publishedAt) add(article, "publishedAt.required", "publishedAt", "Publicação exige data com timezone.");
  if (!article.modifiedAt) add(article, "modifiedAt.required", "modifiedAt", "Publicação exige data de modificação verdadeira.");
  if (!article.readingTimeMinutes || article.readingTimeMinutes < 1) {
    add(article, "readingTime.required", "readingTimeMinutes", "Publicação exige tempo de leitura positivo.");
  }
  if (!article.blocks.length) add(article, "blocks.required", "blocks", "Publicação exige conteúdo editorial.");
  if (!article.sources?.length) add(article, "sources.required", "sources", "Publicação exige ao menos uma fonte verificável.");
  if (!article.internalLinks?.length) add(article, "internalLinks.required", "internalLinks", "Publicação exige links internos úteis.");
  if (!article.cta) add(article, "cta.required", "cta", "Publicação exige CTA definido.");
  if (!article.review?.originalContribution?.trim()) {
    add(article, "review.originalContribution", "review.originalContribution", "A contribuição original deve ser registrada.");
  }
  if (!isApproved(article.review?.factual)) {
    add(article, "review.factual", "review.factual", "Publicação exige revisão factual aprovada.");
  }
  if (!isApproved(article.review?.commercial)) {
    add(article, "review.commercial", "review.commercial", "Publicação exige revisão comercial aprovada.");
  }
}

function isApproved(approval: EditorialApproval | undefined) {
  return (
    approval?.status === "approved" &&
    Boolean(editorialAuthors[approval.approvedBy as keyof typeof editorialAuthors]) &&
    isIsoWithTimezone(approval.approvedAt)
  );
}
