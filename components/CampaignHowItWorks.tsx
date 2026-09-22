"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { trackFunnelEvent } from "@/lib/utm";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
import { DemoHoverPill } from "@/components/DemoHoverPill";
import { TlinButton, TlinCard } from "@/components/ui/tlin";
import { CARD_MOTION, HOW_IT_WORKS_ICONS } from "@/components/campaignCards";

// Destaca em degrade o trecho marcado entre colchetes no titulo (mesmo
// padrao de "[texto]" ja usado em PainSection/CampaignHero).
function HighlightedTitle({ text }: { text: string }) {
  const parts = text.split(/(\[.*?\])/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
              {part.slice(1, -1)}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

export function HowItWorksCard({
  icon,
  title,
  desc,
  index,
  MotionOverride,
}: {
  icon: keyof typeof CARD_MOTION;
  title: string;
  desc: string;
  index: number;
  MotionOverride?: ComponentType<{ isActive: boolean }>;
}) {
  const Motion = MotionOverride ?? CARD_MOTION[icon];
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { amount: 0.45 });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const isActive = isHovered || (isMobile && isInView);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-[#F7F7FB] p-3 md:p-4 flex flex-col gap-5 border border-transparent hover:border-[#B597FF]/20 hover:bg-white transition-colors duration-300"
    >
      <div className="relative w-full h-44 rounded-2xl bg-white border border-zinc-100 overflow-hidden">
        <motion.div
          className="absolute -inset-1/2 bg-gradient-to-tr from-[#B597FF]/10 to-[#38E3FF]/10 blur-[50px] rounded-full pointer-events-none"
          animate={{ opacity: isActive ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative w-full h-full">
          <Motion isActive={isActive} />
        </div>
      </div>

      <div className="px-2 pb-2 md:px-3 md:pb-3">
        <h3 className="text-lg font-bold text-[#0c0d0d] mb-2">{withoutClosingPeriod(title)}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{withoutClosingPeriod(desc)}</p>
      </div>
    </motion.div>
  );
}

// Substitui o TextReveal so nas paginas de campanha: eyebrow "Conheca a
// Tlin" + titulo + grid de 6 mini-cards (3 em cima, 3 embaixo no desktop;
// 1 coluna no mobile), cada um com um motion leve proprio (campaignCardMotions.tsx)
// que toca em loop enquanto o card estiver em hover.
export function CampaignHowItWorks({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];
  const icons = HOW_IT_WORKS_ICONS[variant];
  const sectionTitle = "howItWorksTitle" in campaign && campaign.howItWorksTitle
    ? campaign.howItWorksTitle
    : t.campaigns.howItWorksTitle;
  const sectionCtaTitle = "howItWorksCtaTitle" in campaign && campaign.howItWorksCtaTitle
    ? campaign.howItWorksCtaTitle
    : t.campaigns.howItWorksCtaTitle;

  const openQualification = (source: string) => {
    trackFunnelEvent("click_pricing_cta", { cta_source: source, plan_name: "TLIN" });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source } }));
  };

  return (
    <section id="como-funciona" className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-5"
          >
            <div
              className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide">
              {t.campaigns.howItWorksEyebrow}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-black tracking-tight text-[#0c0d0d]"
          >
            <HighlightedTitle text={withoutClosingPeriod(sectionTitle)} />
          </motion.h2>
        </div>

        <h2 id="agentes" className="sr-only">{t.features.agentesTitle}</h2>
        <h2 id="crm" className="sr-only">{t.features.crmTitle}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {campaign.howItWorksCards.map((card, i) => (
            <HowItWorksCard key={i} icon={icons[i]} title={card.title} desc={card.desc} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 w-full md:mt-8"
        >
          <TlinCard tone="muted" className="flex flex-col items-center justify-between gap-6 px-6 py-7 md:flex-row md:px-10 md:py-9">
            <p className="text-center text-xl font-bold text-tlin-ink md:text-left md:text-2xl">
              <HighlightedTitle text={withoutClosingPeriod(sectionCtaTitle)} />
            </p>

            <DemoHoverPill className="shrink-0">
              <TlinButton onClick={() => openQualification("how_it_works_cta")} className="whitespace-nowrap">
                {t.hero.cta}
              </TlinButton>
            </DemoHoverPill>
          </TlinCard>
        </motion.div>
      </div>
    </section>
  );
}
