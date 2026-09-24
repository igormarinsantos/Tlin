import Image from "next/image";
import Link from "next/link";
import { editorialClusters } from "@/content/editorial/taxonomy";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl } from "@/lib/siteConfig";
import { AiSummaryButton } from "./AiSummaryButton";
import { CATEGORY_VISUALS } from "./categoryVisuals";

export type EditorialArticleSummary = {
  id: EditorialPublishedArticle["id"];
  slug: EditorialPublishedArticle["slug"];
  title: EditorialPublishedArticle["title"];
  summary: EditorialPublishedArticle["summary"];
  clusterId: EditorialPublishedArticle["clusterId"];
  topic: string;
  publishedAt: EditorialPublishedArticle["publishedAt"];
  readingTimeMinutes: EditorialPublishedArticle["readingTimeMinutes"];
  featured: boolean;
  heroImage?: EditorialPublishedArticle["heroImage"];
};

export function ArticleCard({ article, featured = false }: { article: EditorialArticleSummary; featured?: boolean }) {
  const visual = CATEGORY_VISUALS[article.clusterId];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B597FF]/30">
      <div className="shrink-0 p-2.5">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          {article.heroImage ? (
            <Image
              src={article.heroImage.src}
              alt={article.heroImage.decorative ? "" : article.heroImage.alt}
              fill
              sizes={featured ? "(min-width: 768px) 72rem, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
              aria-hidden="true"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                <visual.Icon className="h-12 w-12" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`relative flex flex-1 flex-col px-6 pb-6 ${featured ? "md:px-10 md:pb-10" : ""}`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={editorialClusters[article.clusterId].hubPath}
            className="relative z-20 rounded-full px-3 py-1 text-xs font-bold outline-none transition-opacity hover:opacity-80 focus-visible:ring-4 focus-visible:ring-[#B597FF]/20"
            style={{ backgroundColor: `${visual.from}1a`, color: visual.badgeText }}
          >
            {article.topic}
          </Link>
          <span className="text-xs font-medium text-zinc-400">
            {article.readingTimeMinutes} min de leitura
          </span>
        </div>
        <h2 className={`relative ${featured ? "text-3xl md:text-5xl" : "text-xl"} text-balance font-black tracking-tight text-[#0c0d0d]`}>
          <Link href={`/blog/${article.slug}`} className="outline-none after:absolute after:inset-0">{article.title}</Link>
        </h2>
        <p className="relative mt-4 text-pretty leading-7 text-zinc-500">{article.summary}</p>
        <div className="relative z-10 mt-auto pt-6 text-sm text-zinc-500">
          <div className="grid grid-cols-2 gap-2">
            <AiSummaryButton
              articleUrl={absoluteUrl(`/blog/${article.slug}`)}
              articleTitle={article.title}
              variant="gradient"
              className="min-h-10 w-full min-w-0 justify-center"
            />
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#0c0d0d] px-3 py-2 font-bold text-white outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#242525] focus-visible:ring-4 focus-visible:ring-[#0c0d0d]/20"
            >
              Ler artigo
            </Link>
          </div>
          <span className="mt-4 block text-center text-xs text-zinc-400">
            {formatArticleDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(date));
}
