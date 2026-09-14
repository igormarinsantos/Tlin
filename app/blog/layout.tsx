import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { absoluteUrl } from "@/lib/siteConfig";

const Footer = dynamic(() => import("@/components/Footer").then((mod) => mod.Footer));

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
    <div className="min-h-screen bg-white text-zinc-950">
      {children}
      <Footer />
    </div>
  );
}
