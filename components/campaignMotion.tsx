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
// mostrar o mecanismo da pagina em acao.
export const HERO_MOTION_BY_VARIANT: Record<HeroVariant, CampaignMotion> = {
  iaWhatsapp: "whatsapp",
  recuperacaoDeLeads: "objection",
  crmComIa: "funnel",
  infoprodutores: "whatsapp",
  agentesDeIa: "objection",
};

// Motion da secao de Dor -- repete o do Hero na maioria das paginas (reforca
// a mesma prova), varia so em infoprodutores pra nao repetir tao perto.
export const PAIN_MOTION_BY_VARIANT: Record<HeroVariant, CampaignMotion> = {
  iaWhatsapp: "whatsapp",
  recuperacaoDeLeads: "objection",
  crmComIa: "funnel",
  infoprodutores: "sales",
  agentesDeIa: "objection",
};
