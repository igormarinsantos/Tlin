import type { HeroVariant } from "@/components/Hero";
import { ObjectionAnimation } from "@/components/ObjectionAnimation";
import { WhatsAppQualifyAnimation } from "@/components/WhatsAppQualifyAnimation";
import { SalesNotification } from "@/components/SalesNotification";
import { FunnelAnimation } from "@/components/FunnelAnimation";

export type CampaignMotion = "objection" | "whatsapp" | "sales" | "funnel";

export function renderCampaignMotion(motion: CampaignMotion) {
  switch (motion) {
    case "whatsapp":
      return <WhatsAppQualifyAnimation />;
    case "sales":
      return <SalesNotification />;
    case "funnel":
      return <FunnelAnimation />;
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
  recuperacaoDeLeads: "objection",
  crmComIa: "funnel",
  infoprodutores: "whatsapp",
  agentesDeIa: "objection",
};
