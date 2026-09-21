import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

const title = "IA para escolas | Matrículas e atendimento no WhatsApp | tlin.ai";
const description = "Atenda famílias no WhatsApp, organize interesses de matrícula e transforme conversas em visitas para sua escola.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/ia-para-escolas") },
  openGraph: { title, description, url: absoluteUrl("/ia-para-escolas") },
};

export default function IaParaEscolasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
