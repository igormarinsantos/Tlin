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
    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Icone de caveira (nao emoji) no titulo do "jeito antigo" -- render
// consistente entre plataformas, no lugar do glifo de emoji.
function SkullIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block align-[-2px] mr-1">
      <path
        d="M12 3C7.58 3 4 6.58 4 11c0 2.79 1.42 5.26 3.58 6.7L7 20.5h10l-.58-2.8C18.58 16.26 20 13.79 20 11c0-4.42-3.58-8-8-8z"
        fill="#a1a1aa"
      />
      <circle cx="9" cy="11" r="1.7" fill="white" />
      <circle cx="15" cy="11" r="1.7" fill="white" />
      <path d="M12 13.2l-1.2 2.3h2.4L12 13.2z" fill="white" />
    </svg>
  );
}

// Micro-interacao: o circulo faz um leve "pop" e o check se desenha
// (pathLength) logo depois, em vez de so aparecer junto com a linha.
function CheckIcon() {
  return (
    <motion.div
      className="w-6 h-6 rounded-full bg-[#38E3FF] flex items-center justify-center shrink-0 mt-0.5"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: 0.2, ease: "backOut" }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M4 12l5 5L20 6"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
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
          <div className="flex flex-col">
            {/* Label "DO JEITO ANTIGO" faz parte da mesma superficie branca --
                nao fica solta no espaço azul. */}
            <div className="flex flex-col md:flex-row">
              <div className="bg-white rounded-t-2xl px-5 pt-4 pb-2 md:w-[38%] shrink-0 text-center">
                <span className="text-xs font-bold text-zinc-400 lowercase tracking-wide">
                  <SkullIcon />
                  {t.campaigns.comparisonOldLabel}
                </span>
              </div>
              <div className="hidden md:flex items-end gap-1.5 px-5 md:px-8 md:mx-2 pb-2 flex-1">
                <span className="text-xs font-bold text-[#0c0d0d] lowercase tracking-wide">{t.campaigns.comparisonNewPrefix}</span>
                <img src="/Logo%20Horizontal.svg" alt="Tlin.ai" className="h-4 w-auto" />
              </div>
            </div>

            {campaign.comparison.map((pair, i) => {
              const isLast = i === campaign.comparison.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: (i % 5) * 0.06 }}
                  className="flex flex-col md:flex-row"
                >
                  <div
                    className={`flex items-start gap-3 bg-white px-5 py-4 md:w-[38%] shrink-0 border-t border-zinc-100 ${
                      isLast ? "rounded-b-2xl" : ""
                    }`}
                  >
                    <XIcon />
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{pair.old}</p>
                  </div>
                  <div className="group flex items-start gap-3 px-5 md:px-8 py-4 flex-1 md:mx-2 rounded-2xl cursor-default transition-colors duration-300 hover:bg-white/60">
                    <div className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6">
                      <CheckIcon />
                    </div>
                    <p className="text-base md:text-lg font-semibold text-[#0c0d0d] leading-relaxed transition-colors duration-300 group-hover:text-[#0369a1]">
                      {pair.new}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

