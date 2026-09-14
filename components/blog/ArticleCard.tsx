import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";
import { formatArticleDate } from "@/lib/blog";
import { CATEGORY_VISUALS } from "./categoryVisuals";
import { ArrowRightIcon } from "./icons";

export function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const visual = CATEGORY_VISUALS[article.category];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B597FF]/30 hover:shadow-[0_20px_50px_rgba(181,151,255,0.15)] ${featured ? "md:p-10" : ""}`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: `${visual.from}1a`, color: visual.badgeText }}
        >
          {article.category}
        </span>
        <span className="text-xs font-medium text-zinc-400">{article.readingTime}</span>
      </div>
      <h2 className={`relative ${featured ? "text-3xl md:text-5xl" : "text-xl"} text-balance font-black tracking-tight text-[#0c0d0d]`}>
        <Link href={`/blog/${article.slug}`} className="outline-none after:absolute after:inset-0">{article.title}</Link>
      </h2>
      <p className="relative mt-4 text-pretty leading-7 text-zinc-500">{article.description}</p>
      <div className="relative mt-auto flex items-center justify-between border-t border-zinc-100 pt-6 text-sm text-zinc-500">
        <span>{formatArticleDate(article.publishedAt)}</span>
        <span className="flex items-center gap-1.5 font-bold text-[#0c0d0d] transition-colors group-hover:text-[#8659e7]">
          Ler artigo
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}
