import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_ARTICLES, formatArticleDate, getArticle } from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";
import { CATEGORY_VISUALS } from "@/components/blog/categoryVisuals";
import { ArrowLeftIcon } from "@/components/blog/icons";

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
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.publishedAt, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: "tlin.ai", url: absoluteUrl("/") }, mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`) };

  return (
    <main className="bg-white px-4 pb-12 pt-28 md:px-8 md:pb-20 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="flex items-center gap-1.5 text-sm font-bold text-[#8659e7] hover:underline">
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Todos os conteúdos
        </Link>
        <p className="mt-10 text-sm font-bold uppercase tracking-wide" style={{ color: visual.badgeText }}>
          {article.category}
        </p>
        <h1 className="mt-4 text-balance text-4xl md:text-6xl font-black tracking-tight text-[#0c0d0d]">{article.title}</h1>
        <p className="mt-6 text-xl leading-8 text-zinc-500">{article.description}</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-zinc-200 py-5 text-sm text-zinc-500">
          <span>{article.author}</span>
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span>{article.readingTime}</span>
        </div>
        <div className="mt-12 space-y-12">
          {article.content.map((section) => (
            <section key={section.heading}>
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
      </article>
    </main>
  );
}
