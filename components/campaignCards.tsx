import { Filter, MessageCircle, Bot, LayoutGrid, CalendarCheck, TrendingUp, RotateCcw, ShoppingCart, type LucideIcon } from "lucide-react";
import type { TargetAndTransition, Transition } from "framer-motion";
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

// Micro-interacao propria de cada icone, disparada so no hover do card
// inteiro (nao do icone isolado) -- cada uma remete ao conceito do card:
// funil "capturando", bolha de WhatsApp pulsando, agente "acenando", CRM
// reorganizando, check de agenda confirmando, funil subindo, follow-up
// girando de novo, carrinho balancando.
export const CARD_ICON_HOVER: Record<CardIconKey, { animate: TargetAndTransition; transition: Transition }> = {
  capture: { animate: { y: [0, 4, 0], rotate: -8, scale: 1.1 }, transition: { duration: 0.5, ease: "easeInOut" } },
  whatsapp: { animate: { scale: [1, 1.18, 1] }, transition: { duration: 0.5, ease: "easeInOut" } },
  agent: { animate: { rotate: [0, -12, 10, -6, 0] }, transition: { duration: 0.6, ease: "easeInOut" } },
  crm: { animate: { rotate: [0, 8, -8, 0], scale: 1.05 }, transition: { duration: 0.5, ease: "easeInOut" } },
  schedule: { animate: { scale: [1, 1.25, 1] }, transition: { duration: 0.4, ease: "easeOut" } },
  funnel: { animate: { y: -4, x: 3, scale: 1.1 }, transition: { duration: 0.35, ease: "easeOut" } },
  followup: { animate: { rotate: -360 }, transition: { duration: 0.6, ease: "easeInOut" } },
  cart: { animate: { x: [0, -4, 4, -4, 4, 0] }, transition: { duration: 0.5, ease: "easeInOut" } },
};
