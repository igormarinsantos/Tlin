import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Demo confirmada | tlin.ai",
  description: "Confirmação da sua demonstração com a tlin.ai.",
  alternates: { canonical: absoluteUrl("/obrigado") },
  robots: { index: false, follow: false },
};

export default function ObrigadoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
