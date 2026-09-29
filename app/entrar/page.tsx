import type { Metadata } from "next";
import { LoginGateway } from "@/components/LoginGateway";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Entrar | tlin.ai",
  description: "Acesse sua operação comercial com IA na Tlin",
  alternates: {
    canonical: absoluteUrl("/entrar"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function EntrarPage() {
  return <LoginGateway />;
}
