import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Preços | tlin.ai",
  description: "Conheça os planos da Tlin para escalar atendimento, qualificação e vendas com IA no WhatsApp e CRM.",
  alternates: { canonical: absoluteUrl("/precos") },
};

export default function PrecosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
