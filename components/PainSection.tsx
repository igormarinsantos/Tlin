"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { renderCampaignMotion, PAIN_MOTION_BY_VARIANT } from "@/components/campaignMotion";

// Destaca em degrade o trecho marcado entre colchetes no headline (mesmo
// padrao de "[texto]" ja usado em outras partes do site).
function HighlightedHeadline({ text }: { text: string }) {
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

// Secao de "Dor" com dado de mercado -- so aparece nas paginas de campanha
// (quando ha variant). Reaproveita as mesmas 4 animacoes ja usadas em
// Features.tsx como imagem de apoio, sem criar nenhum asset novo.
export function PainSection({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];
  const motion_ = PAIN_MOTION_BY_VARIANT[variant];

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative p-[1px] rounded-full overflow-hidden inline-flex mb-6">
            <div
              className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide">
              {t.campaigns.painBadge}
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-[#0c0d0d] mb-5">
            <HighlightedHeadline text={campaign.painHeadline} />
          </h2>

          <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-xl mb-5">
            {campaign.painBody}
          </p>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            {campaign.painDisclaimer}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative h-[340px] sm:h-[400px] md:h-[440px] rounded-[2rem] overflow-hidden p-[2px]"
        >
          <div
            className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
          />
          <div className="relative w-full h-full rounded-[calc(2rem-2px)] overflow-hidden bg-[#F8F6FF]">
            {renderCampaignMotion(motion_)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
