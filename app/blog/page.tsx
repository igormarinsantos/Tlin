import type { Metadata } from "next";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "@/lib/blog";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { BlogSearchAndGrid } from "@/components/blog/BlogSearchAndGrid";

export const metadata: Metadata = { title: "IA, vendas e WhatsApp" };

export default function BlogHomePage() {
  const featuredArticles = BLOG_ARTICLES.filter((article) => article.featured);
  const carouselArticles = featuredArticles.length >= 2 ? featuredArticles : BLOG_ARTICLES.slice(0, 3);

  return (
    <main className="relative bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden">
        <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-[#B597FF]/20 blur-[120px]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[#38E3FF]/15 blur-[110px]" />
      </div>

      <section className="px-4 pb-10 pt-28 md:px-8 md:pb-14 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-wide text-zinc-400">Tlin Conteúdo</p>
          <h1 className="max-w-4xl text-balance text-5xl md:text-7xl font-black tracking-tight text-[#0c0d0d]">
            IA que faz negócios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">avançarem.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-500">
            O que muda em inteligência artificial, e como transformar isso em vendas, atendimento e operações melhores.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <FeaturedCarousel articles={carouselArticles} />
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <BlogSearchAndGrid articles={BLOG_ARTICLES} categories={BLOG_CATEGORIES} />
        </div>
      </section>
    </main>
  );
}
