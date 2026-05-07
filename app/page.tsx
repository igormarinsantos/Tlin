import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { LazyShow } from "@/components/LazyShow";

// Lazy-load everything below the fold with no SSR and loading states
const TrustedBy = dynamic(() => import("@/components/TrustedBy").then(m => ({ default: m.TrustedBy })), { ssr: false });
const TextReveal = dynamic(() => import("@/components/TextReveal").then(m => ({ default: m.TextReveal })), { ssr: false });
const Features = dynamic(() => import("@/components/Features").then(m => ({ default: m.Features })), { ssr: false });
const RoiCalculator = dynamic(() => import("@/components/RoiCalculator").then(m => ({ default: m.RoiCalculator })), { ssr: false });
const Pricing = dynamic(() => import("@/components/Pricing").then(m => ({ default: m.Pricing })), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })), { ssr: false });
const Faq = dynamic(() => import("@/components/Faq").then(m => ({ default: m.Faq })), { ssr: false });
const FooterBanner = dynamic(() => import("@/components/FooterBanner").then(m => ({ default: m.FooterBanner })), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(m => ({ default: m.Footer })), { ssr: false });
const ScrollBgWrapper = dynamic(() => import("@/components/ScrollBgWrapper").then(m => ({ default: m.ScrollBgWrapper })), { ssr: false });
const LiaPopup = dynamic(() => import("@/components/LiaPopup").then(m => ({ default: m.LiaPopup })), { ssr: false });
const GlobalBackground = dynamic(() => import("@/components/GlobalBackground").then(m => ({ default: m.GlobalBackground })), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-[#0c0d0d] bg-white">
      <GlobalBackground />
      <ScrollBgWrapper>
        {/* ATTENTION - Hero is priority */}
        <div className="section-to-blur"><Hero /></div>
        
        <LazyShow>
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
        </LazyShow>
      </ScrollBgWrapper>
    </main>
  );
}
