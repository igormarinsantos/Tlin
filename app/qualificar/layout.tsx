import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Qualifique sua empresa",
  description: "Conte para a tlin.ai sobre sua operação comercial e receba um atendimento personalizado.",
  alternates: { canonical: absoluteUrl("/qualificar") },
  openGraph: {
    title: "tlin.ai | Qualifique sua empresa",
    description: "Conte para a tlin.ai sobre sua operação comercial e receba um atendimento personalizado.",
    url: absoluteUrl("/qualificar"),
  },
};

export default function QualificationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
