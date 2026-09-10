import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Atendimento no WhatsApp com IA 24/7",
  description: "Responda, qualifique e converse com todo lead no WhatsApp em segundos. IA comercial que atende sozinha, 24 horas por dia, sem plantão.",
  alternates: { canonical: absoluteUrl("/ia-whatsapp") },
  openGraph: {
    title: "tlin.ai | Atendimento no WhatsApp com IA 24/7",
    description: "Responda, qualifique e converse com todo lead no WhatsApp em segundos. IA comercial que atende sozinha, 24 horas por dia, sem plantão.",
    url: absoluteUrl("/ia-whatsapp"),
  },
};

export default function IaWhatsappLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
