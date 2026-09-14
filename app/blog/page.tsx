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

      {/* O hero da pagina e o proprio carrossel -- sem bloco de titulo
          separado. O h1 continua existindo (sr-only) só pra SEO/estrutura
          semantica, sem aparecer visualmente. */}
      <h1 className="sr-only">Tlin Conteúdo: IA que faz negócios avançarem</h1>

      <section className="px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
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
