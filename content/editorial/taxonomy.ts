import type { ClusterId, EditorialCluster } from "@/lib/editorial/types";

export const editorialClusters = {
  "cluster:ia-comercial": {
    id: "cluster:ia-comercial",
    label: "IA comercial",
    description: "Como a IA atende, qualifica, acompanha e agenda ao longo da venda.",
    hubPath: "/blog/temas/ia-comercial",
    intentOwner: "/",
    allowedIntents: ["informational", "commercial-investigation"],
  },
  "cluster:vendas-whatsapp": {
    id: "cluster:vendas-whatsapp",
    label: "Vendas no WhatsApp",
    description: "Atendimento e venda com contexto no principal canal de conversa do lead.",
    hubPath: "/blog/temas/vendas-whatsapp",
    intentOwner: "/ia-whatsapp",
    allowedIntents: ["informational", "commercial-investigation"],
  },
  "cluster:qualificacao": {
    id: "cluster:qualificacao",
    label: "Qualificação de leads",
    description: "Critérios e processos que preparam a próxima conversa comercial.",
    hubPath: "/blog/temas/qualificacao-de-leads",
    intentOwner: "/agentes-de-ia",
    allowedIntents: ["informational", "commercial-investigation"],
  },
  "cluster:follow-up": {
    id: "cluster:follow-up",
    label: "Follow-up",
    description: "Retomadas úteis e oportunas sem perder o histórico da oportunidade.",
    hubPath: "/blog/temas/follow-up",
    intentOwner: "/recuperacao-de-leads",
    allowedIntents: ["informational", "commercial-investigation"],
  },
  "cluster:agendamento": {
    id: "cluster:agendamento",
    label: "Agendamento comercial",
    description: "Como transformar conversas qualificadas em reuniões confirmadas.",
    hubPath: "/blog/temas/agendamento-comercial",
    intentOwner: "/demo",
    allowedIntents: ["informational", "conversion-support"],
  },
  "cluster:crm-nativo": {
    id: "cluster:crm-nativo",
    label: "CRM nativo",
    description: "Organização do contexto comercial como capacidade da IA comercial.",
    hubPath: "/blog/temas/crm-nativo",
    intentOwner: "/crm-com-ia",
    allowedIntents: ["informational", "commercial-investigation"],
  },
} satisfies Record<ClusterId, EditorialCluster>;
