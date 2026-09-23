import type { EditorialPublishedArticle } from "@/lib/editorial/types";

const igorApproval = {
  status: "approved",
  approvedBy: "author:igor-marin",
  approvedAt: "2026-09-23T09:00:00-03:00",
} as const;

export const agentesDeIaNoWhatsappParaVendas = {
  id: "article:agentes-de-ia-no-whatsapp-para-vendas",
  slug: "agentes-de-ia-no-whatsapp-para-vendas",
  title: "Agentes de IA no WhatsApp: onde eles realmente ajudam vendas",
  summary:
    "Uma visão prática de como agentes de IA reduzem tempo de resposta, qualificam contatos e preservam o contexto para o time comercial.",
  status: "published",
  authorId: "author:igor-marin",
  publishedAt: "2026-07-21T12:00:00-03:00",
  modifiedAt: "2026-09-23T09:00:00-03:00",
  readingTimeMinutes: 6,
  intent: "informational",
  clusterId: "cluster:ia-comercial",
  featured: true,
  blocks: [
    {
      type: "heading",
      level: 2,
      id: "o-problema-nao-e-so-volume",
      text: "O problema não é só volume",
    },
    {
      type: "paragraph",
      text: "Quando um negócio começa a receber mais mensagens, o primeiro gargalo costuma parecer falta de pessoas. Na prática, o problema frequentemente é a combinação entre demora, perda de contexto e follow-up inconsistente.",
    },
    {
      type: "paragraph",
      text: "Um agente de IA bem configurado não substitui a decisão comercial. Ele assume o trabalho repetitivo: responde com velocidade, entende a intenção inicial, faz perguntas de qualificação e entrega a conversa organizada para quem precisa fechar.",
    },
    {
      type: "heading",
      level: 2,
      id: "tres-aplicacoes-que-costumam-gerar-impacto",
      text: "Três aplicações que costumam gerar impacto",
    },
    {
      type: "paragraph",
      text: "A primeira é a resposta imediata fora do horário comercial. A segunda é a qualificação padronizada, com perguntas que o time já usa para decidir prioridade. A terceira é a retomada de conversas que ficariam esquecidas depois do primeiro contato.",
    },
    {
      type: "paragraph",
      text: "A regra é simples: automatize o que tem processo, supervisione o que exige julgamento e sempre deixe claro quando uma pessoa pode assumir a conversa.",
    },
    {
      type: "heading",
      level: 2,
      id: "como-comecar-sem-criar-uma-operacao-engessada",
      text: "Como começar sem criar uma operação engessada",
    },
    {
      type: "paragraph",
      text: "Comece por um único fluxo: novos leads. Defina objetivo, perguntas permitidas, informações que nunca podem ser inventadas e os gatilhos de transferência para uma pessoa. Só então amplie para recuperação, suporte e pós-venda.",
    },
    {
      type: "paragraph",
      text: "O sucesso deve ser medido por tempo até a primeira resposta, taxa de qualificação, reuniões geradas e conversas recuperadas — não apenas pelo número de mensagens automatizadas.",
    },
    {
      type: "heading",
      level: 2,
      id: "ia-comercial-e-uma-operacao-conectada",
      text: "IA comercial é uma operação conectada",
    },
    {
      type: "paragraph",
      text: "Na Tlin, a IA comercial é o núcleo da operação. CRM nativo, follow-up automático e agendamento apoiam o atendimento e preservam o contexto, sem transformar cada capacidade em uma ferramenta isolada ou prometer autonomia sem acompanhamento humano.",
    },
    {
      type: "paragraph",
      text: "HTML acessível, fontes verificáveis e informações consistentes ajudam pessoas, buscadores e sistemas generativos a compreender o conteúdo. Recursos como llms.txt são complementares e não garantem ranking, indexação ou citação em respostas de IA.",
    },
  ],
  sources: [
    {
      id: "source:google-helpful-content",
      title: "Creating helpful, reliable, people-first content",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
      accessedAt: "2026-09-23T09:00:00-03:00",
      publisher: "Google Search Central",
    },
    {
      id: "source:google-ai-features",
      title: "AI features and your website",
      url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
      accessedAt: "2026-09-23T09:00:00-03:00",
      publisher: "Google Search Central",
    },
  ],
  internalLinks: [
    {
      href: "/blog/temas/ia-comercial",
      label: "Veja mais conteúdos sobre IA comercial",
      purpose: "hub do cluster editorial",
    },
    {
      href: "/ia-whatsapp",
      label: "Conheça a IA comercial para WhatsApp",
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
      "Aplica orientações documentadas de conteúdo útil ao fluxo comercial no WhatsApp e explicita os limites de GEO e llms.txt.",
    factual: igorApproval,
    commercial: igorApproval,
  },
} satisfies EditorialPublishedArticle;
