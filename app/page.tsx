"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { GlobalBackground } from "@/components/GlobalBackground";

import { trackFunnelEvent } from "@/lib/utm";

const TextReveal = dynamic(() => import("@/components/TextReveal").then(mod => mod.TextReveal), { ssr: false });
const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features), { ssr: false });
const RoiCalculator = dynamic(() => import("@/components/RoiCalculator").then(mod => mod.RoiCalculator), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing").then(mod => mod.Pricing), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), { ssr: false });
const Faq = dynamic(() => import("@/components/Faq").then(mod => mod.Faq), { ssr: false });
const FooterBanner = dynamic(() => import("@/components/FooterBanner").then(mod => mod.FooterBanner), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });
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

export default function Home() {
  return (
    <main className="flex min-h-[100svh] flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION - Hero is priority */}
        <div className="section-to-blur"><Hero /></div>
        
        <div className="section-to-blur"><TrustedBy /></div>

        <DeferredSection minHeight="min-h-[420px]">
          <TextReveal />
        </DeferredSection>

        {/* CORE CAPABILITIES */}
        <DeferredSection id="features" className="" minHeight="min-h-[900px]">
          <Features />
        </DeferredSection>

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
        <DeferredSection className="no-blur transition-all duration-700 relative z-50" minHeight="min-h-[960px]">
          <Pricing />
        </DeferredSection>

        {/* TRUST / SOCIAL PROOF (The New Carousel) */}
        <DeferredSection id="testimonials" className="section-to-blur" minHeight="min-h-[520px]">
          <Testimonials />
        </DeferredSection>

        {/* OBJECTIONS */}
        <DeferredSection id="faq" className="section-to-blur" minHeight="min-h-[720px]">
          <Faq />
        </DeferredSection>

        {/* FINAL CTA (The Flashlight Effect) */}
        <DeferredSection className="section-to-blur" minHeight="min-h-[620px]">
          <FooterBanner />
        </DeferredSection>

        {/* FOOTER */}
        <DeferredSection className="section-to-blur" minHeight="min-h-[220px]">
          <Footer />
        </DeferredSection>
        
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
