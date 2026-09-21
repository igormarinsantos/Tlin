import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

const title = "IA para assessorias | Atendimento e follow-up no WhatsApp | tlin.ai";
const description = "Responda oportunidades no WhatsApp, organize o contexto comercial e direcione contatos para a conversa certa.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/ia-para-assessorias") },
  openGraph: { title, description, url: absoluteUrl("/ia-para-assessorias") },
};

export default function IaParaAssessoriasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
