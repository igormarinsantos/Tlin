import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";
import { formatArticleDate } from "@/lib/blog";

export function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/90 bg-white/80 p-6 shadow-[0_16px_50px_rgba(12,13,13,0.06)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(181,151,255,0.22)] ${featured ? "md:p-10" : ""}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#B597FF]/20 blur-3xl transition duration-500 group-hover:bg-[#38E3FF]/30" />
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="rounded-full border border-[#B597FF]/20 bg-[#B597FF]/10 px-3 py-1 text-xs font-bold text-zinc-700">{article.category}</span>
        <span className="text-xs font-medium text-zinc-400">{article.readingTime}</span>
      </div>
      <h2 className={`relative ${featured ? "text-3xl md:text-5xl" : "text-2xl"} text-balance font-semibold tracking-[-0.05em] text-zinc-950`}>
        <Link href={`/blog/${article.slug}`} className="outline-none after:absolute after:inset-0">{article.title}</Link>
      </h2>
      <p className="relative mt-4 text-pretty leading-7 text-zinc-600">{article.description}</p>
      <div className="relative mt-auto flex items-center justify-between border-t border-zinc-100 pt-6 text-sm text-zinc-500">
        <span>{formatArticleDate(article.publishedAt)}</span>
        <span className="font-semibold text-zinc-950 transition group-hover:text-[#8659e7]">Ler artigo →</span>
      </div>
    </article>
  );
}
