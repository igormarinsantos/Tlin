import Link from "next/link";
import { editorialClusters } from "@/content/editorial/taxonomy";
import type { EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl } from "@/lib/siteConfig";
import { CATEGORY_VISUALS } from "./categoryVisuals";
import { ArrowRightIcon, SparkleIcon } from "./icons";

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
};

export function ArticleCard({ article, featured = false }: { article: EditorialArticleSummary; featured?: boolean }) {
  const visual = CATEGORY_VISUALS[article.clusterId];
  const summaryUrl = getChatGptSummaryUrl(absoluteUrl(`/blog/${article.slug}`));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B597FF]/30">
      {/* "Imagem" do post -- o site nao tem banco de fotos, entao o banner
          usa o mesmo gradiente + icone por categoria do carrossel de
          destaque (ver categoryVisuals.ts), em vez de fabricar foto falsa.
          Cantos proprios (nao so o recorte do card) + respiro de 10px em
          volta, em vez de colada nas bordas do card. */}
      <div className="p-2.5 shrink-0">
        <div
          className="relative h-32 md:h-40 rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center text-white/30">
            <visual.Icon className="w-12 h-12" />
          </div>
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

export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(date));
}

export function getChatGptSummaryUrl(articleUrl: string) {
  const prompt = `Resuma esse artigo pra mim, em português, com os pontos principais: ${articleUrl}`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
