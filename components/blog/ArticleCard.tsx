import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";
import { formatArticleDate, getChatGptSummaryUrl } from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";
import { CATEGORY_VISUALS } from "./categoryVisuals";
import { ArrowRightIcon, SparkleIcon } from "./icons";

export function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  const visual = CATEGORY_VISUALS[article.category];
  const summaryUrl = getChatGptSummaryUrl(absoluteUrl(`/blog/${article.slug}`));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B597FF]/30 hover:shadow-[0_20px_50px_rgba(181,151,255,0.15)]">
      {/* "Imagem" do post -- o site nao tem banco de fotos, entao o banner
          usa o mesmo gradiente + icone por categoria do carrossel de
          destaque (ver categoryVisuals.ts), em vez de fabricar foto falsa. */}
      <div
        className="relative h-32 md:h-40 overflow-hidden shrink-0"
        style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute inset-0 flex items-center justify-center text-white/30">
          <visual.Icon className="w-12 h-12" />
        </div>
      </div>

      <div className={`relative flex flex-1 flex-col p-6 ${featured ? "md:p-10" : ""}`}>
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
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
          <span>{formatArticleDate(article.publishedAt)}</span>
          <div className="flex items-center gap-4">
            <a
              href={summaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-bold text-zinc-500 transition-colors hover:text-[#8659e7]"
            >
              <SparkleIcon className="w-3.5 h-3.5" />
              Resumir com IA
            </a>
            <span className="flex items-center gap-1.5 font-bold text-[#0c0d0d] transition-colors group-hover:text-[#8659e7]">
              Ler artigo
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
