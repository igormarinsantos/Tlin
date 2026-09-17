"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { LiaPopup } from "@/components/LiaPopup";
import { SmoothScroll } from "@/components/SmoothScroll";

// Rotas de conversão são experiências próprias, sem a navegação da LP.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneFlow = pathname === "/comece" || pathname === "/demo";

  if (isStandaloneFlow) return <>{children}</>;

  return (
    <SmoothScroll>
      <Header />
      {children}
      <LiaPopup />
    </SmoothScroll>
  );
}
