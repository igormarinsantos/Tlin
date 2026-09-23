import { editorialAuthors } from "@/content/editorial/authors";
import { editorialClusters } from "@/content/editorial/taxonomy";
import { editorialArticles } from "@/lib/editorial/registry";
import type {
  EditorialArticle,
  EditorialAuthor,
  EditorialCluster,
  EditorialPublishedArticle,
} from "@/lib/editorial/types";

export type PublishedEditorialCluster = EditorialCluster & {
  slug: string;
  articles: readonly EditorialPublishedArticle[];
};

export type PublishedEditorialAuthor = EditorialAuthor & {
  slug: string;
  profilePath: `/blog/autores/${string}`;
  articles: readonly EditorialPublishedArticle[];
};

function isPublishedAt(article: EditorialArticle, now: Date): article is EditorialPublishedArticle {
  if (article.status !== "published") return false;
  const publishedAt = Date.parse(article.publishedAt);
  return Number.isFinite(publishedAt) && publishedAt <= now.getTime();
}

function byNewestPublication(
  left: EditorialPublishedArticle,
  right: EditorialPublishedArticle,
) {
  const dateDifference = Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
  return dateDifference || left.slug.localeCompare(right.slug, "pt-BR");
}

export function getPublishedArticles(
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
) {
  return articles.filter((article) => isPublishedAt(article, now)).sort(byNewestPublication);
}

export function getPublishedArticleBySlug(
  slug: string,
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
) {
  return getPublishedArticles(now, articles).find((article) => article.slug === slug);
}

export function getPublishedClusters(
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
): PublishedEditorialCluster[] {
  const published = getPublishedArticles(now, articles);

  return Object.values(editorialClusters)
    .map((cluster) => ({
      ...cluster,
      slug: cluster.hubPath.split("/").filter(Boolean).at(-1) ?? "",
      articles: published.filter((article) => article.clusterId === cluster.id),
    }))
    .filter((cluster) => cluster.slug && cluster.articles.length > 0)
    .sort((left, right) => left.label.localeCompare(right.label, "pt-BR"));
}

export function getPublishedClusterBySlug(
  slug: string,
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
) {
  return getPublishedClusters(now, articles).find((cluster) => cluster.slug === slug);
}

export function getPublishedAuthors(
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
  authors: Readonly<Record<string, EditorialAuthor>> = editorialAuthors,
): PublishedEditorialAuthor[] {
  const published = getPublishedArticles(now, articles);

  return Object.values(authors)
    .map((author) => {
      const slug = author.id.split(":").at(-1) ?? "";
      return {
        ...author,
        slug,
        profilePath: `/blog/autores/${slug}` as const,
        articles: published.filter((article) => article.authorId === author.id),
      };
    })
    .filter((author) => author.approved && author.slug && author.articles.length > 0)
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

export function getPublishedAuthorBySlug(
  slug: string,
  now: Date = new Date(),
  articles: readonly EditorialArticle[] = editorialArticles,
) {
  return getPublishedAuthors(now, articles).find((author) => author.slug === slug);
}

export function getRelatedPublishedArticles(
  article: EditorialPublishedArticle,
  now: Date = new Date(),
  limit = 2,
  articles: readonly EditorialArticle[] = editorialArticles,
) {
  const others = getPublishedArticles(now, articles).filter(
    (candidate) => candidate.slug !== article.slug,
  );
  const sameCluster = others.filter((candidate) => candidate.clusterId === article.clusterId);
  const sameIntent = others.filter(
    (candidate) =>
      candidate.clusterId !== article.clusterId && candidate.intent === article.intent,
  );
  const remaining = others.filter(
    (candidate) =>
      candidate.clusterId !== article.clusterId && candidate.intent !== article.intent,
  );
  return [...sameCluster, ...sameIntent, ...remaining].slice(0, limit);
}
