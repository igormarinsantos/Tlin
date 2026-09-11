"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Hero, type HeroVariant } from "@/components/Hero";
import { CampaignHero } from "@/components/CampaignHero";
import { PainSection } from "@/components/PainSection";
import { TrustedBy } from "@/components/TrustedBy";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { GlobalBackground } from "@/components/GlobalBackground";

import { trackFunnelEvent } from "@/lib/utm";

const TextReveal = dynamic(() => import("@/components/TextReveal").then(mod => mod.TextReveal), { ssr: false });
// SSR ligado (sem ssr:false) pra essas seções: precisam existir no HTML inicial
// pro Google indexar sem depender de JS (âncoras #como-funciona/#agentes/#crm/#planos/#faq).
const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features));
const RoiCalculator = dynamic(() => import("@/components/RoiCalculator").then(mod => mod.RoiCalculator), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing").then(mod => mod.Pricing));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials));
const Faq = dynamic(() => import("@/components/Faq").then(mod => mod.Faq));
// FooterBanner fica ssr:false: usa isMobile derivado de matchMedia no estado
// inicial, o que diverge entre server/client e quebra a hidratação. Não faz
// parte do conjunto que precisa de anchors indexáveis (como-funciona/agentes/
// crm/planos/faq), então manter client-only é seguro aqui.
const FooterBanner = dynamic(() => import("@/components/FooterBanner").then(mod => mod.FooterBanner), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));
const LiaPopup = dynamic(() => import("@/components/LiaPopup").then(mod => mod.LiaPopup), { ssr: false });
const LeadQualificationPopup = dynamic(() => import("@/components/LeadQualificationPopup").then(mod => mod.LeadQualificationPopup), { ssr: false });

function DeferredSection({
  children,
  id,
  className = "",
  minHeight = "min-h-[360px]",
  idleDelay,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  minHeight?: string;
  idleDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const node = ref.current;
    const idleId = typeof idleDelay === "number"
      ? window.setTimeout(() => setShouldRender(true), idleDelay)
      : null;

    if (!node || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      if (idleId) window.clearTimeout(idleId);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
          if (idleId) window.clearTimeout(idleId);
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (idleId) window.clearTimeout(idleId);
    };
  }, [idleDelay, shouldRender]);

  return (
    <div id={id} ref={ref} className={`${className} ${shouldRender ? "" : minHeight}`}>
      {shouldRender ? children : null}
    </div>
  );
}

function QualificationController() {
  const [qualifyPlan, setQualifyPlan] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      const plan = e.detail?.plan || "TLIN";
      setQualifyPlan(plan);
      trackFunnelEvent("start_lead_form", {
        plan_name: plan,
        cta_source: e.detail?.source || "unknown",
      });
    };

    window.addEventListener("open-qualification", handleOpen);
    return () => window.removeEventListener("open-qualification", handleOpen);
  }, []);

  return (
    <div className="no-blur">
      {qualifyPlan && (
        <LeadQualificationPopup
          isOpen={!!qualifyPlan}
          onClose={() => setQualifyPlan(null)}
          planName={qualifyPlan}
        />
      )}
    </div>
  );
}

export function MarketingLandingPage({ heroVariant }: { heroVariant?: HeroVariant }) {
  return (
    <main className="flex min-h-[100svh] flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION - Hero is priority */}
        <div className="section-to-blur">
          {heroVariant ? <CampaignHero variant={heroVariant} /> : <Hero />}
        </div>

        {/* Dor com dado de mercado -- so nas paginas de campanha */}
        {heroVariant && <div className="section-to-blur"><PainSection variant={heroVariant} /></div>}

        <div className="section-to-blur"><TrustedBy /></div>

        <DeferredSection minHeight="min-h-[420px]">
          <TextReveal />
        </DeferredSection>

        {/* CORE CAPABILITIES — renderizado direto (sem DeferredSection) pra existir
            no HTML inicial: #como-funciona/#agentes/#crm ficam indexáveis sem JS. */}
        <div className="section-to-blur">
          <Features />
        </div>

        {/* WHITE CURVED GRADIENT SECTION (Above ROI) */}
        <div
          className="w-full h-[200px] md:h-[300px] relative overflow-hidden"
          style={{ background: "radial-gradient(150% 100% at 50% 0%, #FFFFFF 0%, #FFFFFF 35%, #000000 100%)" }}
        />

        {/* IMPACT / URGENCY (The New ROI Simulator) */}
        <DeferredSection id="roi" className="section-to-blur" minHeight="min-h-[760px]">
          <RoiCalculator />
        </DeferredSection>

        {/* WHITE CURVED GRADIENT SECTION (Below ROI) */}
        <div
          className="w-full h-[200px] md:h-[300px] relative overflow-hidden"
          style={{ background: "radial-gradient(150% 100% at 50% 100%, #FFFFFF 0%, #FFFFFF 35%, #000000 100%)" }}
        />

        {/* PRICING / ACTION */}
        <div className="no-blur transition-all duration-700 relative z-50">
          <Pricing />
        </div>

        {/* TRUST / SOCIAL PROOF (The New Carousel) */}
        <div className="section-to-blur">
          <Testimonials />
        </div>

        {/* OBJECTIONS */}
        <div className="section-to-blur">
          <Faq priorityKeys={heroVariant === "recuperacaoDeLeads" ? ["q7", "q8"] : undefined} />
        </div>

        {/* FINAL CTA (The Flashlight Effect) */}
        <DeferredSection className="section-to-blur" minHeight="min-h-[600px] md:min-h-[750px]">
          <FooterBanner />
        </DeferredSection>

        {/* FOOTER */}
        <div className="section-to-blur">
          <Footer />
        </div>

        {/* IA Assistant Popup */}
        <DeferredSection minHeight="min-h-0" idleDelay={1800}>
          <LiaPopup />
        </DeferredSection>

        {/* Lead Qualification Global State */}
        <QualificationController />
      </ScrollBgWrapper>
    </main>
  );
}
