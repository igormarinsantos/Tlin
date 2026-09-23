import { absoluteUrl } from "@/lib/siteConfig";

type LegacyArticleFixture = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  featured: boolean;
  content: readonly {
    heading: string;
    paragraphs: readonly string[];
  }[];
  surfaces: {
    url: string;
    canonical: string;
    sitemap: string;
    rss: string;
    navigation: string;
    sharing: string;
  };
  migration: {
    legacy: "captured";
    migrated: "pending";
  };
};

function fixture(
  article: Omit<LegacyArticleFixture, "surfaces" | "migration">,
): LegacyArticleFixture {
  const route = `/blog/${article.slug}`;
  const canonical = absoluteUrl(route);

  return {
    ...article,
    surfaces: {
      url: route,
      canonical,
      sitemap: canonical,
      rss: canonical,
      navigation: route,
      sharing: canonical,
    },
    migration: {
      legacy: "captured",
      migrated: "pending",
    },
  };
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach((nested) => deepFreeze(nested));
  }
  return value;
}

export const legacyArticles = deepFreeze([
  fixture({
    slug: "agentes-de-ia-no-whatsapp-para-vendas",
    title: "Agentes de IA no WhatsApp: onde eles realmente ajudam vendas",
    description:
      "Uma visão prática de como agentes de IA reduzem tempo de resposta, qualificam contatos e preservam o contexto para o time comercial.",
    category: "Vendas com IA",
    publishedAt: "2026-07-21",
    readingTime: "6 min de leitura",
    author: "Redação Tlin",
    featured: true,
    content: [
      {
        heading: "O problema não é só volume",
        paragraphs: [
          "Quando um negócio começa a receber mais mensagens, o primeiro gargalo costuma parecer falta de pessoas. Na prática, o problema frequentemente é a combinação entre demora, perda de contexto e follow-up inconsistente.",
          "Um agente de IA bem configurado não substitui a decisão comercial. Ele assume o trabalho repetitivo: responde com velocidade, entende a intenção inicial, faz perguntas de qualificação e entrega a conversa organizada para quem precisa fechar.",
        ],
      },
      {
        heading: "Três aplicações que costumam gerar impacto",
        paragraphs: [
          "A primeira é a resposta imediata fora do horário comercial. A segunda é a qualificação padronizada, com perguntas que o time já usa para decidir prioridade. A terceira é a retomada de conversas que ficariam esquecidas depois do primeiro contato.",
          "A regra é simples: automatize o que tem processo, supervisione o que exige julgamento e sempre deixe claro quando uma pessoa pode assumir a conversa.",
        ],
      },
      {
        heading: "Como começar sem criar uma operação engessada",
        paragraphs: [
          "Comece por um único fluxo: novos leads. Defina objetivo, perguntas permitidas, informações que nunca podem ser inventadas e os gatilhos de transferência para uma pessoa. Só então amplie para recuperação, suporte e pós-venda.",
          "O sucesso deve ser medido por tempo até a primeira resposta, taxa de qualificação, reuniões geradas e conversas recuperadas — não apenas pelo número de mensagens automatizadas.",
        ],
      },
    ],
  }),
  fixture({
    slug: "como-avaliar-novos-modelos-de-ia-para-negocios",
    title: "Novo modelo de IA? Como avaliar se ele importa para seu negócio",
    description:
      "Antes de testar toda novidade, use este filtro para decidir se uma tecnologia pode melhorar atendimento, vendas ou operação.",
    category: "IA em movimento",
    publishedAt: "2026-07-18",
    readingTime: "5 min de leitura",
    author: "Redação Tlin",
    featured: true,
    content: [
      {
        heading: "Novidade não é necessariamente vantagem",
        paragraphs: [
          "O ritmo de lançamentos em IA pode levar empresas a testar ferramentas sem uma hipótese clara. A consequência é custo, dispersão e processos que nunca chegam à operação real.",
          "A pergunta certa não é se um modelo é mais novo. É se ele aumenta a qualidade, a velocidade ou a confiabilidade de uma tarefa importante para o cliente ou para o time.",
        ],
      },
      {
        heading: "Um filtro de quatro perguntas",
        paragraphs: [
          "Avalie: qual tarefa específica melhora; quais dados e integrações são necessários; como o resultado será supervisionado; e qual indicador mostrará que a mudança valeu a pena.",
          "Se não houver uma resposta objetiva para essas perguntas, a novidade pode continuar no radar, mas ainda não deve entrar em produção.",
        ],
      },
    ],
  }),
  fixture({
    slug: "playbook-qualificacao-leads-whatsapp",
    title: "Playbook: como qualificar leads no WhatsApp sem perder contexto",
    description:
      "Um roteiro para desenhar perguntas, critérios de prioridade e uma passagem de bastão que ajude vendedores a avançar conversas.",
    category: "Guias e playbooks",
    publishedAt: "2026-07-15",
    readingTime: "8 min de leitura",
    author: "Redação Tlin",
    featured: true,
    content: [
      {
        heading: "Qualificar é preparar a próxima conversa",
        paragraphs: [
          "Uma boa qualificação não é um interrogatório. Ela reduz atrito para o lead e entrega para o comercial as informações necessárias para fazer uma abordagem relevante.",
          "O roteiro deve refletir uma decisão real: segmento, necessidade, urgência, porte, orçamento ou disponibilidade. Perguntas sem uso posterior apenas alongam a conversa.",
        ],
      },
      {
        heading: "Estruture o handoff",
        paragraphs: [
          "Quando o contato atinge o critério de prioridade, o vendedor precisa receber um resumo: origem, necessidade, respostas, etapa e próxima ação recomendada. Esse resumo evita que o cliente repita tudo.",
          "Revise o playbook mensalmente com o time comercial. As melhores objeções e perguntas surgem nas conversas reais, não em um documento isolado.",
        ],
      },
    ],
  }),
]);
