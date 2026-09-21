import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

const title = "IA para clínicas | Atendimento e agenda no WhatsApp | tlin.ai";
const description = "Atenda novos pacientes no WhatsApp, organize oportunidades e encaminhe cada contato para o próximo passo da sua clínica.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/ia-para-clinicas") },
  openGraph: { title, description, url: absoluteUrl("/ia-para-clinicas") },
};

export default function IaParaClinicasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
