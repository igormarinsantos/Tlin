"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { trackFunnelEvent } from "@/lib/utm";
import { renderCampaignMotion, HERO_MOTION_BY_VARIANT } from "@/components/campaignMotion";

// Envolve em degrade as palavras do titulo que baterem com highlightWords
// (mesma logica de destaque do Hero padrao, sem a animacao de digitacao —
// aqui o titulo entra com um fade simples, o motion do lado direito e que
// carrega a atencao principal).
function HighlightedTitle({ title, highlightWords }: { title: string; highlightWords: string[] }) {
  const lines = title.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.split(" ").map((word, wordIdx) => {
            const bare = word.replace(/[^a-zA-ZÀ-ú]/g, "").toLowerCase();
            const isHighlighted = highlightWords.some((h) => h.toLowerCase() === bare);
            return (
              <span key={wordIdx}>
                {isHighlighted ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B597FF] to-[#38E3FF]">
                    {word}
                  </span>
                ) : (
                  word
                )}
                {wordIdx < line.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

// Hero em layout dividido (texto esquerda / motion direita), so pras
// paginas de campanha -- o Hero padrao (centralizado, com o mascote que
// segue o mouse) continua intocado na home/`/demo`/`/comece`.
export function CampaignHero({ variant }: { variant: HeroVariant }) {
  const { t } = useLanguage();
  const campaign = t.campaigns[variant];
  const motion_ = HERO_MOTION_BY_VARIANT[variant];

  const openQualification = (source: string) => {
    trackFunnelEvent("click_pricing_cta", { cta_source: source, plan_name: "TLIN" });
    window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN", source } }));
  };

  return (
    <section className="relative isolate w-full min-h-[80svh] md:min-h-[85svh] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-8 flex items-center bg-white overflow-hidden">
      {/* Fundo azul claro (cor solida, nao opacidade -- opacidade sobre
          branco dilui quase de volta pro branco) que segura a cor solida
          pela parte de cima/meio (onde o conteudo fica) e so desvanece pra
          transparente perto da base, se misturando com o resto da pagina. */}
      <div
        className="absolute inset-0 -z-20"
        style={{ background: "linear-gradient(to bottom, #D6F7FF 0%, #D6F7FF 40%, transparent 90%)" }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#B597FF]/5 to-[#38E3FF]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1300px] w-full mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <h1 className="text-[34px] xs:text-[40px] sm:text-5xl md:text-6xl font-bold tracking-tight md:tracking-tighter text-[#0c0d0d] leading-[1.15] mb-6 break-words [overflow-wrap:anywhere]">
            <HighlightedTitle title={campaign.title} highlightWords={campaign.highlightWords} />
          </h1>

          <p className="text-zinc-500 font-medium text-base md:text-lg max-w-xl mx-auto md:mx-0 mb-8">
            {campaign.subtitle}
          </p>

          <div className="flex flex-row items-center justify-center md:justify-start gap-3 md:gap-4">
            <button
              onClick={() => openQualification("campaign_hero_primary")}
              className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer"
            >
              <div
                className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
                style={{ backgroundImage: "conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)" }}
              />
              <div className="relative px-6 md:px-10 py-3.5 rounded-full font-bold text-[14px] md:text-[15px] z-10 text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center whitespace-nowrap">
                <span className="relative z-10">{t.hero.cta}</span>
                <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => openQualification("campaign_hero_secondary")}
              className="px-6 md:px-10 py-3.5 rounded-full bg-white border border-zinc-200 text-[#0c0d0d] font-bold text-[14px] md:text-[15px] hover:bg-zinc-50 transition-all whitespace-nowrap"
            >
              {t.hero.watchDemo}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative h-[320px] sm:h-[380px] md:h-[460px] rounded-[2rem] overflow-hidden p-[2px]"
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
