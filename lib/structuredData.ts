import { absoluteAppUrl, absoluteUrl, siteConfig } from "@/lib/siteConfig";

const faqItems = [
  {
    question: "A inteligência artificial da Tlin inventa preços ou informações?",
    answer:
      "Não. Os agentes da Tlin trabalham dentro do playbook, tabela de preços, inventário e regras comerciais definidos pelo cliente. Quando uma pergunta foge das regras, o atendimento pode ser roteado para uma pessoa.",
  },
  {
    question: "A Tlin substitui um CRM?",
    answer:
      "A Tlin já vem com CRM próprio integrado nativamente, onde os agentes de IA organizam leads, conversas e o funil comercial. Ela também pode receber leads de ferramentas externas (como HubSpot ou RD Station) via webhook ou formulário, sem precisar substituir o que a empresa já usa.",
  },
  {
    question: "O que a Tlin automatiza no comercial?",
    answer:
      "A Tlin automatiza resposta a leads, qualificação, contorno de objeções, follow-up e recuperação de conversas paradas, agendamento de reuniões, handoff para vendedores e acompanhamento de métricas comerciais, tudo dentro do próprio CRM.",
  },
  {
    question: "Em quanto tempo uma operação pode começar?",
    answer:
      "A implantação depende do volume de integrações e da complexidade do playbook. Operações simples podem começar rapidamente após a configuração dos agentes, fluxos e canais.",
  },
  {
    question: "A solução funciona no WhatsApp?",
    answer:
      "Sim. A proposta central da Tlin é operar agentes de IA comerciais no WhatsApp 24/7, com linguagem natural e transferência para atendimento humano quando necessário.",
  },
  {
    question: "A Tlin faz follow-up automático com leads que não respondem?",
    answer:
      "Sim. Quando um lead esfria ou para de responder, a IA retoma a conversa automaticamente em intervalos definidos no playbook, sem depender de um vendedor lembrar de voltar a fazer contato.",
  },
  {
    question: "A Tlin agenda reuniões e demonstrações automaticamente?",
    answer:
      "Sim. Quando um lead está pronto, a IA consulta a agenda disponível e marca a reunião ou demonstração direto no CRM, já notificando o time comercial responsável.",
  },
];

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: "tlin.ai",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.svg"),
    description: siteConfig.description,
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: "Igor Marin",
    },
    foundingLocation: {
      "@type": "Place",
      name: "São Paulo, SP, Brazil",
    },
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    knowsAbout: [
      "IA comercial",
      "CRM nativo com inteligência artificial",
      "automação de follow-up",
      "agendamento automático de reuniões",
      "automação via webhook",
      "automação de vendas no WhatsApp",
      "qualificação de leads",
      "gestão de conversas comerciais",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "contato@tlin.ia.br",
      telephone: "+55-11-91624-8604",
      areaServed: ["BR"],
      availableLanguage: ["pt-BR", "en", "es"],
    },
    sameAs: [
      "https://instagram.com/tlin.aii",
      "https://linkedin.com/company/tlin",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: "pt-BR",
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    about: [
      "IA comercial com CRM nativo",
      "agentes de IA para vendas",
      "automação de follow-up",
      "agendamento automático de reuniões",
      "automação comercial no WhatsApp",
      "qualificação de leads",
      "SDR com inteligência artificial",
      "atendimento comercial 24/7",
    ],
    mainEntity: {
      "@id": absoluteUrl("/#organization"),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteAppUrl("/#software"),
    name: "tlin.ai",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteAppUrl("/"),
    description:
      "IA comercial com CRM nativo para responder, qualificar, agendar e converter leads no WhatsApp 24/7.",
    featureList: [
      "Atendimento comercial no WhatsApp",
      "CRM nativo para gestão de leads e funil",
      "Qualificação de leads",
      "Automação de follow-up e recuperação de conversas",
      "Agendamento automático de reuniões e demonstrações",
      "Integração com ferramentas externas via webhook e formulário",
      "Handoff para vendedores humanos com contexto",
      "Gestão de conversas e métricas comerciais",
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "497",
      highPrice: "1497",
      offerCount: "3",
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl("/#service"),
    name: "IA comercial com CRM para WhatsApp",
    provider: {
      "@id": absoluteUrl("/#organization"),
    },
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    serviceType: "IA comercial com CRM, follow-up e agendamento nativos",
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "empresas, agências, times comerciais, operações de atendimento e vendas",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Planos tlin.ai",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "497",
          priceCurrency: "BRL",
          description:
            "Plano para pequenas operações que precisam validar atendimento automático com 1 agente IA no WhatsApp.",
        },
        {
          "@type": "Offer",
          name: "Scale",
          price: "997",
          priceCurrency: "BRL",
          description:
            "Plano para operações em tração com múltiplos agentes, CRM nativo nas conversas, consultoria e recuperação de leads.",
        },
        {
          "@type": "Offer",
          name: "Enterprise",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "BRL",
            description: "Sob consulta",
          },
          description:
            "Plano para grandes escalas com agentes ilimitados, onboarding white-glove, API privada e SLA.",
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": absoluteUrl("/#sitenav"),
    name: ["Como funciona", "Agentes", "CRM", "Planos", "Perguntas frequentes"],
    url: [
      absoluteUrl("/#como-funciona"),
      absoluteUrl("/#agentes"),
      absoluteUrl("/#crm"),
      absoluteUrl("/#planos"),
      absoluteUrl("/#faq"),
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export function stringifyStructuredData() {
  return JSON.stringify(structuredData).replace(/</g, "\\u003c");
}
