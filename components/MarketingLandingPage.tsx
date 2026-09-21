"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Hero, type HeroVariant } from "@/components/Hero";
import { CampaignHero } from "@/components/CampaignHero";
import { PainSection } from "@/components/PainSection";
import { TrustedBy } from "@/components/TrustedBy";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { GlobalBackground } from "@/components/GlobalBackground";

const TextReveal = dynamic(() => import("@/components/TextReveal").then(mod => mod.TextReveal), { ssr: false });
// SSR ligado (sem ssr:false): e conteudo textual relevante pra SEO/GEO das
// paginas de campanha, igual Features/Pricing/Testimonials/Faq abaixo.
const CampaignHowItWorks = dynamic(() => import("@/components/CampaignHowItWorks").then(mod => mod.CampaignHowItWorks));
const CampaignReviews = dynamic(() => import("@/components/CampaignReviews").then(mod => mod.CampaignReviews));
const CampaignComparison = dynamic(() => import("@/components/CampaignComparison").then(mod => mod.CampaignComparison));
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

export function MarketingLandingPage({ heroVariant }: { heroVariant?: HeroVariant }) {
  const isSegmentCampaign = heroVariant && ["clinicas", "escolas", "assessorias", "advocacia"].includes(heroVariant);

  return (
    <main className="flex min-h-[100svh] flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION - Hero is priority */}
        {heroVariant ? (
          // Wrapper que estende o azul claro do Hero por baixo da faixa de
          // logos (TrustedBy) tambem, desvanecendo pra transparente só
          // depois dela -- as duas sections ficam sem bg proprio aqui.
          <div className="relative isolate">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: isSegmentCampaign
                  ? "linear-gradient(to bottom, rgba(245,240,255,0.72) 0%, rgba(245,240,255,0.72) 88%, transparent 98%)"
                  : "linear-gradient(to bottom, rgba(234,251,255,0.5) 0%, rgba(234,251,255,0.5) 88%, transparent 98%)",
              }}
            />
            <div className="section-to-blur"><CampaignHero variant={heroVariant} /></div>
            <div className="section-to-blur"><TrustedBy transparentBg /></div>
          </div>
        ) : (
          <>
            <div className="section-to-blur"><Hero /></div>
            <div className="section-to-blur"><TrustedBy /></div>
          </>
        )}

        {/* Dor com dado de mercado -- so nas paginas de campanha */}
        {heroVariant && <div className="section-to-blur"><PainSection variant={heroVariant} /></div>}

        <DeferredSection minHeight="min-h-[420px]">
          {heroVariant ? <CampaignHowItWorks variant={heroVariant} /> : <TextReveal />}
        </DeferredSection>

        {/* Na index, alem do TextReveal, repete a sessao "Conheca a Tlin"
            (grid de 6 cards) que ja existe nas paginas de campanha -- usa o
            variant "agentesDeIa" pra reaproveitar o conteudo/ilustracoes ja
            prontos, sem duplicar copy nova. */}
        {!heroVariant && (
          <DeferredSection minHeight="min-h-[420px]">
            <CampaignHowItWorks variant="agentesDeIa" />
          </DeferredSection>
        )}

        {/* Avaliacoes em 2 fileiras de carrossel infinito -- so nas LPs de campanha */}
        {heroVariant && (
          <div className="section-to-blur">
            <CampaignReviews variant={heroVariant} />
          </div>
        )}

        {/* CORE CAPABILITIES — renderizado direto (sem DeferredSection) pra existir
            no HTML inicial: #como-funciona/#agentes/#crm ficam indexáveis sem JS. */}
        <div className="section-to-blur">
          <Features />
        </div>

        {/* WHITE CURVED GRADIENT SECTION (Above ROI/Case) */}
        <div
          className="w-full h-[200px] md:h-[300px] relative overflow-hidden"
          style={{ background: "radial-gradient(150% 100% at 50% 0%, #FFFFFF 0%, #FFFFFF 35%, #000000 100%)" }}
        />

        {/* IMPACT / URGENCY -- a calculadora de ROI tambem entra nas LPs de
            campanha enquanto o case ainda nao tiver video e resultados
            publicados. Assim, este espaco sempre entrega valor acionavel. */}
        <DeferredSection id="roi" className="section-to-blur" minHeight="min-h-[760px]">
          <RoiCalculator />
        </DeferredSection>

        {/* WHITE CURVED GRADIENT SECTION (Below ROI/Case) */}
        <div
          className="w-full h-[200px] md:h-[300px] relative overflow-hidden"
          style={{ background: "radial-gradient(150% 100% at 50% 100%, #FFFFFF 0%, #FFFFFF 35%, #000000 100%)" }}
        />

        {/* Comparativo "jeito antigo x com a Tlin" -- so nas paginas de campanha, logo antes do Pricing */}
        {heroVariant && (
          <DeferredSection className="section-to-blur" minHeight="min-h-[500px]">
            <CampaignComparison variant={heroVariant} />
          </DeferredSection>
        )}

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

      </ScrollBgWrapper>
    </main>
  );
}
