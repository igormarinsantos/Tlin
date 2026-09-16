"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
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
            <span key={i} className="text-red-600">
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
// (quando ha variant). Tudo centralizado, sem imagem/motion, sem badge e
// sem disclaimer -- so o titulo com o dado destacado e um gancho curto (1
// linha), com icone de info do lado, direto no fundo branco.
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
          <HighlightedHeadline text={withoutClosingPeriod(campaign.painHeadline)} />
        </h2>

        <div className="flex max-w-2xl items-center justify-center gap-1 md:gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-zinc-400 md:h-[18px] md:w-[18px]">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 11v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
        <p className="whitespace-nowrap text-[13px] font-medium text-zinc-500 xs:text-sm md:text-lg">
          <span className="md:hidden">{withoutClosingPeriod(campaign.painBodyMobile)}</span>
          <span className="hidden md:inline">{withoutClosingPeriod(campaign.painBody)}</span>
        </p>
        </div>
      </motion.div>
    </section>
  );
}
