import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_ARTICLES, formatArticleDate, getArticle } from "@/lib/blog";
import { absoluteUrl } from "@/lib/siteConfig";

export function generateStaticParams() { return BLOG_ARTICLES.map(({ slug }) => ({ slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: absoluteUrl(`/blog/${article.slug}`) },
    openGraph: { type: "article", title: article.title, description: article.description, url: absoluteUrl(`/blog/${article.slug}`), publishedTime: article.publishedAt, authors: [article.author] },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.publishedAt, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: "tlin.ai", url: absoluteUrl("/") }, mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`) };

  return <main className="px-5 py-12 md:px-8 md:py-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><article className="mx-auto max-w-3xl"><Link href="/blog" className="text-sm font-semibold text-cyan-700 hover:underline">← Todos os conteúdos</Link><p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">{article.category}</p><h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.055em] text-zinc-950 md:text-6xl">{article.title}</h1><p className="mt-6 text-xl leading-8 text-zinc-600">{article.description}</p><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-zinc-200 py-5 text-sm text-zinc-500"><span>{article.author}</span><span>{formatArticleDate(article.publishedAt)}</span><span>{article.readingTime}</span></div><div className="mt-12 space-y-12">{article.content.map((section) => <section key={section.heading}><h2 className="text-2xl font-semibold tracking-[-0.035em] text-zinc-950">{section.heading}</h2><div className="mt-4 space-y-4 text-lg leading-8 text-zinc-700">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div><aside className="mt-14 rounded-3xl bg-zinc-950 p-8 text-white"><p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Tlin para sua operação</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">Quer aplicar IA no seu atendimento comercial?</h2><p className="mt-3 leading-7 text-zinc-300">Conheça os agentes da Tlin para responder, qualificar e recuperar oportunidades no WhatsApp.</p><a href="https://tlin.cloud/#pricing" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950">Conhecer a Tlin</a></aside></article></main>;
}
