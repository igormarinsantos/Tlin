import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | IA comercial para infoprodutores",
  description: "Responda pico de lançamento, qualifique quem tem fit com seu curso e recupere quem sumiu no carrinho — tudo automático no WhatsApp, 24/7.",
  alternates: { canonical: absoluteUrl("/infoprodutores") },
  openGraph: {
    title: "tlin.ai | IA comercial para infoprodutores",
    description: "Responda pico de lançamento, qualifique quem tem fit com seu curso e recupere quem sumiu no carrinho — tudo automático no WhatsApp, 24/7.",
    url: absoluteUrl("/infoprodutores"),
  },
};

export default function InfoprodutoresLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
