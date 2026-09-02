import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "tlin.ai | Agende uma demonstração",
  description: "Conte para a tlin.ai sobre sua operação comercial e agende uma demonstração personalizada.",
  alternates: { canonical: absoluteUrl("/demo") },
  robots: { index: false, follow: true },
  openGraph: {
    title: "tlin.ai | Agende uma demonstração",
    description: "Conte para a tlin.ai sobre sua operação comercial e agende uma demonstração personalizada.",
    url: absoluteUrl("/demo"),
  },
};

export default function QualificationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
