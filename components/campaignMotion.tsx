import type { HeroVariant } from "@/components/Hero";
import { ObjectionAnimation } from "@/components/ObjectionAnimation";
import { WhatsAppQualifyAnimation } from "@/components/WhatsAppQualifyAnimation";
import { SalesNotification } from "@/components/SalesNotification";
import { FunnelAnimation } from "@/components/FunnelAnimation";
import { FollowUpAnimation } from "@/components/FollowUpAnimation";

export type CampaignMotion = "objection" | "agentObjection" | "whatsapp" | "sales" | "funnel" | "followup";

export function renderCampaignMotion(motion: CampaignMotion) {
  switch (motion) {
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
  clinicas: "whatsapp",
  escolas: "whatsapp",
  assessorias: "funnel",
  advocacia: "whatsapp",
};
