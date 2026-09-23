import type { EditorialArticle } from "@/lib/editorial/types";

const igorApproval = {
  status: "approved",
  approvedBy: "author:igor-marin",
  approvedAt: "2026-09-23T10:30:00-03:00",
} as const;

export const playbookQualificacaoLeadsArticle = {
  id: "article:playbook-qualificacao-leads-whatsapp",
  slug: "playbook-qualificacao-leads-whatsapp",
  title: "Playbook: como qualificar leads no WhatsApp sem perder contexto",
  summary:
    "Um roteiro para desenhar perguntas, critérios de prioridade e uma passagem de bastão que ajude vendedores a avançar conversas.",
  status: "published",
  authorId: "author:igor-marin",
  publishedAt: "2026-07-15T12:00:00-03:00",
  modifiedAt: "2026-07-15T12:00:00-03:00",
  readingTimeMinutes: 8,
  intent: "informational",
  clusterId: "cluster:qualificacao",
  featured: true,
  blocks: [
    {
      type: "heading",
      level: 2,
      id: "qualificar-e-preparar-a-proxima-conversa",
      text: "Qualificar é preparar a próxima conversa",
    },
    {
      type: "paragraph",
      text: "Uma boa qualificação não é um interrogatório. Ela reduz atrito para o lead e entrega para o comercial as informações necessárias para fazer uma abordagem relevante.",
    },
    {
      type: "paragraph",
      text: "O roteiro deve refletir uma decisão real: segmento, necessidade, urgência, porte, orçamento ou disponibilidade. Perguntas sem uso posterior apenas alongam a conversa.",
    },
    {
      type: "heading",
      level: 2,
      id: "estruture-o-handoff",
      text: "Estruture o handoff",
    },
    {
      type: "paragraph",
      text: "Quando o contato atinge o critério de prioridade, o vendedor precisa receber um resumo: origem, necessidade, respostas, etapa e próxima ação recomendada. Esse resumo evita que o cliente repita tudo.",
    },
    {
      type: "paragraph",
      text: "Revise o playbook mensalmente com o time comercial. As melhores objeções e perguntas surgem nas conversas reais, não em um documento isolado.",
    },
  ],
  sources: [
    {
      id: "source:openai-practical-guide-agents",
      title: "A practical guide to building agents",
      url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
      accessedAt: "2026-09-23T10:30:00-03:00",
      publisher: "OpenAI",
    },
  ],
  internalLinks: [
    {
      href: "/blog/temas/qualificacao-de-leads",
      label: "Veja mais conteúdos sobre qualificação de leads",
      purpose: "hub do cluster editorial",
    },
    {
      href: "/agentes-de-ia",
      label: "Conheça os agentes de IA para vendas",
      purpose: "página comercial relacionada",
    },
  ],
  cta: {
    id: "cta:demo",
    label: "Agendar demonstração",
    href: "/demo",
  },
  review: {
    originalContribution:
      "Transforma princípios de instruções claras, tratamento de exceções e intervenção humana em um roteiro de qualificação e handoff para vendas no WhatsApp.",
    factual: igorApproval,
    commercial: igorApproval,
  },
} satisfies EditorialArticle;
