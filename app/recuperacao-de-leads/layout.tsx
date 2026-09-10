import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Recuperação automática de leads parados",
  description: "Follow-up automático pra leads que esfriaram no WhatsApp — a IA retoma a conversa sozinha, nos intervalos certos, sem depender de vendedor.",
  alternates: { canonical: absoluteUrl("/recuperacao-de-leads") },
  openGraph: {
    title: "tlin.ai | Recuperação automática de leads parados",
    description: "Follow-up automático pra leads que esfriaram no WhatsApp — a IA retoma a conversa sozinha, nos intervalos certos, sem depender de vendedor.",
    url: absoluteUrl("/recuperacao-de-leads"),
  },
};

export default function RecuperacaoDeLeadsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
