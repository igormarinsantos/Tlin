import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedAuthorBySlug,
  getPublishedAuthors,
} from "@/lib/editorial/queries";
import {
  createEditorialAuthorStructuredData,
  serializeJsonLd,
} from "@/lib/editorial/structured-data";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type AuthorPageProps = {
  params: Promise<{ author: string }>;
};

export function generateStaticParams() {
  return getPublishedAuthors().map(({ slug }) => ({ author: slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { author: authorSlug } = await params;
  const author = getPublishedAuthorBySlug(authorSlug);
  if (!author) return {};

  const canonical = absoluteUrl(author.profilePath);
  const description = author.bio ?? `Conteúdos publicados por ${author.name}, ${author.role}.`;

  return {
    title: `${author.name}: autoria e conteúdos`,
    description,
    alternates: {
      canonical,
      languages: { "pt-BR": canonical },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: `${author.name}: autoria e conteúdos`,
      description,
      url: canonical,
      images: author.image ? [absoluteUrl(author.image.src)] : [],
    },
    twitter: {
      card: "summary",
      title: `${author.name}: autoria e conteúdos`,
      description,
      images: author.image ? [absoluteUrl(author.image.src)] : [],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author: authorSlug } = await params;
  const author = getPublishedAuthorBySlug(authorSlug);
  if (!author) notFound();

  const structuredData = serializeJsonLd(createEditorialAuthorStructuredData(author));

  return (
    <main className="relative overflow-hidden bg-white px-4 pb-24 pt-32 md:px-8 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] overflow-hidden">
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#B597FF]/20 blur-[120px]" />
        <div className="absolute right-0 top-24 h-[340px] w-[340px] rounded-full bg-[#38E3FF]/15 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="font-bold text-[#8659e7] hover:underline">{siteConfig.name}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="font-bold text-[#8659e7] hover:underline">Conteúdos</Link>
          <span aria-hidden="true">/</span>
          <span>{author.name}</span>
        </nav>

        <header className="flex max-w-3xl flex-col gap-7 py-14 md:flex-row md:items-center md:py-20">
          {author.image && (
            <Image
              src={author.image.src}
              alt={author.image.alt}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover"
              priority
            />
          )}
          <div>
            <p className="text-sm font-bold text-[#8659e7]">✍️ Autoria editorial</p>
            <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-[#0c0d0d] md:text-6xl">
              {author.name}
            </h1>
            <p className="mt-3 text-lg font-bold text-zinc-600">{author.role}</p>
            {author.bio && <p className="mt-5 text-lg leading-8 text-zinc-500">{author.bio}</p>}
          </div>
        </header>

        <section aria-labelledby="author-articles">
          <h2 id="author-articles" className="text-2xl font-black tracking-tight text-[#0c0d0d]">
            Conteúdos publicados
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {author.articles.map((article) => (
              <article
                key={article.slug}
                className="rounded-3xl border border-zinc-200 bg-white p-7 transition-colors hover:border-[#B597FF]/40"
              >
                <p className="text-xs font-bold text-[#8659e7]">{article.readingTimeMinutes} min de leitura</p>
                <h3 className="mt-4 text-2xl font-black tracking-tight text-[#0c0d0d]">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mt-4 leading-7 text-zinc-500">{article.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
