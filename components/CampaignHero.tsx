"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { trackFunnelEvent } from "@/lib/utm";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
import { renderCampaignMotion, HERO_MOTION_BY_VARIANT } from "@/components/campaignMotion";
import { DemoHoverPill } from "@/components/DemoHoverPill";
import { TlinButton, TlinGradientText } from "@/components/ui/tlin";

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
                  <TlinGradientText>
                    {word}
                  </TlinGradientText>
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
    <section className="relative isolate w-full min-h-[80svh] md:min-h-[85svh] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-8 flex items-center overflow-hidden">
      {/* Fundo azul (ver wrapper em MarketingLandingPage.tsx, que estende
          essa cor por baixo do Hero + da faixa "Confianca para escalar sua
          operacao" logo abaixo) -- aqui a section fica sem bg proprio pra
          deixar o gradiente do wrapper aparecer por baixo do conteudo. */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#B597FF]/5 to-[#38E3FF]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1300px] w-full mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <h1 className="text-[34px] xs:text-[40px] sm:text-5xl md:text-6xl font-bold tracking-tight md:tracking-tighter text-[#0c0d0d] leading-[1.15] mb-6 break-words [overflow-wrap:anywhere]">
            <HighlightedTitle title={withoutClosingPeriod(campaign.title)} highlightWords={campaign.highlightWords} />
          </h1>

          <p className="text-zinc-500 font-medium text-base md:text-lg max-w-xl mx-auto md:mx-0 mb-8">
            {withoutClosingPeriod(campaign.subtitle)}
          </p>

          <div className="flex flex-row items-center justify-center md:justify-start gap-3 md:gap-4">
            <DemoHoverPill>
              <TlinButton
                onClick={() => openQualification("campaign_hero_primary")}
                size="md"
              >
                {t.hero.cta}
              </TlinButton>
            </DemoHoverPill>

            <TlinButton
              onClick={() => openQualification("campaign_hero_secondary")}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {t.hero.watchDemo}
            </TlinButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative h-[320px] sm:h-[380px] md:h-[460px]"
        >
          {renderCampaignMotion(motion_, variant)}

          {/* Fade suave embaixo, na cor do wash azul do fundo da pagina (ver
              MarketingLandingPage.tsx) -- fica aqui na pagina (nao dentro do
              componente de motion) porque e o fundo da secao que muda de LP
              pra LP, nao a animacao em si. */}
          {variant === "crmComIa" && (
            <div
              className="absolute inset-x-0 bottom-0 h-24 md:h-32 pointer-events-none z-20"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(234,251,255,0.9))" }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
