"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { TextReveal } from "@/components/TextReveal";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { GlobalBackground } from "@/components/GlobalBackground";

import { Features } from "@/components/Features";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { FooterBanner } from "@/components/FooterBanner";
import { Footer } from "@/components/Footer";
import { trackFunnelEvent } from "@/lib/utm";
const LiaPopup = dynamic(() => import("@/components/LiaPopup").then(mod => mod.LiaPopup), { ssr: false });
const LeadQualificationPopup = dynamic(() => import("@/components/LeadQualificationPopup").then(mod => mod.LeadQualificationPopup), { ssr: false });


export default function Home() {
  return (
    <main className="flex min-h-[100svh] flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION - Hero is priority */}
        <div className="section-to-blur"><Hero /></div>
        
        <div className="section-to-blur"><TrustedBy /></div>

        <TextReveal />

        {/* CORE CAPABILITIES */}
        <div id="features">
          <Features />
        </div>

        {/* WHITE CURVED GRADIENT SECTION (Above ROI) */}
        <div 
          className="w-full h-[200px] md:h-[300px] relative overflow-hidden"
          style={{ background: "radial-gradient(150% 100% at 50% 0%, #FFFFFF 0%, #FFFFFF 35%, #000000 100%)" }}
        />

        {/* IMPACT / URGENCY (The New ROI Simulator) */}
        <div id="roi" className="section-to-blur">
          <RoiCalculator />
        </div>

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
        <div id="testimonials" className="section-to-blur">
          <Testimonials />
        </div>

        {/* OBJECTIONS */}
        <div id="faq" className="section-to-blur">
          <Faq />
        </div>

        {/* FINAL CTA (The Flashlight Effect) */}
        <div className="section-to-blur"><FooterBanner /></div>

        {/* FOOTER */}
        <div className="section-to-blur"><Footer /></div>
        
        {/* IA Assistant Popup */}
        <LiaPopup />
        
        {/* Lead Qualification Global State */}
        {(() => {
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
              <LeadQualificationPopup 
                isOpen={!!qualifyPlan} 
                onClose={() => setQualifyPlan(null)} 
                planName={qualifyPlan} 
              />
            </div>
          );
        })()}
      </ScrollBgWrapper>
    </main>
  );
}

import { useState, useEffect } from "react";
