"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";

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
// (quando ha variant). Frase centralizada, sem imagem/motion -- so o texto
// que carrega a atencao aqui. O disclaimer vem com icone de "info", como
// uma nota adicional sobre a fonte do dado.
export function PainSection({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];

  return (
    <section className="w-full bg-white py-20 md:py-28 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto flex flex-col items-center text-center"
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

        <div className="flex items-start gap-2 max-w-xl text-left bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-zinc-400">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {campaign.painDisclaimer}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
