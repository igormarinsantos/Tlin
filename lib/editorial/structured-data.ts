import { editorialAuthors } from "@/content/editorial/authors";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

function absoluteEditorialUrl(value: string) {
  return value.startsWith("/") ? absoluteUrl(value) : value;
}

export function createArticleStructuredData(article: EditorialPublishedArticle) {
  const author = editorialAuthors[article.authorId as keyof typeof editorialAuthors];
  if (!author) throw new Error(`Unknown editorial author: ${article.authorId}`);

  const canonical = absoluteUrl(`/blog/${article.slug}`);
  const articleEntity: Record<string, unknown> = {
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
  };

  if (article.heroImage) {
    articleEntity.image = [absoluteEditorialUrl(article.heroImage.src)];
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      articleEntity,
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteConfig.name,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Conteúdos",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: canonical,
          },
        ],
      },
    ],
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
