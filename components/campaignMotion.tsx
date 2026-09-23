import type { HeroVariant } from "@/components/Hero";
import { ObjectionAnimation } from "@/components/ObjectionAnimation";
import { WhatsAppQualifyAnimation } from "@/components/WhatsAppQualifyAnimation";
import { SalesNotification } from "@/components/SalesNotification";
import { FunnelAnimation } from "@/components/FunnelAnimation";
import { FollowUpAnimation } from "@/components/FollowUpAnimation";
import { SegmentHeroFlow } from "@/components/SegmentHeroFlow";
import type { SegmentHeroFlowKey } from "@/lib/dictionaries/segmentHeroFlows";

export type CampaignMotion = "objection" | "agentObjection" | "whatsapp" | "sales" | "funnel" | "followup" | "segmentFlow";

const segmentVariants: SegmentHeroFlowKey[] = ["clinicas", "escolas", "assessorias", "advocacia"];

export function isSegmentHeroVariant(variant: HeroVariant): variant is SegmentHeroFlowKey {
  return segmentVariants.includes(variant as SegmentHeroFlowKey);
}

export function renderCampaignMotion(motion: CampaignMotion, variant: HeroVariant) {
  switch (motion) {
    case "segmentFlow":
      return isSegmentHeroVariant(variant) ? <SegmentHeroFlow key={variant} variant={variant} /> : null;
    case "whatsapp":
      return <WhatsAppQualifyAnimation />;
    case "sales":
      return <SalesNotification />;
    case "funnel":
      return <FunnelAnimation />;
    case "followup":
      return <FollowUpAnimation />;
    case "agentObjection":
      return <ObjectionAnimation dictKey="agentObjectionAnimation" />;
    case "objection":
    default:
      return <ObjectionAnimation />;
  }
}

// Motion do Hero das campanhas -- primeira coisa que a pessoa ve, prioriza
// mostrar o mecanismo da pagina em acao. (A secao de Dor virou so texto
// centralizado, sem motion -- esse mapa ficou exclusivo do CampaignHero.)
export const HERO_MOTION_BY_VARIANT: Record<HeroVariant, CampaignMotion> = {
  iaWhatsapp: "whatsapp",
  recuperacaoDeLeads: "followup",
  crmComIa: "funnel",
  infoprodutores: "whatsapp",
  agentesDeIa: "agentObjection",
  clinicas: "segmentFlow",
  escolas: "segmentFlow",
  assessorias: "segmentFlow",
  advocacia: "segmentFlow",
};
