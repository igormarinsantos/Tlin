import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

const title = "IA para advocacia | Primeiro atendimento no WhatsApp | tlin.ai";
const description = "Organize o primeiro atendimento no WhatsApp e encaminhe cada contato para a conversa certa com seu escritório.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/ia-para-advocacia") },
  openGraph: { title, description, url: absoluteUrl("/ia-para-advocacia") },
};

export default function IaParaAdvocaciaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
