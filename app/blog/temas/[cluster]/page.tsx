import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialCta } from "@/components/blog/EditorialCta";
import {
  getPublishedClusterBySlug,
  getPublishedClusters,
} from "@/lib/editorial/queries";
import {
  createEditorialBreadcrumbData,
  serializeJsonLd,
} from "@/lib/editorial/structured-data";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type ClusterPageProps = {
  params: Promise<{ cluster: string }>;
};

export function generateStaticParams() {
  return getPublishedClusters().map(({ slug }) => ({ cluster: slug }));
}

export async function generateMetadata({ params }: ClusterPageProps): Promise<Metadata> {
  const { cluster: clusterSlug } = await params;
  const cluster = getPublishedClusterBySlug(clusterSlug);
  if (!cluster) return {};

  const canonical = absoluteUrl(cluster.hubPath);
  const title = `${cluster.label}: conteúdos para sua operação comercial`;

  return {
    title,
    description: cluster.description,
    alternates: {
      canonical,
      languages: { "pt-BR": canonical },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description: cluster.description,
      url: canonical,
      images: [absoluteUrl("/og/platform-preview-email.jpg")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cluster.description,
      images: [absoluteUrl("/og/platform-preview-email.jpg")],
    },
  };
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { cluster: clusterSlug } = await params;
  const cluster = getPublishedClusterBySlug(clusterSlug);
  if (!cluster) notFound();

  const leadArticle = cluster.articles[0];
  if (!leadArticle) notFound();
  const breadcrumb = createEditorialBreadcrumbData(cluster.hubPath, [
    { name: siteConfig.name, path: "/" },
    { name: "Conteúdos", path: "/blog" },
    { name: cluster.label, path: cluster.hubPath },
  ]);
  const structuredData = serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(cluster.hubPath)}#webpage`,
        url: absoluteUrl(cluster.hubPath),
        name: cluster.label,
        description: cluster.description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": absoluteUrl("/#website") },
        breadcrumb: { "@id": breadcrumb["@id"] },
      },
      breadcrumb,
    ],
  });

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
          <span>{cluster.label}</span>
        </nav>

        <header className="max-w-3xl py-14 md:py-20">
          <p className="text-sm font-bold text-[#8659e7]">✨ Tema editorial</p>
          <h1 className="mt-5 text-balance text-4xl font-black tracking-tight text-[#0c0d0d] md:text-6xl">
            {cluster.label}
          </h1>
          <p className="mt-6 text-xl leading-8 text-zinc-500">{cluster.description}</p>
        </header>

        <section aria-labelledby="cluster-articles">
          <h2 id="cluster-articles" className="text-2xl font-black tracking-tight text-[#0c0d0d]">
            Conteúdos publicados
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {cluster.articles.map((article) => (
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

        <aside className="mt-16 max-w-3xl rounded-3xl bg-[#0c0d0d] p-8 text-white">
          <p className="text-sm font-bold text-[#38E3FF]">Tlin para sua operação</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Veja a IA comercial trabalhando no seu processo
          </h2>
          <p className="mt-3 leading-7 text-zinc-300">
            A demonstração conecta atendimento, qualificação, acompanhamento e agenda em um único fluxo.
          </p>
          <EditorialCta
            articleSlug={leadArticle.slug}
            clusterId={leadArticle.clusterId}
            intent={leadArticle.intent}
            cta={leadArticle.cta}
            location="cluster-hub"
          />
        </aside>
      </div>
    </main>
  );
}
