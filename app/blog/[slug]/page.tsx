import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editorialAuthors } from "@/content/editorial/authors";
import { editorialClusters } from "@/content/editorial/taxonomy";
import { EditorialCta } from "@/components/blog/EditorialCta";
import { ArrowLeftIcon, SparkleIcon } from "@/components/blog/icons";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareBar } from "@/components/blog/ShareBar";
import { CATEGORY_VISUALS } from "@/components/blog/categoryVisuals";
import {
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedPublishedArticles,
} from "@/lib/editorial/queries";
import {
  createArticleStructuredData,
  serializeStructuredData,
} from "@/lib/editorial/structured-data";
import type { ContentBlock, EditorialPublishedArticle } from "@/lib/editorial/types";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const visual = CATEGORY_VISUALS["Vendas com IA"];
const socialImage = {
  url: absoluteUrl("/og/platform-preview-email.jpg"),
  width: 1200,
  height: 630,
  alt: "Interface da IA comercial da Tlin",
};

export function generateStaticParams() {
  return getPublishedArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) return {};

  const author = editorialAuthors[article.authorId];
  const canonical = absoluteUrl(`/blog/${article.slug}`);

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical,
      languages: { "pt-BR": canonical },
    },
    robots: { index: true, follow: true },
    authors: [{ name: author.name, url: absoluteUrl(author.profileUrl) }],
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: article.title,
      description: article.summary,
      url: canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: [author.name],
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [socialImage.url],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const author = editorialAuthors[article.authorId];
  const cluster = editorialClusters[article.clusterId];
  const articleUrl = absoluteUrl(`/blog/${article.slug}`);
  const summaryUrl = createChatGptSummaryUrl(articleUrl);
  const relatedArticles = getRelatedPublishedArticles(article);
  const headings = article.blocks.filter(
    (block): block is Extract<ContentBlock, { type: "heading" }> => block.type === "heading",
  );
  const structuredData = serializeStructuredData(createArticleStructuredData(article));

  return (
    <main className="bg-white px-4 pb-12 pt-28 md:px-8 md:pb-20 md:pt-36">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm font-bold text-[#8659e7] hover:underline"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Todos os conteúdos
        </Link>

        <div
          className="relative mt-6 h-48 overflow-hidden rounded-3xl md:h-64"
          style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center text-white/25">
            <visual.Icon className="h-20 w-20 md:h-24 md:w-24" />
          </div>
        </div>

        <div className="max-w-3xl">
          <p className="mt-10 text-sm font-bold tracking-wide" style={{ color: visual.badgeText }}>
            {cluster.label}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-[#0c0d0d] md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 text-xl leading-8 text-zinc-500">{article.summary}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span>{author.name}</span>
              <span>{formatEditorialDate(article.publishedAt)}</span>
              <span>{article.readingTimeMinutes} min de leitura</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={summaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 transition-colors hover:text-[#8659e7]"
              >
                <SparkleIcon className="h-3.5 w-3.5" />
                Resumir com IA
              </a>
              <ShareBar url={articleUrl} title={article.title} />
            </div>
          </div>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          {headings.length > 1 && (
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="mb-4 text-xs font-bold tracking-wide text-zinc-400">Neste artigo</p>
                <nav className="flex flex-col gap-3" aria-label="Sumário do artigo">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="text-sm leading-snug text-zinc-500 transition-colors hover:text-[#8659e7]"
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <div className="max-w-3xl">
            <div className="space-y-6">{article.blocks.map(renderBlock)}</div>

            <aside className="mt-14 rounded-3xl bg-[#0c0d0d] p-8 text-white">
              <p className="text-sm font-bold tracking-wide text-[#38E3FF]">Tlin para sua operação</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Quer aplicar IA no seu atendimento comercial?
              </h2>
              <p className="mt-3 leading-7 text-zinc-300">
                Conheça a IA comercial da Tlin para responder, qualificar e recuperar oportunidades no WhatsApp.
              </p>
              <EditorialCta
                articleSlug={article.slug}
                clusterId={article.clusterId}
                intent={article.intent}
                cta={article.cta}
                location="article-end"
              />
            </aside>

            <div className="mt-14">
              <p className="mb-6 text-sm font-bold tracking-wide text-zinc-400">Continue lendo</p>
              <div className="grid gap-5 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <RelatedArticleCard key={related.slug} article={related} />
                ))}
                {relatedArticles.length === 0 &&
                  article.internalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-3xl border border-zinc-200 p-6 transition-colors hover:border-[#B597FF]/40"
                    >
                      <span className="font-bold text-[#0c0d0d]">{link.label}</span>
                      {link.purpose && <span className="mt-2 block text-sm text-zinc-500">{link.purpose}</span>}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 2 ? "h2" : "h3";
      return (
        <Heading
          key={block.id}
          id={block.id}
          className="scroll-mt-28 pt-6 text-2xl font-black tracking-tight text-[#0c0d0d]"
        >
          {block.text}
        </Heading>
      );
    }
    case "paragraph":
      return <p key={`paragraph-${index}`} className="text-lg leading-8 text-zinc-700">{block.text}</p>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List key={`list-${index}`} className="space-y-2 pl-6 text-lg leading-8 text-zinc-700 marker:text-[#8659e7]">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </List>
      );
    }
    case "quote":
      return (
        <blockquote key={`quote-${index}`} className="border-l-4 border-[#B597FF] pl-5 text-lg leading-8 text-zinc-700">
          <p>{block.text}</p>
          {block.attribution && <cite className="mt-2 block text-sm text-zinc-500">{block.attribution}</cite>}
        </blockquote>
      );
    case "image":
      return (
        <figure key={`image-${index}`}>
          <Image
            src={block.src}
            alt={block.decorative ? "" : block.alt}
            width={block.width ?? 1200}
            height={block.height ?? 675}
            className="h-auto w-full rounded-3xl"
          />
          {block.caption && <figcaption className="mt-3 text-sm text-zinc-500">{block.caption}</figcaption>}
        </figure>
      );
  }
}

function RelatedArticleCard({ article }: { article: EditorialPublishedArticle }) {
  return (
    <article className="rounded-3xl border border-zinc-200 p-6 transition-colors hover:border-[#B597FF]/40">
      <p className="text-xs font-bold text-[#8659e7]">{formatEditorialDate(article.publishedAt)}</p>
      <h3 className="mt-3 text-xl font-black tracking-tight text-[#0c0d0d]">
        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-3 leading-7 text-zinc-500">{article.summary}</p>
    </article>
  );
}

function formatEditorialDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function createChatGptSummaryUrl(articleUrl: string) {
  const prompt = `Resuma esse artigo pra mim, em português, com os pontos principais: ${articleUrl}`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
