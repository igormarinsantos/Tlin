"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";

// Mesmo padrao de "[texto]" ja usado em PainSection/CampaignHero/CampaignHowItWorks.
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

function XIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-[#38E3FF] flex items-center justify-center shrink-0 mt-0.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M4 12l5 5L20 6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Comparativo "jeito antigo x com a Tlin" -- so nas 5 paginas de campanha,
// logo antes do Pricing. Cada linha pareia o ponto de dor com o resultado
// equivalente usando a Tlin, lado a lado no desktop e empilhado no mobile.
export function CampaignComparison({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="px-3 py-1.5 rounded-full bg-white border border-[#B597FF]/20 text-[#B597FF] text-[11px] font-bold tracking-wide mb-5"
          >
            {t.campaigns.comparisonEyebrow}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-black tracking-tight text-[#0c0d0d]"
          >
            <HighlightedTitle text={t.campaigns.comparisonTitle} />
          </motion.h2>
        </div>

        {/* A Tlin e o "container" (azul translucido com borda, nao degrade) --
            o jeito antigo vira uma caixinha branca menor, abraçada pelo
            espaço azul ao redor dela (sem linhas de tabela, so o abraço). */}
        <div className="rounded-3xl bg-[#38E3FF]/10 border border-[#38E3FF]/30 p-3 md:p-5">
          <div className="hidden md:flex items-center justify-between px-3 pb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{t.campaigns.comparisonOldLabel}</span>
            <span className="text-xs font-bold text-[#0c0d0d] uppercase tracking-wide">{t.campaigns.comparisonNewLabel}</span>
          </div>

          <div className="flex flex-col gap-3">
            {campaign.comparison.map((pair, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: (i % 5) * 0.06 }}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
              >
                <div className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 md:w-[38%] shrink-0">
                  <XIcon />
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{pair.old}</p>
                </div>
                <div className="flex items-start gap-3 px-2 md:px-3 flex-1">
                  <CheckIcon />
                  <p className="text-sm md:text-base font-bold text-[#0c0d0d] leading-relaxed">{pair.new}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

