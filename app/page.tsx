import { Footer } from "@/components/Footer";
import { Faq } from "@/components/Faq";
import { Testimonials } from "@/components/Testimonials";
import { RoiCalculator } from "@/components/RoiCalculator";
import { Pricing } from "@/components/Pricing";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { FooterBanner } from "@/components/FooterBanner";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { LiaPopup } from "@/components/LiaPopup";
import { GlobalBackground } from "@/components/GlobalBackground";

import { Features } from "@/components/Features";
import { TextReveal } from "@/components/TextReveal";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION */}
        <div className="section-to-blur"><Hero /></div>
        <div className="section-to-blur"><TrustedBy /></div>

        <TextReveal />

        {/* CORE CAPABILITIES */}
        <div id="features">
          <Features />
        </div>

        {/* IMPACT / URGENCY (The New ROI Simulator) */}
        <div id="roi" className="section-to-blur">
          <RoiCalculator />
        </div>

        {/* PRICING / ACTION */}
        <div id="pricing" className="no-blur transition-all duration-700 relative z-50">
          <Pricing />
        </div>

        {/* TRUST / SOCIAL PROOF (The New Carousel) */}
        <div className="section-to-blur">
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
      </ScrollBgWrapper>
    </main>
  );
}
