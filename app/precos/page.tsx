"use client";

import { Footer } from "@/components/Footer";
import { FooterBanner } from "@/components/FooterBanner";
import { Faq } from "@/components/Faq";
import { GlobalBackground } from "@/components/GlobalBackground";
import { Pricing } from "@/components/Pricing";
import { ScrollBgWrapper } from "@/components/ScrollBgWrapper";

export default function PrecosPage() {

  return (
    <main className="flex min-h-[100svh] flex-col bg-white text-[#0c0d0d]">
      <GlobalBackground />
      <ScrollBgWrapper>
        <Pricing hideEyebrow comparisonMode="plans" />
        <Faq />
        <FooterBanner />
        <Footer />
      </ScrollBgWrapper>
    </main>
  );
}
