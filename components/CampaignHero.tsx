"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { HeroVariant } from "@/components/Hero";
import { trackFunnelEvent } from "@/lib/utm";
import { withoutClosingPeriod } from "@/lib/marketingCopy";
import { renderCampaignMotion, HERO_MOTION_BY_VARIANT } from "@/components/campaignMotion";
import { DemoHoverPill } from "@/components/DemoHoverPill";
import { TlinButton, TlinGradientText } from "@/components/ui/tlin";

const SEGMENT_PROOF_AVATARS: Partial<Record<HeroVariant, string[]>> = {
  clinicas: ["1", "4", "7", "6"],
  escolas: ["6", "1", "7", "4"],
  assessorias: ["8", "3", "5", "9"],
  advocacia: ["2", "8", "5", "3"],
};

const SEGMENT_PROOF_SOURCES: Partial<Record<HeroVariant, string>> = {
  clinicas: "American Medical Association, pesquisa com cerca de 1.200 médicos",
  escolas: "Gallup e Walton Family Foundation, pesquisa com mais de 2.000 professores",
  assessorias: "Microsoft e LinkedIn Work Trend Index, pesquisa com 31.000 profissionais",
  advocacia: "American Bar Association, pesquisa com 512 advogados",
};

function SegmentProofEyebrow({ variant, text }: { variant: HeroVariant; text: string }) {
  const avatars = SEGMENT_PROOF_AVATARS[variant];
  const source = SEGMENT_PROOF_SOURCES[variant];
  if (!avatars) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mb-5 flex items-center justify-center gap-3 md:justify-start"
    >
      <div className="flex shrink-0 -space-x-2.5" aria-hidden="true">
        {avatars.map((avatar, index) => (
          <motion.span
            key={avatar}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + index * 0.06, duration: 0.35 }}
            className="relative size-8 rounded-full bg-gradient-to-br from-[#B597FF] to-[#38E3FF] p-[1.5px] shadow-[0_3px_10px_rgba(76,57,122,0.14)] md:size-9"
            style={{ zIndex: index + 1 }}
          >
            <Image
              src={`/lotties/avatars/${avatar}_avatar.webp`}
              alt=""
              width={36}
              height={36}
              className="h-full w-full rounded-full bg-white object-cover ring-2 ring-white saturate-[0.8]"
            />
          </motion.span>
        ))}
      </div>
      <span
        className="max-w-[250px] text-left text-[11px] font-bold leading-[1.25] tracking-tight text-zinc-700 md:max-w-[290px] md:text-xs"
        title={source}
        aria-label={source ? `${text}. Fonte: ${source}` : text}
      >
        {text}
      </span>
    </motion.div>
  );
}

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
  const socialProof = "socialProof" in campaign ? campaign.socialProof : undefined;

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
          {socialProof && <SegmentProofEyebrow variant={variant} text={socialProof} />}

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
