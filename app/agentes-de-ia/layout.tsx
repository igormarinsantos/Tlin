import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Agentes de IA para vendas no WhatsApp",
  description: "Agentes de IA treinados no seu playbook que atendem, qualificam e vendem no WhatsApp como seu melhor vendedor, 24 horas por dia.",
  alternates: { canonical: absoluteUrl("/agentes-de-ia") },
  openGraph: {
    title: "tlin.ai | Agentes de IA para vendas no WhatsApp",
    description: "Agentes de IA treinados no seu playbook que atendem, qualificam e vendem no WhatsApp como seu melhor vendedor, 24 horas por dia.",
    url: absoluteUrl("/agentes-de-ia"),
  },
};

export default function AgentesDeIaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
