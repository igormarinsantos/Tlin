import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: { default: "tlin.ai | IA, vendas e WhatsApp", template: "%s | tlin.ai" },
  description: "Análises, guias e playbooks sobre inteligência artificial aplicada a vendas, atendimento e negócios.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    title: "tlin.ai | IA, vendas e WhatsApp",
    description: "Inteligência artificial aplicada ao crescimento de negócios.",
    url: absoluteUrl("/blog"),
  },
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] text-zinc-950">
      <BlogHeader />
      {children}
      <footer className="relative border-t border-zinc-200 bg-white/70 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-sm text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} Tlin. Inteligência artificial aplicada a negócios.</p>
          <a className="font-medium text-zinc-800 hover:underline" href="https://tlin.cloud">tlin.cloud</a>
        </div>
      </footer>
    </div>
  );
}
