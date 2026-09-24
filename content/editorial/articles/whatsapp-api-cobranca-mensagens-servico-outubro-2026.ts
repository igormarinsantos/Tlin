import type { EditorialArticle } from "@/lib/editorial/types";

export const whatsappApiCobrancaMensagensServicoOutubro2026 = {
  id: "article:whatsapp-api-cobranca-mensagens-servico-outubro-2026",
  slug: "whatsapp-api-cobranca-mensagens-servico-outubro-2026",
  title: "WhatsApp API passa a cobrar mensagens de serviço em outubro de 2026",
  summary:
    "A partir de 1º de outubro de 2026, empresas na WhatsApp Business Platform terão 1.000 mensagens de serviço gratuitas por número e pagarão pelas mensagens entregues acima da franquia. Veja como calcular o impacto e preparar a operação.",
  status: "draft",
  authorId: "author:igor-marin",
  modifiedAt: "2026-09-24T09:00:00-03:00",
  readingTimeMinutes: 11,
  intent: "informational",
  clusterId: "cluster:vendas-whatsapp",
  blocks: [
    {
      type: "paragraph",
      text: "A partir de 1º de outubro de 2026, a Meta passará a cobrar mensagens de serviço enviadas por empresas na WhatsApp Business Platform depois que a franquia mensal for consumida. Cada número comercial terá direito a 1.000 mensagens de serviço gratuitas por mês. Da 1.001ª em diante, a cobrança será feita por mensagem entregue e seguirá a tarifa aplicável ao país de destino.",
    },
    {
      type: "paragraph",
      text: "A mudança atinge respostas enviadas pela API oficial durante a janela de atendimento de 24 horas, independentemente de terem sido escritas por uma pessoa, chatbot ou agente de IA. Ela não transforma toda conversa em uma cobrança imediata: mensagens recebidas do cliente continuam sem tarifa de entrega e a franquia mensal precisa ser considerada antes de estimar qualquer custo.",
    },
    {
      type: "heading",
      level: 2,
      id: "o-que-muda-na-cobranca",
      text: "O que muda na cobrança da WhatsApp API",
    },
    {
      type: "paragraph",
      text: "Hoje, uma mensagem do cliente abre uma janela de atendimento de 24 horas. Dentro dela, a empresa pode responder com mensagens de serviço, também chamadas de mensagens livres ou não baseadas em template. A partir de outubro, a janela continuará existindo como regra operacional, mas deixará de representar gratuidade ilimitada para as respostas da empresa.",
    },
    {
      type: "list",
      items: [
        "A cobrança passa a considerar cada mensagem de serviço entregue ao usuário, não apenas a tentativa de envio.",
        "As primeiras 1.000 mensagens de serviço do mês continuam gratuitas para cada número comercial.",
        "A cobrança começa na 1.001ª mensagem de serviço enviada pela empresa no mesmo mês.",
        "Mensagens de utilidade enviadas dentro da janela de atendimento também deixam de ser gratuitas.",
        "A janela gratuita de 72 horas iniciada por anúncios Click to WhatsApp ou botões de chamada para ação do Facebook permanece como exceção prevista.",
      ],
    },
    {
      type: "paragraph",
      text: "É importante não confundir mensagem de serviço com mensagem de marketing. Serviço é a resposta livre enviada durante a janela aberta pelo cliente. Marketing, utilidade e autenticação usam categorias e regras próprias. A categoria atribuída e o status de entrega devem ser conferidos nos relatórios e webhooks da operação.",
    },
    {
      type: "heading",
      level: 2,
      id: "quem-sera-afetado",
      text: "Quem será afetado pela nova tarifa",
    },
    {
      type: "paragraph",
      text: "A nova cobrança é relevante para empresas que usam a WhatsApp Business Platform, conhecida como API oficial, diretamente ou por meio de um provedor. É o cenário comum em operações integradas a CRM, centrais de atendimento, chatbots, automações e agentes de IA.",
    },
    {
      type: "paragraph",
      text: "A regra não é uma cobrança aplicada às conversas feitas apenas nos aplicativos WhatsApp Messenger ou WhatsApp Business para celular. Se o número também estiver conectado à Plataforma por uma configuração de coexistência, entretanto, a empresa deve confirmar com seu provedor como cada mensagem enviada pela API será classificada e faturada.",
    },
    {
      type: "heading",
      level: 2,
      id: "quanto-custa-no-brasil",
      text: "Quanto a nova cobrança pode custar no Brasil",
    },
    {
      type: "paragraph",
      text: "A tarifa divulgada para mensagens de serviço destinadas ao Brasil é de US$ 0,0068 por mensagem entregue, equivalente à tarifa de utilidade listada para o país. Como tabelas, câmbio e condições comerciais podem mudar, o valor deve ser confirmado no rate card da Meta e no contrato do provedor antes de fechar o orçamento.",
    },
    {
      type: "paragraph",
      text: "A fórmula básica é: mensagens cobradas = máximo entre zero e o total de mensagens de serviço entregues menos 1.000. Depois, multiplique o resultado pela tarifa vigente do país de destino. Para converter em reais, use a cotação adotada no seu fechamento financeiro e acrescente impostos ou taxas do provedor quando existirem.",
    },
    {
      type: "list",
      items: [
        "1.000 mensagens de serviço no mês: US$ 0 de tarifa da Meta para serviço.",
        "5.000 mensagens: 4.000 cobradas × US$ 0,0068 = US$ 27,20.",
        "10.000 mensagens: 9.000 cobradas × US$ 0,0068 = US$ 61,20.",
        "50.000 mensagens: 49.000 cobradas × US$ 0,0068 = US$ 333,20.",
      ],
    },
    {
      type: "paragraph",
      text: "Esses exemplos isolam apenas a tarifa estimada da Meta para mensagens de serviço. Não incluem templates de outras categorias, mensalidade da plataforma, cobrança do provedor, infraestrutura de IA, impostos nem variação cambial. Também não descontam eventuais mensagens cobertas pela janela gratuita de 72 horas.",
    },
    {
      type: "heading",
      level: 2,
      id: "atendimento-humano-chatbot-ou-ia",
      text: "Atendimento humano, chatbot ou IA: a regra é a mesma",
    },
    {
      type: "paragraph",
      text: "Para a tarifa de serviço, o que importa é a mensagem entregue pela Plataforma, não quem redigiu a resposta. Uma mensagem enviada por um atendente humano e outra enviada por um agente de IA entram na mesma lógica quando recebem a categoria de serviço.",
    },
    {
      type: "paragraph",
      text: "Isso torna a eficiência conversacional mensurável também pelo custo. Um fluxo que envia saudação, confirmação e pergunta em três balões pode gerar três eventos de cobrança depois da franquia. Uma resposta consolidada pode custar menos, desde que continue clara, natural e fácil de responder. O objetivo não deve ser encurtar toda conversa, mas remover fragmentação e etapas que não ajudam o cliente.",
    },
    {
      type: "heading",
      level: 2,
      id: "como-calcular-o-impacto-real",
      text: "Como calcular o impacto real na sua operação",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Levante o número de mensagens de serviço efetivamente entregues em cada número comercial nos últimos três meses.",
        "Separe mensagens de serviço, utilidade, autenticação e marketing para não aplicar uma única tarifa a todo o volume.",
        "Desconte a franquia de 1.000 mensagens de serviço por número e identifique eventos cobertos pela janela gratuita de 72 horas.",
        "Calcule cenários de volume normal, pico de campanha e sazonalidade usando a tarifa oficial do país de destino.",
        "Some custos do provedor, impostos, ferramentas e modelos de IA para obter o custo completo por atendimento.",
        "Divida o custo total pelo número de conversas resolvidas, oportunidades qualificadas e vendas geradas.",
      ],
    },
    {
      type: "paragraph",
      text: "Olhar apenas para o custo por mensagem pode levar a decisões ruins. Uma conversa mais longa pode ser rentável quando qualifica uma oportunidade relevante, enquanto um fluxo curto pode desperdiçar dinheiro se não resolver a dúvida. A métrica útil combina custo por atendimento, resolução, conversão e receita influenciada.",
    },
    {
      type: "heading",
      level: 2,
      id: "como-reduzir-custos-sem-piorar-a-experiencia",
      text: "Como reduzir custos sem piorar a experiência",
    },
    {
      type: "list",
      items: [
        "Elimine mensagens quebradas que poderiam ser uma única resposta clara.",
        "Conecte CRM, catálogo e agenda para evitar perguntas repetidas e perda de contexto.",
        "Faça a automação pedir somente dados que serão usados na qualificação ou no atendimento.",
        "Defina quando a IA resolve, quando pede confirmação e quando transfere para uma pessoa.",
        "Monitore mensagens entregues por categoria e crie alertas antes de picos inesperados.",
        "Compare custo por conversa resolvida e por reunião gerada, não apenas o volume bruto de mensagens.",
      ],
    },
    {
      type: "paragraph",
      text: "Uma IA comercial com contexto pode ajudar porque consulta o histórico, evita repetir perguntas e organiza a passagem para o vendedor. O ganho, porém, depende do desenho do processo. Automação sem contexto pode aumentar o número de mensagens e o custo sem melhorar a conversão.",
    },
    {
      type: "heading",
      level: 2,
      id: "checklist-antes-de-outubro",
      text: "Checklist para preparar a operação antes de outubro",
    },
    {
      type: "list",
      items: [
        "Confirmar a tabela efetiva da Meta para os países atendidos.",
        "Validar com o provedor como a franquia e as categorias aparecerão nos relatórios.",
        "Revisar saldo, faturamento e forma de pagamento exigidos pelo provedor da API.",
        "Medir a média de mensagens de serviço por conversa e por número comercial.",
        "Testar webhooks e painéis para distinguir mensagens gratuitas e cobradas.",
        "Revisar fluxos fragmentados e atualizar projeções financeiras.",
        "Treinar o time para preservar qualidade, contexto e escalonamento humano.",
      ],
    },
    {
      type: "heading",
      level: 2,
      id: "o-que-a-mudanca-significa",
      text: "O que a mudança significa para vendas no WhatsApp",
    },
    {
      type: "paragraph",
      text: "A cobrança não torna o WhatsApp inviável. Ela transforma mensagens de serviço em um custo variável que precisa ser conectado ao resultado comercial. Operações com contexto, respostas úteis e processos integrados tendem a entender melhor quanto custa qualificar um lead, resolver uma solicitação e gerar uma reunião.",
    },
    {
      type: "paragraph",
      text: "Antes de cortar interações, calcule o impacto com dados reais. O melhor ajuste é reduzir desperdício conversacional sem reduzir a qualidade do atendimento. Esse equilíbrio protege a experiência do cliente e mantém o canal economicamente saudável.",
    },
    {
      type: "heading",
      level: 2,
      id: "perguntas-frequentes",
      text: "Perguntas frequentes sobre a cobrança",
    },
    {
      type: "heading",
      level: 3,
      id: "a-janela-de-24-horas-vai-acabar",
      text: "A janela de atendimento de 24 horas vai acabar?",
    },
    {
      type: "paragraph",
      text: "Não. A janela continua definindo quando a empresa pode enviar respostas livres depois que o cliente escreve. O que muda é a gratuidade: depois da franquia mensal, mensagens de serviço entregues dentro dessa janela passam a gerar cobrança.",
    },
    {
      type: "heading",
      level: 3,
      id: "a-meta-cobra-mensagens-recebidas",
      text: "A Meta cobrará pelas mensagens enviadas pelo cliente?",
    },
    {
      type: "paragraph",
      text: "Não. A cobrança descrita para mensagens de serviço recai sobre respostas enviadas pela empresa. Mensagens recebidas do usuário não entram nessa contagem de entrega.",
    },
    {
      type: "heading",
      level: 3,
      id: "cada-numero-tem-franquia-propria",
      text: "Cada número comercial terá sua própria franquia?",
    },
    {
      type: "paragraph",
      text: "A comunicação disponível indica uma franquia de 1.000 mensagens de serviço por número comercial a cada mês. Empresas com mais de um número devem medir e conferir a cobrança separadamente em seus relatórios.",
    },
    {
      type: "heading",
      level: 3,
      id: "chatbot-e-ia-pagam-mais",
      text: "Chatbot ou IA pagam uma tarifa maior?",
    },
    {
      type: "paragraph",
      text: "Não por serem automação. Uma resposta classificada como mensagem de serviço segue a tarifa dessa categoria independentemente de ser redigida por pessoa, bot ou IA externa. Custos próprios do software, do provedor e do modelo de IA são despesas separadas.",
    },
    {
      type: "heading",
      level: 3,
      id: "vale-a-pena-continuar-usando-whatsapp-api",
      text: "Ainda vale a pena usar a WhatsApp Business Platform?",
    },
    {
      type: "paragraph",
      text: "A decisão depende do valor gerado por atendimento, da necessidade de integração e do volume real. Para operações comerciais, o cálculo deve comparar o custo completo com conversas resolvidas, leads qualificados, reuniões e vendas — não apenas multiplicar mensagens por uma tarifa.",
    },
  ],
  sources: [
    {
      id: "source:whatsapp-business-platform-pricing",
      title: "Preços da Plataforma do WhatsApp Business",
      url: "https://whatsappbusiness.com/pt-br/products/platform-pricing/",
      accessedAt: "2026-09-24T00:00:00-03:00",
      publisher: "WhatsApp Business",
    },
    {
      id: "source:meta-whatsapp-pricing-updates",
      title: "Updates to WhatsApp Business Platform pricing",
      url: "https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing",
      accessedAt: "2026-09-24T00:00:00-03:00",
      publisher: "Meta for Developers",
    },
    {
      id: "source:gupshup-service-messages-pricing-2026",
      title: "WhatsApp Service Messages Pricing w.e.f 01 Oct, 2026",
      url: "https://support.gupshup.io/hc/en-us/articles/62362400519705-WhatsApp-Service-Messages-Pricing-w-e-f-01-Oct-2026",
      accessedAt: "2026-09-24T00:00:00-03:00",
      publisher: "Gupshup",
    },
    {
      id: "source:wad-meta-pricing-2026",
      title: "Nueva modalidad de cobro de Meta para WhatsApp Business desde octubre 2026",
      url: "https://www.wad.chat/es/wad/recursos/nuevo-cobro-meta-whatsapp-business-octubre-2026.html",
      accessedAt: "2026-09-24T00:00:00-03:00",
      publisher: "WAD",
    },
  ],
  internalLinks: [
    {
      href: "/blog/temas/vendas-whatsapp",
      label: "Veja mais conteúdos sobre vendas no WhatsApp",
      purpose: "hub do cluster editorial",
    },
    {
      href: "/ia-whatsapp",
      label: "Conheça a IA comercial para WhatsApp da Tlin",
      purpose: "página comercial relacionada",
    },
  ],
  cta: {
    id: "cta:demo",
    label: "Calcular o impacto na minha operação",
    href: "/demo",
  },
  review: {
    originalContribution:
      "Corrige a leitura de fim total da gratuidade, inclui a franquia por número, demonstra a fórmula com cenários verificáveis e conecta custo por mensagem a métricas de resolução e resultado comercial.",
  },
} satisfies EditorialArticle;
