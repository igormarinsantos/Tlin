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
      "A Tlin pode operar integrada ao CRM existente ou atuar como uma camada de qualificação e atendimento no WhatsApp, enviando leads qualificados e contexto comercial para o time humano.",
  },
  {
    question: "O que a Tlin automatiza no comercial?",
    answer:
      "A Tlin automatiza resposta a leads, qualificação, contorno de objeções, recuperação de conversas, handoff para vendedores e acompanhamento de métricas comerciais.",
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
];

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.svg"),
    description: siteConfig.description,
    foundingLocation: {
      "@type": "Place",
      name: "São Paulo, Brazil",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "contato@tlin.cloud",
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
      "agentes de IA para vendas",
      "automação comercial no WhatsApp",
      "qualificação de leads",
      "SDR com inteligência artificial",
      "atendimento comercial 24/7",
    ],
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
      "Sistema de agentes de IA comerciais para responder, qualificar e converter leads no WhatsApp 24/7.",
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
    name: "Agentes de IA para automação de vendas no WhatsApp",
    provider: {
      "@id": absoluteUrl("/#organization"),
    },
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    serviceType: "Automação comercial com inteligência artificial",
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
            "Plano para operações em tração com múltiplos agentes, CRM, consultoria e recuperação de leads.",
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
