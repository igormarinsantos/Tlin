export type IgorCampaign = {
  slug: string;
  keyword: string;
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  leadMagnet: string;
  deliverables: string[];
  framework: Array<{ title: string; description: string }>;
  segmentQuestion: string;
  consentVersion: string;
};

export const igorCampaigns: Record<string, IgorCampaign> = {
  "7-sistemas-ia-growth": {
    slug: "7-sistemas-ia-growth",
    keyword: "GROWTH",
    eyebrow: "PLAYBOOK GRATUITO · IA & GROWTH",
    title: "7 sistemas de IA para",
    highlightedTitle: "crescer melhor.",
    description:
      "Um mapa direto para usar IA em pesquisa, conteúdo, aquisição, conversão e operação — sem virar uma fábrica de volume inútil.",
    leadMagnet: "Playbook: 7 Sistemas de IA para Growth",
    deliverables: [
      "Os 7 sistemas que eu usaria para operar growth com IA hoje.",
      "Prompts e estruturas para começar sem depender de time técnico.",
      "Uma forma de escolher onde a IA realmente gera retorno.",
    ],
    framework: [
      { title: "Pesquisa", description: "Encontre linguagem, objeções e oportunidades antes de criar." },
      { title: "Conteúdo", description: "Transforme repertório em distribuição com um sistema, não em posts aleatórios." },
      { title: "Conversão", description: "Use IA para diagnosticar atritos e melhorar a jornada de quem já demonstrou interesse." },
    ],
    segmentQuestion: "Qual área você mais quer melhorar com IA?",
    consentVersion: "igor-growth-v1",
  },
};

export function getIgorCampaign(slug: string) {
  return igorCampaigns[slug];
}
