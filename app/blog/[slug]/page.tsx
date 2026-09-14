import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BLOG_ARTICLES,
  formatArticleDate,
  getArticle,
  getChatGptSummaryUrl,
  getRelatedArticles,
  slugifyHeading,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";
import { CATEGORY_VISUALS } from "@/components/blog/categoryVisuals";
import { ArrowLeftIcon, SparkleIcon } from "@/components/blog/icons";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ShareBar } from "@/components/blog/ShareBar";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

export function generateStaticParams() { return BLOG_ARTICLES.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: absoluteUrl(`/blog/${article.slug}`) },
    openGraph: { type: "article", title: article.title, description: article.description, url: absoluteUrl(`/blog/${article.slug}`), publishedTime: article.publishedAt, authors: [article.author] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const visual = CATEGORY_VISUALS[article.category];
  const articleUrl = absoluteUrl(`/blog/${article.slug}`);
  const summaryUrl = getChatGptSummaryUrl(articleUrl);
  const relatedArticles = getRelatedArticles(article);
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.publishedAt, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: "tlin.ai", url: absoluteUrl("/") }, mainEntityOfPage: articleUrl };

  return (
    <main className="bg-white px-4 pb-12 pt-28 md:px-8 md:pb-20 md:pt-36">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

      <div className="mx-auto max-w-5xl">
        <Link href="/blog" className="flex items-center gap-1.5 text-sm font-bold text-[#8659e7] hover:underline">
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Todos os conteúdos
        </Link>

        {/* Capa do artigo -- mesmo gradiente + icone por categoria dos
            cards (o site nao tem foto de capa, ver categoryVisuals.ts),
            num container mais largo que a coluna de texto abaixo. */}
        <div
          className="relative mt-6 h-48 md:h-64 rounded-3xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center text-white/25">
            <visual.Icon className="w-20 h-20 md:w-24 md:h-24" />
          </div>
        </div>

        <div className="max-w-3xl">
          <p className="mt-10 text-sm font-bold uppercase tracking-wide" style={{ color: visual.badgeText }}>
            {article.category}
          </p>
          <h1 className="mt-4 text-balance text-4xl md:text-6xl font-black tracking-tight text-[#0c0d0d]">{article.title}</h1>
          <p className="mt-6 text-xl leading-8 text-zinc-500">{article.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span>{article.author}</span>
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>{article.readingTime}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={summaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 transition-colors hover:text-[#8659e7]"
              >
                <SparkleIcon className="w-3.5 h-3.5" />
                Resumir com IA
              </a>
              <ShareBar url={articleUrl} title={article.title} />
            </div>
          </div>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Sumario -- so desktop, os posts sao curtos demais (2-3 secoes)
              pra valer um acordeao a mais na tela do celular. */}
          {article.content.length > 1 && (
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-4">Neste artigo</p>
                <nav className="flex flex-col gap-3">
                  {article.content.map((section) => (
                    <a
                      key={section.heading}
                      href={`#${slugifyHeading(section.heading)}`}
                      className="text-sm text-zinc-500 leading-snug transition-colors hover:text-[#8659e7]"
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <div className="max-w-3xl">
            <div className="space-y-12">
              {article.content.map((section) => (
                <section key={section.heading} id={slugifyHeading(section.heading)} className="scroll-mt-28">
                  <h2 className="text-2xl font-black tracking-tight text-[#0c0d0d]">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-lg leading-8 text-zinc-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="mt-14 rounded-3xl bg-[#0c0d0d] p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-wide text-[#38E3FF]">Tlin para sua operação</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Quer aplicar IA no seu atendimento comercial?</h2>
              <p className="mt-3 leading-7 text-zinc-300">
                Conheça os agentes da Tlin para responder, qualificar e recuperar oportunidades no WhatsApp.
              </p>
              <a href="https://tlin.ia.br/#planos" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0c0d0d]">
                Conhecer a Tlin
              </a>
            </aside>

            {relatedArticles.length > 0 && (
              <div className="mt-14">
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-6">Continue lendo</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  {relatedArticles.map((related) => (
                    <ArticleCard key={related.slug} article={related} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
