import type { EditorialArticle } from "@/lib/editorial/types";

const igorApproval = {
  status: "approved",
  approvedBy: "author:igor-marin",
  approvedAt: "2026-09-23T10:00:00-03:00",
} as const;

export const comoAvaliarNovosModelosArticle = {
  id: "article:como-avaliar-novos-modelos-de-ia-para-negocios",
  slug: "como-avaliar-novos-modelos-de-ia-para-negocios",
  title: "Novo modelo de IA? Como avaliar se ele importa para seu negócio",
  summary:
    "Antes de testar toda novidade, use este filtro para decidir se uma tecnologia pode melhorar atendimento, vendas ou operação.",
  status: "published",
  authorId: "author:igor-marin",
  publishedAt: "2026-07-18T12:00:00-03:00",
  modifiedAt: "2026-07-18T12:00:00-03:00",
  readingTimeMinutes: 5,
  intent: "informational",
  clusterId: "cluster:ia-comercial",
  featured: true,
  blocks: [
    {
      type: "heading",
      level: 2,
      id: "novidade-nao-e-necessariamente-vantagem",
      text: "Novidade não é necessariamente vantagem",
    },
    {
      type: "paragraph",
      text: "O ritmo de lançamentos em IA pode levar empresas a testar ferramentas sem uma hipótese clara. A consequência é custo, dispersão e processos que nunca chegam à operação real.",
    },
    {
      type: "paragraph",
      text: "A pergunta certa não é se um modelo é mais novo. É se ele aumenta a qualidade, a velocidade ou a confiabilidade de uma tarefa importante para o cliente ou para o time.",
    },
    {
      type: "heading",
      level: 2,
      id: "um-filtro-de-quatro-perguntas",
      text: "Um filtro de quatro perguntas",
    },
    {
      type: "paragraph",
      text: "Avalie: qual tarefa específica melhora; quais dados e integrações são necessários; como o resultado será supervisionado; e qual indicador mostrará que a mudança valeu a pena.",
    },
    {
      type: "paragraph",
      text: "Se não houver uma resposta objetiva para essas perguntas, a novidade pode continuar no radar, mas ainda não deve entrar em produção.",
    },
  ],
  sources: [
    {
      id: "source:openai-practical-guide-agents",
      title: "A practical guide to building agents",
      url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
      accessedAt: "2026-09-23T10:00:00-03:00",
      publisher: "OpenAI",
    },
  ],
  internalLinks: [
    {
      href: "/blog/temas/ia-comercial",
      label: "Veja mais conteúdos sobre IA comercial",
      purpose: "hub do cluster editorial",
    },
  ],
  cta: {
    id: "cta:demo",
    label: "Agendar demonstração",
    href: "/demo",
  },
  review: {
    originalContribution:
      "Organiza um filtro editorial para avaliar modelos por tarefa, dados, supervisão e indicador, sem transformar novidade de fornecedor em recomendação automática.",
    factual: igorApproval,
    commercial: igorApproval,
  },
} satisfies EditorialArticle;
