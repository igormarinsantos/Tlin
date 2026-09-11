"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { CARD_ICON, HOW_IT_WORKS_ICONS } from "@/components/campaignCards";

function HowItWorksCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: keyof typeof CARD_ICON;
  title: string;
  desc: string;
  index: number;
}) {
  const Icon = CARD_ICON[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
      className="rounded-3xl bg-[#F7F7FB] p-6 md:p-7 flex flex-col gap-6"
    >
      <div className="relative w-full h-36 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden">
        <div className="absolute -inset-1/2 bg-gradient-to-tr from-[#B597FF]/10 to-[#38E3FF]/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="relative w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#8B6CFF]" strokeWidth={1.8} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#0c0d0d] mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// Substitui o TextReveal so nas paginas de campanha: eyebrow "Conheca a
// Tlin" + grid de 6 mini-cards (3 em cima, 3 embaixo no desktop; 1 coluna
// no mobile), cada um com um icone/mockup leve e estatico -- sem motion
// pesado, pra ficar rapido e nao competir com a Hero/Dor.
export function CampaignHowItWorks({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];
  const icons = HOW_IT_WORKS_ICONS[variant];

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative p-[1px] rounded-full overflow-hidden inline-flex"
          >
            <div
              className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
              style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 150deg, #B597FF 170deg, #38E3FF 190deg, transparent 210deg 360deg)" }}
            />
            <div className="relative px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide">
              {t.campaigns.howItWorksEyebrow}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {campaign.howItWorksCards.map((card, i) => (
            <HowItWorksCard key={i} icon={icons[i]} title={card.title} desc={card.desc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
