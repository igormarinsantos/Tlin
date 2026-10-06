"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { DeferredLiaPopup } from "@/components/DeferredLiaPopup";
import { SmoothScroll } from "@/components/SmoothScroll";

import { QualificationController } from "@/components/QualificationController";

// Rotas de conversão são experiências próprias, sem a navegação da LP.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneFlow = pathname === "/comece" || pathname === "/demo" || pathname === "/entrar" || pathname.startsWith("/internal/");

  if (isStandaloneFlow) return <>{children}</>;

  return (
    <SmoothScroll>
      <Header />
      {children}
      <DeferredLiaPopup />
      <QualificationController key={pathname} />
    </SmoothScroll>
  );
}
