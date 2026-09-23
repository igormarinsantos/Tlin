import { editorialAuthors } from "@/content/editorial/authors";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const ARTICLE_SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export type EditorialBreadcrumbItem = {
  name: string;
  path: `/${string}`;
};

export type EditorialAuthorProfileData = {
  name: string;
  role: string;
  bio?: string;
  profilePath: `/blog/autores/${string}`;
  image?: {
    src: `/${string}`;
    alt: string;
  };
};

function absoluteEditorialUrl(value: string) {
  return value.startsWith("/") ? absoluteUrl(value) : value;
}

export function createArticleSocialImage(article: EditorialPublishedArticle) {
  return {
    url: absoluteUrl(`/blog/${article.slug}/opengraph-image`),
    ...ARTICLE_SOCIAL_IMAGE_SIZE,
    alt: `Capa do artigo ${article.title}`,
  };
}

export function createBreadcrumbStructuredData(article: EditorialPublishedArticle) {
  return createEditorialBreadcrumbData(`/blog/${article.slug}`, [
    { name: siteConfig.name, path: "/" },
    { name: "Conteúdos", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);
}

export function createEditorialBreadcrumbData(
  pagePath: `/${string}`,
  items: readonly EditorialBreadcrumbItem[],
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(pagePath)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createEditorialAuthorStructuredData(author: EditorialAuthorProfileData) {
  const canonical = absoluteUrl(author.profilePath);
  const breadcrumb = createEditorialBreadcrumbData(author.profilePath, [
    { name: siteConfig.name, path: "/" },
    { name: "Conteúdos", path: "/blog" },
    { name: author.name, path: author.profilePath },
  ]);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: author.name,
        inLanguage: "pt-BR",
        mainEntity: { "@id": `${canonical}#person` },
        breadcrumb: { "@id": breadcrumb["@id"] },
      },
      {
        "@type": "Person",
        "@id": `${canonical}#person`,
        name: author.name,
        jobTitle: author.role,
        url: canonical,
        ...(author.bio ? { description: author.bio } : {}),
        ...(author.image ? { image: absoluteUrl(author.image.src) } : {}),
      },
      breadcrumb,
    ],
  };
}

export function createArticleStructuredData(article: EditorialPublishedArticle) {
  const author = editorialAuthors[article.authorId as keyof typeof editorialAuthors];
  if (!author) throw new Error(`Unknown editorial author: ${article.authorId}`);

  const canonical = absoluteUrl(`/blog/${article.slug}`);
  const socialImage = createArticleSocialImage(article);
  const articleEntity = {
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: article.title,
    description: article.summary,
    inLanguage: "pt-BR",
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Person",
      name: author.name,
      url: absoluteEditorialUrl(author.profileUrl),
    },
    publisher: { "@id": absoluteUrl("/#organization") },
    breadcrumb: { "@id": `${canonical}#breadcrumb` },
    image: [socialImage.url],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      articleEntity,
      createBreadcrumbStructuredData(article),
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const serializeStructuredData = serializeJsonLd;
