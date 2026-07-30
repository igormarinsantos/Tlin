import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "@/lib/blog";
import Image from "next/image";

export const metadata: Metadata = { title: "IA, vendas e WhatsApp" };

export default function BlogHomePage() {
  const [featured, ...articles] = BLOG_ARTICLES;

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden bg-white">
        <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-[#B597FF]/25 blur-[120px]" />
        <div className="absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-[#38E3FF]/20 blur-[110px]" />
      </div>
      <section className="px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-zinc-600">Tlin Conteúdo</p>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.065em] text-[#0c0d0d] md:text-7xl">IA que faz negócios <span className="abstract-highlight">avançarem.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">O que muda em inteligência artificial — e como transformar isso em vendas, atendimento e operações melhores.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="#vendas" className="rounded-full bg-[#0c0d0d] px-5 py-3 text-sm font-bold text-white transition hover:bg-gradient-to-r hover:from-[#B597FF] hover:to-[#38E3FF] hover:text-[#0c0d0d]">Explorar conteúdos</a><a href="https://tlin.cloud/#pricing" className="rounded-full border border-zinc-300 bg-white/80 px-5 py-3 text-sm font-bold text-zinc-800 transition hover:border-[#B597FF]">Conhecer a Tlin</a></div>
          </div>
          <div className="relative mx-auto hidden h-56 w-56 lg:block">
            <div className="absolute inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#B597FF] to-[#38E3FF] opacity-30 blur-2xl" />
            <Image src="/LIA%20PERFIL.webp" alt="Lia, assistente da Tlin" width={260} height={260} className="relative h-full w-full object-contain drop-shadow-2xl" priority />
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200/80 bg-white/60 px-5 py-6 backdrop-blur-sm md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2" aria-label="Temas do blog">
          {BLOG_CATEGORIES.map((category) => <span key={category} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600">{category}</span>)}
        </div>
      </section>

      <section className="px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8659e7]">Em destaque</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Para operar melhor hoje</h2></div></div>
          <ArticleCard article={featured} featured />
        </div>
      </section>

      <section className="relative border-t border-zinc-200 bg-gradient-to-b from-[#f7f3ff] to-[#fafafa] px-5 py-16 md:px-8" id="vendas">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8659e7]">Mais recentes</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">IA geral, com impacto real</h2></div>
          <div className="grid gap-5 md:grid-cols-2">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </div>
      </section>
    </main>
  );
}
