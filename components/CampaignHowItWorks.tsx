"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { trackFunnelEvent } from "@/lib/utm";
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

function HowItWorksCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: keyof typeof CARD_MOTION;
  title: string;
  desc: string;
  index: number;
}) {
  const Motion = CARD_MOTION[icon];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
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
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative w-full h-full">
          <Motion isActive={isHovered} />
        </div>
      </div>

      <div className="px-2 pb-2 md:px-3 md:pb-3">
        <h3 className="text-lg font-bold text-[#0c0d0d] mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
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

  const openQualification = (source: string) => {
    trackFunnelEvent("click_pricing_cta", { cta_source: source, plan_name: "TLIN" });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source } }));
  };

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
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
            <HighlightedTitle text={t.campaigns.howItWorksTitle} />
          </motion.h2>
        </div>

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
          className="w-full rounded-3xl bg-[#F7F7FB] border border-zinc-100 px-6 md:px-10 py-7 md:py-9 mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-xl md:text-2xl font-bold text-[#0c0d0d] text-center md:text-left">
            <HighlightedTitle text={t.campaigns.howItWorksCtaTitle} />
          </p>

          <button
            onClick={() => openQualification("how_it_works_cta")}
            className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer shrink-0"
          >
            <div
              className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
            />
            <div className="relative px-8 md:px-10 py-3.5 rounded-full font-bold text-[14px] md:text-[15px] z-10 text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center whitespace-nowrap">
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
