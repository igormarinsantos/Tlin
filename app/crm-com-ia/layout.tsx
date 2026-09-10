import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | CRM nativo com Inteligência Artificial",
  description: "CRM com IA que organiza leads, conversas e funil de vendas automaticamente no WhatsApp — sem precisar integrar nada externo pra começar.",
  alternates: { canonical: absoluteUrl("/crm-com-ia") },
  openGraph: {
    title: "tlin.ai | CRM nativo com Inteligência Artificial",
    description: "CRM com IA que organiza leads, conversas e funil de vendas automaticamente no WhatsApp — sem precisar integrar nada externo pra começar.",
    url: absoluteUrl("/crm-com-ia"),
  },
};

export default function CrmComIaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
