import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Agende uma demonstração",
  description: "Conte para a tlin.ai sobre sua operação comercial e agende uma demonstração personalizada.",
  alternates: { canonical: absoluteUrl("/demo") },
  openGraph: {
    title: "tlin.ai | Agende uma demonstração",
    description: "Conte para a tlin.ai sobre sua operação comercial e agende uma demonstração personalizada.",
    url: absoluteUrl("/comece"),
  },
};

export default function ComeceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
