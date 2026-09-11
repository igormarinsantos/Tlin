import { Filter, MessageCircle, Bot, LayoutGrid, CalendarCheck, TrendingUp, RotateCcw, ShoppingCart, type LucideIcon } from "lucide-react";
import type { HeroVariant } from "@/components/Hero";

export type CardIconKey = "capture" | "whatsapp" | "agent" | "crm" | "schedule" | "funnel" | "followup" | "cart";

export const CARD_ICON: Record<CardIconKey, LucideIcon> = {
  capture: Filter,
  whatsapp: MessageCircle,
  agent: Bot,
  crm: LayoutGrid,
  schedule: CalendarCheck,
  funnel: TrendingUp,
  followup: RotateCcw,
  cart: ShoppingCart,
};

// Cada variante mapeia os 6 icones na mesma ordem dos 6 cards do dicionario
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
