import Image from "next/image";
import Link from "next/link";

export function BlogHeader() {
  return (
    <header className="relative z-20 px-5 py-6 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="/blog" className="flex items-center gap-3" aria-label="Tlin Blog">
          <Image src="/Logo%20Horizontal.svg" alt="Tlin" width={76} height={27} priority />
          <span className="hidden border-l border-zinc-200 pl-3 text-sm font-medium text-zinc-500 sm:inline">Conteúdo</span>
        </Link>
        <nav aria-label="Navegação do blog" className="hidden items-center gap-2 rounded-full bg-white/75 p-1 text-sm font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200/70 backdrop-blur md:flex">
          <Link href="/blog#ia-em-movimento" className="rounded-full px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950">IA em movimento</Link>
          <Link href="/blog#vendas" className="rounded-full px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950">Vendas com IA</Link>
          <Link href="/blog#guias" className="rounded-full px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950">Guias</Link>
        </nav>
        <a href="https://tlin.ia.br/#pricing" className="shrink-0 whitespace-nowrap rounded-full bg-[#0c0d0d] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-gradient-to-r hover:from-[#B597FF] hover:to-[#38E3FF] hover:text-[#0c0d0d] md:text-sm">
          Começar agora
        </a>
      </div>
    </header>
  );
}
