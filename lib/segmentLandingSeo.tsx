import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export type SegmentLandingKey = "clinicas" | "escolas" | "assessorias" | "advocacia";

type SegmentLandingSeo = {
  path: `/${string}`;
  title: string;
  description: string;
  serviceName: string;
  serviceType: string;
  audience: string;
  breadcrumb: string;
  about: string[];
};

export const segmentLandingSeo: Record<SegmentLandingKey, SegmentLandingSeo> = {
  clinicas: {
    path: "/ia-para-clinicas",
    title: "IA para clínicas no WhatsApp | tlin.ai",
    description: "Reduza a pressão na recepção: responda pacientes no WhatsApp, organize cada interesse no CRM e conduza mais contatos até o agendamento com IA.",
    serviceName: "IA comercial para clínicas",
    serviceType: "Atendimento e organização comercial com IA para clínicas",
    audience: "clínicas, consultórios e operações de saúde com atendimento comercial no WhatsApp",
    breadcrumb: "IA para clínicas",
    about: ["atendimento de pacientes no WhatsApp", "organização de oportunidades para clínicas", "agendamento com contexto"],
  },
  escolas: {
    path: "/ia-para-escolas",
    title: "IA para escolas e matrículas | tlin.ai",
    description: "Atenda famílias mesmo no pico de matrículas, organize cada interesse no CRM e transforme conversas no WhatsApp em visitas agendadas à escola.",
    serviceName: "IA comercial para escolas",
    serviceType: "Atendimento e captação de matrículas com IA para escolas",
    audience: "escolas e instituições de ensino com captação de matrículas pelo WhatsApp",
    breadcrumb: "IA para escolas",
    about: ["atendimento de famílias no WhatsApp", "captação de matrículas", "agendamento de visitas escolares"],
  },
  assessorias: {
    path: "/ia-para-assessorias",
    title: "IA para assessorias no WhatsApp | tlin.ai",
    description: "Qualifique empresários no WhatsApp, aplique seu playbook e agende diagnósticos com contexto para sua assessoria reduzir reuniões sem fit.",
    serviceName: "IA comercial para assessorias",
    serviceType: "Atendimento, qualificação e follow-up com IA para assessorias",
    audience: "assessorias e prestadores de serviços com geração recorrente de oportunidades",
    breadcrumb: "IA para assessorias",
    about: ["qualificação de oportunidades", "follow-up comercial", "agendamento de diagnósticos"],
  },
  advocacia: {
    path: "/ia-para-advocacia",
    title: "IA para advocacia no WhatsApp | tlin.ai",
    description: "Organize o primeiro atendimento jurídico no WhatsApp, registre o contexto informado e encaminhe cada contato ao advogado responsável com agilidade.",
    serviceName: "IA para primeiro atendimento na advocacia",
    serviceType: "Organização do primeiro atendimento com IA para escritórios de advocacia",
    audience: "escritórios de advocacia que recebem novos contatos pelo WhatsApp",
    breadcrumb: "IA para advocacia",
    about: ["primeiro atendimento no WhatsApp", "organização de contexto inicial", "distribuição de contatos no CRM"],
  },
};

const socialImage = {
  url: absoluteUrl("/og/platform-preview-email.jpg"),
  width: 1200,
  height: 630,
  alt: "tlin.ai — IA comercial com CRM, follow-up e agendamento",
};

export function createSegmentMetadata(segment: SegmentLandingKey): Metadata {
  const page = segmentLandingSeo[segment];
  const url = absoluteUrl(page.path);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": url },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      url,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [socialImage.url],
    },
  };
}

export function createSegmentStructuredData(segment: SegmentLandingKey) {
  const page = segmentLandingSeo[segment];
  const url = absoluteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": absoluteUrl("/#website") },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.serviceName,
        description: page.description,
        serviceType: page.serviceType,
        url,
        provider: { "@id": absoluteUrl("/#organization") },
        areaServed: { "@type": "Country", name: "Brazil" },
        audience: { "@type": "BusinessAudience", audienceType: page.audience },
        about: page.about,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Segmentos" },
          { "@type": "ListItem", position: 3, name: page.breadcrumb, item: url },
        ],
      },
    ],
  };
}

export function SegmentLandingStructuredData({ segment }: { segment: SegmentLandingKey }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createSegmentStructuredData(segment)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
