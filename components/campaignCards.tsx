import type { ComponentType } from "react";
import type { HeroVariant } from "@/components/Hero";
import {
  CaptureMotion,
  WhatsappMotion,
  AgentMotion,
  CrmMotion,
  ScheduleMotion,
  FunnelMotion,
  FollowupMotion,
  CartMotion,
} from "@/components/campaignCardMotions";

export type CardIconKey = "capture" | "whatsapp" | "agent" | "crm" | "schedule" | "funnel" | "followup" | "cart";

// Motion pequeno e proprio de cada tema, disparado via prop `isActive`
// (hover do card inteiro, nao do motion isolado).
export const CARD_MOTION: Record<CardIconKey, ComponentType<{ isActive: boolean }>> = {
  capture: CaptureMotion,
  whatsapp: WhatsappMotion,
  agent: AgentMotion,
  crm: CrmMotion,
  schedule: ScheduleMotion,
  funnel: FunnelMotion,
  followup: FollowupMotion,
  cart: CartMotion,
};

// Cada variante mapeia os 6 temas na mesma ordem dos 6 cards do dicionario
// (campaigns.<variant>.howItWorksCards). recuperacaoDeLeads troca o card 1
// (capture -> followup) e infoprodutores troca o card 5 (schedule -> cart),
// espelhando a personalizacao de conteudo decidida com o Igor.
export const HOW_IT_WORKS_ICONS: Record<HeroVariant, CardIconKey[]> = {
  iaWhatsapp: ["capture", "whatsapp", "agent", "crm", "schedule", "funnel"],
  recuperacaoDeLeads: ["followup", "whatsapp", "agent", "crm", "schedule", "funnel"],
  crmComIa: ["capture", "whatsapp", "agent", "crm", "schedule", "funnel"],
  infoprodutores: ["capture", "whatsapp", "agent", "crm", "cart", "funnel"],
  agentesDeIa: ["capture", "whatsapp", "agent", "crm", "schedule", "funnel"],
};
