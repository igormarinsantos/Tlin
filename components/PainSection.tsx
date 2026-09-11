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
// (quando ha variant). Frase centralizada, sem imagem/motion, sem badge e
// sem disclaimer -- so o titulo com o dado destacado e o texto de apoio,
// direto no fundo branco. O icone de info ao lado do texto de apoio e so
// um indicador visual (sem caixa/container), nao um link nem tooltip.
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
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-[#0c0d0d] mb-5">
          <HighlightedHeadline text={campaign.painHeadline} />
        </h2>

        <div className="flex items-start gap-2 max-w-xl text-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-1 text-zinc-400">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
          <p className="text-lg text-zinc-500 font-medium leading-relaxed">
            {campaign.painBody}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
