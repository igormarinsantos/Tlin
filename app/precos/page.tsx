"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { FooterBanner } from "@/components/FooterBanner";
import { Faq } from "@/components/Faq";
import { GlobalBackground } from "@/components/GlobalBackground";
import { LeadQualificationPopup } from "@/components/LeadQualificationPopup";
import { Pricing } from "@/components/Pricing";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";
import { trackFunnelEvent } from "@/lib/utm";

export default function PrecosPage() {
  const [qualifyPlan, setQualifyPlan] = useState<string | null>(null);

  useEffect(() => {
    const openQualification = (event: Event) => {
      const detail = (event as CustomEvent<{ plan?: string; source?: string }>).detail;
      const plan = detail?.plan || "TLIN";
      setQualifyPlan(plan);
      trackFunnelEvent("start_lead_form", {
        plan_name: plan,
        cta_source: detail?.source || "pricing_page",
      });
    };

    window.addEventListener("open-qualification", openQualification);
    return () => window.removeEventListener("open-qualification", openQualification);
  }, []);

  return (
    <main className="flex min-h-[100svh] flex-col bg-white text-[#0c0d0d]">
      <GlobalBackground />
      <ScrollBgWrapper>
        <Pricing hideEyebrow comparisonMode="plans" />
        <Faq />
        <FooterBanner />
        <Footer />
        {qualifyPlan && <LeadQualificationPopup isOpen onClose={() => setQualifyPlan(null)} planName={qualifyPlan} />}
      </ScrollBgWrapper>
    </main>
  );
}
