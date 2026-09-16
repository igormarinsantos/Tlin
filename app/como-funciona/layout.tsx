import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Como funciona | tlin.ai",
  description: "Veja como IA, CRM, follow-up e acompanhamento humano trabalham juntos na operação comercial da Tlin.",
  alternates: { canonical: absoluteUrl("/como-funciona") },
};

export default function ComoFuncionaLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
