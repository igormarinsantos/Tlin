"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { TextReveal } from "@/components/TextReveal";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { GlobalBackground } from "@/components/GlobalBackground";

const Features = dynamic(() => import("@/components/Features").then(mod => mod.Features));
const RoiCalculator = dynamic(() => import("@/components/RoiCalculator").then(mod => mod.RoiCalculator));
const Pricing = dynamic(() => import("@/components/Pricing").then(mod => mod.Pricing));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials));
const Faq = dynamic(() => import("@/components/Faq").then(mod => mod.Faq));
const FooterBanner = dynamic(() => import("@/components/FooterBanner").then(mod => mod.FooterBanner));
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer));
const LiaPopup = dynamic(() => import("@/components/LiaPopup").then(mod => mod.LiaPopup), { ssr: false });
const LeadQualificationPopup = dynamic(() => import("@/components/LeadQualificationPopup").then(mod => mod.LeadQualificationPopup), { ssr: false });


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-[#0c0d0d] bg-white">
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
            const handleOpen = (e: any) => setQualifyPlan(e.detail?.plan || "TLIN");
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
